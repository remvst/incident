onmousemove = (e) => {
    const canvasRect = can.getBoundingClientRect();
    player.target.x = (e.pageX - canvasRect.left) / canvasRect.width * can.width;
    player.target.y = (e.pageY - canvasRect.top) / canvasRect.height * can.height
};

window.addEventListener('load', () => {
    can = document.querySelector('canvas');
    can.width = 800;
    can.height = 800;

    ctx = can.getContext('2d');

    world = new World();
    world.add(player = new Character());

    frame();
});

let lastFrame = performance.now();

function frame() {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    world.cycle(elapsed);

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, can.width, can.height);

    // Render
    world.render();

    requestAnimationFrame(frame);
}

