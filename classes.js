class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites = [],
    animate = false,
    isEnemy = false,
    rotation = 0,
    name
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
    this.isEnemy = isEnemy,
    this.rotation = rotation
    this.name = name
  }
  draw() {
    ctx.save()
    ctx.translate(
      this.position.x + this.width / 2, 
      this.position.y + this.height / 2
    )
    ctx.rotate(this.rotation)
    ctx.translate(
      -this.position.x - this.width / 2, 
      -this.position.y - this.height / 2
    )
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


  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#dialougeBox').style.display = 'block'
    document.querySelector('#dialougeBox').innerHTML = `${this.name} used ${attack.name}`

    let moveDistX = 20
    let moveDistY = 4
    let healthBar = '#enemyHealthBar'
    let rotation = 1

    if (this.isEnemy) {
      moveDistX = -20,
      moveDistY = -4,
      healthBar = "#playerHealthBar",
      rotation = -2.5 
    }

    this.health -= attack.damage

    switch (attack.name) {
      /////////// FIREBALL ///////////////
      case 'Fireball':
        const fireballImage = new Image()
        fireballImage.src = './assets/images/fireball.png'
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          rotation: rotation
        })

        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
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

            renderedSprites.splice(1, 1)
          }
        })

        break;

      /////////// TACKLE ///////////////
      case 'Tackle':
        const tl = gsap.timeline()

        

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
        break;
    }
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