const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function background() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#C4A484";
    ctx.fill();
    ctx.closePath();
}

/* text 
ctx.font = '48px serif';
ctx.fillText('Hello world', 10, 50);
*/

/* circle
ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();
*/


/*
class Plot {
    width; height; color;

    constructor(x, y, width, height, color="brown") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.x+this.width, this.y+this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
*/

class Entity {
    x; y; dx; dy; r; color;

    constructor(x, y, dx=0, dy=0, r=10, color="blue") {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    tick() {
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

class Player extends Entity {
    x; y; dx; dy; r; color;

    constructor(x, y, dx=0, dy=0, r=10, color="lightblue") {
        super();
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.color = color;
    }
}

let player = new Player(25, 25, 0, 0);
/*
let plots = [];
for (let i = 0; i < 3; i++) {
    plots.push(new Plot(25+i*125, 25, 100, 100));
}
*/

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();

    player.tick();
}

setInterval(tick, 10);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") player.dx = 2;
    if (e.key === "Left" || e.key === "ArrowLeft") player.dx = -2;
    if (e.key === "Up" || e.key === "ArrowUp") player.dy = -2;
    if (e.key === "Down" || e.key === "ArrowDown") player.dy = 2;
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") player.dx = 0;
    if (e.key === "Left" || e.key === "ArrowLeft") player.dx = 0;
    if (e.key === "Up" || e.key === "ArrowUp") player.dy = 0;
    if (e.key === "Down" || e.key === "ArrowDown") player.dy = 0;
}