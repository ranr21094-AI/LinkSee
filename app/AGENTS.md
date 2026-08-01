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
- Public copy uses `LinkSee`, `灣區AI未來青年創造營`, and `创意引擎 — AI想象力即“超能力”`. The Hero core-positioning line is `社会创新：「本项目改善的是澳门 城市无障碍游览 场景」`.
- Keep the hero copy vertically compact: desktop starts 32px higher than the original mock, tablet 20px higher, and mobile 16px higher. On desktop, the hover/focus hint is anchored 16px below the project underline.
- Desktop profile cards are transient: no member is shown by default, hover or keyboard focus reveals that member's 68%-opaque card beside their portrait, and pointer leave or blur hides it immediately. Clicking does not pin a card, and portrait hotspots never show numbered/name badges. Touch layouts continue to use member tabs with a solid profile card below the portrait.
- Public member profiles omit age while retaining the age field in local admin data. The role line displays each member's complete responsibility label.
- Team content is editable from `/admin` and persisted through the local API.
- Below the member Hero, present the complete assignment narrative for `声路·澳门`: product description, service audience, three core features, three-step flow, pain-point analysis, three innovations, and short/long-term goals. Keep this content editable in `/admin`; do not add a cross-project launch button.
- Never expose the admin password or a password hint in the public interface.
- Layer the supplied cobalt-blue Macau location map behind the event name and its red underline inside an isolated upper-right lockup. Keep the label and underline above the map, use a 340 × 410px texture at 6% opacity on desktop and 240 × 300px at 6% on tablet, crop it against the right page edge, fade its left edge, and start the bottom fade near 76% so it dissolves as it reaches the nearest portrait instead of ending on a flat cut. Hide it below 700px.
