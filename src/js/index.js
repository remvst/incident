onmousemove = (e) => {
    const canvasRect = can.getBoundingClientRect();
    player.target.x = (e.pageX - canvasRect.left) / canvasRect.width * can.width + camera.x;
    player.target.y = (e.pageY - canvasRect.top) / canvasRect.height * can.height + camera.y;
};

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

