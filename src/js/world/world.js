class World {
    constructor() {
        this.elements = [];
        this.obstacles = new Set();

        for (let i = 0 ; i < 10 ; i++) {
            this.addObstacle(1, i);
        }
    }

    addObstacle(row, col) {
        this.obstacles.add(`${row},${col}`);
    }

    hasObstacle(row, col) {
        return this.obstacles.has(`${row},${col}`);
    }

    add(element) {
        this.elements.push(element);
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

            // Obstacles
            for (let rowOffset = 0 ; rowOffset < CANVAS_HEIGHT / CELL_SIZE ; rowOffset++) {
                for (let colOffset = 0 ; colOffset < CANVAS_WIDTH / CELL_SIZE ; colOffset++) {
                    const row = camera.minRow + rowOffset;
                    const col = camera.minCol + colOffset;

                    if (this.hasObstacle(row, col)) this.renderObstacle(row, col);
    
                    // console.log('obst');
                }
            }
    
            for (const element of this.elements) {
                element.render();
            }
        });
    }

    renderObstacle(row, col) {
        ctx.fillStyle = '#000';
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}
