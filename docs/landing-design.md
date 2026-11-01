# Antique-book landing page

Updated 1 November 2026.

The former layered rectangular frame is replaced with a decorative paper leaf. A second leaf holds the title and game controls. Fine horizontal rules, restrained brown spotting (foxing), softly creased corners and small edge nicks suggest an old illustrated book. The layout uses adjacent leaves on wider screens and one continuous, naturally scrolling leaf on phones. The hero illustration and its existing tonal treatment are preserved.

The primary action follows the role selector and its live status. Help and story dialogs sit beneath the optional guided-hunt control. Text remains selectable HTML; paper is a decorative CSS background. A plain ivory background beneath the texture keeps text legible if the image cannot load. All actions retain their keyboard and screen-reader semantics.

## Validation

- All 15 unit/source checks passed.
- All 66 browser checks passed across desktop Chromium, mobile Chromium and desktop Firefox. These include 320px, 390px, landscape, tablet and desktop viewports, 200% text, keyboard controls, dialogs and game outcomes.
- Desktop (1440 × 900) and phone (390 × 844) screenshots reviewed visually.
- The original hero AVIF and JPEG files have no changes.
- WebKit is covered by the existing GitHub Actions workflow; its local runtime could not start because system libraries were unavailable.

## Asset and reference notes

- Asset: `assets/images/antique-book-leaf.webp`, 1024 × 1536 pixels, approximately 227 KiB, with alpha transparency.
- Created with the built-in OpenAI image-generation tool, then encoded as WebP for the site. The hero AVIF and JPEG files are unchanged.
- [University of Missouri rare-book glossary](https://library.missouri.edu/specialcollections/exhibits/show/glossary/page4): foxing and the frontispiece.
- [Duke University Libraries: Evidence in Book Edges](https://blogs.library.duke.edu/preservation/2016/07/18/book-edges/): untrimmed edges and small tears in old paper.
- [Library of Congress: The History of Arabia, volume 1](https://www.loc.gov/resource/gdclccn.44029225v1/): visual reference for aged nineteenth-century paper. Reference imagery is not embedded in the site.

## Final generation prompt

Use case: photorealistic-natural. Asset type: transparent PNG website background texture for a page of a very old illustrated maritime novel, portrait aspect ratio approximately 2:3. Generate only a blank antique book leaf, seen perfectly flat from directly overhead, with two very slightly offset paper leaves visible behind it. It should fill almost the entire canvas with just a tiny transparent margin around its irregular outer edge. Main leaf warm muted ivory / pale oatmeal, not orange, fine visible rag-paper fibres, gentle uneven age toning, sparse subtle brown foxing mostly near the perimeter, slightly softened and frayed deckle edges, two or three tiny nicks, one softly creased corner. Slightly damaged, lovingly preserved 1850s book paper, not a ruined scroll. Central 85 percent pale, clean and quiet to place an existing illustration or live website typography on top. Fine natural detail and restrained realism. No printed text, no lettering, no illustration, no rectangular hole, no decorative border, no lines, no ornaments, no objects, no spine, no leather, no table, no drop shadow outside the paper, no mockup. Real alpha transparency outside the paper silhouette. The paper itself must be opaque. This is a reusable backdrop; create no whale or ship and no interface.
