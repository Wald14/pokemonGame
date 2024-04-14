// html5 needs to be set to true since a server isn't being used, otherwise CORS issues
const audio = {
  // Main Map
  Map: new Howl({
    src: './assets/audio/map.wav',
    html5: true,
    volume: 0.1
  }),
  // Battle
  InitBattle: new Howl({
    src: './assets/audio/initBattle.wav',
    html5: true,
    volume: 0.1
  }),
  Battle: new Howl({
    src: './assets/audio/battle.mp3',
    html5: true,
    volume: 0.1
  }),
  Victory: new Howl({
    src: './assets/audio/victory.wav',
    html5: true,
    volume: 0.3
  }),
  // Attacks
  TackleHit: new Howl({
    src: './assets/audio/tackleHit.wav',
    html5: true,
    volume: 0.1
  }),
  InitFireball: new Howl({
    src: './assets/audio/initFireball.wav',
    html5: true,
    volume: 0.1
  }),
  FireballHit: new Howl({
    src: './assets/audio/fireballHit.wav',
    html5: true,
    volume: 0.1
  })
}