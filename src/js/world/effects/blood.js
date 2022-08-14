class Blood {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = rnd(5, 20);
    }

    cycle(elapsed) {

    }

    render() {
        ctx.fillStyle = '#900';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fill();
    }
}
