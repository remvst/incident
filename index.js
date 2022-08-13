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

let character;

onmousemove = (e) => {
    const canvasRect = can.getBoundingClientRect();
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
let totalTime = 0;

function frame() {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;
    totalTime += elapsed;

    // head.position.x = can.width / 2 + Math.cos(-totalTime * Math.PI / 16) * 300;
    // head.position.y = can.width / 2 + Math.sin(-totalTime * Math.PI / 16) * 300;
    // head.position.x += elapsed * 20;

    character.cycle(elapsed);

    clear();
    character.render();

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

class Character {
    constructor() {
        this.target = {'x': 0, 'y': 0};

        this.head = new Node();
        this.head.position.x = 100;
        this.head.position.y = 100;

        let parent = this.head;
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

            parent = child;
        }

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

        return normalize(angleBetween(this.position, this.parent.position));
    }

    needsLengthResolution() {
        if (!this.parent) return false;
        const distanceFromParent = dist(this.position, this.parent.position);
        return !isBetween(this.minDistanceFromParent, distanceFromParent, this.maxDistanceFromParent);
    }

    needsAngleResolution() {
        if (!this.parent) return null;
        const parentAngle = this.parent.angle;
        if (parentAngle === null) return false;

        const angleOffset = normalize(this.angle - parentAngle);

        if (!isBetween(normalize(this.minAngleOffset), angleOffset, normalize(this.maxAngleOffset))) {
            return true;
        }
    }

    onParentLengthResolved() {
        // this.resolveAngle();
    }

    resolveLength() {
        const angleToParent = angleBetween(this.position, this.parent.position);
        const averageDistance = (this.minDistanceFromParent + this.maxDistanceFromParent) / 2;

        const targetX = this.parent.position.x - averageDistance * Math.cos(angleToParent);
        const targetY = this.parent.position.y - averageDistance * Math.sin(angleToParent);

        this.position.x = targetX;
        this.position.y = targetY;

        this.children.forEach(child => child.onParentLengthResolved());
    }

    resolveAngle() {
        const distanceFromParent = dist(this.position, this.parent.position);
        const parentAngle = this.parent.angle;
        const averageOffset = (this.minAngleOffset + this.maxAngleOffset) / 2;
        const resolveWithAverageOffset = normalize(parentAngle + averageOffset);
        const resolveWithMinOffset = normalize(parentAngle + this.minAngleOffset);
        const resolveWithMaxOffset = normalize(parentAngle + this.maxAngleOffset);

        const resolutionWithMinOffset = {
            'x': this.parent.position.x + Math.cos(resolveWithMinOffset + Math.PI) * distanceFromParent,
            'y': this.parent.position.y + Math.sin(resolveWithMinOffset + Math.PI) * distanceFromParent,
        };

        const resolutionWithMaxOffset = {
            'x': this.parent.position.x + Math.cos(resolveWithMaxOffset + Math.PI) * distanceFromParent,
            'y': this.parent.position.y + Math.sin(resolveWithMaxOffset + Math.PI) * distanceFromParent,
        }

        const resolutionWithAverageOffset = {
            'x': this.parent.position.x + Math.cos(resolveWithAverageOffset + Math.PI) * distanceFromParent,
            'y': this.parent.position.y + Math.sin(resolveWithAverageOffset + Math.PI) * distanceFromParent,
        };

        const angleOffset = normalize(this.angle - parentAngle);

        const resolutions = [
            resolutionWithMinOffset,
            resolutionWithMaxOffset,
            resolutionWithAverageOffset,
        ].sort((a, b) => {
            const angleOffsetA = normalize(angleBetween(a, this.parent.position) - parentAngle) - angleOffset;
            const angleOffsetB = normalize(angleBetween(b, this.parent.position) - parentAngle) - angleOffset;
            return Math.abs(angleOffsetA) - Math.abs(angleOffsetB);
        });

        // const resolutionOffsets = resolutions.map((a) => {
        //     return normalize(angleBetween(a, this.parent.position) - parentAngle);
        // })

        const resolution = this.angleResolutionResolutionSelector(resolutions);
        
        this.position.x = resolution.x;
        this.position.y = resolution.y;

        const newAngleOffset = normalize(this.angle - parentAngle);
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
        for (const child of this.children) {
            child.realign();
        }
    }

    cycle(elapsed) {
        const angleToTarget = angleBetween(this.visualPosition, this.position);
        let distanceToTarget = dist(this.visualPosition, this.position) * 0.2;
        
        this.visualPosition.x += distanceToTarget * Math.cos(angleToTarget);
        this.visualPosition.y += distanceToTarget * Math.sin(angleToTarget);

        this.resolve();

        for (const child of this.children) {
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
        });

        ctx.wrap(() => {
            ctx.globalAlpha *= 0.5;
            this.renderDebug();
        });

        for (const child of this.children) {
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

            const { angle } = this;
            if (angle) {
                const length = 30;

                ctx.lineWidth = 2;
                ctx.strokeStyle = '#f00'
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(cos(this.angle) * length, sin(this.angle) * length);
                ctx.stroke();

                ctx.wrap(() => {
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
            ctx.fillText(this.id, 0, -10);
        });
    }
}
