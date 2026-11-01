export const ROLE_COPY = {
  moby: {
    name: "Moby Dick",
    target: "the Pequod",
    targetTitle: "The Pequod",
    targetShort: "Pequod",
    heading: "Beneath the waves",
    logTitle: "Chase record",
    logReference: "chase record",
    damage: "Hull damage",
    hitSingular: "hull strike",
    hitPlural: "hull strikes",
    hitLabel: "Pequod hull struck",
    hitDetail: "Your ram strikes the Pequod’s hull.",
    action: "ram the Pequod",
    briefing: "You are Moby Dick. Ahab, known as Old Thunder, has bent the Pequod’s voyage to revenge. Find the ship, ram its hull, and leave its chase beneath the waves.",
    instruction: "Choose a coordinate to ram the Pequod. You can also use the arrow keys and Enter.",
    startStatus: "The Pequod keeps to the fog. Choose a quarter of the sea.",
    startPrompt: "Two hull strikes within five chances sink the Pequod. A miss reveals the ship’s direction and distance.",
    hitPrompts: [
      "Your ram tears into the Pequod’s hull. One more hull strike will sink the ship."
    ],
    win: {
      kicker: "The last chase",
      title: "The Pequod spirals to the bottom of the ocean",
      status: "The second blow lands. The Pequod spirals to the bottom of the ocean.",
      prompt: "Ahab’s chase is ended: the ship turns into its wooden hearse beneath the sea.",
      message: "Two hull strikes tear through the Pequod. You survive Ahab’s pursuit as the ship sinks beneath the waves."
    },
    loss: {
      kicker: "Old Thunder’s vengeance",
      title: "The White Whale falls",
      status: "Your five chances are spent. Old Thunder’s harpoon finds the White Whale.",
      prompt: "Moby Dick is slain; the Pequod, battered but afloat, sails on.",
      message: "You could not sink the Pequod within five chances. Ahab takes his vengeance, and the ship remains afloat."
    }
  },
  ahab: {
    name: "Captain Ahab",
    target: "Moby Dick",
    targetTitle: "Moby Dick",
    targetShort: "Moby Dick",
    heading: "The quarter-deck",
    logTitle: "Captain’s log",
    logReference: "captain’s log",
    damage: "Moby Dick’s wounds",
    hitSingular: "harpoon strike",
    hitPlural: "harpoon strikes",
    hitLabel: "Moby Dick struck",
    hitDetail: "Your harpoon strikes Moby Dick.",
    action: "cast a harpoon",
    briefing: "You are Captain Ahab, known as Old Thunder. The White Whale moves beneath the charted sea. Read the water, cast true, and take your vengeance before he escapes.",
    instruction: "Choose a coordinate to cast a harpoon at Moby Dick. You can also use the arrow keys and Enter.",
    startStatus: "The White Whale slips beneath the fog. Choose a quarter of the sea.",
    startPrompt: "Two harpoon strikes within five chances bring Moby Dick down. A miss reveals the whale’s direction and distance.",
    hitPrompts: [
      "Your harpoon wounds Moby Dick. One more harpoon strike will end the chase."
    ],
    win: {
      kicker: "Old Thunder’s vengeance",
      title: "Moby Dick falls",
      status: "The second harpoon lands. The White Whale falls.",
      prompt: "Ahab’s vengeance has found its mark; the Pequod rides on above the dark water.",
      message: "Two harpoon strikes bring down Moby Dick. You have won the last chase."
    },
    loss: {
      kicker: "The White Whale",
      title: "The Pequod is smashed",
      status: "Your five chances are spent. Moby Dick turns upon the Pequod.",
      prompt: "The White Whale breaks the ship and drags Old Thunder beneath the sea.",
      message: "The Pequod is smashed into smithereens and the White Whale drags Old Thunder to the bottom of the sea."
    }
  }
};
