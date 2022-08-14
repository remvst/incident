generateFromCanvas = (can, ctx) => {
    const grid = [];
    const imageData = ctx.getImageData(0, 0, can.width, can.height);

    for (let y = 0 ; y < can.height ; y++) {
        grid.push([]);
        for (let x = 0 ; x < can.width ; x++) {
            grid[y][x] = imageData.data[y * can.width * 4 + x * 4] > 0x80;
        }
    }

    return grid;
};

generateRandomWorld = () => createCanvas(50, 50, (ctx, can) => {
    ctx.fillStyle = '#fff';

    clearPath = (x1, y1, x2, y2) => {
        const distance = distP(x1, y1, x2, y2);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;

        let prevX = x1,
            prevY = y1;
        for (let d = 0 ; d <= distance ; d += 5) {
            const ratio = d / distance;
            const x = limit(0, x1 + (x2 - x1) * ratio + rnd(-0.1, 0.1) * distance, can.width);
            const y = limit(0, y1 + (y2 - y1) * ratio + rnd(-0.1, 0.1) * distance, can.height);
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();

            prevX = x;
            prevY = y;
        }
    };

    ctx.fillRect(0, 0, can.width, can.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(4, 4, 3, 3);

    for (let x = 1 ; x < can.width ; x += 10) {
        for (let y = 1 ; y < can.height ; y += 10) {

            w = rnd(4, 9);
            h = rnd(4, 9);

            ctx.fillRect(x, y, w, h);

            ctx.fillRect(x, ~~rnd(y, y + h - 2), 10, 2);
            ctx.fillRect( ~~rnd(x, x + w - 2), y, 2, 10);
        }
    }

    // Close the arena
    ctx.fillStyle = '#fff';
    const thickness = 3;
    ctx.fillRect(0, 0, can.width, thickness);
    ctx.fillRect(0, 0, thickness, can.height);
    ctx.fillRect(0, can.height - thickness, can.width, thickness);
    ctx.fillRect(can.width - thickness, 0, thickness, can.height);

    return generateFromCanvas(can, ctx);
});
