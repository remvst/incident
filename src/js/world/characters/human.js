class Human extends Character {
    constructor() {
        super();
        human(this.head);

        this.head.onReadjustment = () => this.newTarget();

        this.nextTarget = 0;

        this.visionRange = CELL_SIZE * 3;
        this.visionAngle = PI / 2;
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
        const angle = rnd(0, TWO_PI);
        this.target.x = this.head.position.x + Math.cos(angle) * 200;
        this.target.y = this.head.position.y + Math.sin(angle) * 200;
        this.target.radius = CELL_SIZE / 2;
    }

    cycle(elapsed) {
        const distToTarget = dist(this.head.position, this.target);
        if (distToTarget <= this.target.radius || (this.nextTarget -= elapsed) < 0) {
            this.nextTarget = 1;
            this.newTarget();
        }

        super.cycle(elapsed);
        
    }

    seesPlayer() {
        if (!this.couldSeePlayer()) {
            return;
        }

        const angleToPlayer = normalize(angleBetween(this.head.position, player.head.position));
        const angleToTarget = normalize(angleBetween(this.head.position, this.target));

        return normalize(angleToPlayer - angleToTarget) < this.visionAngle / 2;
    }

    couldSeePlayer() {
        const distanceToPlayer = dist(this.head.position, player.head.position);
        if (distanceToPlayer > this.visionRange) {
            return;
        }

        const angleToPlayer = angleBetween(this.head.position, player.head.position);

        const impact = castRay(this.head.position.x, this.head.position.y, angleToPlayer, CELL_SIZE * 10);
        return !impact || dist(impact, this.head.position) > distanceToPlayer;
    }

    render() {
        super.render();

        // const angle = angleBetween(this.head.position, this.target);
        // const res = castRay(this.head.position.x, this.head.position.y, angle, CELL_SIZE * 10);
        // if (res) {
        //     ctx.fillStyle = '#f00';
        //     ctx.fillRect(res.x - 20, res.y - 20, 40, 40);

        //     ctx.strokeStyle = '#f00';
        //     ctx.lineWidth = 2;
        //     ctx.beginPath();
        //     ctx.moveTo(this.head.position.x, this.head.position.y);
        //     ctx.lineTo(res.x, res.y);
        //     ctx.stroke();
        // }
    }
}

class Janitor extends Human {
    // TODO color
    cycle(elapsed) {
        this.speed = 200 * this.health;
        this.cycle(elapsed);
    }
}

class Intern extends Human {
    // TODO color
    cycle(elapsed) {
        this.speed = 200 * this.health;
        this.cycle(elapsed);
    }
}

class SecurityDude extends Human {
    constructor() {
        super();
        this.nextShot = 0;
    }

    cycle(elapsed) {
        const seesPlayer = this.seesPlayer();
        this.speed = seesPlayer ? 0 : 100;
        this.visionRange = seesPlayer ? CELL_SIZE * 5 : CELL_SIZE * 3;

        super.cycle(elapsed);

        if (seesPlayer) {
            this.target.x = player.head.position.x;
            this.target.y = player.head.position.y;
            this.faceTarget(player.head.position);
        }

        this.nextShot -= elapsed;
        if ((this.nextShot -= elapsed) <= 0) {
            this.nextShot = this.shotCount % 3 ? 0.5 : 2;
            if (seesPlayer) {
                const angleToPlayer = angleBetween(this.head.position, player.head.position);
                world.add(new Bullet(this.head.position.x, this.head.position.y, angleToPlayer));
                this.shotCount++;
            }
        }
    }

    render() {
        ctx.wrap(() => {
            const seesPlayer = this.seesPlayer();
            const angleToTarget = normalize(angleBetween(this.head.position, this.target));
            ctx.translate(this.head.position.x, this.head.position.y);
            ctx.rotate(angleToTarget);
            ctx.fillStyle = seesPlayer ? '#f00' : '#fff';
            ctx.globalAlpha = 0.05;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.visionRange, -this.visionAngle / 2, this.visionAngle / 2);
            ctx.fill();
        });

        super.render();
    }
}
