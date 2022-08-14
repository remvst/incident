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
    }
}
