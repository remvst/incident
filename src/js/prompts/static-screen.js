STATIC_PATTERN = createCanvasPattern(100, 100, (ctx) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = '#fff';
    for (let x = 0 ; x < 100 ; x++) {
        for (let y = 0 ; y < 100 ; y++) {
            ctx.globalAlpha = random();
            ctx.fillRect(x, y, 1, 1);
        }
    }
});

class StaticScreen extends Waitable {
    constructor() {
        super();
    }

    cycle() {

    }

    render() {
        ctx.fillStyle = '#0018b0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = STATIC_PATTERN;

        const scale = 4;
        ctx.wrap(() => {
            const x = ~~(random() * 100);
            const y = ~~(random() * 100);

            ctx.scale(4, 4);
            ctx.translate(x, y);
            ctx.fillRect(-x, -y, CANVAS_WIDTH / scale, CANVAS_HEIGHT / scale);
        })
    }
}
