// FUNCTIONS
function rect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function between(val, low, high) {
    if (typeof val === "object") { // checking if point is between 2 points
        return between(val[0], low[0], high[0]) && between(val[1], low[1], high[1]);
    } else { // checking if value is between 2 values
        return val > low && val < high; 
    }
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ENTITY CLASS
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

// AREA CLASS
class Area {

    constructor(contents, bg_color, north, east, south, west, bg_img=null) { 
        this.contents = contents;
        this.bg_color = bg_color;
        this.north = north;
        this.east = east;
        this.south = south;
        this.west = west;
        if (bg_img) {
            this.bg_img = new Image();
            this.bg_img.src = bg_img;
        }
    }

    draw() {
        for (let thing of this.contents) {
            thing.draw();
        }

        rect(canvas.width/2 - 25, 0, 5, 10, "brown");
        rect(canvas.width/2 + 20, 0, 5, 10, "brown");
        rect(canvas.width/2 - 25, canvas.height-10, 5, 10, "brown");
        rect(canvas.width/2 + 20, canvas.height-10, 5, 10, "brown");
        rect(0, canvas.height/2 - 25, 10, 5, "brown");
        rect(0, canvas.height/2 + 20, 10, 5, "brown");
        rect(canvas.width-10, canvas.height/2 - 25, 10, 5, "brown");
        rect(canvas.width-10, canvas.height/2 + 20, 10, 5, "brown");
    }

    background() {
        rect(0, 0, canvas.width, canvas.height, this.bg_color);
        if (this.bg_img) {
            ctx.drawImage(this.bg_img, 0, 0);
        }
    }

    change_area(x, y, r) {
        if (this.north && between([x, y-r], [canvas.width/2 - 25, 0], [canvas.width/2 + 25, 10])) {
            return this.north;
        }
        if (this.south && between([x, y+r], [canvas.width/2 - 25, canvas.height-10], [canvas.width/2 + 25, canvas.height])) 
            return this.south;
        if (this.west && between([x-r, y], [0, canvas.height/2 - 25], [10, canvas.height/2 + 25]))
            return this.west;
        if (this.east && between([x+r, y], [canvas.width-10, canvas.height/2 - 25], [canvas.width, canvas.height/2 + 25]))
            return this.east;
        return null;
    }

}

// PLANT STUFF
/*
class Plant {
    constructor(x, y, img_names) {
        this.x = x;
        this.y = y;
        this.img_names = img_names;
        this.stage = 0;

        // idk what these are
        this.width = 50;
        this.height = 50; 
    }

    draw() {
        ctx.drawImage(this.img_names[this.stage], this.x, this.y);
    }

    grow() {
        if (this.stage !== this.img_names.length - 1 && randint(1, 100) === 1) {
            this.stage++;
        }
    }
}

class Plot {
    
    constructor(x, y, width, height, color, plants) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.plants = plants;
    }
    
    draw() {
        for (let plant of this.plants) {
            plant.draw();
        }
    }

    detect_collect(x, y) {
        for (let plant of this.plants) {
            if (between([x, y], [plant.x, plant.y], [plant.x+plant.width, plant.y+plant.height])) {
                return true;
            }
        }
        return false;
    }

    grow() {
        for (let plant of this.plants) {
            plant.grow();
        }
    }
        
}
*/

// MAIN
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let player = new Player(25, 25, 0, 0);

let tmp_area = new Area([], "blue", null, null, null, null);
let cur_area = new Area([], "#C4A484", tmp_area, null, null, null, "volcanic_landscape.jpg");
tmp_area.south = cur_area;

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cur_area.background();
    cur_area.draw();
    if (cur_area.change_area(player.x, player.y, player.r)) {
        cur_area = cur_area.change_area(player.x, player.y, player.r);
        if (!between(player.y, 10 + player.r, canvas.height - 10 - player.r)) player.y = canvas.height - player.y;
        if (!between(player.x, 10 + player.r, canvas.width - 10 - player.r)) player.x = canvas.width - player.y;
    }

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