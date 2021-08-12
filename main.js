let cvs = document.createElement("canvas")
let ctx = cvs.getContext("2d")

let imgNyawa = new Image()
imgNyawa.src = "nyawa.png"

let game = {
    h: 750,
    w: 750,
    fps: 60,
    state: "first",
    score: 0,
    nyawa: 3,
}

let brick = {
    bricks: [],
    color: ['red', 'yellow', 'green'],
    gap: 35,
    
    update() {
        for(var i=0; i < this.bricks.length; i++) {
            if (
                ( ball.y > (this.bricks[i].row*30+this.gap) && ball.y < (this.bricks[i].row*30+this.gap)+(ball.r*2) )
                &&
                ( ball.x > (this.bricks[i].col*100+this.gap) && ball.x < (this.bricks[i].col*100+this.gap)+100 )
            )  {
                console.log("Collison Detected Will Brick : Row:" +  this.bricks[i].row + " Col:" +  this.bricks[i].col + " Color:" +  this.color[this.bricks[i].oriColor]) 
                if (this.bricks[i].color == 2) {
                    this.bricks[i].color = 1
                } else if (this.bricks[i].color == 1) {
                    this.bricks[i].color = 0
                } else {
                    if ( this.bricks[i].oriColor == 2 ) {
                        game.score = game.score+3
                    } else if ( this.bricks[i].oriColor == 1 ) {
                        game.score = game.score+2
                    } else if ( this.bricks[i].oriColor == 0 ) {
                        game.score = game.score+1
                    }
                    this.bricks.splice(i, 1)
                }
                ball.velocityY = - (ball.velocityY*1.05)
            }
        }
    },
    render() {
        for(var i=0; i < this.bricks.length; i++) {
            ctx.beginPath()
            ctx.fillStyle = this.color[this.bricks[i].color]
            ctx.fillRect( (this.bricks[i].col*100+this.gap), (this.bricks[i].row*30+this.gap), 90, 20 )    
        }
    }
}

let ball = {
    x: (game.w/2), 
    y: (game.h/2),
    r: 10,
    speed: 1,
    velocityX: 3,
    velocityY: 3,
    
    update() {
        this.y += this.velocityY
        this.x += this.velocityX
        
        
        // colison with border
        if (
            this.x >= game.w || this.x <= 0
        ) {
            this.velocityX = -this.velocityX
        }
        
        if (this.y <= 0) {
            this.velocityY = -this.velocityY
        }
        
        // colison with user
        if (
            ( this.x > user.x && this.x < (user.x+user.w) )
            &&
            (user.y == this.y || ( (this.y+this.r) > user.y ))
        ) {
             //console.log( ball.x + " - " + user.x + " = " +  (ball.x - user.x) )
            let collidePoint = ball.x - user.x
            if (collidePoint < 40) {
                let aselerasi = (ball.x - user.x) / 20;
                this.velocityX = - (this.velocityX+this.speed)*aselerasi
                console.log("Increase Velocity X : " + aselerasi)
            } else if (collidePoint > 61) {
                let aselerasi = (ball.x - user.x) / 30 - 1;
                console.log("Increase Velocity X : " + aselerasi)
                this.velocityX = + this.velocityX+this.speed*aselerasi
            } else {
                this.velocityX = Math.floor(Math.random()*3)
            }
            
            this.velocityY = - this.velocityY
        }
        
        
        // detect lose
        if (this.y >= game.h) {
            if (game.nyawa == 1) {
                game.state = "gameover"
                newGame(true)
            } else {
                game.nyawa--
                newGame()
            }
        }
    },
    render() {
        ctx.beginPath()
        ctx.fillStyle = "green"
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.fill()
    }
}

let user = {
    x: 10,
    y: 100,
    w: 100,
    h: 10,
    gap: 10,
    
    event(e) {
        this.x = e.clientX - (this.w/2)
    },
    update() {
        this.y = game.h - (this.h + this.gap)
    },
    render() {
        ctx.beginPath()
        ctx.fillStyle = "yellow"
        ctx.fillRect(this.x, this.y, this.w, this.h)        
    }
}

