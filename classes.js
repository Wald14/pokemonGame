class Sprite {
  constructor({ 
    position, 
    image, 
    frames = { max: 1, hold: 10 }, 
    sprites = [], 
    animate = false,
    isEnemy = false,
  }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.health = 100
    this.isEnemy = isEnemy
  }
  draw() {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.drawImage(
      this.image, // HTML image
      this.frames.val * this.width, // crop left
      0, // crop top
      this.image.width / this.frames.max, // crop width
      this.image.height, // crop height
      this.position.x, // ACTUAL x position
      this.position.y, // ACTUAL y position
      this.image.width / this.frames.max, // ACTUAL render
      this.image.height, // ACTUAL render
    )
    ctx.restore()

    if (!this.animate) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }

  attack({ attack, recipient }) {
    const tl = gsap.timeline()

    this.health -= attack.damage

    let moveDistX = 20
    let moveDistY = 4
    let healthBar = '#enemyHealthBar'

    if(this.isEnemy) {
      moveDistX = -20, 
      moveDistY = -4,
      healthBar = "#playerHealthBar"
    }


    tl.to(this.position, {
      x: this.position.x - moveDistX,
      y: this.position.y + moveDistY
    }).to(this.position, {
      x: this.position.x + (moveDistX * 2),
      y: this.position.y - (moveDistY * 3),
      duration: 0.1,
      onComplete: () => {
        // Enemy actually gets hit
        gsap.to(healthBar, {
          width: this.health + '%'
        })

        gsap.to(recipient.position, {
          x: recipient.position.x + (moveDistX / 2),
          y: recipient.position.y - moveDistY,
          yoyo: true,
          repeat: 5,
          duration: 0.08,
        })

        gsap.to(recipient, {
          opacity: 0,
          repeat: 5,
          yoyo: true,
          duration: 0.08,
        })

      }
    }).to(this.position, {
      x: this.position.x,
      y: this.position.y
    })
  }
}

class Boundary {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    ctx.fillStyle = "rgba(255, 0, 0, 0)"
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}