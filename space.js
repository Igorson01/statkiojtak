const canvas= document.querySelector('canvas')
const scoreEl= document.querySelector('#scoreEl')
const c= canvas.getContext('2d')

canvas.width= 1024
canvas.height= 576


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

let spawnBuffer = 500
let fps = 60
let fpsInterval = 1000 / fps
let msPrev = window.performance.now()

function init() {
    audio.backgroundMusic.play()
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
function animate(){
    if(!game.active) return
    requestAnimationFrame(animate)

    const msNow = window.performance.now()
    const elapsed = msNow - msPrev

    if(elapsed < fpsInterval) return

    msPrev = msNow - (elapsed % fpsInterval) // 3.34

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
            audio.explode.play()
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
            audio.bonus.play()
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
                        // singular projectile hit enemy
                        audio.explode.play()
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
            }) && game.over && audio.explode.play()
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
        spawnBuffer = spawnBuffer < 0 ? 100 : spawnBuffer
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + spawnBuffer)
        frames = 0
        spawnBuffer -= 100
        
    }

     
    if(keys.space.pressed && player.powerUp === 'MachineGun' && frames % 2 === 0 && !game.over) { 
    if(frames % 6 === 0) audio.shoot.play()
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
    }
    
    frames++
    
}

document.querySelector('#startButton').addEventListener('click' , () => {

audio.start.play()
document.querySelector('#background').style.display = 'none'
document.querySelector('#scoreContainer').style.display = 'flex'
    init()
    animate()
})
document.querySelector('#restartButton').addEventListener('click' , () => {
    score = 0
    scoreEl.textContent = score
    
    audio.select.play()
document.querySelector('#restartScreen').style.display = 'none'
document.querySelector('#scoreContainer').style.display = 'flex'
    init()
    animate()
})
    

addEventListener('keydown', ({key}) => {
    if(game.over) return
    switch(key){
        case 'a':
         keys.a.pressed= true
         break

         case 'd':
         keys.d.pressed= true
         break

         case ' ':
         keys.space.pressed = true
         if(player.powerUp === 'MachineGun') return
         audio.shoot.play()
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



