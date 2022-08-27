class Character {
    constructor() {
        this.target = {'x': 0, 'y': 0, 'radius': CELL_SIZE / 2};

        this.head = new Node();
        this.head.supersafeCollisions = true;
        this.head.position.x = -50;
        this.head.position.y = 0;

        this.head.realign();

        this.health = 1;

        this.speed = 200;
        this.bloodColor = '#900';

        this.rectangle = {'minX': 0, 'maxX': 0, 'minY': 0, 'maxY': 0};

        this.resetMetrics();
    }

    computeRectangle() {
        this.rectangle.minX = Number.MAX_SAFE_INTEGER;
        this.rectangle.minY = Number.MAX_SAFE_INTEGER;
        this.rectangle.maxX = Number.MIN_SAFE_INTEGER;
        this.rectangle.maxY = Number.MIN_SAFE_INTEGER;

        for (const node of this.head.allNodes()) {
            this.rectangle.minX = Math.min(this.rectangle.minX, node.position.x);
            this.rectangle.minY = Math.min(this.rectangle.minY, node.position.y);
            this.rectangle.maxX = Math.max(this.rectangle.maxX, node.position.x);
            this.rectangle.maxY = Math.max(this.rectangle.maxY, node.position.y);
        }
    }

    resetMetrics() {
        this.travelledDistance = 0;   
    }

    damage(amount, source) {
        this.health -= amount;

        for (let i = 0 ; i < 5 ; i++) {
            this.addBloodDroop(this.bloodColor, source);
        }
        this.addBloodParticle(source);
    }

    addBloodDroop(color, position) {
        const blood = new Blood(
            position.x + rnd(-50, 50),
            position.y + rnd(-50, 50),
            color,
        )

        timeout(0).then(() => world.addToBottom(blood));
        timeout(60).then(() => world.remove(blood));
    }

    addBloodParticle(source) {
        world.add(new Particle({
            'x': [source.x + rnd(-5, 5), rnd(-40, 40)],
            'y': [source.y + rnd(-5, 5), rnd(-40, 40)],
            'duration': rnd(0.2, 0.4),
            'color': this.bloodColor,
            'size': [rnd(10, 15), 5],
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

    renderShadow() {
        this.head.renderShadow();
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
