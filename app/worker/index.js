const TEAM_ROW_ID = 1;
const MAX_TEAM_PAYLOAD_BYTES = 1024 * 1024;
const CORS_ORIGINS = new Set(["https://ranr21094-ai.github.io"]);
const FALLBACK_ADMIN_PASSWORD_HASH =
  "aad443156fcda374c4e23db4d639904c98dbfaeda47391812b772f47cbb134d9";
const teamTableSql = `CREATE TABLE IF NOT EXISTS team_content (
  id INTEGER PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

function corsHeaders(request) {
  const origin = request.headers.get("origin");
  if (!CORS_ORIGINS.has(origin)) return {};

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, PUT, POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-admin-password",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function jsonResponse(payload, status = 200, request) {
  return Response.json(payload, {
    status,
    headers: {
      "cache-control": "no-store",
      ...(request ? corsHeaders(request) : {}),
    },
  });
}

function validateTeam(team) {
  const requiredTeamFields = ["teamName", "eventName", "contactEmail", "projectLine"];
  const requiredMemberFields = ["id", "name", "role", "age", "gender", "school", "major", "tagline"];
  const requiredProjectFields = ["name", "tagline", "summary", "audience"];
  const requiredProjectListLengths = { features: 3, journey: 6, highlights: 3 };

  if (!team || typeof team !== "object") throw new Error("团队数据格式错误");
  if (!Array.isArray(team.members) || team.members.length !== 5) {
    throw new Error("团队必须保留五位成员");
  }

  for (const key of requiredTeamFields) {
    if (typeof team[key] !== "string" || !team[key].trim()) {
      throw new Error(`缺少团队字段：${key}`);
    }
  }

  if (!team.project || typeof team.project !== "object") {
    throw new Error("缺少参赛项目资料");
  }

  for (const key of requiredProjectFields) {
    if (typeof team.project[key] !== "string" || !team.project[key].trim()) {
      throw new Error(`缺少项目字段：${key}`);
    }
  }

  for (const [group, requiredLength] of Object.entries(requiredProjectListLengths)) {
    if (!Array.isArray(team.project[group]) || team.project[group].length !== requiredLength) {
      throw new Error(`项目字段 ${group} 必须保留 ${requiredLength} 项`);
    }
    team.project[group].forEach((item, index) => {
      for (const key of ["title", "description"]) {
        if (typeof item?.[key] !== "string" || !item[key].trim()) {
          throw new Error(`项目字段 ${group} 第 ${index + 1} 项缺少 ${key}`);
        }
      }
    });
  }

  for (const [group, keys] of Object.entries({
    painPoints: ["current", "impact", "limitations"],
    goals: ["shortTerm", "longTerm"],
  })) {
    if (!team.project[group] || typeof team.project[group] !== "object") {
      throw new Error(`缺少项目字段：${group}`);
    }
    for (const key of keys) {
      if (typeof team.project[group][key] !== "string" || !team.project[group][key].trim()) {
        throw new Error(`缺少项目字段：${group}.${key}`);
      }
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

async function sha256(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function isAdminAuthorized(request, env) {
  const supplied = request.headers.get("x-admin-password") || "";
  if (env.ADMIN_PASSWORD) return supplied === env.ADMIN_PASSWORD;
  return Boolean(supplied) && (await sha256(supplied)) === FALLBACK_ADMIN_PASSWORD_HASH;
}

async function ensureTeamTable(db) {
  await db.prepare(teamTableSql).run();
}

async function fetchBundledTeam(request, env) {
  const dataUrl = new URL(request.url);
  dataUrl.pathname = "/team.json";
  dataUrl.search = "";
  const response = await env.ASSETS.fetch(new Request(dataUrl, request));
  if (!response.ok) throw new Error("团队资料加载失败");
  return response.json();
}

async function upsertTeam(db, team) {
  await db
    .prepare(
      `INSERT INTO team_content (id, payload, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET
         payload = excluded.payload,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(TEAM_ROW_ID, JSON.stringify(team))
    .run();
}

async function getTeam(request, env) {
  if (!env.DB) return fetchBundledTeam(request, env);

  await ensureTeamTable(env.DB);
  const row = await env.DB
    .prepare("SELECT payload FROM team_content WHERE id = ?")
    .bind(TEAM_ROW_ID)
    .first();

  if (row?.payload) return JSON.parse(row.payload);

  const seed = await fetchBundledTeam(request, env);
  await upsertTeam(env.DB, seed);
  return seed;
}

async function saveTeam(request, env) {
  if (!(await isAdminAuthorized(request, env))) {
    return jsonResponse({ error: "管理密码不正确" }, 401, request);
  }
  if (!env.DB) return jsonResponse({ error: "线上内容数据库不可用" }, 503, request);

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_TEAM_PAYLOAD_BYTES) {
    return jsonResponse({ error: "请求内容过大" }, 413, request);
  }

  const team = validateTeam(JSON.parse(body));
  await ensureTeamTable(env.DB);
  await upsertTeam(env.DB, team);
  return jsonResponse(team, 200, request);
}

async function serveAppShell(request, env) {
  const indexUrl = new URL(request.url);
  indexUrl.pathname = "/index.html";
  indexUrl.search = "";
  return env.ASSETS.fetch(new Request(indexUrl, request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (
        request.method === "OPTIONS" &&
        (url.pathname === "/api/team" || url.pathname === "/api/admin/verify")
      ) {
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }

      if (url.pathname === "/api/admin/verify" && request.method === "POST") {
        return (await isAdminAuthorized(request, env))
          ? jsonResponse({ ok: true }, 200, request)
          : jsonResponse({ error: "管理密码不正确" }, 401, request);
      }

      if (url.pathname === "/api/team" && request.method === "GET") {
        return jsonResponse(await getTeam(request, env), 200, request);
      }

      if (url.pathname === "/api/team" && request.method === "PUT") {
        return await saveTeam(request, env);
      }

      if (
        (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) &&
        ["GET", "HEAD"].includes(request.method)
      ) {
        return serveAppShell(request, env);
      }

      const response = await env.ASSETS.fetch(request);
      const acceptsHtml = request.headers.get("accept")?.includes("text/html");

      if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
        return response;
      }

      return serveAppShell(request, env);
    } catch (error) {
      return jsonResponse({ error: error.message || "请求失败" }, 400, request);
    }
  },
};
