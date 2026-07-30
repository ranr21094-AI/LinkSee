import { createServer as createHttpServer } from "node:http";
import { readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const root = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(root, "data/team.json");
const publicDataPath = resolve(root, "public/team.json");
const adminPassword = process.env.ADMIN_PASSWORD || "linksee-admin";

function parseServerArgs(argv) {
  const result = { host: "0.0.0.0", port: Number(process.env.PORT || 4173), strictPort: false };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--host" && argv[index + 1]) result.host = argv[++index];
    if (token === "--port" && argv[index + 1]) result.port = Number(argv[++index]);
    if (token === "--strictPort") result.strictPort = true;
  }

  return result;
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

async function readRequestBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error("请求内容过大");
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function validateTeam(team) {
  const requiredTeamFields = ["teamName", "eventName", "trackTitle", "headline", "projectLine"];
  const requiredMemberFields = ["id", "name", "role", "age", "gender", "school", "major", "tagline"];

  if (!team || typeof team !== "object") throw new Error("团队数据格式错误");
  if (!Array.isArray(team.members) || team.members.length !== 5) {
    throw new Error("团队必须保留五位成员");
  }

  for (const key of requiredTeamFields) {
    if (typeof team[key] !== "string" || !team[key].trim()) {
      throw new Error(`缺少团队字段：${key}`);
    }
  }

  team.members.forEach((member, index) => {
    for (const key of requiredMemberFields) {
      if (typeof member[key] !== "string" || !member[key].trim()) {
        throw new Error(`第 ${index + 1} 位成员缺少字段：${key}`);
      }
    }
  });

  team.members[0].isCaptain = true;
  team.members.slice(1).forEach((member) => {
    member.isCaptain = false;
  });

  return team;
}

async function persistTeam(team) {
  const payload = `${JSON.stringify(team, null, 2)}\n`;
  const tempData = `${dataPath}.tmp`;
  const tempPublic = `${publicDataPath}.tmp`;

  await writeFile(tempData, payload, "utf8");
  await writeFile(tempPublic, payload, "utf8");
  await rename(tempData, dataPath);
  await rename(tempPublic, publicDataPath);
}

const serverOptions = parseServerArgs(process.argv.slice(2));
const vite = await createViteServer({
  root,
  appType: "spa",
  server: {
    middlewareMode: true,
    host: serverOptions.host,
    allowedHosts: ["terminal.local", "localhost", "127.0.0.1"],
  },
});

const server = createHttpServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  try {
    if (url.pathname === "/api/team" && request.method === "GET") {
      const team = JSON.parse(await readFile(dataPath, "utf8"));
      sendJson(response, 200, team);
      return;
    }

    if (url.pathname === "/api/team" && request.method === "PUT") {
      if (request.headers["x-admin-password"] !== adminPassword) {
        sendJson(response, 401, { error: "管理密码不正确" });
        return;
      }

      const team = validateTeam(await readRequestBody(request));
      await persistTeam(team);
      sendJson(response, 200, team);
      return;
    }

    vite.middlewares(request, response, (error) => {
      if (error) {
        console.error(error);
        sendJson(response, 500, { error: "页面加载失败" });
      }
    });
  } catch (error) {
    sendJson(response, 400, { error: error.message || "请求失败" });
  }
});

server.once("error", (error) => {
  if (error.code === "EADDRINUSE" && serverOptions.strictPort) {
    console.error(`Port ${serverOptions.port} is already in use.`);
    process.exit(1);
  }
  throw error;
});

server.listen(serverOptions.port, serverOptions.host, () => {
  console.log(`LinkSee running at http://${serverOptions.host}:${serverOptions.port}`);
});
