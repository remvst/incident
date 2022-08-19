class Blood {

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = rnd(5, 10);
        this.alpha = rnd(0.5, 1);
        this.color = color;
    }

    cycle(elapsed) {

    }

    render() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fill();
    }
}
