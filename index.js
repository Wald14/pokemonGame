const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

// Increment by width of map
// Splits array into sub arrays, each representing a row on the map
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 140) {
  collisionsMap.push(collisions.slice(i, i + 140))
}

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

const image = new Image()
image.src = './assets/images/ubenTown.png'

const foregroundImage = new Image()
foregroundImage.src = './assets/images/ubenTownForeground.png'

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
    max: 4
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


const movables = [background, ...boundaries, foreground]

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    // Left of Player vs Right of Box
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x
    // Right of Player vs Left of Box
    && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
    // Top of Player vs Bottom of Box
    && rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    // Bottom of Player vs Top of Box
    && rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function animate() {
  window.requestAnimationFrame(animate)
  // Render out background
  background.draw()
  // Render out boundries
  boundaries.forEach((boundry) => {
    boundry.draw()
  })
  // Render out player
  player.draw()
  // Render out foreground
  foreground.draw()

  let moving = true
  player.moving = false
  //////////////// MOVING UP ////////////////
  if (keys.up.pressed && lastKey === 'up') {
    player.moving = true
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
  else if (keys.down.pressed && lastKey === 'down') {
    player.moving = true
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
  else if (keys.left.pressed && lastKey === 'left') {
    player.moving = true
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
  else if (keys.right.pressed && lastKey === 'right') {
    player.moving = true
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
animate()

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