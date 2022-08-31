getEventPosition = (event, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (event.pageX - canvasRect.left) / canvasRect.width * CANVAS_WIDTH;
    out.y = (event.pageY - canvasRect.top) / canvasRect.height * CANVAS_HEIGHT;
}

onmousemove = (event) => {
    inputMode = INPUT_MODE_MOUSE;
    getEventPosition(event, mousePosition);
};
onmousedown = () => {
    inputMode = INPUT_MODE_MOUSE;
    mouseDown = document.hasFocus();
}
onmouseup = () => mouseDown = false;
