# LinkSee Design QA

## Visual truth and capture conditions

- Source visual: `C:\Users\10127\.codex\generated_images\019fb342-bc4f-7b81-bd34-82b6e5bf015c\call_xEbOPSW1aZgTguu065sGtT9w.png`
- Source size: 1486 × 1058 px.
- Latest map reference: `C:\Users\10127\AppData\Local\Temp\codex-clipboard-9fe4d90d-68b7-4362-b651-bc73b706cb9e.png` (643 × 775 px). The user-directed target now places a larger map behind the event title and red underline, with its lower edge fading into the nearest portrait.
- Latest user direction supersedes the source visual in four areas: remove `05 / MEMBERS`, use transient translucent profile cards beside members, move the hero copy upward with the hover hint below the project underline, and integrate the map into the event-title background layer.
- Final desktop implementation: `qa/implementation-map-layer-v6.png`
- Desktop capture: public home with no profile open, 1440 × 1000 CSS viewport, DPR 1; full-page screenshot is 1424 × 1076 px after scrollbar exclusion.
- Full-view targeted comparison: `qa/comparison-map-layer-v6.png`; the reference and the right-side implementation crop are normalized to 643 × 775 px.
- Focused map comparison: `qa/comparison-map-layer-focus-v6.png`; both title/map regions are normalized to 420 × 500 px for direct layer, scale, and fade inspection.
- Tablet evidence: `qa/implementation-tablet-map-layer-v6.png`, 800 × 1000 CSS viewport, DPR 1; full-page screenshot is 784 × 1254 px.
- Mobile evidence: `qa/implementation-mobile-map-layer-v6.png`, 390 × 844 CSS viewport, DPR 1; full-page screenshot is 374 × 993 px.
- Desktop state: public home with no profile open, 1440 × 1000 CSS viewport, DPR 1.
- Final mobile implementation: `qa/implementation-mobile-map-layer-v6.png`
- Latest assignment-complete desktop capture: `qa/implementation-project-v7.png`, 1440 × 1000 CSS viewport.
- Latest assignment-complete mobile capture: `qa/implementation-mobile-project-v7.png`, 390 × 844 CSS viewport.
- Mobile state: public home with the captain tab selected, 390 × 844 CSS viewport; full-page capture is 374 × 993 px after scrollbar exclusion.
- Full-view comparison: `qa/comparison-v4.png`. The source was center-cropped and normalized to the implementation dimensions.
- Focused profile comparison: `qa/comparison-profile-v3.png`.
- Focused before/after hero comparison: `qa/comparison-hero-shift-v4.png`.
- Five-member position evidence: `qa/profile-positions-v4.png`.

## Required fidelity surfaces

- Fonts and typography: the heavy black display hierarchy, vermilion `AI`, compact blue profile headings, and small editorial labels remain consistent with the source direction.
- Spacing and layout: headline, portrait composition, event label, profile card, timeline, and footer remain aligned. The 340 × 410 px desktop map starts behind the event title, reaches the right portrait edge, and creates no horizontal overflow.
- Colors and tokens: warm ivory, black, vermilion, and cobalt remain unchanged. The map stays at 6% opacity on desktop and tablet; desktop profile background remains `rgba(255, 250, 244, 0.68)` with an 8 px blur.
- Image quality: the supplied high-resolution five-person portrait, LinkSee mark, and vector Macau map remain sharp. The map uses its existing SVG content with a layered mask rather than a replacement asset.
- Copy and content: competition, track, project, and member content are unchanged. No visible or accessible `05 / MEMBERS` decoration remains.

## Comparison history

### Earlier V1/V2 fixes

- P2: removed the original oversized active-member oval.
- P2: corrected timeline/footer overlap.
- P2: fixed mobile headline, event copy, count placement, and overflow.
- P3: hid the mobile selector scrollbar.

### V3 interaction pass

- P2: overlapping portrait hotspots could route the upper member to the captain.
  - Fix: tightened all five hotspot regions so they no longer overlap.
  - Evidence: all five click states resolved to the expected member and slot.
