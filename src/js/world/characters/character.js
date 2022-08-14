class Character {
    constructor() {
        this.target = {'x': 0, 'y': 0};

        this.head = new Node();
        this.head.position.x = -50;
        this.head.position.y = 0;

        this.head.realign();

        this.health = 1;
    }

    damage(amount) {
        this.health -= amount;
    }
    
    cycle(elapsed) {
        const speed = 200;
        const distToTarget = dist(this.head.position, this.target);
        const angleToTarget = angleBetween(this.head.position, this.target);
        const appliedDistance = Math.min(elapsed * speed, distToTarget);

        this.head.position.x += Math.cos(angleToTarget) * appliedDistance;
        this.head.position.y += Math.sin(angleToTarget) * appliedDistance;

        this.head.cycle(elapsed);
        this.head.resolve();
    }

    render() {
        this.head.render();

        ctx.wrap(() => {
            ctx.fillStyle = '#f00';
            ctx.fillRect(this.target.x, this.target.y, 10, 10);
        });
    }
}

function creepyBug(head) {
    let parent = head;

    spine = new Node(parent);
    spine.minDistanceFromParent = 30;
    spine.maxDistanceFromParent = 50;
    spine.visualSpeed = 100;
    spine.angleResolutionResolutionSelector = Node.pickClosest;

    const leg1 = new Node(spine);
    leg1.minAngleOffset = Math.PI / 2 + Math.PI / 4;
    leg1.maxAngleOffset = Math.PI / 2 - Math.PI / 4;
    leg1.minDistanceFromParent = 40;
    leg1.maxDistanceFromParent = 60;
    leg1.visualSpeed = 200;
    leg1.angleResolutionResolutionSelector = Node.pickAverage;

    const leg2 = new Node(spine);
    leg2.minAngleOffset = Math.PI * 3 / 2 + Math.PI / 4;
    leg2.maxAngleOffset = Math.PI * 3 / 2 - Math.PI / 4;
    leg2.minDistanceFromParent = 40;
    leg2.maxDistanceFromParent = 60;
    leg2.visualSpeed = 200;
    leg2.angleResolutionResolutionSelector = Node.pickAverage;

    // leg2.extraRender = 

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

function human(head) {
    const neck = new Node(head);
    neck.maxAngleOffset = Math.PI / 8;
    neck.minAngleOffset = -Math.PI / 8;
    neck.minDistanceFromParent = 0;
    neck.maxDistanceFromParent = 5;

    const leftShoulder = new Node(neck);
    leftShoulder.minDistanceFromParent = 30;
    leftShoulder.maxDistanceFromParent = 50;
    leftShoulder.minAngleOffset = Math.PI / 2 - Math.PI / 8 + Math.PI / 8;
    leftShoulder.maxAngleOffset = Math.PI / 2 + Math.PI / 8 + Math.PI / 8;

    const rightShoulder = new Node(neck);
    rightShoulder.minDistanceFromParent = 30;
    rightShoulder.maxDistanceFromParent = 50;
    rightShoulder.minAngleOffset = -Math.PI / 2 - Math.PI / 8 - Math.PI / 8;
    rightShoulder.maxAngleOffset = -Math.PI / 2 + Math.PI / 8 - Math.PI / 8;

    const leftHand = new Node(leftShoulder);
    leftHand.minDistanceFromParent = 10;
    leftHand.maxDistanceFromParent = 30;
    leftHand.minAngleOffset = Math.PI / 2 - Math.PI / 8;
    leftHand.maxAngleOffset = Math.PI / 2 + Math.PI / 8;

    const rightHand = new Node(rightShoulder);
    rightHand.minDistanceFromParent = 10;
    rightHand.maxDistanceFromParent = 30;
    rightHand.minAngleOffset = -Math.PI / 2 - Math.PI / 8;
    rightHand.maxAngleOffset = -Math.PI / 2 + Math.PI / 8;

    rightShoulder.extraRender = leftShoulder.extraRender = leftHand.extraRender = rightHand.extraRender = renderLine('#f00', 20);
    neck.extraRender = renderCircle('#daab79', 20);
}

