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
