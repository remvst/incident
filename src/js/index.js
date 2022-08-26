window.addEventListener('load', () => {
    can = document.querySelector('canvas');
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();
    story();
    frame();
});

let lastFrame = performance.now();

frame = () => {
    const now = performance.now();
    let elapsed = Math.min((now - lastFrame) / 1000, 1 / 30);
    lastFrame = now;

    fastForward = DOWN[70];

    if (fastForward) {
        tapePlaying = true;
    }

    if (fastForward) {
        elapsed *= 4;
    }

    if (tapePlaying) {
        tapeTime += elapsed;
    }

    cycleTimeouts();

    screen.cycle(elapsed);
    ctx.wrap(() => {
        crtPrerender();

        ctx.wrap(() => screen.render());

        if (fastForward) {
            ctx.wrap(() => {
                ctx.translate(CANVAS_WIDTH - 80, 50);
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 25);
                ctx.lineTo(20, 12);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(20, 0);
                ctx.lineTo(20, 25);
                ctx.lineTo(40, 12);
                ctx.fill();
            });
        } else if (tapePlaying) {
            if (screen instanceof IntroScreen) {
                ctx.wrap(() => {
                    ctx.translate(20, 20);
                    ctx.shadowColor = '#000';
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 4;
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, 25);
                    ctx.lineTo(20, 12);
                    ctx.fill();
                });
            }
        } else {
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
        }

        if (fastForward) {
            crtLineGlitch(CANVAS_HEIGHT / 3);
            crtLineGlitch(CANVAS_HEIGHT * 2 / 3);
        }

        crtOverlay();
    });

    if (DEBUG) {
        ctx.fillStyle = '#fff';
        ctx.textAlign = nomangle('right');
        ctx.textBaseline = nomangle('top');
        ctx.font = nomangle('24pt Arial');
        ctx.fillText(~~(1 / elapsed), CANVAS_WIDTH - 10, 10);
    }

    requestAnimationFrame(frame);
}