- P2: clicking a portrait exposed the global focus outline as a large blue ellipse.
  - Fix: suppressed the hotspot outline while keeping the bordered member-name focus label visible.
  - Post-fix evidence: `qa/profile-positions-v4.png`.
- User-directed change: removed the large `05 / MEMBERS` decoration and its responsive styles.
- User-directed change: assigned five profile positions and changed the desktop card to 68% opacity.

### V4 hero-position pass

- User-directed change: raised the hero copy by 32 px on desktop, 20 px on tablet, and 16 px on mobile.
- User-directed change: moved the desktop hover/focus hint into the hero copy flow, exactly 16 px below the project underline.
- Post-change evidence: `qa/comparison-hero-shift-v4.png`.
- No actionable P0/P1/P2 issue was found; the title remains clear of the header and portraits at all tested sizes.

### V5 map-extension pass

- P2: the map ended on a visible flat horizontal crop before reaching the nearby portrait.
  - Fix: increased the desktop map viewport from 220 px to 300 px and the tablet viewport from 170 px to 225 px.
  - Fix: combined the existing left-edge fade with a bottom fade from 82% to 100%, so the map dissolves where it touches the portrait instead of ending abruptly.
  - Post-fix evidence: `qa/comparison-map-extend-v5.png` and `qa/comparison-map-focus-v5.png`.
- Desktop evidence: the 300 px map reaches the engineer portrait hotspot at its faded lower edge without page overflow.
- Tablet evidence: the 225 px map overlaps the portrait stage by 13 px only within its fade; opacity remains 6% and there is no horizontal overflow.
- Mobile evidence: the map remains hidden below 700 px and all five member buttons remain present.
- No actionable P0/P1/P2 issue remains after the focused comparison.

### V6 event-title layer pass

- P2: the enlarged map still read as a separate block anchored below the red underline rather than part of the event-title composition.
  - Fix: moved the map to `top: -18px` and `right: -54px` inside the event lockup, enlarged it to 340 × 410 px, and isolated that lockup’s stacking context.
  - Fix: placed the map at `z-index: -1`, leaving the event title and underline in the foreground, and moved the bottom fade start to 76% so the texture dissolves at the nearest hairline.
  - Post-fix evidence: `qa/comparison-map-layer-v6.png` and `qa/comparison-map-layer-focus-v6.png`.
- Desktop evidence: the event title is the topmost hit target over the map, the map measures 340 × 410 px at 6% opacity, and the page has no horizontal overflow.
- Tablet evidence: the map measures 240 × 300 px at 6% opacity, ends at the portrait-stage boundary within its fade, retains all five member buttons, and creates no horizontal overflow.
- Mobile evidence: the map is `display: none`, all five member buttons remain present, and there is no horizontal overflow.
- No actionable P0/P1/P2 issue remains after the full-view and focused comparisons.

### V7 assignment and project-content pass

- Added the complete `声路·澳门` assignment narrative below the existing member Hero: product description, service audience, three features, three-step flow, pain-point analysis, three innovations, and short/long-term goals.
- Changed the Hero core positioning to the approved social-innovation statement while preserving the existing track title and event lockup.
- Updated the portrait to four women and one man; the left-middle slot now represents 娄午尘 as a woman. The remaining four figures, crop, background, and interaction positions are unchanged.
- Public member profiles no longer show age, retain gender/school/major/tagline, and display the full approved responsibility label. Age remains editable in the local admin data.
- Added project-content editors and validation to `/admin`; an unchanged save completed successfully and kept the captain first.
- Desktop at 1440 px and mobile at 390 px have no horizontal overflow. Mobile keeps all five member tabs, hides the map, uses the solid profile card, and stacks all new content sections into one readable column.
- Added a site-specific social sharing image at `public/og.png` with matching warm-ivory, black, vermilion, and cobalt art direction.

### V8 project-title and contact pass

- Removed the public `创意引擎 / AI想象力即“超能力”` heading and promoted `声路·澳门` to the Hero title, with the middle dot carrying the existing vermilion accent.
- Added `winnyng0327@gmail.com` as a clickable footer contact and as an editable field in `/admin`.
- Kept the social-innovation positioning, member interaction, project sections, portrait, map treatment, and responsive rules unchanged.

### V9 Hero clearance and member corrections

