class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.center = {'x': 0, 'y': 0};
    }

    get minRow() {
        return ~~(this.y / CELL_SIZE);
    }

    get minCol() {
        return ~~(this.x / CELL_SIZE);
    }

    cycle(elapsed) {
        const target = player ? {
            'x': player.head.position.x - CANVAS_WIDTH / 2,
            'y': player.head.position.y - CANVAS_HEIGHT / 2,
        } : {
            'x': 0,
            'y': 0,
        };

        const distanceToTarget = dist(target, this),
            speed = max(1, distanceToTarget / 0.2),
            angle = atan2(target.y - this.y, target.x - this.x),
            appliedDist = min(speed * elapsed, distanceToTarget);

        this.x += cos(angle) * appliedDist;
        this.y += sin(angle) * appliedDist;

        this.center.x = camera.x + CANVAS_WIDTH / 2;
        this.center.y = camera.y + CANVAS_HEIGHT / 2;
    }
}
