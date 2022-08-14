let w = window;

let can;
let ctx;

let character;

limit = (a, b, c) => b < a ? a : (b > c ? c : b);
isBetween = (a, b, c) => a <= b && b <= c || a >= b && b >= c;
rnd = (min, max) => random() * (max - min) + min;
distP = (x1, y1, x2, y2) => sqrt((x1 - x2)**2 + (y1 - y2)**2);
dist = (a, b) => distP(a.x, a.y, b.x, b.y);
normalize = x => moduloWithNegative(x, PI);
angleBetween = (a, b) => atan2(b.y - a.y, b.x - a.x);
roundToNearest = (x, precision) => round(x / precision) * precision;
pick = a => a[~~(random() * a.length)];

// Modulo centered around zero: the result will be between -y and +y
moduloWithNegative = (x, y) => {
    x = x % (y * 2);
    if (x > y) {
        x -= y * 2;
    }
    if (x < -y) {
        x += y * 2;
    }
    return x;
};

// Make Math global
let math = Math;
Object.getOwnPropertyNames(math).forEach(n => w[n] = w[n] || math[n]);

TWO_PI = PI * 2;

let canvasProto = CanvasRenderingContext2D.prototype;

// A couple extra canvas functions
canvasProto.wrap = function(f) {
    this.save();
    f();
    this.restore();
};

let nextId = 1;

class Node {
    constructor(parent) {
        this.id = `n[${nextId++}]`;

        this.position = {'x': 0, 'y': 0};
        this.visualPosition = {'x': 0, 'y': 0};

        this.minDistanceFromParent = 50;
        this.maxDistanceFromParent = 70;

        this.angleResolutionResolutionSelector = Node.pickAverage;
        this.minAngleOffset = -Math.PI / 4;
        this.maxAngleOffset = Math.PI / 4;

        this.children = [];

        if (parent) {
            this.parent = parent;
            this.parent.children.push(this);
        }

        this.extraRender = () => {};
    }

    static pickAverage(resolutions) {
        return resolutions[~~(resolutions.length / 2)];
    }

    static pickClosest(resolutions) {
        return resolutions[0];
    }

    static pickFurthest(resolutions) {
        return resolutions[resolutions.length - 1];
    }

    get angle() {
        if (!this.parent) {
            return 0;
        }

        return normalize(angleBetween(this.position, this.parent.position));
    }

    needsLengthResolution() {
        if (!this.parent) return 0;
        let distanceFromParent = dist(this.position, this.parent.position);
        return !isBetween(this.minDistanceFromParent, distanceFromParent, this.maxDistanceFromParent);
    }

    needsAngleResolution() {
        if (!this.parent) return 0;
        let parentAngle = this.parent.angle;
        if (parentAngle === 0) return 0;

        let angleOffset = normalize(this.angle - parentAngle);

        if (!isBetween(normalize(this.minAngleOffset), angleOffset, normalize(this.maxAngleOffset))) {
            return 1;
        }
    }

    onParentLengthResolved() {
        // this.resolveAngle();
    }

    resolveLength() {
        let angleToParent = angleBetween(this.position, this.parent.position);
        let averageDistance = (this.minDistanceFromParent + this.maxDistanceFromParent) / 2;

        let targetX = this.parent.position.x - averageDistance * Math.cos(angleToParent);
        let targetY = this.parent.position.y - averageDistance * Math.sin(angleToParent);

        this.position.x = targetX;
        this.position.y = targetY;

        this.children.forEach(child => child.onParentLengthResolved());
    }

