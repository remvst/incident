onmousemove = (e) => {
    const canvasRect = can.getBoundingClientRect();
    mousePosition.x = (e.pageX - canvasRect.left) / canvasRect.width * can.width;
    mousePosition.y = (e.pageY - canvasRect.top) / canvasRect.height * can.height;
};

onmousedown = () => mouseDown = true;
onmouseup = () => mouseDown = false;
