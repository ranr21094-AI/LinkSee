# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## LinkSee design decisions

- Visual source of truth: the selected warm-ivory editorial mock with black, vermilion, and cobalt typography.
- The hero always presents five people, with the captain in the front/center interaction slot.
- Current team mix is four women and one man. The left-middle portrait slot represents 娄午尘 and uses the female figure in `team-portrait-stage-v2.png`.
- Do not show a large `05` or `MEMBERS` decoration on the public page.
- Public copy uses `LinkSee`, `灣區AI未來青年創造營`, and `声路·澳门`; do not show `创意引擎` or `AI想象力即“超能力”`. The Hero core-positioning line is `社会创新：「本项目改善的是澳门 城市无障碍游览 场景」`.
- Do not show the separate `SOCIAL INNOVATION / 社会创新` Hero kicker. The project title, positioning line, page guide, and hover/focus hint begin directly at the established Hero copy anchor and therefore sit higher as one compact group.
- Show `winnyng0327@gmail.com` as a clickable `mailto:` contact in the footer and keep it editable in `/admin`.
- Repeat the same editable email as `CONTACT · address` immediately to the right of the public `LinkSee` brand. On desktop and tablet it shares the header row with the event name; below 700px the brand and full email stay on the first row while the event name moves to a second row aligned right.
- Keep the hero copy vertically compact: desktop starts at `top: 92px` so the positioning underline clears the nearest portrait hair, while tablet and mobile retain their established spacing. On desktop, the hover/focus hint is anchored 16px below the project underline.
- Desktop profile cards are transient: no member is shown by default, hover or keyboard focus reveals that member's 68%-opaque card beside their portrait, and pointer leave or blur hides it immediately. Clicking does not pin a card, and portrait hotspots never show numbered/name badges. Touch layouts continue to use member tabs with a solid profile card below the portrait.
- Public member profiles omit age while retaining the age field in local admin data. The role line displays each member's complete responsibility label.
- Prefix the captain's public-facing name with `队长·` while keeping the editable raw name as `吳芸曦`.
- Keep the captain role as `产品策划与统筹（PM/策划）` without a second captain suffix; her public tagline is `让每一次抵达，都被城市温柔看见。`.
- Place the four-link page guide directly above the desktop hover/focus hint, targeting the project, challenge, innovation, and goals sections. Keep the guide independently visible and horizontally scrollable on tablet and mobile even though the hover hint is hidden there.
- Keep section headings 01–04 tightly grouped: desktop and tablet use a `56px` number rail with a `12px` gap, while mobile keeps its `42px` rail. In the project audience card, group the label and body at the top with a `28px` gap; retain the standard card bottom inset and the original `76px` gap before the feature grid.
- Team content is editable from `/admin` and persisted through the local API.
- Below the member Hero, present the complete assignment narrative for `声路·澳门`: product description, three service audiences, three core features, the six-step flow from the supplied `补充.md`, pain-point analysis, three innovations, and the full three-item short/long-term goal lists. Keep this content editable in `/admin`; do not add a cross-project launch button.
- The 01–04 project copy follows `页面补充材料.docx`: position the project as a first-person blind-travel experience game based on real Macao streets; use the features `盲杖探索 / 感官导航 / 多结局叙事`, the documented reality analysis, the three innovation categories, and the 72-hour plus long-term goals.
- Never expose the admin password or a password hint in the public interface.
- Layer the supplied cobalt-blue Macau location map behind the event name and its red underline inside an isolated upper-right lockup. Keep the label and underline above the map, use a 340 × 410px texture at 6% opacity on desktop and 240 × 300px at 6% on tablet, crop it against the right page edge, fade its left edge, and start the bottom fade near 76% so it dissolves as it reaches the nearest portrait instead of ending on a flat cut. Hide it below 700px.