    resolveAngle() {
        let distanceFromParent = dist(this.position, this.parent.position);
        let parentAngle = this.parent.angle;
        let averageOffset = (this.minAngleOffset + this.maxAngleOffset) / 2;
        let resolveWithAverageOffset = normalize(parentAngle + averageOffset);
        let resolveWithMinOffset = normalize(parentAngle + this.minAngleOffset);
        let resolveWithMaxOffset = normalize(parentAngle + this.maxAngleOffset);

        let resolutionWithMinOffset = {
            'x': this.parent.position.x + Math.cos(resolveWithMinOffset + Math.PI) * distanceFromParent,
            'y': this.parent.position.y + Math.sin(resolveWithMinOffset + Math.PI) * distanceFromParent,
        };

        let resolutionWithMaxOffset = {
            'x': this.parent.position.x + Math.cos(resolveWithMaxOffset + Math.PI) * distanceFromParent,
            'y': this.parent.position.y + Math.sin(resolveWithMaxOffset + Math.PI) * distanceFromParent,
        }

        let resolutionWithAverageOffset = {
            'x': this.parent.position.x + Math.cos(resolveWithAverageOffset + Math.PI) * distanceFromParent,
            'y': this.parent.position.y + Math.sin(resolveWithAverageOffset + Math.PI) * distanceFromParent,
        };

        let angleOffset = normalize(this.angle - parentAngle);

        let resolutions = [
            resolutionWithMinOffset,
            resolutionWithMaxOffset,
            resolutionWithAverageOffset,
        ].sort((a, b) => {
            let angleOffsetA = normalize(angleBetween(a, this.parent.position) - parentAngle) - angleOffset;
            let angleOffsetB = normalize(angleBetween(b, this.parent.position) - parentAngle) - angleOffset;
            return Math.abs(angleOffsetA) - Math.abs(angleOffsetB);
        });

        // let resolutionOffsets = resolutions.map((a) => {
        //     return normalize(angleBetween(a, this.parent.position) - parentAngle);
        // })

        let resolution = this.angleResolutionResolutionSelector(resolutions);
        
        this.position.x = resolution.x;
        this.position.y = resolution.y;

        let newAngleOffset = normalize(this.angle - parentAngle);
        // console.log('resolved angle', angleOffset, newAngleOffset, resolutionOffsets);

        // if (this.id === 'n[3]') throw new Error();
    }

    resolve() {
        // Resolve length elasticity
        if (this.needsLengthResolution()) {
            this.resolveLength();
        }

        // Resolve angle elasticity
        if (this.needsAngleResolution()) {
            this.resolveAngle();
        }
    }

    realign() {
        this.visualPosition.x = this.position.x;
        this.visualPosition.y = this.position.y;
        for (let child of this.children) {
            child.realign();
        }
    }

    cycle(elapsed) {
        let angleToTarget = angleBetween(this.visualPosition, this.position);
        let distanceToTarget = dist(this.visualPosition, this.position) * 0.2;
        
        this.visualPosition.x += distanceToTarget * Math.cos(angleToTarget);
        this.visualPosition.y += distanceToTarget * Math.sin(angleToTarget);

        this.resolve();

        for (let child of this.children) {
            child.cycle(elapsed);
        }
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.visualPosition.x, this.visualPosition.y);

            ctx.fillStyle = '#f00';
            ctx.fillRect(-5, -5, 10, 10);

            if (this.parent) {
                ctx.lineWidth = 10;
                ctx.strokeStyle = '#fff';
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(this.parent.visualPosition.x - this.visualPosition.x, this.parent.visualPosition.y - this.visualPosition.y);
                ctx.stroke();
            }

            this.extraRender();
        });

        ctx.wrap(() => {
            ctx.globalAlpha *= 0.5;
            this.renderDebug();
        });

        for (let child of this.children) {
            ctx.wrap(() => child.render());
        } 
    }

    renderDebug() {
        ctx.wrap(() => {
            ctx.translate(this.position.x, this.position.y);

            ctx.fillStyle = '#fff';
            // ctx.fillRect(-5, -5, 10, 10);

            if (this.parent) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#fff'
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(this.parent.position.x - this.position.x, this.parent.position.y - this.position.y);
                ctx.stroke();
            }

            let { angle } = this;
            if (angle) {
                let length = 30;

                ctx.lineWidth = 2;
                ctx.strokeStyle = '#f00'
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(cos(this.angle) * length, sin(this.angle) * length);
                ctx.stroke();

                ctx.wrap(() => {
                    if (!this.parent || !this.parent.parent) return;
                    let parentAngle = this.parent.angle;

                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#0f0'
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(this.maxAngleOffset + this.parent.angle) * length, Math.sin(this.maxAngleOffset + this.parent.angle) * length);
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(this.minAngleOffset + this.parent.angle) * length, Math.sin(this.minAngleOffset + this.parent.angle) * length);
                    ctx.stroke();
                });

                // if (this.id === 'n[4]') {
                //     // console.log(angle);
                // }
            }

            ctx.fillStyle = '#fff';
            ctx.font = '12pt Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(this.id, 0, -10);
        });
    }
}


