// The 12-character suite. Each character drives the shader tint,
// the card/background accent and its own pool of unlock phrases.
export interface Character {
  id: string
  name: string
  image: string
  // rgb 0-1 tint fed into the shader uniforms
  shaderColor: [number, number, number]
  // css accent used for text / glows / background hue
  accent: string
  phrases: string[]
}

export const CHARACTERS: Character[] = [
  {
    id: "patty",
    name: "Patty",
    image: "/characterImages/patty.png",
    shaderColor: [1.0, 0.35, 0.55],
    accent: "#ff5a8c",
    phrases: [
      "Let's get it on!",
      "Patty has entered the chat.",
      "Hope you stretched first.",
      "Snacks later. Chaos now.",
      "You rang? Excellent choice.",
    ],
  },
  {
    id: "kiko",
    name: "Kiko",
    image: "/characterImages/kiko.png",
    shaderColor: [0.35, 0.85, 1.0],
    accent: "#4fd2ff",
    phrases: [
      "Kiko pop! Right on time.",
      "Blink and you'll miss me.",
      "Fast feet, faster comebacks.",
      "Did somebody order a whirlwind?",
      "Zoom zoom, coming through!",
    ],
  },
  {
    id: "atlas",
    name: "Atlas",
    image: "/characterImages/atlas.png",
    shaderColor: [0.55, 0.6, 1.0],
    accent: "#8a90ff",
    phrases: [
      "The world was getting heavy anyway.",
      "Atlas has arrived. Maps optional.",
      "Big shoulders, bigger plans.",
      "I carry the team. Literally.",
      "Heavy is fine. I lift.",
    ],
  },
  {
    id: "bram",
    name: "Bram",
    image: "/characterImages/bram.png",
    shaderColor: [1.0, 0.55, 0.25],
    accent: "#ff8c3f",
    phrases: [
      "Bram slam, thank you ma'am.",
      "Knock knock. It's destiny.",
      "Built like a legend, snores like one too.",
      "Someone say demolition?",
      "Gentle giant? Half right.",
    ],
  },
  {
    id: "kami",
    name: "Kami",
    image: "/characterImages/kami.png",
    shaderColor: [0.8, 0.5, 1.0],
    accent: "#b57bff",
    phrases: [
      "The spirits said you'd pick me.",
      "Kami sees all. Especially that.",
      "Fate? I prefer 'scheduling'.",
      "Whispered into existence. Loudly.",
      "Your aura called. I answered.",
    ],
  },
  {
    id: "miso",
    name: "Miso",
    image: "/characterImages/miso.png",
    shaderColor: [1.0, 0.8, 0.3],
    accent: "#ffcf4d",
    phrases: [
      "Soup's up, buttercup!",
      "Warm, salty, unstoppable.",
      "Miso happy to be here.",
      "Stirring up trouble since forever.",
      "Comfort food with a kick.",
    ],
  },
  {
    id: "nori",
    name: "Nori",
    image: "/characterImages/nori.png",
    shaderColor: [0.3, 0.9, 0.55],
    accent: "#3fe07f",
    phrases: [
      "Wrapped up and ready to roll.",
      "Nori knows. Nori always knows.",
      "Seaweed? See me DOMINATE.",
      "Fresh from the tide, baby.",
      "Sticky situations are my specialty.",
    ],
  },
  {
    id: "rune",
    name: "Rune",
    image: "/characterImages/rune.png",
    shaderColor: [0.4, 0.75, 0.95],
    accent: "#58aef2",
    phrases: [
      "The prophecy misspelled my name.",
      "Ancient symbols, modern problems.",
      "Rune reporting for glyph duty.",
      "Carved in stone. Hard to cancel.",
      "Decode THIS.",
    ],
  },
  {
    id: "suki",
    name: "Suki",
    image: "/characterImages/suki.png",
    shaderColor: [1.0, 0.45, 0.75],
    accent: "#ff70b8",
    phrases: [
      "Suki! That's the whole announcement.",
      "Cute, but make it dangerous.",
      "I bite. Adorably.",
      "Sparkles are a lifestyle.",
      "You unlocked me? Lucky you.",
    ],
  },
  {
    id: "tavo",
    name: "Tavo",
    image: "/characterImages/tavo.png",
    shaderColor: [0.95, 0.35, 0.3],
    accent: "#f25549",
    phrases: [
      "Tavo time. Set your watches.",
      "Hot-headed? I call it preheated.",
      "Bring the drama. I brought mine.",
      "Spice level: yes.",
      "Last one in buys tacos.",
    ],
  },
  {
    id: "vela",
    name: "Vela",
    image: "/characterImages/vela.png",
    shaderColor: [0.5, 0.95, 0.95],
    accent: "#5ef2e8",
    phrases: [
      "Sails up, standards higher.",
      "Vela rides the winds of victory.",
      "Smooth seas never unlocked me.",
      "Navigation? Vibes, mostly.",
      "Anchors aweigh, problems away.",
    ],
  },
  {
    id: "zeni",
    name: "Zeni",
    image: "/characterImages/zeni.png",
    shaderColor: [0.95, 0.85, 0.4],
    accent: "#f2d64b",
    phrases: [
      "Cha-ching! Zeni's in the party.",
      "Fortune favors the fabulous.",
      "I don't chase coins. They follow.",
      "Rich in style, loaded with luck.",
      "Jackpot. That's you, right now.",
    ],
  },
]
