const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

//////////////////// MAP SIZE ////////////////////
//////////////////// !!! Change if changing map size !!! ////////////////////
const mapSize = {
  x: 140,
  y: 80
}

// Increment by width of map
// Splits array into sub arrays, each representing a row on the map
const collisionsMap = []
for (let i = 0; i < collisions.length; i += mapSize.x) {
  collisionsMap.push(collisions.slice(i, i + mapSize.x))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += mapSize.x) {
  battleZonesMap.push(battleZonesData.slice(i, i + mapSize.x))
}

///////// BOUNDARIES /////////
const boundaries = []
const offset = {
  x: -160,
  y: -1150
}
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      boundaries.push(new Boundary({
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        }
      })
      )
    }
  })
})

///////// BATTLE ZONES /////////
const battleZones = []
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025) {
      battleZones.push(new Boundary({
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        }
      })
      )
    }
  })
})

///////// IMAGES LOADING /////////
const image = new Image()
image.src = './assets/images/ubenTown2.0.png'

const foregroundImage = new Image()
foregroundImage.src = './assets/images/ubenTownForeground2.0.png'

const playerUpImage = new Image()
playerUpImage.src = './assets/images/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './assets/images/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './assets/images/playerRight.png'

const playerDownImage = new Image()
playerDownImage.src = './assets/images/playerDown.png'


