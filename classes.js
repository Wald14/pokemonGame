class Sprite {
  constructor({ position, image, frames = { max: 1 }, sprites = [] }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.moving = false
    this.sprites = sprites
  }
  draw() {
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

    if (!this.moving) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
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
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}