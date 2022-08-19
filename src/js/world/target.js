class Target {
    constructor(row, col, rows, cols) {
        this.x = col * CELL_SIZE;
        this.y = row * CELL_SIZE;
        this.w = cols * CELL_SIZE;
        this.h = rows * CELL_SIZE;
    }

    cycle() {
        if (
            isBetween(this.x, player.head.position.x, this.x + this.w) &&
            isBetween(this.y, player.head.position.y, this.y + this.h)
        ) {
            world.remove(this);
        }
    }

    render() {
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = Math.sin(Date.now() / 1000 * TWO_PI) * 0.25 + 0.5;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
