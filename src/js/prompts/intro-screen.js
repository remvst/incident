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
            // this.message = [];
            this.clicked = true;
            setTimeout(() => this.resolve(), 1000);
        }
    }

    render() {
        crtPrerender();

        ctx.fillStyle = '#0018b0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // if (Date.now() % 2000 > 500) {
        //     ctx.wrap(() => {
        //         ctx.font = '36pt Arial';
        //         ctx.textAlign = 'left';
        //         ctx.textBaseline = 'top';
        //         ctx.fillStyle = '#fff';
        //         ctx.shadowColor = '#000';
        //         ctx.shadowOffsetX = 0;
        //         ctx.shadowOffsetY = 8;
        //         ctx.fillText(nomangle('NO INPUT'), 40, 40);
        //     });
        // }

        ctx.wrap(() => {
            ctx.font = nomangle('bold 96pt Courier');
            ctx.textAlign = nomangle('center');
            ctx.textBaseline = nomangle('middle');
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#000';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 16;

            let y = CANVAS_HEIGHT / 2 - this.message.length / 2 * 100;
            for (const line of this.message) {
                ctx.fillText(line, CANVAS_WIDTH / 2, y);
                 y += 100;
            }
        });

        if (!this.clicked) {
            ctx.wrap(() => {
                ctx.font = nomangle('24pt Courier');
                ctx.textAlign = nomangle('center');
                ctx.textBaseline = nomangle('bottom');
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.fillText(nomangle('[CLICK TO PLAY THE TAPE]'), CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
            });

            ctx.wrap(() => {
                ctx.font = nomangle('36pt Arial');
                ctx.textAlign = nomangle('left');
                ctx.textBaseline = nomangle('middle');
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 8;
                ctx.fillStyle = '#fff';
                ctx.fillRect(40, 40, 10, 50);
                ctx.fillRect(60, 40, 10, 50);
                ctx.fillText(nomangle('PAUSED'), 100, 65);
            });
        } else {
            ctx.wrap(() => {
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 8;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.moveTo(40, 40);
                ctx.lineTo(40, 90);
                ctx.lineTo(80, 65);
                ctx.fill();
            });
        }

        crtOverlay();

        // ctx.font = '24pt Arial';
        // ctx.textAlign = 'left';
        // ctx.textBaseline = 'top';
        // ctx.fillStyle = '#0f0';
        // ctx.fillText('NO INPUT', 50, 50);
    }
}
