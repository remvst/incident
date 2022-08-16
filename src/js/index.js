window.addEventListener('load', () => {
    can = document.querySelector('canvas');
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();

    world = new World();
    camera = new Camera();

    frame();
});

let lastFrame = performance.now();

function frame() {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    world.cycle(elapsed);
    world.render();

    requestAnimationFrame(frame);
}

