import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

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
  await access(new URL("../dist/client/assets/team-portrait-stage-v2.png", import.meta.url));
  await access(new URL("../dist/client/og.png", import.meta.url));
});

test("publishes the complete assignment and Sound Road project content", async () => {
  const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
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
  assert.match(source.projectLine, /社会创新/);
  assert.equal(source.project.name, "声路·澳门");
  assert.equal(source.project.features.length, 3);
  assert.equal(source.project.journey.length, 3);
  assert.equal(source.project.highlights.length, 3);
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
