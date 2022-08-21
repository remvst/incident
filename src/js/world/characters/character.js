class Character {
    constructor() {
        this.target = {'x': 0, 'y': 0, 'radius': CELL_SIZE / 2};

        this.head = new Node();
        this.head.position.x = -50;
        this.head.position.y = 0;

        this.head.realign();

        this.health = 1;

        this.speed = 200;
        this.bloodColor = '#900';

        this.resetMetrics();
    }

    resetMetrics() {
        this.travelledDistance = 0;   
    }

    damage(amount, source) {
        this.health -= amount;

        for (let i = 0 ; i < 5 ; i++) {
            const blood = new Blood(
                source.x + rnd(-50, 50),
                source.y + rnd(-50, 50),
                this.bloodColor,
            )
            setTimeout(() => world.addToBottom(blood), 0);
            setTimeout(() => world.remove(blood), 60000);
        }
        this.addBloodParticle(source);
    }

    addBloodParticle(source) {
        world.add(new Particle({
            'x': [source.x + rnd(-10, 10), rnd(-80, 80)],
            'y': [source.y + rnd(-10, 10), rnd(-80, 80)],
            'duration': rnd(0.2, 0.4),
            'color': this.bloodColor,
            'size': [rnd(10, 15), 3],
            'alpha': [1, -1],
        }));
    }
    
    cycle(elapsed) {
        const distToTarget = dist(this.head.position, this.target);
        if (distToTarget >= this.target.radius) {
            const angleToTarget = angleBetween(this.head.position, this.target);
            const appliedDistance = Math.min(elapsed * this.speed, distToTarget);

            this.head.position.x += Math.cos(angleToTarget) * appliedDistance;
            this.head.position.y += Math.sin(angleToTarget) * appliedDistance;

            this.travelledDistance += appliedDistance;
        }

        this.head.cycle(elapsed);
        this.head.resolve();
    }

    render() {
        this.head.render();

        // ctx.wrap(() => {
        //     ctx.fillStyle = '#f00';
        //     ctx.fillRect(this.target.x, this.target.y, 10, 10);
        // });
    }

    faceTarget(target) {
        const angleFromTarget = angleBetween(target, this.head.position);
        this.head.children.forEach((child) => {
            const childDistance = dist(child.position, this.head.position);
            child.position.x = this.head.position.x + Math.cos(angleFromTarget) * childDistance;
            child.position.y = this.head.position.y + Math.sin(angleFromTarget) * childDistance;
        });
    }
}
