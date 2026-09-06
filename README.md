# The White Whale versus Old Thunder

A literary coordinate-hunt game inspired by the final chase in Moby-Dick. Choose Moby Dick or Captain Ahab and follow clues across a maritime chart.

**HTML · CSS · JavaScript**

[Visit the website](https://samobrienolinger.github.io/the-white-whale-vs-old-thunder/) · [Getting started](#getting-started) · [Repository guide](#repository-guide) · [Checks](#checks-and-review) · [Credits](#credits-and-reuse)

<img src="assets/images/IMG_0954.jpeg" alt="The Pequod above Moby Dick in a stormy sea" width="880">

## What you can explore

- Two playable roles with distinct narratives and outcomes.
- A 7 × 7 chart, five chances and two hits needed to win.
- Directional and proximity clues after misses.
- Keyboard board navigation, live status feedback and replay.

## Using the project

1. Choose Moby Dick or Captain Ahab, then select **Begin the Hunt**.
2. Choose coordinates from A1 to G7.
3. Use the direction and proximity clues after a miss.
4. Land two hits within five chances, then replay or change sides.

## Getting started

Requires Git, a browser and a local HTTP server. Python 3 provides one without installing application packages.

```bash
git clone https://github.com/SamOBrienOlinger/the-white-whale-vs-old-thunder.git
cd the-white-whale-vs-old-thunder
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://localhost:8000). Serve the repository over HTTP so module imports, relative assets and page links resolve correctly.

The repository also provides a development-server script. Install its development dependencies with `npm install`, then run `npm run dev`.

## Repository guide

| Path | Purpose |
| --- | --- |
| [index.html](index.html) | Primary browser entry point |
| [assets/](assets/) | Project styles, scripts, data and imagery |
| [test/](test/) | Automated test source |
| [e2e/](e2e/) | Browser journey tests |
| [game-engine.js](game-engine.js) | Game rules and state transitions |
| [script.js](script.js) | Page interaction and state rendering |
| [styles.css](styles.css) | Page layout and visual styling |
| [.github/workflows/](.github/workflows/) | Build, test or deployment workflows |
| [package.json](package.json) | Package dependencies and available commands |

## Checks and review

Use Node.js and npm for the package commands below. Install the package dependencies first when the command uses a local build or test tool.

| Command | Purpose |
| --- | --- |
| `npm test` | Run the existing test suite |
| `npm run test:e2e` | Run browser journey tests |

For a manual review, follow the main user journey, check keyboard navigation and narrow-screen layouts, and inspect the browser console for missing assets or failed requests.

Supporting notes: [design-qa.md](design-qa.md).

Generate fresh results from the revision you are working on; historical test reports describe earlier runs.

## Deployment

A GitHub Pages site is configured for this repository. Its published URL is linked at the top of this README.

## Credits and reuse

Design decisions, original feature notes, historical testing evidence and detailed acknowledgements remain available in the preserved project record:

- [README.md · original project record](https://github.com/SamOBrienOlinger/the-white-whale-vs-old-thunder/blob/a3f3aeea8c46d8a6660772ab9221d3dc21ced4b4/README.md)

- The game is an unofficial creative interpretation of Herman Melville's public-domain novel [*Moby-Dick; or, The Whale*](https://en.wikipedia.org/wiki/Moby-Dick).
- Character background: [Captain Ahab](https://en.wikipedia.org/wiki/Captain_Ahab).
- Pequod design reference: [ship artwork by Lars Platoon on Instagram](https://www.instagram.com/p/DSiOfq8jwdM/?igsi=cGFmcmR4bmg3MHBk).
- Additional Moby Dick and Pequod visual reference: [Moby Dick Large on Storenvy](https://www.storenvy.com/products/17731562-moby-dick-large).
- Several interface illustrations and role icons were generated or refined with OpenAI image tools from user-approved visual references.

This project is not affiliated with the creators, publishers or sellers linked above. Referenced third-party material remains subject to its original owner's terms.

Reuse terms are recorded in [LICENSE](LICENSE). Third-party assets and dependencies retain their own terms.

## Support

Repository maintained in [Sam O’Brien-Olinger’s GitHub account](https://github.com/SamOBrienOlinger). For a problem or suggested improvement, [open an issue](https://github.com/SamOBrienOlinger/the-white-whale-vs-old-thunder/issues) with the affected page or command, steps to reproduce, and expected behaviour.

[Back to top](#the-white-whale-versus-old-thunder)
