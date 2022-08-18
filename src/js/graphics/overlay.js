OVERLAY_PATTERN = createCanvasPattern(1, 2, (ctx) => {
    ctx.globalAlpha = 0.2;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1, 1);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 1, 1, 1);
});