- Raised the desktop Hero copy from `116px` to `92px`, moving the project title, positioning underline, and hover hint together so the red line clears the nearest portrait hair.
- Public captain labels now read `队长·吳芸曦`; the editable source name remains `吳芸曦`.
- Corrected 吳芸曦's major to `政治学与行政学` and 张燕菲's major to `计算机艺术` in both local and published team data.

### V10 captain copy refinement

- Removed the redundant `+ 队长` suffix from 吳芸曦's role because her public name already carries the `队长·` prefix.
- Replaced the former competitive tagline with `让每一次抵达，都被城市温柔看见。`, matching the project's inclusive-city theme.

### V11 page guide and member correction

- Corrected 张燕菲's major to `计算艺术` in both local and published team data.
- Added a four-link page guide below the desktop hover/focus hint for the project, challenge, innovation, and goals sections.
- Kept the guide visible as a horizontally scrollable control on tablet and mobile while the hover-only instruction remains hidden.

### V12 editorial spacing refinement

- Narrowed the desktop 01–04 section-number rail to `112px` with a `24px` gap, moving every section title left while retaining the editorial numbering structure.
- Reduced the audience panel's bottom inset to `22px` and the gap before the feature grid to `52px`, removing the oversized lower whitespace without changing its content.
- Kept the existing tablet and mobile heading grids and stacked project layout unchanged.

### V13 spacing clarification

- Moved all 01–04 headings farther left by reducing the desktop and tablet number rail to `56px` and the inter-column gap to `12px`.
- Corrected the audience-card interpretation: restored its normal bottom inset and the original `76px` following-section gap, then grouped the label and body at the top with a `28px` gap.
- Applied the same `28px` label-to-body spacing on mobile while retaining the `42px` mobile heading rail.

### V14 hero guide order

- Moved the four-link page guide above the desktop hover/focus instruction without changing either component's styling or behavior.
- Touch layouts continue to show the guide while hiding the hover-only instruction.

### V15 header contact

- Added the editable team email as a second `mailto:` link immediately to the right of the public LinkSee brand, using the label `CONTACT ·` and a cobalt divider.
- Desktop and tablet retain a single header row; below 700px the brand and full email remain on the first row while the event name moves to a right-aligned second row.
- The header and footer contacts read the same `contactEmail` field, so admin edits stay synchronized.

### V16 Hero kicker removal

- Removed the standalone `SOCIAL INNOVATION / 社会创新` kicker while retaining `社会创新` in the editable core-positioning sentence.
- The project title, positioning underline, page guide, and hover/focus instruction now move upward together from the unchanged Hero copy anchor; portrait placement remains unchanged.

### V17 supplemental project copy

- Reworked the 01–04 narrative from `页面补充材料.docx`: the project is now described as a first-person blind-travel experience game, with blind-cane exploration, sensory navigation, multiple endings, documented pain points, three innovation categories, and 72-hour/long-term goals.

## Functional and responsive checks

- All five desktop portrait buttons reveal the correct member on hover or keyboard focus and clear the profile on pointer leave or blur.
- Clicking does not pin a desktop profile; mobile member buttons continue to select the persistent bottom profile.
- Cards stay inside the portrait stage and beside the related figure without covering that member's face.
- Mobile at 390 px has no horizontal overflow, retains member tabs, hides the desktop card, and uses a solid profile card.
- Tablet at 800 px uses the same stable member-tab layout with no horizontal overflow.
- Hero copy uses the intended 92 px desktop top offset, 60 px tablet padding, and 38 px mobile padding; the hover hint is hidden on touch layouts while the page guide remains available.
- Timeline playback advances and changes the control to pause.
- The latest desktop render exposes all five portrait hotspots with clear accessible names, and no profile is shown away from a member. The map remains non-interactive and hidden from assistive technology.
- `/admin` unlocks, keeps the captain first, and successfully saves unchanged data.
- Public and admin browser consoles contain no errors or warnings.

## Severity summary

- P0: 0
- P1: 0
- P2: 0
- P3: 1 accepted simplification — the implementation omits the hand-drawn silhouette outline and pictogram row from the original concept.

final result: passed
