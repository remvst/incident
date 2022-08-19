class Player extends Character {
    constructor() {
        super();
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
        this.speed = mouseDown ? 600 : 200;

        super.cycle(elapsed);

        if (mouseDown) {
            this.dashDistance += distP(this.head.position.x, this.head.position.y, x, y);
        }
        
        for (const element of world.elements) {
            if (element instanceof Human) {
                if (dist(this.head.position, element.head.position) < 50) {
                    element.damage(elapsed * 1);
                    if (element.health <= 0) {
                        this.absorb(element);
                    }
                }
            }
        }
    }

    extend() {
        this.tail = creepyBug(this.tail);

        for (const node of this.tail.allNodes()) {
            node.resolve();
        }
        this.head.realign();
    }

    render() {
        super.render();

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(this.target.x, this.target.y, 20, 0, TWO_PI)
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

        // for (let i = 0 ; i < 20 ; i++) {
        //     world.addToBottom(new Blood(
        //         human.head.position.x + rnd(-50, 50),
        //         human.head.position.y + rnd(-50, 50),
        //     ));
        // }

        setTimeout(() => this.extend(), 500);

        let delay = 0.5;
        const absorbedNodes = Array.from(human.head.allNodes());
        for (const absorbedNode of absorbedNodes) {
            absorbedNode.children = [];

            setTimeout(() => {
                const randomNode = pick(Array.from(this.head.allNodes()));
                randomNode.children.push(absorbedNode);
                absorbedNode.parent = randomNode;
            }, delay * 1000);
            delay += 0.5;
        }
    }
}
