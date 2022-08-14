class Character {
    constructor() {
        this.target = {'x': 0, 'y': 0};

        this.head = new Node();
        this.head.position.x = 100;
        this.head.position.y = 100;

        creepyBug(this);
        // human(this);

        this.head.realign();
    }
    
    cycle(elapsed) {
        const distToTarget = dist(this.head.position, this.target);
        const angleToTarget = angleBetween(this.head.position, this.target);
        const appliedDistance = Math.min(elapsed * 100, distToTarget);

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

function creepyBug(character) {
    let parent = character.head;
    let child;
    for (let i = 0 ; i < 10 ; i++)  {
        child = new Node(parent);
        child.minDistanceFromParent = 30;
        child.maxDistanceFromParent = 50;
        child.visualSpeed = 100;
        child.angleResolutionResolutionSelector = Node.pickClosest;

        const leg1 = new Node(child);
        leg1.minAngleOffset = Math.PI / 2 + Math.PI / 4;
        leg1.maxAngleOffset = Math.PI / 2 - Math.PI / 4;
        leg1.minDistanceFromParent = 40;
        leg1.maxDistanceFromParent = 60;
        leg1.visualSpeed = 200;
        leg1.angleResolutionResolutionSelector = Node.pickAverage;
    
        const leg2 = new Node(child);
        leg2.minAngleOffset = Math.PI * 3 / 2 + Math.PI / 4;
        leg2.maxAngleOffset = Math.PI * 3 / 2 - Math.PI / 4;
        leg2.minDistanceFromParent = 40;
        leg2.maxDistanceFromParent = 60;
        leg2.visualSpeed = 200;
        leg2.angleResolutionResolutionSelector = Node.pickAverage;

        if (i % 4 === 0) {
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

        parent = child;
    }
}

function human(character) {
    const neck = new Node(character.head);
    neck.maxAngleOffset = Math.PI / 8;
    neck.minAngleOffset = -Math.PI / 8;
    neck.minDistanceFromParent = 0;
    neck.maxDistanceFromParent = 5;

    const leftShoulder = new Node(neck);
    leftShoulder.minDistanceFromParent = 50;
    leftShoulder.maxDistanceFromParent = 70;
    leftShoulder.minAngleOffset = Math.PI / 2 - Math.PI / 8 + Math.PI / 8;
    leftShoulder.maxAngleOffset = Math.PI / 2 + Math.PI / 8 + Math.PI / 8;

    const rightShoulder = new Node(neck);
    rightShoulder.minDistanceFromParent = 50;
    rightShoulder.maxDistanceFromParent = 70;
    rightShoulder.minAngleOffset = -Math.PI / 2 - Math.PI / 8 - Math.PI / 8;
    rightShoulder.maxAngleOffset = -Math.PI / 2 + Math.PI / 8 - Math.PI / 8;

    const leftHand = new Node(leftShoulder);
    leftHand.minDistanceFromParent = 30;
    leftHand.maxDistanceFromParent = 50;
    leftHand.minAngleOffset = Math.PI / 2 - Math.PI / 8;
    leftHand.maxAngleOffset = Math.PI / 2 + Math.PI / 8;

    const rightHand = new Node(rightShoulder);
    rightHand.minDistanceFromParent = 30;
    rightHand.maxDistanceFromParent = 50;
    rightHand.minAngleOffset = -Math.PI / 2 - Math.PI / 8;
    rightHand.maxAngleOffset = -Math.PI / 2 + Math.PI / 8;

    character.head.extraRender = () => {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
    };

    rightHand.extraRender = () => {
        ctx.rotate(rightHand.angle + Math.PI);
        ctx.fillStyle = '#f00';
        ctx.fillRect(0, -5, 40, 10);
    };
}

