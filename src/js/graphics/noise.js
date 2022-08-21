NOISE_PATTERN = createCanvasPattern(400, 400, (ctx) => {
    ctx.fillStyle = '#fff';

    for (let i = 0 ; i < 50 ; i++) {
        ctx.globalAlpha = random() * 0.1;

        const l = rnd(40, 100);
        ctx.fillRect(
            random() * (400 - l),
            random() * 400,
            l,
            2
        );
    }
});
