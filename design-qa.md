**Source visual truth**

- Path: `/workspace/scratch/6cf2716ff9a7/upload/IMG_0973.jpeg`
- Source pixels: 1125 × 1756.
- State: mobile landing page with the former upper-left role controls circled in red and the requested lower-left/lower-right target regions circled in yellow.

**Implementation evidence**

- Browser-rendered screenshot: inline Cloud Browser capture from `http://terminal.local:4173/` in the current Work Mode session.
- Browser viewport: 1363 × 936 CSS px at device pixel ratio 1.
- Landing-stage bounds: 622.375 × 920 CSS px.
- Rendered control bounds: both controls measure 180.219 × 78.813 CSS px.
- State: landing page before role selection.

**Full-view comparison evidence**

- The former stacked upper-left controls have been removed from the ship area.
- Moby Dick is positioned at the lower-left of the whale and Captain Ahab at the lower-right, matching the two highlighted target regions.
- The buttons are 75% of the previous width and height (`39.5% × 11.6%` to `29.625% × 8.7%`).
- The ship, whale, bottom controls, image crop and period styling remain unchanged.

**Focused role-control comparison**

- Both role labels remain fully inside their respective button bounds (`copyInside: true`).
- The icon, border, copy hierarchy and navy/burgundy role distinction remain intact after scaling.
- The controls are horizontally symmetrical at `left: 3.3%` and `right: 3.3%`, with a shared `top: 61.5%`.

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

- [x] Move Moby Dick to the lower-left target region.
- [x] Move Captain Ahab to the lower-right target region.
- [x] Reduce both buttons to 75% of their former width and height.
- [x] Preserve role selection, responsive text containment and game entry.

**Follow-up Polish**

- None required for this scoped change.

final result: passed
