
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

        this.centerX = (this.col + this.cols / 2) * CELL_SIZE;
        this.centerY = (this.row + this.rows / 2) * CELL_SIZE;

        for (let rowOffset = 0 ; rowOffset < rows ; rowOffset++) {
            for (let colOffset = 0 ; colOffset < cols ; colOffset++) {
                world.addFreeCell(row + rowOffset, col + colOffset)
            }
        }

        this.asTarget = new Target(row, col, rows, cols);

        world.lastRoom = this;
    }

    freeCells() {
        const cells = [];
        for (let rowOffset = 0 ; rowOffset < this.rows ; rowOffset++) {
            for (let colOffset = 0 ; colOffset < this.cols ; colOffset++) {
                if (!world.hasObstacle(this.row + rowOffset, this.col + colOffset)) {
                    cells.push([this.row + rowOffset, this.col + colOffset]);
                }
            }
        }
        return cells;
    }

    makeWall(row, col, rows, cols) {
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
                world.removeFreeCell(this.row + row + rowOffset, this.col + col + colOffset);
            }
        }
        return this;
    }

    makeWallWithSymetry(row, col, rows, cols) {
        return this.makeWall(row, col, rows, cols)
            .makeWall(row, this.cols - col, rows, -cols)
            .makeWall(col, row, cols, rows)
            .makeWall(this.rows - row, this.cols - col, -rows, -cols)
            .makeWall(this.cols - col, this.rows - row, -cols, -rows)
            .makeWall(this.rows - row, col, -rows, cols)
            .makeWall(col, this.rows - row, cols, -rows);
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

    spawnHumanGroup(humanType, count) {
        const freeCells = this.freeCells();
        if (!freeCells.length) {
            throw new Error('No cell to spawn at');
        }

        return world.addAllToBottom(mappable(count).map(() => {
            const [row, col] = pick(freeCells);
            const human = new humanType();
            human.head.position.x = (col + 0.5) * CELL_SIZE;
            human.head.position.y = (row + 0.5) * CELL_SIZE;
            human.head.cycle(0);
            human.head.realign();
            return human;
        }));
    };
}
