onmousemove = (e) => {
    const canvasRect = can.getBoundingClientRect();
    mousePosition.x = (e.pageX - canvasRect.left) / canvasRect.width * CANVAS_WIDTH;
    mousePosition.y = (e.pageY - canvasRect.top) / canvasRect.height * CANVAS_HEIGHT;
};

onmousedown = () => mouseDown = true;
onmouseup = () => mouseDown = false;
