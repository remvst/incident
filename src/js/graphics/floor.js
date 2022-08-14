FLOOR_PATTERN = createCanvasPattern(50, 50, (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 50, 50);

    ctx.fillStyle = '#accceb';
    ctx.fillRect(1, 1, 48, 48);
});
