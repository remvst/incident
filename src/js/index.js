isCoilSubscriber = () => {
    if (location.href.indexOf('iswearihavecoil') > 0) {
        return true;
    }
    document.monetization && document.monetization.state === nomangle('started');
};

onload = () => {
    can = document.querySelector('canvas');
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();
    gameLoop();
    frame();
};

onblur = () => {
    tapePlaying = false;
};

let lastFrame = performance.now();

frame = () => {
    const now = performance.now();
    let elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    fastForward = DOWN[70];

    if (fastForward || mouseDown) {
        tapePlaying = true;
    }

    if (fastForward) {
        elapsed *= 4;
    }

    if (tapePlaying) {
        tapeTime += elapsed;
    }

    cycleTimeouts();

    if (tapePlaying) {
        screen.cycle(elapsed);
    }

    ctx.wrap(() => {
        crtPrerender();

        ctx.wrap(() => screen.render());

        if (screen instanceof StaticScreen) {
            ctx.wrap(() => {
                ctx.font = nomangle('18pt Arial');
                ctx.textAlign = nomangle('left');
                ctx.textBaseline = nomangle('middle');
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;
                ctx.fillStyle = '#fff';
                // ctx.fillRect(20, 20, 5, 25);
                // ctx.fillRect(30, 20, 5, 25);
                ctx.fillText(nomangle('NO INPUT'), 20, 33);
            });
        } else if (fastForward) {
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
                ctx.textAlign = nomangle('left');
                ctx.textBaseline = nomangle('bottom');
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 2;
                // ctx.fillText(nomangle('[CLICK] PLAY THE TAPE'), CANVAS_WIDTH / 2, CANVAS_HEIGHT * 2 / 3);
                // ctx.fillText(nomangle('[F] FAST FORWARD'), CANVAS_WIDTH / 2, CANVAS_HEIGHT * 2 / 3 + 20);

                const messages = [
                    [nomangle('[CLICK]'), nomangle('PLAY THE TAPE')],
                    [nomangle('[F]'), nomangle('FAST FORWARD')],
                ]

                if (screen instanceof IntroScreen) {
                    const extra = [
                        nomangle('[I]'), 
                        isInfiniteMode
                            ? nomangle('STORY MODE')
                            : nomangle('INFINITE MODE (COIL ONLY)'),
                    ];
                    messages.push(extra);

                    extra.alpha = isCoilSubscriber() ? 1 : 0.5;
                }

                if (screen instanceof FinalScreen) {
                    messages.push([nomangle('[T]'), nomangle('TWEET YOUR RESULTS')]);
                }

                const maxTotalWidth = messages.reduce((acc, msg) => {
                    return max(acc, ctx.measureText(msg.slice(0, 2).join(' ')).width);
                }, 0)
                const maxFirstCol = messages.reduce((acc, [msg]) => {
                    return max(acc, ctx.measureText(msg).width);
                }, 0);

                let y = CANVAS_HEIGHT * 2 / 3;
                for (const line of messages) {
                    const startX = (CANVAS_WIDTH - maxTotalWidth) / 2;

                    ctx.fillStyle = line.color || '#fff';
                    ctx.globalAlpha = line.alpha || 1;
                    ctx.textAlign = nomangle('center');
                    ctx.fillText(line[0], startX, y);
                    ctx.textAlign = nomangle('left');
                    ctx.fillText(line[1], startX + maxFirstCol, y);

                    y += 20;
                }
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
