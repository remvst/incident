FLOOR_PATTERN = createCanvasPattern(CELL_SIZE, CELL_SIZE, (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = '#accceb';
    ctx.fillRect(1, 1, CELL_SIZE - 2, CELL_SIZE - 2);
});
