const battleBackgroundImage = new Image()
battleBackgroundImage.src = './assets/images/battleBackground.png'

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

let enemyMonster
let emby
let renderedSprites
let battleAnimationId
let queue

function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialougeBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()

  // Random Enemy
  const enemyMonsterArr = Object.keys(monsters)
  const randomEnemy = enemyMonsterArr[Math.floor(Math.random() * (enemyMonsterArr.length - 1)) + 1]

  // Generate and Render Monsters
  enemyMonster = new Monster(monsters[randomEnemy])
  emby = new Monster(monsters.Emby)
  renderedSprites = [enemyMonster, emby]
  queue = []

  // Set Monster Name in Health Bar
  const enemyName = document.querySelector("#enemyName")
  console.log(enemyName)
  enemyName.innerHTML = enemyMonster.name

  emby.attacks.forEach(attack => {
    const button = document.createElement('button')
    button.classList.add('attackBtn')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
  })

  // Event listeners for attack buttons
  document.querySelectorAll('.attackBtn').forEach((button) => {
    // button.style.borderLeft = '1px solid black'
    // button.style.borderRight = '1px solid black'
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      emby.attack({
        attack: selectedAttack,
        recipient: enemyMonster,
        renderedSprites
      })

      if (enemyMonster.health <= 0) {
        queue.push(() => {
          enemyMonster.faint()
        })
        queue.push(() => {
          // fade back to black
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'

              gsap.to('#overlappingDiv', {
                opacity: 0
              })

              battle.initiated = false
              audio.Map.play()
            }
          })
        })
      }
      // enemyMonster attacks here
      const randomAttack = enemyMonster.attacks[Math.floor(Math.random() * enemyMonster.attacks.length)]

      queue.push(() => {
        enemyMonster.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites
        })

        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint()
          })
          queue.push(() => {
            // fade back to black
            gsap.to('#overlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#userInterface').style.display = 'none'

                gsap.to('#overlappingDiv', {
                  opacity: 0
                })

                battle.initiated = false
                audio.Map.play()
              }
            })
          })
        }
      })
    })
    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      document.querySelector('#attackType').innerHTML = selectedAttack.type
      document.querySelector('#attackType').style.color = selectedAttack.color
    })

    button.addEventListener('mouseleave', (e) => {
      document.querySelector('#attackType').innerHTML = "Attack Type"
      document.querySelector('#attackType').style.color = 'black'
    })
  })
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  // Render background and characters
  battleBackground.draw()

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}
animate()
// initBattle()
// animateBattle()



document.querySelector('#dialougeBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else {
    e.currentTarget.style.display = 'none'
  }
})