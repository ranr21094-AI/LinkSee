import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

function createMemoryD1() {
  let payload = null;

  return {
    prepare(sql) {
      let bindings = [];
      return {
        bind(...values) {
          bindings = values;
          return this;
        },
        async first() {
          if (sql.startsWith("SELECT")) return payload ? { payload } : null;
          return null;
        },
        async run() {
          if (sql.startsWith("INSERT")) payload = bindings[1];
          return { success: true };
        },
      };
    },
  };
}

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("serves the admin SPA without redirecting the admin path", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/admin", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async (request) => {
          calls.push(new URL(request.url).pathname);
          return new Response("admin app", { status: 200 });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "admin app");
  assert.deepEqual(calls, ["/index.html"]);
});

test("verifies the admin password and persists team edits in D1", async () => {
  const source = JSON.parse(
    await readFile(new URL("../data/team.json", import.meta.url), "utf8"),
  );
  const env = {
    ADMIN_PASSWORD: "test-secret",
    DB: createMemoryD1(),
    ASSETS: {
      fetch: async (request) =>
        new URL(request.url).pathname === "/team.json"
          ? Response.json(source)
          : new Response("missing", { status: 404 }),
    },
  };

  const rejected = await worker.fetch(
    new Request("https://example.test/api/admin/verify", {
      method: "POST",
      headers: { "x-admin-password": "wrong" },
    }),
    env,
  );
  assert.equal(rejected.status, 401);

  const verified = await worker.fetch(
    new Request("https://example.test/api/admin/verify", {
      method: "POST",
      headers: { "x-admin-password": "test-secret" },
    }),
    env,
  );
  assert.equal(verified.status, 200);

  const initial = await worker.fetch(new Request("https://example.test/api/team"), env);
  assert.equal(initial.status, 200);
  assert.equal((await initial.json()).project.journey[0].title, "进入网页");

  source.project.journey[0].title = "开始体验";
  const saved = await worker.fetch(
    new Request("https://example.test/api/team", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-admin-password": "test-secret",
      },
      body: JSON.stringify(source),
    }),
    env,
  );
  assert.equal(saved.status, 200);

  const refreshed = await worker.fetch(new Request("https://example.test/api/team"), env);
  assert.equal((await refreshed.json()).project.journey[0].title, "开始体验");
});

test("allows the GitHub Pages frontend to use the hosted content API", async () => {
  const origin = "https://ranr21094-ai.github.io";
  const response = await worker.fetch(
    new Request("https://example.test/api/team", {
      method: "OPTIONS",
      headers: {
        origin,
        "access-control-request-method": "PUT",
        "access-control-request-headers": "content-type,x-admin-password",
      },
    }),
    {},
  );

  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.match(response.headers.get("access-control-allow-methods"), /PUT/);
  assert.match(response.headers.get("access-control-allow-headers"), /x-admin-password/);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
  await access(new URL("../dist/.openai/drizzle/0000_mushy_jackpot.sql", import.meta.url));
  await access(new URL("../dist/client/assets/team-portrait-stage-v2.png", import.meta.url));
  await access(new URL("../dist/client/og.png", import.meta.url));
});

