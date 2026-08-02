import { useEffect, useMemo, useState } from "react";

const portraitSlots = [
  { key: "captain", number: "01" },
  { key: "developer", number: "02" },
  { key: "director", number: "03" },
  { key: "designer", number: "04" },
  { key: "engineer", number: "05" },
];

const pageGuideItems = [
  { number: "01", label: "参赛项目", href: "#project" },
  { number: "02", label: "现实痛点", href: "#challenge" },
  { number: "03", label: "核心亮点", href: "#innovation" },
  { number: "04", label: "参赛目标", href: "#goals" },
];

const teamFields = [
  ["teamName", "队伍名称"],
  ["eventName", "比赛名称"],
  ["contactEmail", "联系邮箱"],
  ["projectLine", "核心定位"],
];

const projectFields = [
  ["name", "项目名称"],
  ["tagline", "项目口号"],
  ["summary", "产品 / 方案描述", true],
  ["audience", "服务群体", true],
  ["researchNote", "调研与表达边界", true],
];

const painPointFields = [
  ["current", "现状问题"],
  ["impact", "影响范围"],
  ["limitations", "现有方案不足"],
];

const goalFields = [
  ["shortTerm", "赛事期间目标"],
  ["longTerm", "赛后长期愿景"],
];

const memberFields = [
  ["name", "姓名"],
  ["role", "队内分工"],
  ["age", "年龄"],
  ["gender", "性别"],
  ["school", "学校"],
  ["major", "专业"],
  ["tagline", "一句话介绍"],
];

async function loadTeam() {
  const usesLocalApi = ["localhost", "127.0.0.1"].includes(
    window.location.hostname,
  );

  if (!usesLocalApi) {
    const response = await fetch("/team.json", { cache: "no-store" });
    if (!response.ok) throw new Error("团队资料加载失败");
    return response.json();
  }

  try {
    const response = await fetch("/api/team", { cache: "no-store" });
    if (!response.ok) throw new Error("API unavailable");
    return await response.json();
  } catch {
    const fallback = await fetch("/team.json", { cache: "no-store" });
    if (!fallback.ok) throw new Error("团队资料加载失败");
    return fallback.json();
  }
}

function Brand({ teamName }) {
  return (
    <a className="brand-lockup" href="/" aria-label={`${teamName} 首页`}>
      <img src="/assets/linksee-mark.png" alt="" className="brand-mark" />
      <span>{teamName}</span>
    </a>
  );
}

function publicMemberName(member) {
  return member.isCaptain ? `队长·${member.name}` : member.name;
}

function MemberProfile({ member, index, compact = false }) {
  if (!member) return null;

  return (
    <section
      className={`member-profile${compact ? " member-profile--compact" : ""}`}
      aria-live="polite"
    >
      <header className="profile-heading">
        <div>
          <p>{member.role}</p>
          <h2>{publicMemberName(member)}</h2>
        </div>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </header>

      <dl className="profile-facts">
        <div>
          <dt>性别</dt>
          <dd>{member.gender}</dd>
        </div>
        <div>
          <dt>学校</dt>
          <dd>{member.school}</dd>
        </div>
        <div>
          <dt>专业</dt>
          <dd>{member.major}</dd>
        </div>
      </dl>

      <p className="profile-tagline">{member.tagline}</p>
    </section>
  );
}

function StoryTimeline() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return undefined;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 20) {
          setPlaying(false);
          return 0;
        }
        return current + 1;
      });
    }, 500);

    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="story-timeline" aria-label="澳门故事短片时间轴">
      <span className="recording-label">REC</span>
      <button type="button" onClick={() => setPlaying((value) => !value)}>
        {playing ? "暂停" : "播放"}
      </button>
      <progress value={progress} max="20">
        {progress} / 20
      </progress>
      <div className="timeline-labels" aria-hidden="true">
        <span>00:00</span>
        <span>00:05</span>
        <span>00:10</span>
        <span>00:15</span>
        <span>00:20</span>
      </div>
    </div>
  );
}

function SectionHeading({ index, eyebrow, title, description, inverse = false }) {
  return (
    <header className={`section-heading${inverse ? " section-heading--inverse" : ""}`}>
      <p className="section-number">{index}</p>
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
    </header>
  );
}