function createCanvas() {
    cvs.height = game.h
    cvs.width = game.w
    cvs.style.background = "black"
    document.body.appendChild(cvs)
}
function main() {
    createCanvas()
    newGame(true)
    update()
}
function newGame(resetNyawa = false) {
    if (resetNyawa) game.nyawa = 3
    ball.x = game.w/2
    ball.y = game.h/2
    ball.speed = 1
    ball.velocityX = 3
    ball.velocityY = 3
    if (resetNyawa) {
        brick.bricks = []
        for(var j=0; j < 3;j++) {
            for(var i=0; i < 7;i++) {
                let randCol = Math.floor(Math.random() * 3)
                brick.bricks.push({ row: j, col: i, color: randCol, oriColor: randCol })
            }
        }
    }
}
function update() {
    if (game.state == "gameover") {
        gameOverScreen()
        return ;
    }
    if (game.state == "first") {
        startScreen()
        return ;
    }
    if (game.state == "pause") {
        pauseScreen()
        return ;
    }
    
    user.update()
    ball.update()
    brick.update()
    
    // render
    render()

    // time
    setTimeout(() => update(), 1000 / game.fps)
}


function drawText(text, x, y, color = "white", size = 46, opacity = 1) {
    ctx.font = size + "px fantasy"
    ctx.fillStyle = color
    ctx.textBaseline = "center"
    ctx.textAlign = "center"
    ctx.globalAlpha = opacity
    ctx.fillText(text, x, y)
    ctx.globalAlpha = 1
}

function render() {    
    ctx.clearRect(0, 0, game.w, game.h)
    
    // score
    drawText("Score: " + game.score, game.w/2, game.h/2, "white", "46", 0.5)
    drawText("Esc for pause", game.w/2, ((game.h/2) / 4)*3, "white", "18", 0.5)
    nyawa()
    
    // render
    user.render()
    ball.render()
    brick.render()
}


function pauseScreen() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, game.w, game.h);
    drawText("Enter for continue game", game.w/2, game.h/2, "white", "40", 1)
}

function gameOverScreen() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, game.w, game.h);
    drawText("Game Over :(", game.w/2, (game.h/2)-10, "white", "46", 1)
    drawText("Enter or Click Anywhere for continue", game.w/2, (game.h/2)+10, "white", "20", 1)
    drawText("Your Score : " + game.score, game.w/2, (game.h/2)+25, "white", "14", 1)
}

function startScreen() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, game.w, game.h);
    drawText("Enter or Click Anywhere for Play game", game.w/2, (game.h/2)+10, "white", "20", 1)
    drawText("Bricks Breaker :]", game.w/2, (game.h/2)-10, "white", "46", 1)
}

function nyawa() {
    let start = 180;
    let gap = 1;
    let y = game.h / 2 + 100
    
    ctx.globalAlpha = 0.5
    if (game.nyawa > 0) {
        ctx.drawImage(imgNyawa, start*1, y, 32, 32);
    } 
    if (game.nyawa > 1) {
        ctx.drawImage(imgNyawa, start*2, y, 32, 32);
    } 
    if (game.nyawa > 2) {
        ctx.drawImage(imgNyawa, start*3, y, 32, 32);
    }
    ctx.globalAlpha = 1
}

window.addEventListener("mousemove", e => user.event(e))
window.addEventListener("DOMContentLoaded", main)
window.addEventListener("keydown", e => {
    // MAIN MENE
    if (e.keyCode == 27) game.state = "pause" // pause
    if (e.keyCode == 13 && game.state == 'pause') {
        game.state = "play"
        update()
    } else if (e.keyCode == 13 && game.state == 'gameover') {
        game.state = "play"
        game.score = 0
        update()
    }
})
window.addEventListener("click", e => {
    // MAIN MENE
    if (game.state == 'first') {
        game.state = 'play'
        update()
    }
    if (game.state == 'gameover') {
        game.state = 'play'
        game.score = 0
        update()
    }
})