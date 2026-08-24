# [The White Whale versus Old Thunder](https://samobrienolinger.github.io/the-white-whale-vs-old-thunder/)

A mobile-first, Battleship-inspired browser game built in plain HTML, CSS and JavaScript.

You play as Moby Dick. The five-cell Pequod is hidden on a 10×10 coordinate grid. Strike all five occupied coordinates to sink the ship. A single miss allows Captain Ahab—"Old Thunder"—to kill the whale, and the intact Pequod survives.

The game’s updated prompts draw on the supplied summaries of [Captain Ahab](https://en.wikipedia.org/wiki/Captain_Ahab), [*Moby-Dick*](https://en.wikipedia.org/wiki/Moby-Dick), and [Moby Dick as a white sperm whale](https://en.wikipedia.org/wiki/Moby_Dick_(whale)).

## Run locally

Open `index.html` through a local web server. For example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Test

```bash
npm test
```

No third-party dependencies are required.
