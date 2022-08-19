NOISE_PIXEL_SIZE = 4;

// NOISE_PATTERN = createCanvasPattern(400, 400, (ctx) => {
//     ctx.fillStyle = '#000';
//     ctx.fillRect(0, 0, 400, 400);

//     ctx.fillStyle = '#fff';
//     for (let x = 0 ; x < 400 ; x += NOISE_PIXEL_SIZE) {
//         for (let y = 0 ; y < 400 ; y += NOISE_PIXEL_SIZE) {
//             ctx.globalAlpha = random() * 0.5;
//             ctx.fillRect(x, y, NOISE_PIXEL_SIZE, NOISE_PIXEL_SIZE);
//         }
//     }
// });

NOISE_PATTERN = createCanvasPattern(400, 400, (ctx) => {
    ctx.fillStyle = '#fff';

    for (let i = 0 ; i < 50 ; i++) {
        ctx.globalAlpha = random() * 0.5;

        const l = rnd(20, 50);
        ctx.fillRect(
            random() * (400 - l),
            random() * 400,
            l,
            1
        );
    }
});