class Character {
    constructor() {
        this.target = {'x': 0, 'y': 0};

        this.head = new Node();
        this.head.position.x = 100;
        this.head.position.y = 100;

        // creepyBug(this);
        human(this);

        this.head.realign();
    }
    
    cycle(elapsed) {
        let distToTarget = dist(this.head.position, this.target);
        let angleToTarget = angleBetween(this.head.position, this.target);
        let appliedDistance = Math.min(elapsed * 100, distToTarget);

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

        let leg1 = new Node(child);
        leg1.minAngleOffset = Math.PI / 2 + Math.PI / 4;
        leg1.maxAngleOffset = Math.PI / 2 - Math.PI / 4;
        leg1.minDistanceFromParent = 40;
        leg1.maxDistanceFromParent = 60;
        leg1.visualSpeed = 200;
        leg1.angleResolutionResolutionSelector = Node.pickAverage;
    
        let leg2 = new Node(child);
        leg2.minAngleOffset = Math.PI * 3 / 2 + Math.PI / 4;
        leg2.maxAngleOffset = Math.PI * 3 / 2 - Math.PI / 4;
        leg2.minDistanceFromParent = 40;
        leg2.maxDistanceFromParent = 60;
        leg2.visualSpeed = 200;
        leg2.angleResolutionResolutionSelector = Node.pickAverage;

        if (i % 4 === 0) {
            leg1.minDistanceFromParent *= 3;
            leg2.maxDistanceFromParent *= 3;

            let ext1 = new Node(leg1);
            ext1.minAngleOffset = Math.PI / 2 + Math.PI / 4;
            ext1.maxAngleOffset = Math.PI / 2 - Math.PI / 4;
            ext1.minDistanceFromParent = 40;
            ext1.maxDistanceFromParent = 60;
            ext1.visualSpeed = 200;
            ext1.angleResolutionResolutionSelector = Node.pickAverage;

            let ext2 = new Node(leg2);
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
    let neck = new Node(character.head);
    neck.maxAngleOffset = Math.PI / 8;
    neck.minAngleOffset = -Math.PI / 8;
    neck.minDistanceFromParent = 0;
    neck.maxDistanceFromParent = 5;

    let leftShoulder = new Node(neck);
    leftShoulder.minDistanceFromParent = 50;
    leftShoulder.maxDistanceFromParent = 70;
    leftShoulder.minAngleOffset = Math.PI / 2 - Math.PI / 8 + Math.PI / 8;
    leftShoulder.maxAngleOffset = Math.PI / 2 + Math.PI / 8 + Math.PI / 8;

    let rightShoulder = new Node(neck);
    rightShoulder.minDistanceFromParent = 50;
    rightShoulder.maxDistanceFromParent = 70;
    rightShoulder.minAngleOffset = -Math.PI / 2 - Math.PI / 8 - Math.PI / 8;
    rightShoulder.maxAngleOffset = -Math.PI / 2 + Math.PI / 8 - Math.PI / 8;

    let leftHand = new Node(leftShoulder);
    leftHand.minDistanceFromParent = 30;
    leftHand.maxDistanceFromParent = 50;
    leftHand.minAngleOffset = Math.PI / 2 - Math.PI / 8;
    leftHand.maxAngleOffset = Math.PI / 2 + Math.PI / 8;

    let rightHand = new Node(rightShoulder);
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


onmousemove = (e) => {
    let canvasRect = can.getBoundingClientRect();
    character.target.x = (e.pageX - canvasRect.left) / canvasRect.width * can.width;
    character.target.y = (e.pageY - canvasRect.top) / canvasRect.height * can.height
};

window.addEventListener('load', () => {
    can = document.querySelector('canvas');
    can.width = 800;
    can.height = 800;

    ctx = can.getContext('2d');

    character = new Character();
    frame();
});

let lastFrame = performance.now();

function frame() {
    let now = performance.now();
    let elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    character.cycle(elapsed);

    clear();
    character.render();

    requestAnimationFrame(frame);
}

function clear() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, can.width, can.height);
}

