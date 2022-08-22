class Player extends Character {
    constructor() {
        super();
        this.bloodColor = '#fffb23';
        this.name = 'K-31';
        this.tail = this.head;
        this.extend();
        this.extend();
    }

    resetMetrics() {
        super.resetMetrics();
        this.dashDistance = 0;
    }

    cycle(elapsed) {
        const { x, y } = this.head.position;

        this.target.x = mousePosition.x + camera.x;
        this.target.y = mousePosition.y + camera.y;
        this.speed = mouseDown ? 300 : 100;

        super.cycle(elapsed);

        if (mouseDown) {
            this.dashDistance += distP(this.head.position.x, this.head.position.y, x, y);
        }
        
        for (const element of world.elements) {
            if (element instanceof Human) {
                if (dist(this.target, element.head.position) < 25) {
                    this.target.x = element.head.position.x;
                    this.target.y = element.head.position.y;
                }

                if (dist(this.head.position, element.head.position) < 25) {
                    element.damage(elapsed * 1, this.head.position);
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

        let delay = 0.5;
        const absorbedNodes = Array.from(human.head.allNodes());
        for (const absorbedNode of absorbedNodes) {
            absorbedNode.children = [];

            const hostingNode = pick(Array.from(this.head.children[0].allNodes()));

            timeout(delay).then(() => {
                hostingNode.children.push(absorbedNode);
                absorbedNode.parent = hostingNode;
            });
            delay += 0.5;
        }

        timeout(0.5).then(() => this.extend(true));
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

        if (this.tail.parent === this.head) {
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