test("publishes the complete assignment and Sound Road project content", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const hosting = JSON.parse(
    await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  );
  const source = JSON.parse(
    await readFile(new URL("../data/team.json", import.meta.url), "utf8"),
  );
  const published = JSON.parse(
    await readFile(new URL("../public/team.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(published, source);
  assert.equal(source.contactEmail, "winnyng0327@gmail.com");
  assert.match(appSource, /className="header-contact"/);
  assert.equal(
    appSource.match(/mailto:\$\{team\.contactEmail\}/g)?.length,
    2,
  );
  assert.equal("trackTitle" in source, false);
  assert.equal("headline" in source, false);
  assert.doesNotMatch(appSource, /SOCIAL INNOVATION \/ 社会创新/);
  assert.doesNotMatch(appSource, /className="research-note"/);
  assert.doesNotMatch(appSource, /href="\/\?view=admin"/);
  assert.match(appSource, /apiUrl\("\/api\/admin\/verify"\)/);
  assert.match(appSource, /appUrl\("assets\/team-portrait-stage-v2\.png"\)/);
  assert.match(appSource, /className="journey-editor-grid"/);
  assert.match(styles, /grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(appSource, /className="section-number"/);
  assert.doesNotMatch(styles, /\.section-number/);
  for (const ordinal of ["一", "二", "三", "四"]) {
    assert.match(appSource, new RegExp(`ordinal="${ordinal}"`));
  }
  assert.match(appSource, /<h2>\{ordinal\}、\{title\}<\/h2>/);
  assert.match(appSource, /className=\{`mobile-portrait-focus mobile-portrait-focus--\$\{activeSlot\.key\}`\}/);
  assert.match(appSource, /aria-pressed=\{activeIndex === index\}/);
  for (const slot of ["captain", "developer", "director", "designer", "engineer"]) {
    assert.match(styles, new RegExp(`mobile-portrait-focus--${slot}`));
  }
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*?\.event-lockup \{[\s\S]*?display: none;/);
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*?\.hero \{[\s\S]*?padding-top: 18px;/);
  assert.equal(hosting.d1, "DB");
  assert.match(source.projectLine, /社会创新/);
  assert.equal(source.project.name, "声路·澳门");
  assert.equal(source.project.tagline, "第一人称盲人出行体验游戏");
  assert.equal(source.project.features[0].title, "盲杖探索");
  assert.equal(source.project.features[1].title, "感官导航");
  assert.equal(source.project.features[2].title, "多结局叙事");
  assert.equal(source.project.features.length, 3);
  assert.equal(source.project.journey.length, 6);
  assert.deepEqual(
    source.project.journey.map((step) => step.title),
    ["进入网页", "选择关卡", "盲杖探索", "障碍与分支", "抵达终点", "知识与反思"],
  );
  assert.equal(source.project.highlights.length, 3);
  assert.match(source.project.goals.shortTerm, /72 小时/);
  assert.match(source.project.goals.shortTerm, /制作并部署团队 \/ 项目介绍页面/);
  assert.match(source.project.goals.shortTerm, /公益创新方向/);
  assert.match(source.project.goals.longTerm, /无障碍热力图/);
  assert.match(source.project.audience, /普通社会公众/);
  assert.match(source.project.audience, /政府相关部门/);
  assert.match(source.project.audience, /各大学校及社团/);
  assert.match(appSource, /aria-label="页面导览"/);
  assert.ok(
    appSource.indexOf('className="page-guide"') <
      appSource.indexOf('className="hover-hint"'),
  );
  for (const href of ["#project", "#challenge", "#innovation", "#goals"]) {
    assert.match(appSource, new RegExp(`href: "${href}"`));
  }
  assert.ok(source.project.audience);
  assert.ok(source.project.painPoints.current);
  assert.ok(source.project.painPoints.impact);
  assert.ok(source.project.painPoints.limitations);
  assert.ok(source.project.goals.shortTerm);
  assert.ok(source.project.goals.longTerm);
  assert.equal(source.members.find((member) => member.id === "lou-wuchen").gender, "女");
  assert.equal(
    source.members.find((member) => member.id === "wu-yunxi").major,
    "政治学与行政学",
  );
  assert.equal(
    source.members.find((member) => member.id === "zhang-yanfei").major,
    "计算艺术",
  );
  assert.deepEqual(
    Object.fromEntries(source.members.map((member) => [member.name, member.role])),
    {
      "吳芸曦": "产品策划与统筹（PM/策划）",
      "娄午尘": "测试与辅助开发（场外支援/机动）",
      "李佩珊": "视觉与美术设计（UI/美术）",
      "张燕菲": "硬件交互与建模设计（数据/音效/文案）",
      "冉冉": "游戏开发工程师（技术主程）",
    },
  );
  assert.equal(
    source.members.find((member) => member.id === "wu-yunxi").tagline,
    "让每一次抵达，都被城市温柔看见。",
  );
});
