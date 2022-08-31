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

        ctx.fillStyle = isInfiniteMode ? '#008000' : '#0018b0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.wrap(() => {
            ctx.font = nomangle('bold 48pt Courier');
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');

            const message = isInfiniteMode
                ? [nomangle('INFINITE MODE'), nomangle('BONUS TAPE')]
                : [nomangle('INCIDENT'), nomangle('AT BIO13K')];

            const subtitle = isInfiniteMode 
                ? nomangle('Confidential - for Coil subscribers only') 
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
        });

        ctx.wrap(() => {
            const bestEscape = parseFloat(localStorage['BEST_ESCAPE_KEY']);

            ctx.font = nomangle('8pt Courier');
            ctx.textAlign = nomangle('left');
            ctx.textBaseline = nomangle('bottom');
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#000';
            ctx.shadowOffsetY = 2;
            ctx.fillText(
                nomangle('Fastest escape: ') + (
                    isNaN(bestEscape) 
                        ? nomangle('none yet') 
                        : formatTimeShort(bestEscape)
                ), 
                10, 
                CANVAS_HEIGHT - 10
            );

            ctx.textAlign = nomangle('right');
            ctx.fillText(
                hasGamepad
                    ? nomangle('Gamepad detected')
                    : nomangle('No gamepad detected'), 
                CANVAS_WIDTH - 10, 
                CANVAS_HEIGHT - 10,
            );
        });
    }
}
