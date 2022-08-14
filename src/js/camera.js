class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    get minRow() {
        return ~~(this.y / CELL_SIZE);
    }

    get minCol() {
        return ~~(this.x / CELL_SIZE);
    }

    cycle(elapsed) {
        // TODO
    }
}
