# [The White Whale versus Old Thunder](https://samobrienolinger.github.io/the-white-whale-vs-old-thunder/)

[landing page]

A mobile-first, Battleship-inspired browser game built in plain HTML, CSS and JavaScript.

At the start of each chase, choose to command either Moby Dick or Captain Ahab—"Old Thunder". Your quarry occupies a more generous eight-cell run on the 10×10 coordinate grid, and you have five coordinate choices to land three decisive strikes.

- As **Moby Dick**, three breaches sink the Pequod.
- As **Captain Ahab**, three harpoons bring down Moby Dick.

This replaces the earlier one-miss ending and makes the chase substantially more forgiving while keeping the hidden-coordinate game intact.

The game’s updated prompts draw on the supplied summaries of [Captain Ahab](https://en.wikipedia.org/wiki/Captain_Ahab), [*Moby-Dick*](https://en.wikipedia.org/wiki/Moby-Dick), and [Moby Dick as a white sperm whale](https://en.wikipedia.org/wiki/Moby_Dick_(whale)).

## Visual inspiration

The design of the Pequod was inspired by this ship artwork by Lars Platoon on Instagram:
https://www.instagram.com/p/DSiOfq8jwdM/?igsi=cGFmcmR4bmg3MHBk

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
