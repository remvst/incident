window.addEventListener('load', () => {
    can = document.querySelector('canvas');
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();

    // screen = new PromptScreen(
    //     nomangle('On August 13th 2022, research facility BIOTHIRTEEN experienced a biohazard incident'),
    // );

    story();

    frame();
});

let lastFrame = performance.now();

frame = () => {
    const now = performance.now();
    const elapsed = Math.min((now - lastFrame) / 1000, 1 / 30);
    lastFrame = now;

    screen.cycle(elapsed);
    ctx.wrap(() => screen.render());

    requestAnimationFrame(frame);
}

timeLabel = () => {
    const t = new Date();
    return `${addZeroes(t.getHours(), 2)}:${addZeroes(t.getMinutes(), 2)} - `;
};
