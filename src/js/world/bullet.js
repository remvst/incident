class Bullet {
    constructor(x, y, angle, owner) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.owner = owner;
    }

    cycle(elapsed) {
        this.x += elapsed * Math.cos(this.angle) * 600;
        this.y += elapsed * Math.sin(this.angle) * 600;

        if (world.hasObstacleXY(this.x, this.y)) {
            world.remove(this);
        }

        for (const node of player.head.allNodes()) {
            if (dist(node.position, this) < 20) {
                player.damage(0.5, this);
                world.remove(this);
                return;
            }
        }
    }

    render() {
        ctx.fillStyle = pick(['#f00', '#fff']);
        ctx.fillRect(this.x - 4, this.y - 4, 8, 8);
    }
}
