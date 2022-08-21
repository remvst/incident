FLOOR_PATTERN = createCanvasPattern(CELL_SIZE, CELL_SIZE, (ctx) => {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = '#222';
    ctx.fillRect(1, 1, CELL_SIZE - 2, CELL_SIZE - 2);
});
