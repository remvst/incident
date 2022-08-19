class World extends Waitable {
    constructor() {
        super();
        this.elements = [];
        this.freeSpots = new Set();

        camera = new Camera();

        world = this;

        this.resolveCondition = () => false;
    }

    freePositionAround(x, y) {
        while (this.hasObstacleXY(x, y)) {
            x += CELL_SIZE;
            y += CELL_SIZE;
        }

        return {x, y};
    }

    addFreeCell(row, col) {
        this.freeSpots.add(`${row},${col}`);
    }

    hasObstacle(row, col) {
        return !this.freeSpots.has(`${row},${col}`);
    }

    hasObstacleXY(x, y) {
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
        return element;
    }

    addAll(elements) {
        elements.forEach(x => this.add(x));
        return elements;
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

        if (this.resolveCondition()) this.resolve();
    }

    render() {
        // Clear
        ctx.wrap(() => {
            ctx.translate(-camera.x, -camera.y);

            ctx.fillStyle = FLOOR_PATTERN;
            ctx.fillRect(camera.x, camera.y, CANVAS_WIDTH, CANVAS_HEIGHT);
    
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

        // Camera feed effects
        ctx.wrap(() => {
            ctx.fillStyle = OVERLAY_PATTERN;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, (Date.now() % 4000 / 4000) * CANVAS_HEIGHT, CANVAS_WIDTH, 1);

            ctx.globalAlpha = 1;
            if (Date.now() % 4000 < 200) {
                for (let y = 0 ; y < CANVAS_WIDTH ; y += 200) {
                    ctx.drawImage(
                        can, 
                        0, y, CANVAS_WIDTH, 100,
                        40, y, CANVAS_WIDTH, 100,
                    );
                }
            }

            ctx.globalAlpha = 1;
            ctx.font = '48pt Courier';
            
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            const t = new Date();
            ctx.fillText(`${addZeroes(t.getHours(), 2)}:${addZeroes(t.getMinutes(), 2)}:${addZeroes(t.getSeconds(), 2)}.${addZeroes(t.getMilliseconds(), 3)}`, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);

            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText('REC', 50, 50);

            ctx.fillRect(20, 20, 100, 4);
            ctx.fillRect(20, 20, 4, 100);

            ctx.fillRect(20, CANVAS_HEIGHT - 20, 100, -4);
            ctx.fillRect(20, CANVAS_HEIGHT - 20, 4, -100);

            ctx.fillRect(CANVAS_WIDTH - 20, 20, -100, 4);
            ctx.fillRect(CANVAS_WIDTH - 20, 20, -4, 100);

            ctx.fillRect(CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20, -100, -4);
            ctx.fillRect(CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20, -4, -100);

            if (this.instruction) {
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.font = '24pt Courier';
                ctx.fillText(this.instruction.toUpperCase(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200);
            }
        });
    }

    * renderableObstacles() {
        for (let rowOffset = -1 ; rowOffset < CANVAS_HEIGHT / CELL_SIZE + 1 ; rowOffset++) {
            for (let colOffset = -1 ; colOffset < CANVAS_WIDTH / CELL_SIZE + 1 ; colOffset++) {
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

    addObstaclesFromCanvas(can) {
        gridFromCanvas(can).forEach((rowValues, row) => {
            rowValues.forEach((cell, col) => {
                if (!cell) this.addFreeCell(row, col);
            });
        });
    }

    makeRoom(row, col, rows, cols) {
        if (rows < 0) {
            row += rows;
            rows *= -1;
        }
        if (cols < 0) {
            col += cols;
            cols *= -1;
        }

        for (let rowOffset = 0 ; rowOffset < rows ; rowOffset++) {
            for (let colOffset = 0 ; colOffset < cols ; colOffset++) {
                this.addFreeCell(row + rowOffset, col + colOffset)
            }
        }

        this.lastRoomAsTarget = new Target(row, col, rows, cols);
        this.lastMakeRoom = [row, col, rows, cols];
    }

    connectRoomRelative(connectRow, connectCol) { 
        const [previousRow, previousCol, previousRows, previousCols] = this.lastMakeRoom;

        this.makeRoom(
            previousRow + previousRows / 2 + (rowDirection * previousRows / 2),
        )
    }

    connectRight(rowOffset, rows, cols) {
        const [previousRow, previousCol, previousRows, previousCols] = this.lastMakeRoom;
        this.makeRoom(previousRow + rowOffset, previousCol + previousCols, rows, cols);
    }

    expand(roomCount) {
        const rooms = [() => {
            return new Room(-5, -5, 10, 10)
                .connectRight(5, 2, 1);

            // this.makeRoom(-5, -5, 10, 10);

            // this.connectRight(5, 2, 1);
            // this.makeRoom(0, 5, 2, 1);
        }, (initialRoom) => {
            const secondRoom = initialRoom.connectRight(-1, 15, 10);
            secondRoom.connectDown(2, 1, 2);
            secondRoom.connectLeft(7, 2, 1);
            secondRoom.connectUp(1, 1, 2).connectUp(0, 10, 10);
        }];
    
        let res;
        for (let i = 0 ; i < Math.min(roomCount, rooms.length) ; i++) {
            res = rooms[i](res);
        }
    }

    get hasHuman() {
        for (const element of this.elements) {
            if (element instanceof Human) {
                return true;
            }
        }
    }

    hasAny(elements) {
        for (const element of elements) {
            if (this.elements.indexOf(element) >= 0) {
                return true;
            }
        }
    }
}

class Room {
    constructor(row, col, rows, cols) {
        if (rows < 0) {
            row += rows;
            rows *= -1;
        }
        if (cols < 0) {
            col += cols;
            cols *= -1;
        }

        this.row = row;
        this.col = col;
        this.rows = rows;
        this.cols = cols;

        for (let rowOffset = 0 ; rowOffset < rows ; rowOffset++) {
            for (let colOffset = 0 ; colOffset < cols ; colOffset++) {
                world.addFreeCell(row + rowOffset, col + colOffset)
            }
        }
    }

    connectLeft(rowOffset, rows, cols) {
        return new Room(this.row + rowOffset, this.col - cols, rows, cols);
    }

    connectRight(rowOffset, rows, cols) {
        return new Room(this.row + rowOffset, this.col + this.cols, rows, cols);
    }

    connectUp(colOffset, rows, cols) {
        return new Room(this.row - rows, this.col + colOffset, rows, cols);
    }

    connectDown(colOffset, rows, cols) {
        return new Room(this.row + this.rows, this.col + colOffset, rows, cols);
    }
}
