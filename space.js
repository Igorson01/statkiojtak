const canvas= document.querySelector('canvas')
const scoreEl= document.querySelector('#scoreEl')
const c= canvas.getContext('2d')

canvas.width= 1024
canvas.height= 576

class Player {
    constructor() {
        this.position = {
            x:canvas.width / 2 - this.width /2,
            y:200
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.rotation=0
        this.opacity = 1
        
        const image= new Image()
        image.src= './img/spaceship.png'
        image.onload= () => {

        this.image = image
        this.width = image.width * 0.15
        this.height = image.height * 0.50
        this.position = {
            x:canvas.width / 2 - this.width /2,
            y:canvas.height - this.width - 40
        }
        }
        this.particles = []
        this.frames = 0
    }

    draw(){
        //c.fillStyle = 'red'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player.position.x + player.width /2,
            player.position.y + player.height/2
        )
        c.rotate(this.rotation)

        c.translate(
           - player.position.x - player.width /2,
           - player.position.y - player.height/2
        )

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.height,
            this.width,
        )
        c.restore()
    }

    update(){
        if(!this.image) return

        this.draw()
        this.position.x += this.velocity.x
        
        if(this.opacity !== 1) return
        this.frames++
        if(this.frames % 2 === 0) {
            this.particles.push(
                new Particle({
                position:{
                    x: this.position.x + this.width/1.2,
                    y: this.position.y + this.height/2,
                },
                velocity:{
                    x:(Math.random() - 0.5) * 1.5,
                    y:1.4
                },
                radius: Math.random() * 2,
                color: 'yellow',
                fades: true,
            })
          )
        }
    }
}

class Projectiles{
    constructor({position,velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity

        this.radius = 5
        this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x,
              this.position.y,
              this.radius,
              0,
              Math.PI *2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle{
    constructor({position,velocity, radius, color,fades}) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x,
              this.position.y,
              this.radius,
              0,
              Math.PI *2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.fades)
        this.opacity -= 0.01
    }
}

class InvaderProjectile{
    constructor({position,velocity}) {
        this.position = position
        this.velocity = velocity

        this.width=5
        this.height=10
    }
    draw() {
      c.fillStyle= 'yellow'
      c.fillRect(this.position.x, this.position.y, this.width,
        this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Invader {
    constructor({position}) {
        this.velocity = {
            x:0,
            y:0
        }
        
        const image= new Image()
        image.src= './img/invader.png'
        image.onload= () => {

        this.image = image
        this.width = image.width * 1
        this.height = image.height * 1
        this.position = {
            x:position.x,
            y:position.y
        }
        }
    }

    draw(){
        //c.fillStyle = 'red'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
    

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.height,
            this.width,
        )
        c.restore()
    }

    update({velocity}){
        if(this.image) { 
        this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
        
    }}

    shoot(InvaderProjectiles){
        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x:0,
                y:5
            }
        }))

    }
}

