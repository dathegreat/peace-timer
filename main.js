//TODO: text prompts for inhale vs exhale

function getTimerContext(){
    if(document.getElementById("timer")){
        const canvas = document.getElementById("timer")
        return canvas.getContext("2d")
    }
    
    return getTimerContext()
}

function resize(){
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}

function createBackgroundGradient(ctx){
    const background = ctx.createLinearGradient(ctx.canvas.width / 2, 0, ctx.canvas.width / 2, ctx.canvas.height)
    background.addColorStop(0, "rgba(2,0,36,1)")
    background.addColorStop(0.29, "rgba(9,9,121,1)")
    background.addColorStop(1, "rgba(0,107,129,1)")
    return background
}
//define vertices beginning with top and ending with left
function createSquare(ctx){
    const radius = ctx.canvas.width < ctx.canvas.height ? ctx.canvas.width * 0.25 : ctx.canvas.height * 0.25
    const center = {x: ctx.canvas.width / 2, y: ctx.canvas.height / 2}
    const square = {
        vertices: [
            {x: center.x, y: center.y - radius},
            {x: center.x + radius, y: center.y},
            {x: center.x, y: center.y + radius},
            {x: center.x - radius, y: center.y}
        ],
        center: center
    }
    return square
}

function createBall(ctx){
    return {
        position: {x: (ctx.canvas.width / 2) - (sideLength / 2), y: (ctx.canvas.height / 2) - (sideLength / 2)}
    }
}

function strokeSquare(ctx, square){
    ctx.lineWidth = 10
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#4298aa"
    ctx.beginPath()
    ctx.moveTo(square.vertices[0].x, square.vertices[0].y)
    ctx.lineTo(square.vertices[1].x, square.vertices[1].y)
    ctx.lineTo(square.vertices[2].x, square.vertices[2].y)
    ctx.lineTo(square.vertices[3].x, square.vertices[3].y)
    ctx.closePath()
    ctx.stroke()
}

function fillSquare(ctx, square, ball){
    const topLeftX = Math.min(ball.position.x, square.center.x - (ball.position.x - square.center.x))
    const topRightX = Math.max(ball.position.x, square.center.x + (square.center.x - ball.position.x))
    ctx.fillStyle = "blue"
    ctx.beginPath()
    ctx.moveTo(topLeftX, ball.position.y)
    ctx.lineTo(topRightX, ball.position.y)
    if(ball.position.y <= square.vertices[1].y){
        ctx.lineTo(square.vertices[1].x, square.vertices[1].y)
        ctx.lineTo(square.vertices[2].x, square.vertices[2].y)
        ctx.lineTo(square.vertices[3].x, square.vertices[3].y)
    }else{
        ctx.lineTo(square.vertices[2].x, square.vertices[2].y)
    }
    ctx.closePath()
    ctx.fill()
}

function drawBackground(ctx, gradient){
    ctx.fillStyle = gradient
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height)
}

function drawBall(ctx, ball){
    ctx.fillStyle = ball.color
    ctx.beginPath()
    ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
}

function lerp(x1, x2, t){
    return x1 + (t * (x2 - x1))
}

//initialize canvas
const ctx = getTimerContext()
resize()
//initialize timer
const timer = {
    backgroundGradient: createBackgroundGradient(ctx),
    square: createSquare(ctx),
    ball: {
        position: {x: 100, y: 100},
        radius: 10,
        color: "white"
    }
}

//draw background gradient
drawBackground(ctx, timer.backgroundGradient)
//create square path
strokeSquare(ctx, timer.square)
drawBall(ctx, timer.ball)

const breathDuration = 3000

function animationLoop(){
    drawBackground(ctx, timer.backgroundGradient)
    //lerp ball y position
    timer.ball.position.y = lerp(
        timer.square.vertices[0].y, 
        timer.square.vertices[2].y, 
        Math.abs((performance.now() % (breathDuration * 4)) - (breathDuration * 2)) / (breathDuration * 2)
    )
    //lerp ball x position
    timer.ball.position.x = lerp(
        timer.square.vertices[3].x,
        timer.square.vertices[1].x, 
        Math.abs( ((performance.now() + breathDuration) % (breathDuration * 4)) - (breathDuration * 2) ) / (breathDuration * 2)
    )
    //fill square based on breath progress
    fillSquare(ctx, timer.square, timer.ball)
    strokeSquare(ctx, timer.square)
    drawBall(ctx, timer.ball)

    requestAnimationFrame(animationLoop)
}

animationLoop()

document.addEventListener("resize", resize)