# LinkSee Design QA

## Visual truth and capture conditions

- Source visual: `C:\Users\10127\.codex\generated_images\019fb342-bc4f-7b81-bd34-82b6e5bf015c\call_xEbOPSW1aZgTguu065sGtT9w.png`
- Source size: 1486 × 1058 px.
- Latest user direction supersedes the source visual in three areas: remove `05 / MEMBERS`, use a translucent profile card positioned beside each member, and move the hero copy upward with the hover hint directly below the project underline.
- Final desktop implementation: `qa/implementation-home-v4.png`
- Desktop state: public home, captain selected, 1280 × 720 CSS viewport, DPR 1.5; full-page capture is 1264 × 962 px after scrollbar exclusion.
- Final mobile implementation: `qa/implementation-mobile-v4.png`
- Mobile state: public home, captain selected, 390 × 844 CSS viewport; full-page capture is 374 × 1009 px after scrollbar exclusion.
- Full-view comparison: `qa/comparison-v4.png`. The source was center-cropped and normalized to the implementation dimensions.
- Focused profile comparison: `qa/comparison-profile-v3.png`.
- Focused before/after hero comparison: `qa/comparison-hero-shift-v4.png`.
- Five-member position evidence: `qa/profile-positions-v4.png`.

## Required fidelity surfaces

- Fonts and typography: the heavy black display hierarchy, vermilion `AI`, compact blue profile headings, and small editorial labels remain consistent with the source direction.
- Spacing and layout: headline, portrait composition, event label, profile card, timeline, and footer remain aligned. Removing the count opens the intended top-right negative space.
- Colors and tokens: warm ivory, black, vermilion, and cobalt remain unchanged. Desktop profile background is verified as `rgba(255, 250, 244, 0.68)` with an 8 px blur; mobile uses solid warm white.
- Image quality: the supplied high-resolution five-person portrait and LinkSee mark remain sharp with no crop or asset changes.
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

## Functional and responsive checks

- All five portrait buttons select the correct member and use distinct captain, developer, director, designer, and engineer card positions.
- Click leaves the selected portrait button focused and updates the profile; the same React handler remains wired to mouse enter and keyboard focus.
- Cards stay inside the portrait stage and beside the related figure without covering that member's face.
- Mobile at 390 px has no horizontal overflow, retains member tabs, hides the desktop card, and uses a solid profile card.
- Tablet at 800 px uses the same stable member-tab layout with no horizontal overflow.
- Hero copy uses the intended 116 px desktop top offset, 60 px tablet padding, and 38 px mobile padding; the hover hint is hidden on touch layouts.
- Timeline playback advances and changes the control to pause.
- `/admin` unlocks, keeps the captain first, and successfully saves unchanged data.
- Public and admin browser consoles contain no errors or warnings.

## Severity summary

- P0: 0
- P1: 0
- P2: 0
- P3: 1 accepted simplification — the implementation omits the hand-drawn silhouette outline and pictogram row from the original concept.

final result: passed