function ProjectStory({ project }) {
  const painPointLabels = {
    current: "现状问题",
    impact: "影响范围",
    limitations: "现有方案不足",
  };

  return (
    <div className="editorial-content">
      <section className="content-section project-section" id="project">
        <SectionHeading
          index="01"
          eyebrow="THE PROJECT / 参赛项目"
          title={project.name}
          description={project.tagline}
        />

        <div className="project-lede">
          <article className="project-statement">
            <p className="editorial-label">ONE-LINE CONCEPT</p>
            <p>{project.summary}</p>
          </article>
          <aside className="audience-panel">
            <p className="editorial-label">WHO WE SERVE / 服务群体</p>
            <p>{project.audience}</p>
          </aside>
        </div>

        <div className="feature-grid" aria-label="项目核心功能">
          {project.features.map((feature, index) => (
            <article key={feature.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="journey-block">
          <header>
            <p className="editorial-label">HOW IT WORKS / 使用流程</p>
            <p>从听见方向，到抵达故事。</p>
          </header>
          <ol>
            {project.journey.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="challenge-band" id="challenge">
        <div className="content-section challenge-section">
          <SectionHeading
            index="02"
            eyebrow="WHY IT MATTERS / 现实痛点"
            title={"不是到不了，\n而是每一步都缺少连续的提示。"}
            inverse
          />
          <div className="pain-grid">
            {Object.entries(project.painPoints).map(([key, value], index) => (
              <article key={key}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{painPointLabels[key]}</h3>
                <p>{value}</p>
              </article>
            ))}
          </div>
          <p className="research-note">{project.researchNote}</p>
        </div>
      </section>

      <section className="content-section innovation-section" id="innovation">
        <SectionHeading
          index="03"
          eyebrow="WHAT MAKES IT DIFFERENT / 核心亮点"
          title="让无障碍成为体验的主叙事"
        />
        <div className="highlight-list">
          {project.highlights.map((highlight, index) => (
            <article key={highlight.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="goals-band" id="goals">
        <div className="content-section goals-section">
          <SectionHeading
            index="04"
            eyebrow="OUR GOALS / 参赛目标"
            title={"先做出一条可抵达的路，\n再让更多城市故事从这里出发。"}
          />
          <div className="goals-grid">
            <article>
              <p className="editorial-label">NOW / 赛事期间</p>
              <h3>打磨可用原型</h3>
              <p>{project.goals.shortTerm}</p>
            </article>
            <article>
              <p className="editorial-label">NEXT / 赛事之后</p>
              <h3>与真实使用者共同验证</h3>
              <p>{project.goals.longTerm}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamHome({ team }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(null);
  const activeMember = team.members[activeIndex] || team.members[0];
  const desktopActiveMember =
    desktopActiveIndex === null ? null : team.members[desktopActiveIndex];
  const desktopActiveSlot =
    desktopActiveIndex === null
      ? null
      : portraitSlots[desktopActiveIndex] ||
        portraitSlots[portraitSlots.length - 1];
  const [projectNameLead, ...projectNameTailParts] = team.project.name.split("·");
  const projectNameTail = projectNameTailParts.join("·");

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="header-contact-lockup">
          <Brand teamName={team.teamName} />
          <a
            className="header-contact"
            href={`mailto:${team.contactEmail}`}
            aria-label={`发送邮件至 ${team.contactEmail}`}
          >
            <span>CONTACT ·</span>
            {team.contactEmail}
          </a>
        </div>
        <div className="event-lockup">
          <p className="event-name">{team.eventName}</p>
          <img
            src="/assets/macau-map-watermark.svg"
            alt=""
            aria-hidden="true"
            className="macau-map-watermark"
            draggable="false"
          />
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-project-kicker">SOCIAL INNOVATION / 社会创新</p>
          <h1 id="hero-title">
            {projectNameLead}
            {projectNameTail && (
              <>
                <span className="project-name-dot">·</span>
                {projectNameTail}
              </>
            )}
          </h1>
          <p className="project-line">{team.projectLine}</p>
          <nav className="page-guide" aria-label="页面导览">
            {pageGuideItems.map((item) => (
              <a key={item.href} href={item.href}>
                <span>{item.number}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <p className="hover-hint">
            <span>HOVER / FOCUS</span>
            悬停头像，认识我们
          </p>
        </div>

        <div className="portrait-stage">
          <img
            src="/assets/team-portrait-stage-v2.png"
            alt="LinkSee 五位成员形象，四位女性与一位男性"
            className="team-portrait"
          />

          <div className="portrait-hotspots" aria-label="选择团队成员">
            {team.members.map((member, index) => {
              const slot = portraitSlots[index] || portraitSlots[portraitSlots.length - 1];
              return (
                <button
                  type="button"
                  key={member.id}
                  className={`portrait-hotspot portrait-hotspot--${slot.key}`}
                  aria-label={`查看${publicMemberName(member)}的介绍`}
                  onMouseEnter={() => setDesktopActiveIndex(index)}
                  onMouseLeave={() => setDesktopActiveIndex(null)}
                  onFocus={() => setDesktopActiveIndex(index)}
                  onBlur={() => setDesktopActiveIndex(null)}
                />
              );
            })}
          </div>

          {desktopActiveMember && desktopActiveSlot ? (
            <div
              className={`member-profile-wrap member-profile-wrap--${desktopActiveSlot.key}`}
            >
              <MemberProfile
                member={desktopActiveMember}
                index={desktopActiveIndex}
              />
            </div>
          ) : null}

          <StoryTimeline />
        </div>

        <div className="mobile-member-nav" aria-label="选择团队成员">
          {team.members.map((member, index) => (
            <button
              type="button"
              key={member.id}
              className={activeIndex === index ? "is-active" : ""}
              onClick={() => setActiveIndex(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {publicMemberName(member)}
            </button>
          ))}
        </div>

        <div className="mobile-profile">
          <MemberProfile member={activeMember} index={activeIndex} compact />
        </div>
      </section>

      <ProjectStory project={team.project} />

      <footer className="site-footer">
        <span>LINKSEE · ACCESSIBLE MACAU JOURNEY</span>
        <div className="footer-links">
          <a href={`mailto:${team.contactEmail}`}>
            CONTACT · {team.contactEmail}
          </a>
          <a href="/?view=admin">管理内容</a>
        </div>
      </footer>
    </main>
  );
}

function Field({ label, value, onChange, multiline = false, type = "text" }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <label className="admin-field">
      <span>{label}</span>
      <Control
        {...(multiline ? {} : { type })}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function AdminPage({ initialTeam }) {
  const [team, setTeam] = useState(initialTeam);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => setTeam(initialTeam), [initialTeam]);

  const memberCount = useMemo(() => team.members.length, [team.members]);

  function updateTeamField(key, value) {
    setTeam((current) => ({ ...current, [key]: value }));
  }

  function updateMember(index, key, value) {
    setTeam((current) => ({
      ...current,
      members: current.members.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [key]: value } : member,
      ),
    }));
  }

  function updateProjectField(key, value) {
    setTeam((current) => ({
      ...current,
      project: { ...current.project, [key]: value },
    }));
  }

  function updateProjectNested(group, key, value) {
    setTeam((current) => ({
      ...current,
      project: {
        ...current.project,
        [group]: { ...current.project[group], [key]: value },
      },
    }));
  }

  function updateProjectListItem(group, index, key, value) {
    setTeam((current) => ({
      ...current,
      project: {
        ...current.project,
        [group]: current.project[group].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
  }

  function moveMember(index, direction) {
    const destination = index + direction;
    if (index === 0 || destination < 1 || destination >= memberCount) return;

    setTeam((current) => {
      const members = [...current.members];
      [members[index], members[destination]] = [members[destination], members[index]];
      return { ...current, members };
    });
  }

  async function saveTeam(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/team", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(team),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "保存失败");
      setTeam(payload);
      setMessage("保存成功，首页内容已更新。");
    } catch (error) {
      setMessage(error.message || "保存失败");
    } finally {
      setSaving(false);
    }
  }

  if (!unlocked) {
    return (
      <main className="admin-shell admin-login">
        <Brand teamName={team.teamName} />
        <section>
          <p className="admin-eyebrow">CONTENT STUDIO</p>
          <h1>管理后台</h1>
          <p>编辑比赛信息、参赛项目与五位成员资料。队长始终固定在第一位。</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!password.trim()) return;
              setUnlocked(true);
            }}
          >
            <Field
              label="管理密码"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <button type="submit" className="primary-button">
              进入后台
            </button>
          </form>
          <a href="/" className="text-link">
            返回团队首页
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">LINKSEE CONTENT STUDIO</p>
          <h1>管理团队内容</h1>
        </div>
        <a href="/" className="secondary-button">
          查看首页
        </a>
      </header>

      <form onSubmit={saveTeam}>
        <section className="admin-section">
          <header>
            <h2>页面信息</h2>
            <p>这些文字会实时出现在团队首页。</p>
          </header>
          <div className="admin-grid">
            {teamFields.map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={team[key]}
                onChange={(value) => updateTeamField(key, value)}
              />
            ))}
          </div>
        </section>

        <section className="admin-section">
          <header>
            <h2>成员资料</h2>
            <p>第一位固定为队长；其余成员可调整展示顺序。</p>
          </header>

          <div className="member-editor-list">
            {team.members.map((member, index) => (
              <article className="member-editor" key={member.id}>
                <header>
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{member.name || `成员 ${index + 1}`}</h3>
                    {index === 0 && <strong>队长 / 首位</strong>}
                  </div>
                  {index > 0 && (
                    <div className="reorder-buttons">
                      <button
                        type="button"
                        onClick={() => moveMember(index, -1)}
                        disabled={index === 1}
                      >
                        上移
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMember(index, 1)}
                        disabled={index === memberCount - 1}
                      >
                        下移
                      </button>
                    </div>
                  )}
                </header>
                <div className="admin-grid">
                  {memberFields.map(([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      value={member[key]}
                      multiline={key === "tagline"}
                      onChange={(value) => updateMember(index, key, value)}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <header>
            <h2>参赛项目</h2>
            <p>编辑项目介绍、服务群体、现实痛点、使用流程和参赛目标。</p>
          </header>

          <div className="admin-grid">
            {projectFields.map(([key, label, multiline]) => (
              <Field
                key={key}
                label={label}
                value={team.project[key]}
                multiline={multiline}
                onChange={(value) => updateProjectField(key, value)}
              />
            ))}
          </div>

          <div className="project-editor-group">
            <h3>核心功能</h3>
            {team.project.features.map((feature, index) => (
              <div className="admin-grid" key={`feature-${index}`}>
                <Field
                  label={`功能 ${index + 1} 标题`}
                  value={feature.title}
                  onChange={(value) =>
                    updateProjectListItem("features", index, "title", value)
                  }
                />
                <Field
                  label={`功能 ${index + 1} 描述`}
                  value={feature.description}
                  multiline
                  onChange={(value) =>
                    updateProjectListItem("features", index, "description", value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="project-editor-group">
            <h3>使用流程</h3>
            {team.project.journey.map((step, index) => (
              <div className="admin-grid" key={`journey-${index}`}>
                <Field
                  label={`步骤 ${index + 1} 标题`}
                  value={step.title}
                  onChange={(value) =>
                    updateProjectListItem("journey", index, "title", value)
                  }
                />
                <Field
                  label={`步骤 ${index + 1} 描述`}
                  value={step.description}
                  multiline
                  onChange={(value) =>
                    updateProjectListItem("journey", index, "description", value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="project-editor-group">
            <h3>现实痛点</h3>
            <div className="admin-grid">
              {painPointFields.map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  value={team.project.painPoints[key]}
                  multiline
                  onChange={(value) =>
                    updateProjectNested("painPoints", key, value)
                  }
                />
              ))}
            </div>
          </div>

          <div className="project-editor-group">
            <h3>核心亮点</h3>
            {team.project.highlights.map((highlight, index) => (
              <div className="admin-grid" key={`highlight-${index}`}>
                <Field
                  label={`亮点 ${index + 1} 标题`}
                  value={highlight.title}
                  onChange={(value) =>
                    updateProjectListItem("highlights", index, "title", value)
                  }
                />
                <Field
                  label={`亮点 ${index + 1} 描述`}
                  value={highlight.description}
                  multiline
                  onChange={(value) =>
                    updateProjectListItem("highlights", index, "description", value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="project-editor-group">
            <h3>参赛目标</h3>
            <div className="admin-grid">
              {goalFields.map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  value={team.project.goals[key]}
                  multiline
                  onChange={(value) => updateProjectNested("goals", key, value)}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="admin-savebar">
          <p role="status">{message}</p>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "保存中…" : "保存全部修改"}
          </button>
        </div>
      </form>
    </main>
  );
}

export function App() {
  const [team, setTeam] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeam().then(setTeam).catch((loadError) => setError(loadError.message));
  }, []);

  if (error) {
    return (
      <main className="load-state">
        <h1>LinkSee</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="load-state">
        <p>正在加载 LinkSee 团队资料…</p>
      </main>
    );
  }

  const isAdmin =
    window.location.pathname.startsWith("/admin") ||
    new URLSearchParams(window.location.search).get("view") === "admin";

  return isAdmin ? (
    <AdminPage initialTeam={team} />
  ) : (
    <TeamHome team={team} />
  );
}
