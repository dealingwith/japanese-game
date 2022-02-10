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

function popup(text, x, y, width, height="auto", font_sz=12, color="black", bg_color="white", font="sans-serif", padding=10) {
    let p = document.getElementById("text");
    p.setAttribute("style", `margin: ${y+8}px ${x+8}px; width: ${width}px; height: ${height}px; padding: ${padding}px;
        font-size: ${font_sz}px; color: ${color}; background-color: ${bg_color}; font-family: ${font};`)
    p.innerHTML = text;
}

function remove_popup() {
    let p = document.getElementById("text");
    p.innerHTML = "";
    p.setAttribute("style", "");
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

    constructor(x, y, dx=0, dy=0, img, label=null, img_width=0, img_height=0, label_color="white") {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.label = label;

        this.img = new Image();
        this.img.src = img;

        this.img_width = img_width;
        this.img_height = img_height;

        this.label_color = label_color;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y);

        if (this.label) {
            fill_text(this.label, this.x, this.y-5, 12, this.label_color);
        }
    }

    tick() {
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }

    say(text) {
        popup(text, this.x+this.img_width/1.5, this.y+this.img_height/1.5, 250);
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
        this.is_denied_change_area = false;
    }

    draw() {
        for (let thing of this.contents) {
            thing.draw();
        }

        rect(canvas.width/2 - 35, 0, 5, 10, "brown");
        rect(canvas.width/2 + 30, 0, 5, 10, "brown");
        rect(canvas.width/2 - 35, canvas.height-10, 5, 10, "brown");
        rect(canvas.width/2 + 30, canvas.height-10, 5, 10, "brown");
        rect(0, canvas.height/2 - 35, 10, 5, "brown");
        rect(0, canvas.height/2 + 30, 10, 5, "brown");
        rect(canvas.width-10, canvas.height/2 - 35, 10, 5, "brown");
        rect(canvas.width-10, canvas.height/2 + 30, 10, 5, "brown");
    }

    background() { 
        rect(0, 0, canvas.width, canvas.height, this.bg_color);
        if (this.bg_img) {
            ctx.drawImage(this.bg_img, 0, 0);
        }
    }

    change_area(x, _y, _width, _height) {
        let width = _width/2;
        let height = _height/2;
        let y = _y+height;
        if (between([x+width, y-height], [canvas.width/2 - 25, 0], [canvas.width/2 + 25, 10])) {
            if (this.north) {
                draw_samurai2 = false;
                this.is_denied_change_area = false;
                remove_popup();
                return this.north;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        if (between([x+width, y+height], [canvas.width/2 - 25, canvas.height-10], [canvas.width/2 + 25, canvas.height])) {
            if (this.south) {
                draw_samurai2 = false;
                this.is_denied_change_area = false;
                remove_popup();
                return this.south;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        if (between([x, y], [0, canvas.height/2 - 25], [10, canvas.height/2 + 25])) {
            if (this.west) {
                draw_samurai2 = false;
                this.is_denied_change_area = false;
                remove_popup();
                return this.west;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        if (between([x+width, y], [canvas.width-10, canvas.height/2 - 25], [canvas.width, canvas.height/2 + 25])) {
            if (this.east) {
                draw_samurai2 = false;
                this.is_denied_change_area = false;
                remove_popup();
                return this.east;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }

        return null;
    }

    denied_change_area(x, y) {
        this.is_denied_change_area = true;
        samurai2.x = x;
        samurai2.y = y;
        samurai2.say("Hey you! You can't leave this land! You're a PEASANT. You have to farm in the land your Daimyo told you to farm in. You should know the social hierarchy! Emperor > Shogun > Daimyo > Samurai > Ronin > Peasants > Artisans > Merchants. I know it's kind of unfair, but that's the feudal system. It has advantages, like good organization of classes, but also has disadvantages, like inequality between classes.");
        draw_samurai2 = true;
    }

}

// MAIN
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let player = new Entity(500, 300, 0, 0, "japanese_peasant.png", "Player", 60, 95);
let samurai1 = new Entity(50, 225, 0, 0, "samurai.png", "Samurai 陽翔", 60, 62);
let samurai2 = new Entity(-100, -100, 0, 0, "samurai.png", "Samurai 陽菜", 60, 62);
let shintoist = new Entity(-100, -100, 0, 0, "japanese_peasant.png", "Shintoist 哲也", 60, 95, "black");

let draw_samurai2 = false;

let test = new Entity(100, 50, 0, 0, "rice_plant.png");
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

    if (cur_area.bg_color === "#C4A484") {
        if (!cur_area.is_denied_change_area) {
            samurai1.say("Hey peasant! What are you doing here? Don't you know that because of mountains mostly caused by the 188 volcanoes in Japan, only about 20% of land can be farmed! Go right and you'll find some land you can farm in. You should be greatful your Daiymo gave you land. Armies often fight over little patches of fertile farmland!")
        }
        samurai1.tick();
    }

    if (draw_samurai2) {
        samurai2.tick();
    }

    if (cur_area.bg_color === "yellow") {
        shintoist.x = 30;
        shintoist.y = 30;
        shintoist.tick();
        if (!cur_area.is_denied_change_area) {
            shintoist.say("Hello! I haven't seen you before. Let me introduce you to the religion of Shinto. Us shintoists believe that all natural beings are alive, and have spirits. We ask the kami, the nature spirits, for help when we need it. To honor the kami, we worship and sacrifice at Shinto shrines. Since you don't look like you have anything to sacrifice, I'll give you some paper to make origami to sacrifice. Origami is a compound of the words \"ori\", meaning to fold, and \"kami\", meaning paper. It started when Chinese Buddhist monks carried paper to Japan in the 6th century, and was first only used for religious ceremonies because of the high price of paper. You can make origami too! Just press space.");
        }
    } else {
        shintoist.x = -100;
        shintoist.y = -100;
    }

    if (cur_area.change_area(player.x, player.y, player.img_width, player.img_height)) {
        cur_area = cur_area.change_area(player.x, player.y, player.img_width, player.img_height);
        if (!between(player.y, 200, canvas.height - 200)) player.y = canvas.height - player.y - player.img_height;
        if (!between(player.x, 200, canvas.width - 200)) player.x = canvas.width - player.x - player.img_width/2;
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
            plants.push(new Entity(player.x, player.y, 0, 0, "rice_plant.png")); 
        } else if (cur_area.bg_color === "yellow") {
            origamis.push(new Entity(player.x, player.y, 0, 0, "origami_crane.png")); 
        }
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") player.dx = 0;
    if (e.key === "Left" || e.key === "ArrowLeft") player.dx = 0;
    if (e.key === "Up" || e.key === "ArrowUp") player.dy = 0;
    if (e.key === "Down" || e.key === "ArrowDown") player.dy = 0;
}
