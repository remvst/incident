class PromptScreen extends Waitable {
    constructor(message) {
        super();
        this.message = message;
        this.age = 0;
    }

    cycle(elapsed) {
        this.age += elapsed;

        if (this.message.length && this.age > 3) {
            this.message = '';
            setTimeout(() => this.resolve(), 1000);
        }
    }

    get displayedMessage() {
        return this.message.slice(0, ~~(this.age * 20));
    }

    render() {
        crtPrerender();

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#fff';
        ctx.textAlign = nomangle('left');
        ctx.textBaseline = nomangle('middle');
        ctx.font = nomangle('36pt Courier');

        ctx.wrap(() => {
            ctx.font = nomangle('36pt Courier');
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#000';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 16;

            let y = CANVAS_HEIGHT / 2 - this.message.length / 2 * 60;
            for (const line of this.message) {
                ctx.fillText(line, CANVAS_WIDTH / 2, y);
                 y += 60;
            }
        });

        crtOverlay();
    }
}
