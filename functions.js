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