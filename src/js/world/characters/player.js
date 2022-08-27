class Player extends Character {
    constructor() {
        super();
        this.bloodColor = '#fffb23';
        this.name = 'K-31';
        this.tail = this.head;

        this.totalKills = 0;

        this.neck = new Node(this.head);
        this.neck.minDistanceFromParent = 1;
        this.neck.maxDistanceFromParent = 2;
        this.neck.visualSpeed = 100;
        this.neck.angleResolutionResolutionSelector = Node.pickClosest;

        this.tail = this.neck;

        this.nextFireDamage = 0;
        this.bloodTrailTimeleft = 0;

        this.damageIndicators = [];

        this.extend();
        this.extend();

        this.leftClaw = new Node(this.neck);
        this.leftClaw.minDistanceFromParent = 10;
        this.leftClaw.maxDistanceFromParent = 15;
        this.leftClaw.visualSpeed = 100;
        this.leftClaw.minAngleOffset = PI - PI / 5 + PI / 8;
        this.leftClaw.maxAngleOffset = PI - PI / 5 - PI / 8;
        this.leftClaw.angleResolutionResolutionSelector = Node.pickClosest;

        const leftClawEnd = new Node(this.leftClaw);
        leftClawEnd.minDistanceFromParent = 10;
        leftClawEnd.maxDistanceFromParent = 15;
        leftClawEnd.visualSpeed = 100;
        leftClawEnd.minAngleOffset = leftClawEnd.maxAngleOffset = PI / 2;
        leftClawEnd.angleResolutionResolutionSelector = Node.pickClosest;

        this.rightClaw = new Node(this.neck);
        this.rightClaw.minDistanceFromParent = 10;
        this.rightClaw.maxDistanceFromParent = 15;
        this.rightClaw.visualSpeed = 100;
        this.rightClaw.minAngleOffset = PI + PI / 5 + PI / 8;
        this.rightClaw.maxAngleOffset = PI + PI / 5 - PI / 8;
        this.rightClaw.angleResolutionResolutionSelector = Node.pickClosest;

        const rightClawEnd = new Node(this.rightClaw);
        rightClawEnd.minDistanceFromParent = 10;
        rightClawEnd.maxDistanceFromParent = 15;
        rightClawEnd.visualSpeed = 100;
        rightClawEnd.minAngleOffset = rightClawEnd.maxAngleOffset = -PI / 2;
        rightClawEnd.angleResolutionResolutionSelector = Node.pickClosest;
    }

    resetMetrics() {
        super.resetMetrics();
        this.dashDistance = 0;
    }

    cycle(elapsed) {
        const { x, y } = this.head.position;

        this.leftClaw.minAngleOffset = PI - PI / 5 + PI / 8 + Math.sin(tapeTime * PI * 2 * 4) * PI / 3;
        this.leftClaw.maxAngleOffset = PI - PI / 5 - PI / 8 + Math.sin(tapeTime * PI * 2 * 4) * PI / 3;

        this.rightClaw.minAngleOffset = PI + PI / 5 + PI / 8 - sin(tapeTime * PI * 2 * 4) * PI / 3;
        this.rightClaw.maxAngleOffset = PI + PI / 5 - PI / 8 - sin(tapeTime * PI * 2 * 4) * PI / 3;

        this.target.x = mousePosition.x + camera.x;
        this.target.y = mousePosition.y + camera.y;
        this.speed = mouseDown ? 400 : 100;
        // if (this.absorbing) this.speed = 0;

        if (this.burningTimeleft >= 0) {
            this.burningTimeleft -= elapsed;

            // Fire particle
            const node = pick(Array.from(this.head.allNodes()));
            world.add(new Particle({
                'x': [node.position.x, rnd(-40, 40)],
                'y': [node.position.y, rnd(-40, 40)],
                'duration': rnd(0.3, 0.4),
                'color': pick(['#ff0', '#f00', '#000']),
                'size': [rnd(5, 10), 5],
                'alpha': [1, 0],
            }));

            this.nextFireDamage -= elapsed;
            if (this.nextFireDamage <= 0) {
                this.nextFireDamage = 1;
                this.damage(1, this.head.position);
            }
        }

        super.cycle(elapsed);

        if (mouseDown) {
            this.dashDistance += distP(this.head.position.x, this.head.position.y, x, y);
        }
        
        this.absorbing = false;
        for (const element of world.elements) {
            if (element instanceof Human) {
                if (dist(this.target, element.head.position) < CELL_SIZE * (this.absorbing ? 3 : 1)) {
                    this.target.x = element.head.position.x;
                    this.target.y = element.head.position.y;
                }

                if (dist(this.head.position, element.head.position) < 30) {
                    element.damage(elapsed * (mouseDown ? 3 : 2), this.head.position);
                    if (element.health <= 0) {
                        this.absorb(element);
                    }
                    this.absorbing = true;
                }
            }
        }

        for (let i = this.damageIndicators.length - 1 ; i >= 0 ; i--) {
            const indicator = this.damageIndicators[i];
            indicator.cycle(elapsed);
            if (indicator.timeLeft <= 0) {
                this.damageIndicators.splice(i, 1);
            }
        }
    }

    extend(addLegs) {
        this.health += 1;

        const spine = new Node(this.tail);
        spine.minDistanceFromParent = 5;
        spine.maxDistanceFromParent = 15;
        spine.visualSpeed = 100;
        spine.angleResolutionResolutionSelector = Node.pickClosest;

        if (addLegs) {
            const leg1 = new Node(spine);
            leg1.minAngleOffset = PI / 2 + PI / 3;
            leg1.maxAngleOffset = PI / 2 - PI / 3;
            leg1.minDistanceFromParent = 10;
            leg1.maxDistanceFromParent = 20;
            leg1.visualSpeed = 200;
            leg1.angleResolutionResolutionSelector = Node.pickAverage;

            const leg2 = new Node(spine);
            leg2.minAngleOffset = PI * 3 / 2 + PI / 3;
            leg2.maxAngleOffset = PI * 3 / 2 - PI / 3;
            leg2.minDistanceFromParent = 10;
            leg2.maxDistanceFromParent = 20;
            leg2.visualSpeed = 200;
            leg2.angleResolutionResolutionSelector = Node.pickAverage;

            if (spine.depth % 4 === 0) {
                leg1.minDistanceFromParent *= 3;
                leg2.maxDistanceFromParent *= 3;

                const ext1 = new Node(leg1);
                ext1.minAngleOffset = PI / 2 + PI / 4;
                ext1.maxAngleOffset = PI / 2 - PI / 4;
                ext1.minDistanceFromParent = 20;
                ext1.maxDistanceFromParent = 40;
                ext1.visualSpeed = 200;
                ext1.angleResolutionResolutionSelector = Node.pickAverage;

                const ext2 = new Node(leg2);
                ext2.minAngleOffset = PI * 3 / 2 + PI / 4;
                ext2.maxAngleOffset = PI * 3 / 2 - PI / 4;
                ext2.minDistanceFromParent = 20;
                ext2.maxDistanceFromParent = 40;
                ext2.visualSpeed = 200;
                ext2.angleResolutionResolutionSelector = Node.pickAverage;
            }
        }

        this.tail = spine;

        for (const node of this.tail.allNodes()) {
            node.resolve();
        }
        this.head.realign();

        this.health++;
    }

    render() {
        super.render();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.1;

        ctx.beginPath();
        ctx.arc(this.target.x, this.target.y, 10, 0, TWO_PI);
        ctx.stroke();

        const angleToTarget = atan2(this.target.y - this.head.position.y, this.target.x - this.head.position.x);
        const distanceToTarget = dist(this.target, this.head.position);
        const lineDistance = distanceToTarget - 10;
        ctx.beginPath();
        ctx.moveTo(this.head.position.x, this.head.position.y);
        ctx.lineTo(
            this.head.position.x + cos(angleToTarget) * lineDistance, 
            this.head.position.y + sin(angleToTarget) * lineDistance,
        );
        ctx.stroke();
    }

    renderHud() {
        for (const indicator of this.damageIndicators) {
            indicator.render();
        }
    }

    absorb(human) {
        world.remove(human);

        this.totalKills++;

        let delay = 0.5;
        const absorbedNodes = Array.from(human.head.allNodes());
        for (const absorbedNode of absorbedNodes) {
            absorbedNode.children = [];

            const potentialHostNodes = Array.from(this.neck.children[0].allNodes()).sort((a, b) => a.depth - b.depth);
            if (potentialHostNodes.length > 1) {
                potentialHostNodes.splice(0, potentialHostNodes.length * 0.5);
            }

            const hostingNode = pick(potentialHostNodes);

            timeout(delay).then(() => {
                hostingNode.children.push(absorbedNode);
                absorbedNode.parent = hostingNode;
            });
            delay += 0.5;
        }

        timeout(0.5).then(() => this.extend(true));

        for (let delay = 0 ; delay < 3 ; delay += 0.2) {
            timeout(delay).then(() => this.addBloodDroop('#900', this.head.position));
        }
    }

    burn() {
        this.burningTimeleft = 1;
    }

    damage(amount, source) {
        super.damage(amount, source);

        this.damageIndicators.push(new DamageIndicator(source.owner ? source.owner.head.position : source));

        for (let i = 0 ; i < 10 ; i++) {
            this.addBloodParticle(source);
        }

        if (this.tail.parent === this.neck) {
            this.health = 0;

            world.remove(this);

            for (let i = 0 ; i < 100 ; i++) {
                this.addBloodParticle(source);
            }

            timeout(2).then(() => world.reject(new Error()));
        } else {
            this.health = 1;

            const index = this.tail.parent.children.indexOf(this.tail);
            if (index >= 0) this.tail.parent.children.splice(index, 1);
            this.tail = this.tail.parent;
        }
    }
}

class DamageIndicator {
    constructor(source) {
        this.source = source;
        this.timeLeft = 1;
        this.age = 0;
    }

    cycle(elapsed) {
        this.timeLeft -= elapsed;
        this.age += elapsed;
    }

    render() {
        ctx.wrap(() => {
            const center = player.head.position;
            ctx.translate(center.x, center.y);
            ctx.rotate(angleBetween(center, this.source));
            ctx.fillStyle = ctx.strokeStyle = '#f00';
            ctx.lineWidth = 10;
            ctx.beginPath();

            const ratio = min(1, this.age / 0.1);
            ctx.globalAlpha = ratio;

            for (let angle = -PI / 6 ; angle < PI / 6 ; angle += PI / 16) {
                const radius = rnd(100, 110) * ratio;
                ctx.lineTo(
                    cos(angle) * radius,
                    sin(angle) * radius,
                );
            }
            ctx.stroke();
        });
    }
}
