class Human extends Character {
    constructor() {
        super();
        human(this.head);
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
            'x': [this.head.position.x + rnd(-10, 10), rnd(-50, 50)],
            'y': [this.head.position.y + rnd(-10, 10), rnd(-50, 50)],
            'duration': rnd(0.2, 0.4),
            'color': '#900',
            'size': [rnd(20, 30), 5],
            'alpha': [1, 0],
        }));
    }
}
