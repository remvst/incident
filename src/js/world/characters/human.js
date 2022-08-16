class Human extends Character {
    constructor() {
        super();
        human(this.head);

        this.head.onReadjustment = () => this.newTarget();
        this.newTarget();
    }

    damage(amount) {
        super.damage(amount);
        setTimeout(() => {
            world.addToBottom(new Blood(
                this.head.position.x + rnd(-50, 50),
                this.head.position.y + rnd(-50, 50),
            ));
        }, 0);

        world.add(new Particle({
            'x': [this.head.position.x + rnd(-10, 10), rnd(-80, 80)],
            'y': [this.head.position.y + rnd(-10, 10), rnd(-80, 80)],
            'duration': rnd(0.2, 0.4),
            'color': '#900',
            'size': [rnd(20, 30), 5],
            'alpha': [1, 0],
        }));
    }

    newTarget() {
        console.log('find target!');
        const angle = rnd(0, TWO_PI);
        this.target.x = this.head.position.x + Math.cos(angle) * 200;
        this.target.y = this.head.position.y + Math.sin(angle) * 200;
    }

    cycle(elapsed) {
        const distToTarget = dist(this.head.position, this.target);
        if (distToTarget < CELL_SIZE / 2) {
            this.newTarget();
        }


        this.speed = 200 * this.health;

        super.cycle(elapsed);
        
    }
}
