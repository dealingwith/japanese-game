// FUNCTIONS
function rect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function fill_text(text, x, y, font_sz, color="black", font="sans-serif") {
    ctx.beginPath();
    ctx.font = `${font_sz}px ${font}`;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillText(text, x, y);
    ctx.closePath();
}

function popup(text, x, y, width, height="auto", font_sz=14, color="black", bg_color="white", font="sans-serif", padding=10) {
    let p = document.getElementById("text1");
    //if (p.innerHTML !== "" && p.innerHTML !== text) p = document.getElementById("text2");
    if ( p.innerHTML !== text) p = document.getElementById("text2");
    p.setAttribute("style", `margin: ${y+8}px ${x+8}px; width: ${width}px; height: ${height}px; padding: ${padding}px;
        font-size: ${font_sz}px; color: ${color}; background-color: ${bg_color}; font-family: ${font};`)
    p.innerHTML = text;
}

function remove_popup(number=1) {
    if (number === 1) {
        let p = document.getElementById("text1");
        p.innerHTML = "";
        p.setAttribute("style", "");
    } else {
        let p = document.getElementById("text2");
        p.innerHTML = "";
        p.setAttribute("style", "");
    }
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

    constructor(x, y, dx=0, dy=0, r=10, label=null, color="blue") {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.label = label;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        if (this.label) {
            fill_text(this.label, this.x - parseInt(this.label.length/3*10), this.y - 20, 14, "white");
        }
    }

    tick() {
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }

    say(text, unsay=false) {
        if (unsay) { remove_popup(); return; }
        popup(text, this.x, this.y, 250);
    }

}

class ImgEntity extends Entity {
    x; y; dx; dy; r; color;

    constructor(x, y, dx=0, dy=0, img, label=null) {
        super()
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.label = label;

        if (img) {
            this.img = new Image();
            this.img.src = img;
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y);

        if (this.label) {
            fill_text(this.label, this.x - parseInt(this.label.length/3*10), this.y - 20, 14, "white");
        }
    }
}

class Player extends Entity {
    x; y; dx; dy; r; color;

    constructor(x, y, dx=0, dy=0, r=10, label=null, color="lightblue") {
        super();
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.label = label;
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

    background() { rect(0, 0, canvas.width, canvas.height, this.bg_color);
        if (this.bg_img) {
            ctx.drawImage(this.bg_img, 0, 0);
        }
    }

    change_area(x, y, r) {
        if (between([x, y-r], [canvas.width/2 - 25, 0], [canvas.width/2 + 25, 10])) {
            if (this.north) {
                draw_samurai2 = false;
                return this.north;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        if (between([x, y+r], [canvas.width/2 - 25, canvas.height-10], [canvas.width/2 + 25, canvas.height])) {
            if (this.south) {
                draw_samurai2 = false;
                return this.south;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        if (between([x-r, y], [0, canvas.height/2 - 25], [10, canvas.height/2 + 25])) {
            if (this.west) {
                draw_samurai2 = false;
                return this.west;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        if (between([x+r, y], [canvas.width-10, canvas.height/2 - 25], [canvas.width, canvas.height/2 + 25])) {
            if (this.east) {
                draw_samurai2 = false;
                return this.east;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        //if (cur_area.bg_color !== "#C4A484") {
        //    draw_samurai2 = false;
       // }

        return null;
    }

    denied_change_area(x, y) {
        samurai2.x = x;
        samurai2.y = y;
        samurai2.say("Hey you! You can't leave this land! You're a PEASANT. You have to farm in the land your Daimyo told you to farm in. You should know the social hierarchy! Emperor > Shogun > Daimyo > Samurai > Ronin > Peasants > Artisans > Merchants. You're waaaaay at the bottom.");
        draw_samurai2 = true;
    }

}

// MAIN
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let player = new Player(500, 300, 0, 0, 10, "Player");
let samurai1 = new Entity(50, 225, 0, 0, 10, "Samurai 陽翔", "red");
let samurai2 = new Entity(-10, -10, 0, 0, 10, "Samurai 陽菜", "red");

let draw_samurai2 = false;

let test = new ImgEntity(100, 50, 0, 0, "rice_plant.png");
let plants = [];
let origamis = [];

let tmp_area = new Area([], "blue", null, null, null, null, "volcanic_landscape2.png");
let tmp2_area = new Area([], "yellow", null, null, tmp_area, null, "shinto_shrine.png");
let cur_area = new Area([], "#C4A484", null, tmp_area, null, null, "volcanic_landscape.jpg");
tmp_area.west = cur_area;
tmp_area.north = tmp2_area;

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cur_area.background();
    cur_area.draw();
    if (cur_area.change_area(player.x, player.y, player.r)) {
        cur_area = cur_area.change_area(player.x, player.y, player.r);
        if (!between(player.y, 10 + player.r, canvas.height - 10 - player.r)) player.y = canvas.height - player.y;
        if (!between(player.x, 10 + player.r, canvas.width - 10 - player.r)) player.x = canvas.width - player.x;

        remove_popup();
    }

    if (cur_area.bg_color === "#C4A484") {
        samurai1.say("Hey peasant! What are you doing here? Don't you know that because of mountains, only about 20% of land can be farmed! Go find some land that you can actually farm to make yourself useful!")
        samurai1.tick();
    }

    if (cur_area.bg_color === "blue") {
        for (let plant of plants) {
            plant.tick();
        }
    } else if (cur_area.bg_color === "yellow") {
        for (let origami of origamis) {
            origami.tick();
        }
    }

    if (draw_samurai2) {
        samurai2.tick();
    } else {
        if (cur_area.bg_color === "#C4A484") {
            remove_popup(2);
        } else {
            remove_popup(1);
            remove_popup(2);
        }
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
    if (e.keyCode === 32) {// 32 key code is space
        if (player.y > 280 && cur_area.bg_color === "blue") {
            plants.push(new ImgEntity(player.x, player.y, 0, 0, "rice_plant.png")); 
        } else if (cur_area.bg_color === "yellow") {
            origamis.push(new ImgEntity(player.x, player.y, 0, 0, "origami_crane.png")); 
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") player.dx = 0;
    if (e.key === "Left" || e.key === "ArrowLeft") player.dx = 0;
    if (e.key === "Up" || e.key === "ArrowUp") player.dy = 0;
    if (e.key === "Down" || e.key === "ArrowDown") player.dy = 0;
}