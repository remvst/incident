onmousemove = (e) => {
    const canvasRect = can.getBoundingClientRect();
    character.target.x = (e.pageX - canvasRect.left) / canvasRect.width * can.width;
    character.target.y = (e.pageY - canvasRect.top) / canvasRect.height * can.height
};

window.addEventListener('load', () => {
    can = document.querySelector('canvas');
    can.width = 800;
    can.height = 800;

    ctx = can.getContext('2d');

    character = new Character();
    frame();
});

let lastFrame = performance.now();

function frame() {
    const now = performance.now();
    const elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    character.cycle(elapsed);

    clear();
    character.render();

    requestAnimationFrame(frame);
}

function clear() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, can.width, can.height);
}