const player = new Sprite({
  position: {
    // Static demensions of player file: 192x68px
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage
})

// infinate loop over animate
const keys = {
  up: {
    pressed: false
  },
  left: {
    pressed: false
  },
  right: {
    pressed: false
  },
  down: {
    pressed: false
  },
}

// Objects that need to move as player moves
const movables = [background, ...boundaries, foreground, ...battleZones]

////////////////////////////////////////////////
//////////////// COLLISION TEST ////////////////
////////////////////////////////////////////////

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    // Left of Player vs Right of Box
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x
    // Right of Player vs Left of Box
    && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
    // Top of Player vs Bottom of Box
    && rectangle1.position.y <= rectangle2.position.y + rectangle2.height - (rectangle1.height - (rectangle1.height / 4))
    // Bottom of Player vs Top of Box
    && rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

const battle = {
  initiated: false
}

////////////////////////////////////////////////
//////////////// ANIMATION LOOP ////////////////
////////////////////////////////////////////////
function animate() {
  const animationId = window.requestAnimationFrame(animate)

  // RENDERING LAYERS AND IMAGES
  background.draw()
  boundaries.forEach((boundry) => {
    boundry.draw()
  })
  battleZones.forEach((battleZone) => {
    battleZone.draw()
  })
  player.draw()
  foreground.draw()

  let moving = true
  player.animate = false

  // console.log(animationId)
  if (battle.initiated) return

  // ACTIVATE BATTLE
  if (keys.up.pressed || keys.down.pressed || keys.left.pressed || keys.right.pressed) {
    // BATTLE ZONE COLLISION DETECTION
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x))
        *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y))

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone
        }) &&
        overlappingArea > (player.width * player.height) / 2
        && Math.random() < 0.01
      ) {
        ////// ACTIVATE BATTLE ////////
        // deactivate current animation loop
        window.cancelAnimationFrame(animationId)

        audio.Map.stop()
        audio.InitBattle.play()
        audio.Battle.play()

        battle.initiated = true

        // Handles battle flash
        gsap.to('#overlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.3,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.3,
              onComplete() {
                // activate new animation loop
                initBattle()
                animateBattle()
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.3,
                })
              }
            })
          }
        })
        break
      }
    }
  }

  /////////////////////////////////////////////////
  //////////////// PLAYER MOVEMENT /////////////////////
  /////////////////////////////////////////////////

  //////////////// MOVING UP & LEFT ////////////////
  if (keys.up.pressed && keys.left.pressed) {
    player.animate = true
    player.image = player.sprites[lastKey]
    for (let i = 0; i < boundaries.length; i++) {
      const boundry = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundry, position: {
            x: boundry.position.x + 2,
            y: boundry.position.y + 2
          }
        }
      })
      ) {
        moving = false
        break
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 2
        movable.position.y += 2
      })
    }
  //////////////// MOVING UP & RIGHT ////////////////
  } else if (keys.up.pressed && keys.right.pressed) {
    player.animate = true
    player.image = player.sprites[lastKey]
    for (let i = 0; i < boundaries.length; i++) {
      const boundry = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundry, position: {
            x: boundry.position.x - 2,
            y: boundry.position.y + 2
          }
        }
      })
      ) {
        moving = false
        break
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 2
        movable.position.y += 2
      })
    }
  //////////////// MOVING DOWN & RIGHT ////////////////
} else if (keys.down.pressed && keys.right.pressed) {
  player.animate = true
  player.image = player.sprites[lastKey]
  for (let i = 0; i < boundaries.length; i++) {
    const boundry = boundaries[i]
    if (rectangularCollision({
      rectangle1: player,
      rectangle2: {
        ...boundry, position: {
          x: boundry.position.x - 2,
          y: boundry.position.y - 2
        }
      }
    })
    ) {
      moving = false
      break
    }
  }

  if (moving) {
    movables.forEach((movable) => {
      movable.position.x -= 2
      movable.position.y -= 2
    })
  }
  //////////////// MOVING DOWN & LEFT ////////////////
} else if (keys.down.pressed && keys.left.pressed) {
  player.animate = true
  player.image = player.sprites[lastKey]
  for (let i = 0; i < boundaries.length; i++) {
    const boundry = boundaries[i]
    if (rectangularCollision({
      rectangle1: player,
      rectangle2: {
        ...boundry, position: {
          x: boundry.position.x + 2,
          y: boundry.position.y - 2
        }
      }
    })
    ) {
      moving = false
      break
    }
  }

  if (moving) {
    movables.forEach((movable) => {
      movable.position.x += 2
      movable.position.y -= 2
    })
  }
//////////////// MOVING UP ////////////////
} else if (keys.up.pressed) {
    player.animate = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      const boundry = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundry, position: {
            x: boundry.position.x,
            y: boundry.position.y + 3
          }
        }
      })
      ) {
        moving = false
        break
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3
      })
    }
  }
  //////////////// MOVING DOWN ////////////////
  else if (keys.down.pressed) {
    player.animate = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundry = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundry, position: {
            x: boundry.position.x,
            y: boundry.position.y - 3
          }
        }
      })
      ) {
        moving = false
        break
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
    }
  }
  //////////////// MOVING LEFT ////////////////
  else if (keys.left.pressed) {
    player.animate = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundry = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundry, position: {
            x: boundry.position.x + 3,
            y: boundry.position.y
          }
        }
      })
      ) {
        moving = false
        break
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 3
      })
    }
  }
  //////////////// MOVING RIGHT ////////////////
  else if (keys.right.pressed) {
    player.animate = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundry = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundry, position: {
            x: boundry.position.x - 3,
            y: boundry.position.y
          }
        }
      })
      ) {
        moving = false
        break
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
    }
  }

}
// animate()

//////////// EVENT LISTENERS FOR MOVING PLAYER //////////////////
let lastKey = ''
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      keys.up.pressed = true
      lastKey = 'up'
      break;

    case 'a':
    case 'ArrowLeft':
      keys.left.pressed = true
      lastKey = 'left'
      break;

    case 'd':
    case 'ArrowRight':
      keys.right.pressed = true
      lastKey = 'right'
      break;

    case 's':
    case 'ArrowDown':
      keys.down.pressed = true
      lastKey = 'down'
      break;

  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      keys.up.pressed = false
      break;

    case 'a':
    case 'ArrowLeft':
      keys.left.pressed = false
      break;

    case 'd':
    case 'ArrowRight':
      keys.right.pressed = false
      break;

    case 's':
    case 'ArrowDown':
      keys.down.pressed = false
      break;

  }
})

let clicked = false
addEventListener('keydown', () => {
  if (!clicked){
    audio.Map.play()
    clicked = true
  }
})