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
        audio.enemyShoot.play()
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