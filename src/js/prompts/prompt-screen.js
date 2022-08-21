class PromptScreen extends Waitable {
    constructor(message) {
        super();
        this.message = message;
    }

    cycle() {
        
    }

    render() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.wrap(() => {
            ctx.font = nomangle('18pt Courier');
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');
            ctx.fillStyle = '#fff';

            let y = CANVAS_HEIGHT / 2 - this.message.length / 2 * 30;
            for (const line of this.message) {
                ctx.fillText(line, CANVAS_WIDTH / 2, y);
                 y += 30;
            }
        });
    }
}
