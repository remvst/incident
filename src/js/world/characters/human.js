class Human extends Character {
    constructor(shoulderColor, headColor = '#daab79') {
        super();
        
        const neck = new Node(this.head);
        neck.maxAngleOffset = Math.PI / 8;
        neck.minAngleOffset = -Math.PI / 8;
        neck.minDistanceFromParent = 0;
        neck.maxDistanceFromParent = 5;
    
        const leftShoulder = new Node(neck);
        leftShoulder.minDistanceFromParent = 15;
        leftShoulder.maxDistanceFromParent = 25;
        leftShoulder.minAngleOffset = Math.PI / 2 - Math.PI / 8 + Math.PI / 8;
        leftShoulder.maxAngleOffset = Math.PI / 2 + Math.PI / 8 + Math.PI / 8;
    
        const rightShoulder = new Node(neck);
        rightShoulder.minDistanceFromParent = 15;
        rightShoulder.maxDistanceFromParent = 25;
        rightShoulder.minAngleOffset = -Math.PI / 2 - Math.PI / 8 - Math.PI / 8;
        rightShoulder.maxAngleOffset = -Math.PI / 2 + Math.PI / 8 - Math.PI / 8;
    
        const leftHand = new Node(leftShoulder);
        leftHand.minDistanceFromParent = 5;
        leftHand.maxDistanceFromParent = 15;
        leftHand.minAngleOffset = Math.PI / 2 - Math.PI / 8;
        leftHand.maxAngleOffset = Math.PI / 2 + Math.PI / 8;
    
        const rightHand = new Node(rightShoulder);
        rightHand.minDistanceFromParent = 5;
        rightHand.maxDistanceFromParent = 15;
        rightHand.minAngleOffset = -Math.PI / 2 - Math.PI / 8;
        rightHand.maxAngleOffset = -Math.PI / 2 + Math.PI / 8;
    
        rightShoulder.extraRender = leftShoulder.extraRender = leftHand.extraRender = rightHand.extraRender = renderLine(shoulderColor, 10);
        neck.extraRender = renderCircle(headColor, 10);

        this.head.onReadjustment = () => this.newTarget();

        this.nextTarget = 0;

        this.visionRange = CELL_SIZE * 3;
        this.visionAngle = PI / 2;
    }

    damage(amount, source) {
        super.damage(amount, source);
        if (this.health <= 0) {
            for (let i = 0 ; i < 20 ; i++) {
                this.addBloodParticle(source);
            }
        }
    }

    newTarget() {
        const angleToTarget = angleBetween(this.head.position, this.target);
        const newAngle = roundToNearest(angleToTarget, PI / 2) + pick([-1, 1]) * PI / 2;
        
        this.target.x = this.head.position.x + Math.cos(newAngle) * 200;
        this.target.y = this.head.position.y + Math.sin(newAngle) * 200;
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
    constructor() {
        super('#00f');
        this.name = nomangle('Janitor #') + ~~(random() * 300);
    }

    cycle(elapsed) {
        this.speed = 50 * this.health;
        super.cycle(elapsed);
    }
}

class Intern extends Human {
    constructor() {
        super(pick(['#080', '#00f', '#8f0', '#808']));
        this.name = nomangle('Intern #') + ~~(random() * 300);
    }

    cycle(elapsed) {
        this.speed = 100 * this.health;
        super.cycle(elapsed);
    }
}

class AttackingHuman extends Human {
    damage(amount, source) {
        super.damage(amount, source);
        this.nextShot = 1;
    }

    cycle(elapsed) {
        const seesPlayer = this.seesPlayer();
        this.speed = seesPlayer ? 0 : 100;
        this.visionRange = seesPlayer ? CELL_SIZE * 8 : CELL_SIZE * 5;

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
                world.add(new this.bulletType(this.head.position.x, this.head.position.y, angleToPlayer));
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

class SecurityDude extends AttackingHuman {
    constructor() {
        super('#000');
        this.nextShot = 0;
        this.name = nomangle('Security #') + ~~(random() * 300);
        this.bulletType = Bullet;
    }
}
