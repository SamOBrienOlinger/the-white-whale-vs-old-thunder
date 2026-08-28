**Source visual truth**

- Path: `/workspace/scratch/6cf2716ff9a7/upload/IMG_0978.jpeg`
- Source pixels: 1124 × 1728.
- State: mobile landing page with the two current lower role controls circled in yellow and a request for a further 25% reduction.

**Implementation evidence**

- Browser-rendered screenshot: inline Cloud Browser capture from `http://terminal.local:4173/` in the current Work Mode session.
- Browser viewport: 1363 × 936 CSS px at device pixel ratio 1.
- Landing-stage bounds: 622.375 × 920 CSS px.
- Rendered control bounds: both controls measure 135.172 × 59.109 CSS px.
- State: landing page before role selection.

**Full-view comparison evidence**

- Moby Dick remains at the lower-left of the whale and Captain Ahab remains at the lower-right.
- Each control is exactly 75% of its immediately preceding width and height (`29.625% × 8.7%` to `22.21875% × 6.525%`).
- The centre points remain unchanged, so the controls shrink inward without drifting toward the page edges.
- The ship, whale, bottom controls, image crop and period styling remain unchanged.

**Focused role-control comparison**

- Both role labels remain fully inside their respective button bounds (`copyInside: true`).
- The icon, border, copy hierarchy and navy/burgundy role distinction remain intact after scaling.
- The controls are horizontally symmetrical at `left: 7.003125%` and `right: 7.003125%`, with a shared `top: 62.5875%`.

**Required fidelity surfaces**

- Fonts and typography: Georgia display treatment, uppercase hierarchy, line breaks and label containment are preserved; no clipping or overflow is visible.
- Spacing and layout rhythm: role controls are symmetrically placed beside the whale and no longer obscure the Pequod.
- Colors and visual tokens: navy, burgundy, cream, brass borders, shadows and selected-state treatment are unchanged.
- Image quality and asset fidelity: the supplied landing artwork and role icon assets are unchanged and remain sharp at their rendered size.
- Copy and content: “Play as Moby Dick” and “Play as Captain Ahab” are unchanged.

**Interaction verification**

- Moby Dick selection sets `aria-pressed="true"` and enables “Begin the Hunt”.
- Captain Ahab selection sets `aria-pressed="true"` and enables “Begin the Hunt”.
- “Begin the Hunt” hides the landing screen, reveals the game, and renders all 49 coordinate controls.
- No site-origin console errors were present.
- All 14 automated tests pass.

**Findings**

- No actionable P0, P1 or P2 differences remain for the requested placement and scale change.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Preserve Moby Dick in the lower-left target region.
- [x] Preserve Captain Ahab in the lower-right target region.
- [x] Reduce both buttons by a further 25% in width and height.
- [x] Preserve role selection, responsive text containment and game entry.

**Follow-up Polish**

- None required for this scoped change.

final result: passed
