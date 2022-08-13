const w = window;

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
const math = Math;
Object.getOwnPropertyNames(math).forEach(n => w[n] = w[n] || math[n]);

TWO_PI = PI * 2;

let can;
let ctx;

let head;

window.addEventListener('load', () => {
    can = document.querySelector('canvas');
    can.width = 800;
    can.height = 800;

    ctx = can.getContext('2d');

    head = new Node();
    head.x = 100;
    head.y = 100;

    let parent = head;
    let child;
    for (let i = 0 ; i < 5 ; i++)  {
        child = new Node(parent);

        const angleTest = new Node(child);
        angleTest.minAngleOffset = Math.PI / 2 + Math.PI / 8;
        angleTest.maxAngleOffset = Math.PI / 2 - Math.PI / 8;
        // angleTest.angleResolutionResolutionSelector = Node.pickFurthest;
    
        const angleTest2 = new Node(child);
        angleTest2.minAngleOffset = Math.PI * 3 / 2 + Math.PI / 8;
        angleTest2.maxAngleOffset = Math.PI * 3 / 2 - Math.PI / 8;
        // angleTest2.angleResolutionResolutionSelector = Node.pickFurthest;

        parent = child;
    }

    // child.x = 260;
    // child.y = 200 - 60;

    // child.minAngleOffset = Math.PI / 2 + Math.PI / 8;
    // child.maxAngleOffset = Math.PI / 2 - Math.PI / 8;

    // const angleTest = new Node(parent);
    // angleTest.x = 150;
    // angleTest.y = 250;
    // angleTest.minAngleOffset = Math.PI / 2 + Math.PI / 8;
    // angleTest.maxAngleOffset = Math.PI / 2 - Math.PI / 8;
    // // angleTest.angleResolutionResolutionSelector = Node.pickFurthest;

    // const angleTest2 = new Node(parent);
    // angleTest2.x = 200;
    // angleTest2.y = 200;
    // angleTest2.minAngleOffset = Math.PI * 3 / 2 + Math.PI / 8;
    // angleTest2.maxAngleOffset = Math.PI * 3 / 2 - Math.PI / 8;
    // // angleTest2.angleResolutionResolutionSelector = Node.pickFurthest;


    frame();
});

let lastFrame = performance.now();
let totalTime = 0;

function frame() {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;
    totalTime += elapsed;

    head.x += 50 * elapsed;

    head.x = can.width / 2 + Math.cos(totalTime * Math.PI / 8) * 300;
    head.y = can.width / 2 + Math.sin(totalTime * Math.PI / 8) * 300;

    head.resolve();

    clear();
    head.render();

    requestAnimationFrame(frame);
}

function clear() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, can.width, can.height);
}

const canvasProto = CanvasRenderingContext2D.prototype;

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

        this.x = 0;
        this.y = 0;

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
            return null;
        }

        return normalize(angleBetween(this, this.parent));
    }

    get angleOffset() {
        if (!this.parent || !this.parent.parent) {
            return null;
        }

        const { angle } = this;
        const parentAngle = this.parent.angle;
        return normalize(angle, parentAngle);
    }

    needsLengthResolution() {
        const distanceFromParent = dist(this, this.parent);
        // console.log(distanceFromParent, this.minDistanceFromParent, this.maxDistanceFromParent);
        if (!isBetween(this.minDistanceFromParent, distanceFromParent, this.maxDistanceFromParent)) return true;
        return false;
    }

    needsAngleResolution() {
        if (!this.parent) return null;
        const parentAngle = this.parent.angle;
        if (parentAngle === null) return false;

        const angleOffset = normalize(this.angle - parentAngle);

        if (!isBetween(normalize(this.minAngleOffset), angleOffset, normalize(this.maxAngleOffset))) {
            console.log(normalize(this.minAngleOffset), angleOffset, normalize(this.maxAngleOffset));
            return true;
        }
    }

    resolve() {
        if (this.parent) {
            // Resolve length elasticity
            if (this.needsLengthResolution()) {
                const angleToParent = angleBetween(this, this.parent);
                const targetX = this.parent.x - this.minDistanceFromParent * Math.cos(angleToParent);
                const targetY = this.parent.y - this.minDistanceFromParent * Math.sin(angleToParent);

                this.x = targetX;
                this.y = targetY;
                // const angleToParentAfter = angleBetween(this, this.parent);
                // console.log(angleToParent, angleToParentAfter);
            }

            if (this.needsAngleResolution()) {
                console.log('resolving angle for ', this.id);

                const distanceFromParent = dist(this, this.parent);
                const { angle } = this;
                const parentAngle = this.parent.angle;
                const averageOffset = (this.minAngleOffset + this.maxAngleOffset) / 2;
                const resolveWithAverageOffset = normalize(parentAngle + averageOffset);
                const resolveWithMinOffset = normalize(parentAngle + this.minAngleOffset);
                const resolveWithMaxOffset = normalize(parentAngle + this.maxAngleOffset);

                // console.log('angle should be', resolveWithMinOffset);

                const resolutionWithMinOffset = {
                    'x': this.parent.x + Math.cos(resolveWithMinOffset + Math.PI) * distanceFromParent,
                    'y': this.parent.y + Math.sin(resolveWithMinOffset + Math.PI) * distanceFromParent,
                };

                const resolutionWithMaxOffset = {
                    'x': this.parent.x + Math.cos(resolveWithMaxOffset + Math.PI) * distanceFromParent,
                    'y': this.parent.y + Math.sin(resolveWithMaxOffset + Math.PI) * distanceFromParent,
                }

                const resolutionWithAverageOffset = {
                    'x': this.parent.x + Math.cos(resolveWithAverageOffset + Math.PI) * distanceFromParent,
                    'y': this.parent.y + Math.sin(resolveWithAverageOffset + Math.PI) * distanceFromParent,
                };

                const resolutions = [
                    resolutionWithMinOffset,
                    resolutionWithMaxOffset,
                    resolutionWithAverageOffset,
                ].sort((a, b) => dist(this, a) - dist(this, b));

                // const resolution = dist(this, resolutionWithMinOffset) > dist(this, resolutionWithMaxOffset) ? resolutionWithMinOffset : resolutionWithMaxOffset;
                // const resolution = resolutionWithAverageOffset;

                const resolution = this.angleResolutionResolutionSelector(resolutions);
                // const resolution = resolutionWithAverageOffset;
                
                this.x = resolution.x;
                this.y = resolution.y;

                const newAngle = this.angle;

                console.log('angle should be', resolveWithAverageOffset, ' but is', newAngle);
            }
        }

        for (const child of this.children) {
            child.resolve();
        }
    }

    render() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - 5, this.y - 5, 10, 10);

        if (this.parent) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff'
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.parent.x, this.parent.y);
            ctx.stroke();
        }

        const { angle } = this;
        if (angle) {
            const length = 30;

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#f00'
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(this.angle) * length, this.y + Math.sin(this.angle) * length);
            ctx.stroke();

            ctx.wrap(() => {
                ctx.translate(this.x, this.y);
                // ctx.rotate(this.angle);

                if (!this.parent || !this.parent.parent) return;
                const parentAngle = this.parent.angle;

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
        ctx.fillText(this.id, this.x, this.y - 10);

        for (const child of this.children) {
            ctx.wrap(() => child.render());
        }
    }
}
