class PromptScreen extends Waitable {
    constructor(message) {
        super();
        this.message = message;
        this.age = 0;
    }

    cycle(elapsed) {
        this.age += elapsed;

        if (mouseDown) {
            if (this.promptReady) {
                this.resolve();
            } else {
                this.age = 10;
            }
            mouseDown = false;
        }
    }

    get displayedMessage() {
        return this.message.slice(0, ~~(this.age * 20));
    }

    get promptReady()  {
        return this.displayedMessage === this.message;
    }

    render() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.font = nomangle('24pt Courier');
        ctx.textAlign = nomangle('left');
        ctx.textBaseline = nomangle('middle');

        ctx.fillStyle = '#fff';

        const textSize = ctx.measureText(this.message);
        const { displayedMessage } = this;
        ctx.fillText(displayedMessage, (CANVAS_WIDTH - textSize.width) / 2, CANVAS_HEIGHT / 2);

        if (this.promptReady) {
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('bottom');
            ctx.fillText(nomangle('[CLICK TO CONTINUE]'), CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
        }
    }
}
