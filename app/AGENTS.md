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
- Desktop interaction uses hover and keyboard focus; each member's 68%-opaque profile card appears beside their portrait. Touch layouts use member tabs with a solid profile card below the portrait.
- Team content is editable from `/admin` and persisted through the local API.
- Never expose the admin password or a password hint in the public interface.
- Use the supplied Macau location map as a cobalt-blue decorative watermark: right-aligned over the portrait stage on desktop and tablet, centered within the portrait stage on mobile, always below interactive hotspots and profile cards.
