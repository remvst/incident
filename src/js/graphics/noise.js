NOISE_PATTERN = createCanvasPattern(400, 400, (ctx) => {
    ctx.fillStyle = '#fff';

    for (let i = 0 ; i < 50 ; i++) {
        ctx.globalAlpha = random();

        const l = rnd(20, 50);
        ctx.fillRect(
            random() * (400 - l),
            random() * 400,
            l,
            2
        );
    }
});
