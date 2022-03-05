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
