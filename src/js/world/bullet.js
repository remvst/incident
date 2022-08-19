class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    cycle(elapsed) {
        this.x += elapsed * Math.cos(this.angle) * 600;
        this.y += elapsed * Math.sin(this.angle) * 600;

        if (world.hasObstacleXY(this.x, this.y)) {
            world.remove(this);
        }

        for (const node of player.head.allNodes()) {
            if (dist(node.position, this) < 20) {
                player.damage(0.2, this);
                world.remove(this);
            }
        }
    }

    render() {
        ctx.fillStyle = pick(['#f00', '#fff']);
        ctx.fillRect(this.x - 8, this.y - 8, 16, 16);
    }
}
