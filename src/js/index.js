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
            crtLineGlitch(CANVAS_HEIGHT / 3);
            crtLineGlitch(CANVAS_HEIGHT * 2 / 3);
            // crtLineGlitch(CANVAS_HEIGHT / 2);
            // crtLineGlitch(CANVAS_HEIGHT * 3 / 4);
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
