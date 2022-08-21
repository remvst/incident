class IntroScreen extends Waitable {

    constructor() {
        super();
        this.message = [
            nomangle('INCIDENT'),
            nomangle('AT BIO13K'),
        ];
    }

    cycle() {
        if (mouseDown) {
            tapePlaying = true;
        }
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
        });

        if (!tapePlaying) {
            ctx.wrap(() => {
                ctx.font = nomangle('12pt Courier');
                ctx.textAlign = nomangle('center');
                ctx.textBaseline = nomangle('bottom');
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.fillText(nomangle('[CLICK TO PLAY THE TAPE]'), CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
            });

            ctx.wrap(() => {
                ctx.font = nomangle('18pt Arial');
                ctx.textAlign = nomangle('left');
                ctx.textBaseline = nomangle('middle');
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.fillStyle = '#fff';
                ctx.fillRect(20, 20, 5, 25);
                ctx.fillRect(30, 20, 5, 25);
                ctx.fillText(nomangle('PAUSED'), 50, 33);
            });

            // ctx.drawImage(PAUSE_ICON, 0, 0);
        } else {
            ctx.wrap(() => {
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.moveTo(20, 20);
                ctx.lineTo(20, 45);
                ctx.lineTo(40, 32);
                ctx.fill();
            });
        }
    }
}
