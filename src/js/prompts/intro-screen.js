class IntroScreen extends Waitable {

    constructor() {
        super();
        this.createdTime = Date.now();
    }

    cycle() {
    }

    render() {
        const realAge = (Date.now() - this.createdTime) / 1000;
        const ratio = min(1, realAge / 0.3);
        if (ratio > 0) {
            ctx.translate(0, sin(realAge * TWO_PI * 10) * CANVAS_HEIGHT * (1 - ratio));
            crtScreenTearing();
        }

        ctx.fillStyle = '#0018b0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.wrap(() => {
            ctx.font = nomangle('bold 48pt Courier');
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');

            const message = isInfiniteMode
                ? [nomangle('INFINITE MODE'), nomangle('BONUS TAPE')]
                : [nomangle('INCIDENT'), nomangle('AT BIO13K')];

            const subtitle = isInfiniteMode 
                ? nomangle('Coil subscribers only') 
                : nomangle('A confidential 13KB tape by @remvst');

            let y = CANVAS_HEIGHT / 2 - message.length / 2 * 50;
            for (const line of message) {
                ctx.fillStyle = '#000';
                ctx.fillText(line, CANVAS_WIDTH / 2, y + 8);

                ctx.fillStyle = '#fff';
                ctx.fillText(line, CANVAS_WIDTH / 2, y);

                y += 50;
            }

            ctx.font = nomangle('12pt Courier');
            ctx.fillStyle = '#000';

            ctx.fillText(subtitle, CANVAS_WIDTH / 2, y + 2);
            ctx.fillStyle = '#fff';
            ctx.fillText(subtitle, CANVAS_WIDTH / 2, y);

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
