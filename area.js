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

    change_specific_area(area, between_args, x, y) {
        if (between(...between_args)) {
            if (area) {
                draw_samurai2 = false;
                this.is_denied_change_area = false;
                remove_popup();
                return area;
            } else {
                this.denied_change_area(x, y);
                return null;
            }
        }
    }

    change_area(x, _y, _width, _height) {
        let width = _width/2;
        let height = _height/2;
        let y = _y+height;

        let north = this.change_specific_area(this.north, [[x+width, y-height], [canvas.width/2 - 25, 0], [canvas.width/2 + 25, 10]], x, y);
        let south = this.change_specific_area(this.south, [[x+width, y+height], [canvas.width/2 - 25, canvas.height-10], [canvas.width/2 + 25, canvas.height]], x, y);
        let west = this.change_specific_area(this.west, [[x, y], [0, canvas.height/2 - 25], [10, canvas.height/2 + 25]], x, y);
        let east = this.change_specific_area(this.east, [[x+width, y], [canvas.width-10, canvas.height/2 - 25], [canvas.width, canvas.height/2 + 25]], x, y);
        if (north) return north;
        if (south) return south;
        if (west) return west;
        if (east) return east;

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
