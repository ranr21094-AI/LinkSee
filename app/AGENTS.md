# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## LinkSee design decisions

- Visual source of truth: the selected warm-ivory editorial mock with black, vermilion, and cobalt typography.
- The hero always presents five people, with the captain in the front/center interaction slot.
- Current team mix is three women and two men.
- Do not show a large `05` or `MEMBERS` decoration on the public page.
- Public copy uses `LinkSee`, `灣區AI未來青年創造營`, `创意引擎 — AI想象力即“超能力”`, and `用AI视频讲述澳门故事`.
- Keep the hero copy vertically compact: desktop starts 32px higher than the original mock, tablet 20px higher, and mobile 16px higher. On desktop, the hover/focus hint is anchored 16px below the project underline.
- Desktop profile cards are transient: no member is shown by default, hover or keyboard focus reveals that member's 68%-opaque card beside their portrait, and pointer leave or blur hides it immediately. Clicking does not pin a card, and portrait hotspots never show numbered/name badges. Touch layouts continue to use member tabs with a solid profile card below the portrait.
- Team content is editable from `/admin` and persisted through the local API.
- Never expose the admin password or a password hint in the public interface.
- Place the supplied cobalt-blue Macau location map directly below the event-name red underline in the upper-right whitespace. Treat it as an enlarged background texture: crop it against the right page edge, fade its left edge, extend its lower portion until it reaches the nearest portrait, then fade the bottom edge into that overlap instead of ending on a flat horizontal cut. Use about 7% opacity on desktop and 6% on tablet, and hide it below 700px.
