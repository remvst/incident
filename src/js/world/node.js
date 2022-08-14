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

        this.extraRender = parent ? renderLine('#fff') : () => {};
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

    needsCollisionResolution() {
        // return world.hasObstacleXY(this.position.x, this.position.y, 50);
    }

    resolveCollision() {
        const {x, y} = this.position;

        const radius = 50;
        // const left = x - radius;
        // const right = x + radius;
        // const top = y - radius;
        // const bottom = y + radius;

        // const leftObstacle = world.hasObstacleXY(left, y);
        // const rightObstacle = world.hasObstacleXY(right, y);

        // if (world.hasObstacleXY(x, y, 0)) {
        //     return; // Not much we can do
        // }

        // if (world.hasObstacleXY(left, y)) {
        //     this.position.x = x + radius;
        // }

        const readjusted = world.readjust(x, y, radius);
        if (!readjusted) {
            return;
        }

        this.position.x = readjusted.x;
        this.position.y = readjusted.y;
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

        // Resolve collisions
        // if (this.needsCollisionResolution()) {
            this.resolveCollision();
        // }
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
                // ctx.stroke();
            }
        });

        for (const child of this.children) {
            ctx.wrap(() => child.render());
        } 

        ctx.wrap(() => {
            this.extraRender(this);
        });

        ctx.wrap(() => {
            ctx.globalAlpha *= 0.5;
            this.renderDebug();
        });
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
            }

            ctx.fillStyle = '#fff';
            ctx.font = '12pt Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(this.id, 0, -10);
        });
    }

    * allNodes() {
        yield this;
        for (const child of this.children) {
            for (const sub of child.allNodes()) {
                yield sub;
            }
        }
    }

    get depth() {
        if (!this.parent) return 0;
        return this.parent.depth + 1;
    }
}


function renderLine(color, thickness = 10, lineCap = 'round') {
    return (node) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = lineCap;

        ctx.beginPath();
        ctx.moveTo(node.parent.visualPosition.x, node.parent.visualPosition.y);
        ctx.lineTo(node.visualPosition.x, node.visualPosition.y)
        ctx.stroke();
    };
};

function renderCircle(color, radius) {
    return (node) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.visualPosition.x, node.visualPosition.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
