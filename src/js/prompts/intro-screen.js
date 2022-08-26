class IntroScreen extends Waitable {

    constructor() {
        super();
        this.message = [
            nomangle('INCIDENT'),
            nomangle('AT BIO13K'),
        ];
    }

    cycle() {
    }

    render() {
        ctx.fillStyle = '#0018b0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.wrap(() => {
            ctx.font = nomangle('bold 48pt Courier');
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');

            let y = CANVAS_HEIGHT / 2 - this.message.length / 2 * 50;
            for (const line of this.message) {
                ctx.fillStyle = '#000';
                ctx.fillText(line, CANVAS_WIDTH / 2, y + 8);

                ctx.fillStyle = '#fff';
                ctx.fillText(line, CANVAS_WIDTH / 2, y);

                y += 50;
            }

            ctx.font = nomangle('12pt Courier');
            ctx.fillStyle = '#000';
            ctx.fillText(nomangle('by @remvst'), CANVAS_WIDTH / 2, y + 2);
            ctx.fillStyle = '#fff';
            ctx.fillText(nomangle('by @remvst'), CANVAS_WIDTH / 2, y);

            const bestEscape = parseFloat(localStorage['BEST_ESCAPE_KEY']);
            const bestEscapeToString = isNaN(bestEscape) ? nomangle('no recorded escape') : formatTimeShort(bestEscape);
            const bestEscapeLabel = nomangle('Fastest escape: ') + bestEscapeToString

            ctx.font = nomangle('8pt Courier');
            ctx.textAlign = nomangle('left');
            ctx.textBaseline = nomangle('bottom');
            ctx.fillStyle = '#000';
            ctx.fillText(bestEscapeLabel, 10, CANVAS_HEIGHT - 10 + 2);
            ctx.fillStyle = '#fff';
            ctx.fillText(bestEscapeLabel, 10, CANVAS_HEIGHT - 10);
        });
    }
}
