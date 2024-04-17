const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: './assets/images/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball, attacks.Slash]
  },
  Draggle: {
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: './assets/images/draggleSpriteRed.png'
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Hydrusquid: {
    position: {
      x: 800,
      y: 108
    },
    image: {
      src: './assets/images/hydrusquid.png'
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Hydrusquid",
    attacks: [attacks.Tackle, attacks.Slash]
  },
  Chomp: {
    position: {
      x: 800,
      y: 70
    },
    image: {
      src: './assets/images/chomp.png'
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Chomp",
    attacks: [attacks.Tackle]
  }
}