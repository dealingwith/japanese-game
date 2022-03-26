class Entity {

    constructor(options) {
        for (const [key, value] of Object.entries(options)) {
          this[key] = value;
        }
        if (!this.label_color) this.label_color = "white";

        this.img = new Image();
        this.img.src = options.img;
        var this_entity = this;
        this.img.addEventListener('load', function() {
          // once the image is loaded, get its width and height
          this_entity.img_width = this.naturalWidth;
          this_entity.img_height = this.naturalHeight;
        }, false);

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
