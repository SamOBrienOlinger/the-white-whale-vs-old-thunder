# Antique-book landing page

Updated 1 November 2026.

## Faded book text behind the hero

Original maritime paragraphs are typeset on the hero's paper leaf, beneath the existing illustration, with justified lines, indented paragraphs, muted sepia ink, 30% opacity and a restrained 0.4px blur. Old Standard TT revives the Modern serif printing styles used in late nineteenth-century books; see the [typeface documentation](https://ctan.org/pkg/oldstandard). Its letter outlines are embedded in `assets/images/hero-book-text.svg`, so the exact typography displays consistently without a webfont request. The source font and its SIL Open Font License are retained in `assets/fonts/old-standard-tt/`.

The text is decorative, hidden from assistive technology, non-interactive, and clipped to the hero leaf. The heading and caption remain clear above it. It scales down on phones and disappears in forced-colour mode. The illustration itself is unchanged. The prose is original interface decoration, not an excerpt from *Moby-Dick*.

## Moby Dick button engraving

The Moby Dick choice now uses a pale sperm whale with sepia contours and engraved hatching to match Captain Ahab's portrait. The existing whale icon supplied the subject and the Ahab portrait supplied the style reference. Both passes used the built-in OpenAI image-generation tool. The transparent result is encoded as a 384 × 256 WebP at `assets/images/role-icon-moby-engraved.webp`.

The whale uses a 96 × 64px icon area on desktop and 84 × 56px on phones, keeping the character labels aligned with Ahab's icon. Both illustrations are decorative CSS images; the existing button labels provide their accessible names. The original hero illustration remains unchanged.

Initial style-transfer prompt:

Use case: style-transfer. Asset type: transparent Moby Dick character-choice button icon for an antique-book-themed browser game.
Input image 1 is the existing sperm-whale icon to redraw. Input image 2 is the Captain Ahab portrait and is the STYLE REFERENCE ONLY.
Replace the flat whale silhouette with one original nineteenth-century engraved / woodcut illustration of Moby Dick that looks printed by exactly the same artist as the Ahab reference: the same warm dark sepia ink, cream highlights, decisive contours, fine but readable curved hatching, and restrained antique maritime-book character. Keep only the whale subject from image 1; do not copy its simplified cartoon proportions.
Draw an anatomically credible adult white sperm whale in a clean side view, facing right: enormous long blunt rectangular head taking about one third of its total length, tiny low-set eye, narrow underslung lower jaw, long body tapering smoothly toward a narrow tail stock, small pectoral flipper, a low dorsal hump rather than a tall dorsal fin, and broad two-lobed tail flukes. The back and tail may curve upward gently for a compact icon, but preserve a natural elongated body. Make Moby Dick visibly pale through generous light cream highlights, with sepia contour lines and engraved shadows. No smiling expression, no cartoon eye, no humpback throat grooves, no dolphin snout, no oversized belly.
Landscape composition approximately 3:2, the full whale including the entire tail and head visible, centred and filling about 90 percent of the canvas width. Strong readable silhouette and simplified hatching that will remain recognisable in a button at roughly 90 by 60 pixels. Transparent background outside the whale; real alpha, not a checkerboard. No paper rectangle, no circle, no badge, no border, no lettering, no words, no watermark, no waves, no spout, no ship, no human, no harpoon, no decorative clutter. Output only the redrawn whale icon, not the portrait and not a UI mockup.

Final edge-refinement prompt:

Use case: background-extraction. Edit the provided engraved Moby Dick icon. Preserve the whale's existing shape, full anatomy, cream highlights and sepia engraved details exactly. Remove the brown glow / soft shadow / haze around it completely. The output must be a clean cutout: every pixel OUTSIDE the whale's precise outer contour is fully transparent; the whale itself is opaque cream and dark brown with only the boundary antialiased. Do not add any background, ambient shading, halo, drop shadow, checkerboard, text or other object. Keep the whole head and both tail flukes visible. Crop away excess empty margins while retaining a small transparent margin around the whale. This is an icon to place directly over parchment, so transparent areas must show the page without any tint or glow.

## Captain Ahab button portrait

The Ahab choice uses an original sepia engraved head-and-shoulders portrait, replacing the earlier harpoon symbol. It was generated using the built-in OpenAI image-generation tool and encoded as a 256 × 256 WebP with alpha transparency. The shipped asset is `assets/images/role-icon-ahab-engraved.webp` (approximately 28 KiB). It displays in a 64px icon area on desktop and a 56px area on phones. The shared icon area keeps both character names aligned. The portrait is decorative because the button already has an accessible character label.

Generation prompt:

Use case: illustration-story. Asset type: small transparent icon for the Captain Ahab character-choice button in an antique-book-themed Moby-Dick browser game. Generate one original, refined nineteenth-century woodcut / engraved ink portrait of Captain Ahab: an older, stern, weather-beaten whaling captain, strong aquiline nose, furrowed brow, restrained short beard and sideburns, a subtle old facial scar, plain dark short-brim seafarer's hat and a high-collared heavy coat. Head and shoulders only, compact three-quarter profile facing slightly left. No actor likeness. The character should read immediately as a formidable old maritime captain rather than a generic weapon. Use a single dark warm sepia ink close to #704735, confident clear outer contours, bold shadow masses and a few broad engraved hatching cuts. Simplify facial detail so this remains crisp and recognisable at 48 to 64 pixels on a cream parchment button. Centred square composition; head and shoulders fill about 88 percent of the canvas; entire hat and bust visible with a small clean margin. True transparent background outside the portrait, with no rectangular background, no paper, no badge, no circle, no border, no lettering, no words, no watermark. No ship, no whale, no harpoon, no skull, no eyepatch, no pirate costume, no modern peaked naval uniform. No photographic shading, no 3D, no gradients, no ornamental clutter. This is an understated printed book illustration icon, not a logo with text and not a complete button mockup.

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
