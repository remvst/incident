GRADIENT_OVERLAY = createCanvas(CANVAS_HEIGHT, CANVAS_HEIGHT, (ctx, can) => {
    const grad = ctx.createRadialGradient(
        can.width / 2, can.height / 2, 0,
        can.width / 2, can.height / 2, can.width,
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, can.width, can.height);
});

crtPrerender = () => {
    if (Date.now() % 1000 < 500) {
        ctx.translate(0, rnd(-1, 1));
    }
};

crtOverlay = () => {
    const t = ~~(Date.now() / (1000 / 50));

    // Camera feed effects
    ctx.wrap(() => {
        // CRT overlay
        ctx.fillStyle = OVERLAY_PATTERN;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Sweeping line
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.03;
        ctx.fillRect(0, (Date.now() % 10000 / 10000) * (CANVAS_HEIGHT + 150) - 150, CANVAS_WIDTH, 150);

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

    for (let offY = 0 ; offY < 2 ; offY++) {
        for (let i = 0 ; i < 25 ; i++) {
            const x = random() * 400;
            const y = random() * 400;
            ctx.wrap(() => {
                ctx.translate(x, y + offY);
                ctx.fillStyle = NOISE_PATTERN;
                ctx.fillRect(-x, -y, CANVAS_WIDTH, 4);
            });
        }
    }

    ctx.drawImage(
        GRADIENT_OVERLAY, 
        0, 0, GRADIENT_OVERLAY.width, GRADIENT_OVERLAY.height,
        0, 0, CANVAS_WIDTH, CANVAS_HEIGHT,
    );
}
