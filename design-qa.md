**Source visual truth**

- Path: `/workspace/scratch/6cf2716ff9a7/upload/IMG_0979.jpeg`
- Source pixels: 1125 × 1816.
- State: mobile Moby Dick game board with the voyage map visible mainly in the left gutter and obscured beneath the playable coordinate cells.

**Implementation evidence**

- Browser-rendered screenshot: inline Cloud Browser capture from `http://terminal.local:4173/?map-layer=2` in the current Work Mode session.
- Browser viewport: 1363 × 936 CSS px at device pixel ratio 1.
- State: Moby Dick selected, game entered, unplayed 7×7 coordinate chart visible.
- Focused board evidence: the complete historical map is visible continuously beneath the A–G and 1–7 grid; the former map-only gutter is now neutral parchment.

**Full-view comparison evidence**

- The source shows the map detached from the playable surface because it belongs to the scrollable outer frame.
- The implementation places the map on `.coordinate-board`, so the map and all 49 playable squares share the same coordinate system and scroll together.
- Unplayed cells use 20% parchment opacity, making the map clearly visible without weakening grid borders or coordinate labels.
- Caption, legend, command area and surrounding period styling remain unchanged.

**Focused board-state comparison**

- Resting state: the map is visible beneath every unplayed coordinate.
- Hover/focus state: the active square retains the stronger parchment treatment and focus outline.
- Result state: a tested miss at A1 becomes a solid dark sea square labelled “Miss”; the map remains visible beneath the other 48 unplayed cells.
- Computed board background contains `pequod-voyage-map.webp`; computed unplayed-cell background is `rgba(230, 218, 190, 0.2)`.

**Required fidelity surfaces**

- Fonts and typography: sea-chart headings, row/column labels, captions and status copy are unchanged and remain legible.
- Spacing and layout rhythm: grid geometry, labels, caption and scroll behaviour are unchanged; the image now aligns with the playable grid.
- Colors and visual tokens: parchment, teak, navy miss and burgundy hit treatments are preserved; only resting transparency changed.
- Image quality and asset fidelity: the supplied optimized 800 × 554 voyage-map WebP is reused directly, centred and covered across the grid without introducing a substitute asset.
- Copy and content: no game wording or coordinate labels changed.

**Interaction verification**

- Moby Dick selection and “Begin the Hunt” work.
- The board renders 49 coordinate controls.
- A1 accepts a strike, announces its result, and displays the correct solid miss state.
- Map imagery remains attached to the board after the strike.
- No site-origin console errors were present.
- All 14 automated tests pass.

**Findings**

- No actionable P0, P1 or P2 differences remain for the requested map-visibility correction.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Attach the voyage map directly to the coordinate board.
- [x] Remove the image from the outer gutter.
- [x] Make unplayed cells translucent.
- [x] Preserve labels, focus, hit and miss contrast.
- [x] Bust the cached stylesheet URLs.

**Follow-up Polish**

- None required for this scoped change.

final result: passed