class Grid {
    constructor() {
        this.position = {
            x:0,
            y:0
        }
        this.velocity = {
            x:3,
            y:0
        }
        this.invaders= []

       const columns = Math.floor(Math.random() * 10 + 5)
       const rows = Math.floor(Math.random() * 5 + 2)

       this.width = columns * 35
       for (let x=0; x<columns; x++) {
        for (let y=0; y<rows; y++) {
            this.invaders.push(new Invader({position:{
                x:x * 35,
                y:y * 35
            }}))
        }
       }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0

        if(this.position.x + this.width>= canvas.width || 
           this.position.x <= 0 ) {
           this.velocity.x = -this.velocity.x * 1.15
           this.velocity.y = 30
        }
    }
}
class Bomb {
    static radius = 30
    constructor({
        position,
        velocity
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 0
        this.color = 'red'
        this.opacity = 1
        this.active = false
        gsap.to(this, {
            radius: 30
        })

    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x,this.position.y, this.radius, 0, Math.PI *2)
        c.closePath()
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.x + this.radius + this.velocity.x >= canvas.width || this.position.x - this.radius + this.velocity.x <= 0)
         {this.velocity.x = -this.velocity.x
        } else if (this.position.y + this.radius + this.velocity.y >= canvas.height || this.position.y - this.radius + this.velocity.y <= 0) 
        {this.velocity.y = -this.velocity.y}  
    }
    explode() {
        this.active = true
        this.velocity.x = 0
        this.velocity.y = 0
        gsap.to(this, {
            radius:200,
            color: 'white'
        })
        gsap.to(this, {
            delay: .1,
            opacity: 0,
            duration: 0.15
            
        })
    }
}
class PowerUp{
    static radius = 15
    constructor({position,velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x,
              this.position.y,
              this.radius,
              0,
              Math.PI *2)
        c.fillStyle = 'green'
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
function randomBetween(min, max) {
  return  Math.random() * (max - min) + min
}

let player = new Player()
let projectiles = []
let grids= []
let invaderProjectiles = []
let particles = []
let bombs = []
let powerUps = []
let keys= {
    a: {
        pressed:false
    },
    d: {
        pressed:false
    },
    space: {
        pressed:false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500) + 500
let game = {
    over:false,
    active:true
}

let score = 0
function init() {
    player = new Player()
    projectiles = []
    grids= []
    invaderProjectiles = []
    particles = []
    bombs = []
    powerUps = []
    keys= {
        a: {
            pressed:false
        },
        d: {
            pressed:false
        },
        space: {
            pressed:false
        }
    }
    
    frames = 0
    randomInterval = Math.floor(Math.random() * 500) + 500
    game = {
        over:false,
        active:true
    }
    score = 0

    for(let i=0 ; i<100; i++) { 
        particles.push(
            new Particle({
            position:{
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity:{
                x:0,
                y:0.5
            },
            radius: Math.random() * 3,
            color: 'white'
        }))
        }
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

        player.opacity = 0
        game.over = true
   }, 0)

   //stop game altogether
   setTimeout(() => {
       game.active = false
       document.querySelector('#restartScreen').style.display = 'flex'
       document.querySelector('#scoreContainer').style.display = 'none'
       
  }, 1500)

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
let spawnBuffer = 500
function animate(){
    if(!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)

    
    for(let i = powerUps.length - 1; i>=0; i--){ 
        const powerUp = powerUps[i]
        if(powerUp.position.x - powerUp.radius >= canvas.width)
        powerUps.splice(i,1)
        else powerUp.update( )
    }
    //spawn powerUps
    if(frames % 500 === 0  ) {
        powerUps.push(new PowerUp({
        position:{
        x:0,
        y:Math.random() * 300 + 15
    },
    velocity:{
        x: 5,
        y:0
    }
}))
}

    if(frames % 200 === 0 && bombs.length < 3 ) {
        bombs.push(new Bomb({
            position: {
                x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
                y: randomBetween(Bomb.radius, canvas.height - Bomb.radius),
            },
            velocity: {
                x:(Math.random() - 0.5) * 6,
                y:(Math.random() - 0.5) * 6,
            }
        }))
    }
    for (let i= bombs.length - 1; i>= 0; i --) {
        const bomb = bombs[i]
        if(bomb.opacity <= 0) {
            bombs.splice(i,1)
        }else bomb.update()
    }
    player.update()

    for(let i = player.particles.length - 1; i >= 0; i --) {
        const particle = player.particles[i]
        particle.update()

        if(particle.opacity ===0) player.particles[i].splice(i,1)
    }
    particles.forEach((particle, i) => {

        if(particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if(particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i,1)  
            }, 0)
        } else{
            particle.update()
        }
    })
    
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        }else invaderProjectile.update()

