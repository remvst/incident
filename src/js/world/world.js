class World {
    constructor() {
        this.elements = [];
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
    }

    render() {
        // Clear
        ctx.fillStyle = FLOOR_PATTERN;
        ctx.fillRect(0, 0, can.width, can.height);

        for (const element of this.elements) {
            element.render();
        }
    }
}
