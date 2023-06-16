
function randomBetween(min, max) {
    return  Math.random() * (max - min) + min
  }

function createScoreLabels({score = 420, object}) {
    const scoreLabel = document.createElement('label')
    scoreLabel.innerHTML= score
    scoreLabel.style.position = 'absolute'
    scoreLabel.style.color = 'white'
    scoreLabel.style.fontFamily = 'monospace'
    scoreLabel.style.top = object.position.y + 'px'
    scoreLabel.style.left = object.position.x + 'px'
    scoreLabel.style.userSelect = 'none'
    document.querySelector('#parentDiv').appendChild(scoreLabel)
    gsap.to(scoreLabel,{
    opacity: 0,
    y: -30,
    duration: 1,
    onComplete: () => {
    document.querySelector('#parentDiv').removeChild(scoreLabel)
                                    
    }
    })
}
function endGame(){
    //Makes player dissapear
    setTimeout(() => {
        audio.gameOver.play()
        player.opacity = 0
        game.over = true
   }, 0)

   //stop game altogether
   setTimeout(() => {
       game.active = false
       document.querySelector('#restartScreen').style.display = 'flex'
       document.querySelector('#scoreContainer').style.display = 'none'
       audio.backgroundMusic.stop()
       
  }, 2000)
   createParticles({
       object: player,
       color: 'red',
       fades: true
       
       
       
       
       
    })
}
function rectangularCollision({
    rectangle1,
    rectangle2
}) {
  return  (rectangle1.position.y + rectangle1.height >= rectangle2.position.y
            && rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
            rectangle1.position.x <= rectangle2.position.x + rectangle2.width * 1.7)
}

function createParticles({object,color, fades}){ 
    for(let i=0 ; i<15; i++) { 
        particles.push(
            new Particle({
            position:{
                x: object.position.x + object.width /2,
                y: object.position.y + object.height /2
            },
            velocity:{
                x:(Math.random() -0.5) *2,
                y:(Math.random() -0.5) *2
            },
            radius: Math.random() * 4,
            color: color ||'#BAA0DE',
            fades
        }))
        }
    }

    