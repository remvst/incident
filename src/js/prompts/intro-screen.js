class IntroScreen extends Waitable {
    cycle() {

    }

    render() {
        if (Date.now() % 1000 < 500) {
            ctx.translate(0, rnd(-2, 2));
        }

        const t = ~~(Date.now() / (1000 / 50));

        ctx.fillStyle = '#0018b0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (Date.now() % 2000 > 500) {
            ctx.wrap(() => {
                ctx.font = '18pt Arial';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.fillText(nomangle('NO INPUT'), 20, 20);
            });
        }


        ctx.wrap(() => {
            ctx.font = 'bold 48pt Courier';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#000';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 8;
            ctx.fillText(nomangle('INCIDENT'), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 25);
            ctx.fillText(nomangle('AT BIO13K'), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25);
        });

        // Camera feed effects
        ctx.wrap(() => {
            // CRT overlay
            ctx.fillStyle = OVERLAY_PATTERN;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
            // Sweeping line
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.03;
            ctx.fillRect(0, (Date.now() % 10000 / 10000) * (CANVAS_HEIGHT + 200) - 200, CANVAS_WIDTH, 200);

            // Screen tearing
            ctx.globalAlpha = 1;
            if (Date.now() % 3000 < 200) {
                for (let y = 0 ; y < CANVAS_WIDTH ; y += 20) {
                    ctx.drawImage(
                        can, 
                        0, y, CANVAS_WIDTH, 10,
                        40, y, CANVAS_WIDTH, 10,
                    );
                }
            }
        });

        const x = ~~(sin(t) * 400);
        const y = ~~(cos(t) * 400);

        ctx.wrap(() => {
            ctx.translate(x, y);
            ctx.fillStyle = NOISE_PATTERN;
            ctx.fillRect(-x, -y, CANVAS_WIDTH, CANVAS_HEIGHT);
        });

        // ctx.font = '24pt Arial';
        // ctx.textAlign = 'left';
        // ctx.textBaseline = 'top';
        // ctx.fillStyle = '#0f0';
        // ctx.fillText('NO INPUT', 50, 50);
    }
}
