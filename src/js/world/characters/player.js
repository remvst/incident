class Player extends Character {
    constructor() {
        super();
        this.tail = this.head;
        this.extend();
        this.extend();
        this.extend();
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        for (const element of world.elements) {
            if (element instanceof Human) {
                if (dist(this.head.position, element.head.position) < 50) {
                    this.absorb(element);
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

    absorb(human) {
        world.remove(human);

        for (let i = 0 ; i < 50 ; i++) {
            world.addToBottom(new Blood(
                human.head.position.x + rnd(-50, 50),
                human.head.position.y + rnd(-50, 50),
            ));
        }

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
