class Character {
    constructor() {
        this.target = {'x': 0, 'y': 0, 'radius': CELL_SIZE / 2};

        this.head = new Node();
        this.head.position.x = -50;
        this.head.position.y = 0;

        this.head.realign();

        this.health = 1;

        this.speed = 200;

        this.resetMetrics();
    }

    resetMetrics() {
        this.travelledDistance = 0;   
    }

    damage(amount) {
        this.health -= amount;
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

function creepyBug(head) {
    let parent = head;

    spine = new Node(parent);
    spine.minDistanceFromParent = 10;
    spine.maxDistanceFromParent = 30;
    spine.visualSpeed = 100;
    spine.angleResolutionResolutionSelector = Node.pickClosest;

    const leg1 = new Node(spine);
    leg1.minAngleOffset = Math.PI / 2 + Math.PI / 3;
    leg1.maxAngleOffset = Math.PI / 2 - Math.PI / 3;
    leg1.minDistanceFromParent = 20;
    leg1.maxDistanceFromParent = 40;
    leg1.visualSpeed = 200;
    leg1.angleResolutionResolutionSelector = Node.pickAverage;

    const leg2 = new Node(spine);
    leg2.minAngleOffset = Math.PI * 3 / 2 + Math.PI / 3;
    leg2.maxAngleOffset = Math.PI * 3 / 2 - Math.PI / 3;
    leg2.minDistanceFromParent = 20;
    leg2.maxDistanceFromParent = 40;
    leg2.visualSpeed = 200;
    leg2.angleResolutionResolutionSelector = Node.pickAverage;

    if (spine.depth % 4 === 0) {
        leg1.minDistanceFromParent *= 3;
        leg2.maxDistanceFromParent *= 3;

        const ext1 = new Node(leg1);
        ext1.minAngleOffset = Math.PI / 2 + Math.PI / 4;
        ext1.maxAngleOffset = Math.PI / 2 - Math.PI / 4;
        ext1.minDistanceFromParent = 40;
        ext1.maxDistanceFromParent = 60;
        ext1.visualSpeed = 200;
        ext1.angleResolutionResolutionSelector = Node.pickAverage;

        const ext2 = new Node(leg2);
        ext2.minAngleOffset = Math.PI * 3 / 2 + Math.PI / 4;
        ext2.maxAngleOffset = Math.PI * 3 / 2 - Math.PI / 4;
        ext2.minDistanceFromParent = 40;
        ext2.maxDistanceFromParent = 60;
        ext2.visualSpeed = 200;
        ext2.angleResolutionResolutionSelector = Node.pickAverage;
    }

    return spine;
}

