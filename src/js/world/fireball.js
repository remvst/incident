class Fireball {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    cycle(elapsed) {
        this.x += elapsed * Math.cos(this.angle) * 400;
        this.y += elapsed * Math.sin(this.angle) * 400;

        if (world.hasObstacleXY(this.x, this.y)) {
            world.remove(this);
        }

        this.addParticle();

        for (const node of player.head.allNodes()) {
            if (dist(node.position, this) < 20) {
                player.burn();
                world.remove(this);
                return;
            }
        }
    }

    addParticle() {
        world.add(new Particle({
            'x': [this.x, rnd(-40, 40)],
            'y': [this.y, rnd(-40, 40)],
            'duration': rnd(0.3, 0.4),
            'color': pick(['#ff0', '#f00', '#000']),
            'size': [rnd(5, 10), 5],
            'alpha': [1, 0],
        }));
    }

    render() {
    }
}
