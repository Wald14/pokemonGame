const battleBackgroundImage = new Image()
battleBackgroundImage.src = './assets/images/battleBackground.png'

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

const draggle = new Monster(monsters.Draggle)
const emby = new Monster(monsters.Emby)
console.log(emby)

const renderedSprites = [draggle, emby]

emby.attacks.forEach(attack => {
  const button = document.createElement('button')
  button.classList.add('attackBtn')
  button.innerHTML = attack.name
  document.querySelector('#attacksBox').append(button)
})

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  // Render background and characters
  battleBackground.draw()

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}
// animate()
animateBattle()

const queue = []

// Event listeners for attack buttons
document.querySelectorAll('.attackBtn').forEach((button) => {
  button.addEventListener('click', (e)=> {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites
    })

    const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

    queue.push(()=>{
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites
      })
    })
  })
})

document.querySelector('#dialougeBox').addEventListener('click', (e) => {
  if (queue.length > 0){
    queue[0]()
    queue.shift()
  } else {
    e.currentTarget.style.display = 'none'
  }
})