        // projectile hit player
        if( rectangularCollision({rectangle1:invaderProjectile,
                                  rectangle2: player})
            ) { 
            invaderProjectiles.splice(index, 1)
            endGame()
        }
    })

    
    for(let i = projectiles.length -1; i >= 0; i--) {
        const projectile = projectiles[i]
    for(let j = bombs.length -1; j >= 0; j--) {
        const bomb = bombs[j]
        // jezeli pocisk dotknie bombe, usun pocisk
        if(Math.hypot(projectile.position.x - bomb.position.x, projectile.position.y - bomb.position.y) < projectile.radius + Bomb.radius && !bomb.active) {
            projectiles.splice(i,1)
            bomb.explode()
        }
    }
    for(let j = powerUps.length -1; j >= 0; j--) {
        const powerUp = powerUps[j]
        // jezeli pocisk dotknie wzmocnienie, usun pocisk
        if(Math.hypot(
            projectile.position.x - powerUp.position.x,
            projectile.position.y - powerUp.position.y) < projectile.radius + PowerUp.radius ) {
            projectiles.splice(i,1)
            powerUps.splice(j,1)
            player.powerUp = 'MachineGun'
            
            setTimeout(() => {
                player.powerUp = null
                
            }, 5000)
        }
    }
        if(projectile.position.y + projectile.radius <=0) {
        projectiles.splice(i, 1)
        
        } else { 
            projectile.update()
       } 
}

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawn projectiles
    if(frames % 100 === 0 && grid.invaders.length > 0){
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }
        for(let i = grid.invaders.length -1; i >= 0; i--) {
            const invader =  grid.invaders[i]

            invader.update({velocity:grid.velocity})

            for(let j = bombs.length -1; j >= 0; j--) {
                const bomb = bombs[j]
                const invaderRadius = 15
                
                // jezeli bomba dotknie kosmitow, usun kosmitow 
                if(Math.hypot(
                    invader.position.x - bomb.position.x,
                    invader.position.y - bomb.position.y
                    ) <
                    invaderRadius + bomb.radius && bomb.active
                    ) {
                    score += 69
                    scoreEl.innerHTML = score
                    grid.invaders.splice(i,1)   
                    createScoreLabels({
                        object: invader,
                        score: 69
                    })    
                    createParticles({
                        object: invader,
                        fades:true
                    }) 
            }
        }

            // projectiles hit enemy
            projectiles.forEach((projectile,j) =>{
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                    invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width&&
                    projectile.position.y + projectile.radius >= invader.position.y
                    ) {
                       
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )

                        //remove invader and projectile
                        if(invaderFound && projectileFound){
                            score +=420
                            
                            scoreEl.innerHTML = score
                            // dynamic  score label
                            createScoreLabels({
                                object: invader
                            })
                            createParticles({
                            object: invader,
                            fades:true
                         })
        
                        grid.invaders.splice(i,1)
                        projectiles.splice(j,1)

                        if(grid.invaders.length>0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length -1]

                            grid.width=lastInvader.position.x - firstInvader.position.x + lastInvader.width
                            grid.position.x = firstInvader.position.x
                        } else {
                            grid.splice(gridIndex,0)
                        }
                        }
                    },0)
                }
            })
            //remove player if invaders touch it
            if( rectangularCollision({rectangle1:invader,
            rectangle2: player
            }) && game.over
            ) 
            endGame()
        
        }// end looping over grid.invaders
    })

    if(keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -7
        player.rotation = -0.10
    } else if (keys.d.pressed && player.position.x + player.width *1.70 <= canvas.width) { 
        player.velocity.x = 7
        player.rotation = 0.10
    } else {
        player.velocity.x = 0
        player.rotation= 0
    }

    
    //spawning enemies
    if (frames % randomInterval === 0) {
        console.log(spawnBuffer)
        console.log(randomInterval)
        spawnBuffer = spawnBuffer < 0 ? 100 : spawnBuffer
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + spawnBuffer)
        frames = 0
        spawnBuffer -= 100
        
    }

     
    if(keys.space.pressed && player.powerUp === 'MachineGun' && frames % 2 === 0)
    projectiles.push(
        new Projectiles({
            position:{
                x:player.position.x  + player.width * 0.83,
                y:player.position.y 
            },
            velocity:{
                x:0,
                y:-10
            },
            color: 'yellowgreen'
        })
     )

    
    frames++
}

document.querySelector('#startButton').addEventListener('click' , () => {
document.querySelector('#background').style.display = 'none'
document.querySelector('#scoreContainer').style.display = 'flex'
    init()
    animate()
})
document.querySelector('#restartButton').addEventListener('click' , () => {
    score = 0
    scoreEl.textContent = score
document.querySelector('#restartScreen').style.display = 'none'
document.querySelector('#scoreContainer').style.display = 'flex'
    init()
    animate()
})
    

addEventListener('keydown', ({key}) => {
    if(game.over) return
    switch(key){
        case 'a':
         //console.log('left')
         keys.a.pressed= true
         break

         case 'd':
         //console.log('right')
         keys.d.pressed= true
         break

         case ' ':
         //console.log('space')
         keys.space.pressed = true
         if(player.powerUp === 'MachineGun') return
         projectiles.push(
            new Projectiles({
                position:{
                    x:player.position.x  + player.width * 0.83,
                    y:player.position.y 
                },
                velocity:{
                    x:0,
                    y:-7
                },
                
            })
         )
         break
    }
})
addEventListener('keyup', ({key}) => {
    switch(key){
        case 'a':
        
         keys.a.pressed= false
         break

         case 'd':
         
         
         keys.d.pressed= false
         break

         case ' ':
         
         keys.space.pressed = false
         break
    }
})



