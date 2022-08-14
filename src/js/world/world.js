class World {
    constructor() {
        this.elements = [];
        this.obstacles = new Set();

        generateRandomWorld().forEach((rowValues, row) => {
            rowValues.forEach((cell, col) => {
                if (cell) {
                    this.addObstacle(row, col);
                }
            });
        });

        world = this;

        player = new Player();
        player.head.position.x = player.head.position.y = 4 * CELL_SIZE;
        player.head.resolve();
        player.head.realign();
        this.add(player);

        for (let i = 0 ; i < 5 ; i++) {
            const testHuman = new Human();
            testHuman.head.position.x = testHuman.head.position.y = 6 * CELL_SIZE;
            testHuman.head.position.y += CELL_SIZE * i;
            testHuman.head.resolve();
            testHuman.head.realign();
            testHuman.target.x = testHuman.target.y = 6 * CELL_SIZE;
            testHuman.target.y += CELL_SIZE * i;
            this.add(testHuman);
        }
    }

    addObstacle(row, col) {
        this.obstacles.add(`${row},${col}`);
    }

    hasObstacle(row, col) {
        return this.obstacles.has(`${row},${col}`);
    }

    hasObstacleXY(x, y, radius) {
        return this.hasObstacle(Math.floor(y / CELL_SIZE), Math.floor(x / CELL_SIZE), 0);
    }

    readjust(x, y, radius) {
        const left = x - radius;
        const right = x + radius;
        const top = y - radius;
        const bottom = y + radius;

        const currentObstacle = this.hasObstacleXY(x, y);
        const leftObstacle = this.hasObstacleXY(left, y);
        const rightObstacle = this.hasObstacleXY(right, y);
        const topObstacle = this.hasObstacleXY(x, top);
        const bottomObstacle = this.hasObstacleXY(x, bottom);

        if (!currentObstacle && !leftObstacle && !rightObstacle && !topObstacle && !bottomObstacle) {
            return null;
        }

        const row = Math.floor(y / CELL_SIZE);
        const col = Math.floor(x / CELL_SIZE);

        const res = {'x': x, 'y': y};

        if (leftObstacle) {
            res.x = col * CELL_SIZE + radius;
        }

        if (rightObstacle) {
            res.x = (col + 1) * CELL_SIZE - radius;
        }

        if (topObstacle) {
            res.y = row * CELL_SIZE + radius;
        }

        if (bottomObstacle) {
            res.y = (row + 1) * CELL_SIZE - radius;
        }

        return res;
    }

    add(element) {
        this.elements.push(element);
    }

    addToBottom(element) {
        this.elements.unshift(element);
    }

    remove(element) {
        const index = this.elements.indexOf(element);
        if (index >= 0) this.elements.splice(index, 1);
    }

    cycle(elapsed) {
        for (const element of this.elements) {
            element.cycle(elapsed);
        }
        camera.cycle(elapsed);
    }

    render() {
        // Clear
        ctx.wrap(() => {
            ctx.translate(-camera.x, -camera.y);

            ctx.fillStyle = FLOOR_PATTERN;
            ctx.fillRect(camera.x, camera.y, can.width, can.height);
    
            for (const element of this.elements) {
                ctx.wrap(() => element.render());
            }

            // Obstacles sides
            ctx.fillStyle = '#111';
            for (const [row, col] of this.renderableObstacles()) {
                this.renderObstacleSides(row, col);
            }

            // Obstacle side outlines
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#666';
            for (const [row, col] of this.renderableObstacles()) {
                this.renderObstacleSides(row, col);
            }
            
            ctx.fillStyle = '#000';
            ctx.strokeStyle = 'rgba(255,255,255, 0.1)';
            ctx.strokeStyle = 'rgba(255,255,255, 0)';
            for (const [row, col] of this.renderableObstacles()) {
                this.renderObstacleTop(row, col);
            }
        });
    }

    * renderableObstacles() {
        for (let rowOffset = 0 ; rowOffset < CANVAS_HEIGHT / CELL_SIZE + 1 ; rowOffset++) {
            for (let colOffset = 0 ; colOffset < CANVAS_WIDTH / CELL_SIZE + 1 ; colOffset++) {
                const row = camera.minRow + rowOffset;
                const col = camera.minCol + colOffset;

                if (this.hasObstacle(row, col)) {
                    yield [row, col];
                }
            }
        }
    }

    renderObstacleSides(row, col) {
        const left = col * CELL_SIZE;
        const right = left + CELL_SIZE;
        const north = row * CELL_SIZE;
        const south = north + CELL_SIZE;

        const center = camera.center;

        // North wall
        if (!this.hasObstacle(row - 1, col) && north > center.y)
        this.fill3DShape(
            left, north, 0,
            right, north, 0,
            right, north, CELL_SIZE,
            left, north, CELL_SIZE,
        );

        // South wall
        if (!this.hasObstacle(row + 1, col) && south < center.y)
        this.fill3DShape(
            left, south, 0,
            right, south, 0,
            right, south, CELL_SIZE,
            left, south, CELL_SIZE,
        );

        // Left wall
        if (!this.hasObstacle(row, col - 1) && left > center.x)
        this.fill3DShape(
            left, north, 0,
            left, south, 0,
            left, south, CELL_SIZE,
            left, north, CELL_SIZE,
        );

        // Right wall
        if (!this.hasObstacle(row, col + 1) && right < center.x)
        this.fill3DShape(
            right, north, 0,
            right, south, 0,
            right, south, CELL_SIZE,
            right, north, CELL_SIZE,
        );
    }

    renderObstacleTop(row, col) {
        const left = col * CELL_SIZE;
        const right = left + CELL_SIZE;
        const north = row * CELL_SIZE;
        const south = north + CELL_SIZE;

        // Top
        this.fill3DShape(
            left, north, CELL_SIZE,
            right, north, CELL_SIZE,
            right, south, CELL_SIZE,
            left, south, CELL_SIZE,
        );
    }

    fill3DShape(...points) {
        ctx.beginPath();
        for (let i = 0 ; i < points.length ; i += 3) {
            const x = points[i + 0];
            const y = points[i + 1];
            const z = points[i + 2];

            const in2D = this.pointIn3DTo2D(x, y, z);
            ctx[i ? 'lineTo' : 'moveTo'](in2D.x, in2D.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    pointIn3DTo2D(x, y, z) {
        const angleFromCenter = atan2(y - camera.center.y, x - camera.center.x);
        const distanceFromCenter = distP(camera.center.x, camera.center.y, x, y);

        return {
            'x': x + Math.cos(angleFromCenter) * distanceFromCenter * z * 0.002,
            'y': y + Math.sin(angleFromCenter) * distanceFromCenter * z * 0.002,
        };

    }
}
