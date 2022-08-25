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
        this.speed = mouseDown ? 300 : 100;

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
        
        for (const element of world.elements) {
            if (element instanceof Human) {
                if (dist(this.target, element.head.position) < CELL_SIZE) {
                    this.target.x = element.head.position.x;
                    this.target.y = element.head.position.y;
                }

                if (dist(this.head.position, element.head.position) < 30) {
                    element.damage(elapsed * 2, this.head.position);
                    if (element.health <= 0) {
                        this.absorb(element);
                    }
                }
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

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(this.target.x, this.target.y, 10, 0, TWO_PI)
        ctx.fill();

        // const angle = angleBetween(this.head.position, this.target);
        // const res = castRay(this.head.position.x, this.head.position.y, angle, CELL_SIZE * 10);
        // if (res) {
        //     console.log(!!res);
        //     ctx.fillStyle = '#f00';
        //     ctx.fillRect(res.x - 20, res.y - 20, 40, 40);

        //     ctx.beginPath();
        //     ctx.moveTo(this.head.position.x, this.head.position.y);
        //     ctx.lineTo(res.x, res.y);
        //     ctx.stroke();
        // }
    }

    absorb(human) {
        world.remove(human);

        this.totalKills++;

        let delay = 0.5;
        const absorbedNodes = Array.from(human.head.allNodes());
        for (const absorbedNode of absorbedNodes) {
            absorbedNode.children = [];

            const hostingNode = pick(Array.from(this.neck.children[0].allNodes()));

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

        for (let i = 0 ; i < 10 ; i++) {
            this.addBloodParticle(source);
        }

        // const leaf = pick(Array.from(this.head.allNodes()).filter(node => node.parent && !node.children.length));
        // if (!leaf) return; // For safety

        // if (leaf === this.tail) {
        //     this.tail = leaf.parent;
        // }


        // const index = leaf.parent.children.indexOf(leaf);
        // leaf.parent.children.splice(index, 1);

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
