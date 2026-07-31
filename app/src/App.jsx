import { useEffect, useMemo, useState } from "react";

const portraitSlots = [
  { key: "captain", number: "01" },
  { key: "developer", number: "02" },
  { key: "director", number: "03" },
  { key: "designer", number: "04" },
  { key: "engineer", number: "05" },
];

const teamFields = [
  ["teamName", "队伍名称"],
  ["eventName", "比赛名称"],
  ["trackTitle", "赛道标题"],
  ["headline", "主标题"],
  ["projectLine", "项目介绍"],
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

function MemberProfile({ member, index, compact = false }) {
  if (!member) return null;

  return (
    <section
      className={`member-profile${compact ? " member-profile--compact" : ""}`}
      aria-live="polite"
    >
      <header className="profile-heading">
        <div>
          <p>{member.isCaptain ? "CAPTAIN" : member.role}</p>
          <h2>{member.name}</h2>
        </div>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </header>

      <dl className="profile-facts">
        <div>
          <dt>年龄</dt>
          <dd>{member.age}岁</dd>
        </div>
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

function TeamHome({ team }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMember = team.members[activeIndex] || team.members[0];
  const activeSlot =
    portraitSlots[activeIndex] || portraitSlots[portraitSlots.length - 1];
  const headlineWithoutAi = team.headline.replace(/^AI/, "");
  const headlineSplitAt = headlineWithoutAi.indexOf("即");
  const headlineLead =
    headlineSplitAt >= 0 ? headlineWithoutAi.slice(0, headlineSplitAt) : headlineWithoutAi;
  const headlineTail = headlineSplitAt >= 0 ? headlineWithoutAi.slice(headlineSplitAt) : "";

  return (
    <main className="site-shell">
      <header className="site-header">
        <Brand teamName={team.teamName} />
        <p className="event-name">{team.eventName}</p>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="track-title">{team.trackTitle} —</p>
          <h1 id="hero-title">
            <span className="headline-ai">AI</span>
            {headlineLead}
            {headlineTail && <span className="headline-tail">{headlineTail}</span>}
          </h1>
          <p className="project-line">{team.projectLine}</p>
          <p className="hover-hint">
            <span>HOVER / FOCUS</span>
            悬停头像，认识我们
          </p>
        </div>

        <div className="portrait-stage">
          <img
            src="/assets/team-portrait-stage.png"
            alt="LinkSee 五位成员形象，三位女性与两位男性"
            className="team-portrait"
          />
          <img
            src="/assets/macau-map-watermark.svg"
            alt=""
            aria-hidden="true"
            className="macau-map-watermark"
            draggable="false"
          />

          <div className="portrait-hotspots" aria-label="选择团队成员">
            {team.members.map((member, index) => {
              const slot = portraitSlots[index] || portraitSlots[portraitSlots.length - 1];
              return (
                <button
                  type="button"
                  key={member.id}
                  className={`portrait-hotspot portrait-hotspot--${slot.key}${
                    activeIndex === index ? " is-active" : ""
                  }`}
                  aria-pressed={activeIndex === index}
                  aria-label={`查看${member.name}的介绍`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <span>
                    {slot.number} · {member.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className={`member-profile-wrap member-profile-wrap--${activeSlot.key}`}
          >
            <MemberProfile member={activeMember} index={activeIndex} />
          </div>

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
              {member.name}
            </button>
          ))}
        </div>

        <div className="mobile-profile">
          <MemberProfile member={activeMember} index={activeIndex} compact />
        </div>
      </section>

      <footer className="site-footer">
        <span>LINKSEE · MACAU STORIES WITH AI</span>
        <a href="/admin">管理内容</a>
      </footer>
    </main>
  );
}

function Field({ label, value, onChange, multiline = false }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <label className="admin-field">
      <span>{label}</span>
      <Control value={value} onChange={(event) => onChange(event.target.value)} />
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
          <p>编辑比赛信息与五位成员资料。队长始终固定在第一位。</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!password.trim()) return;
              setUnlocked(true);
            }}
          >
            <Field label="管理密码" value={password} onChange={setPassword} />
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

  return window.location.pathname.startsWith("/admin") ? (
    <AdminPage initialTeam={team} />
  ) : (
    <TeamHome team={team} />
  );
}
