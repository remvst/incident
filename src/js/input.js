updateControls = () => {
    if (inputMode === INPUT_MODE_MOUSE) {
        player.target.x = mousePosition.x + camera.x;
        player.target.y = mousePosition.y + camera.y;
        player.movementPower = mouseDown ? 1 : 1 / 4;
    } else if (inputMode === INPUT_MODE_TOUCH) {
        if (!hasTouchDown) {
            console.log('go touch');
            player.target.x = player.head.position.x;
            player.target.y = player.head.position.y;
        } else {
            const angle = angleBetween(touchStartPosition, touchPosition);
            const force = dist(touchStartPosition, touchPosition) / TOUCH_JOYSTICK_MAX_RADIUS;

            player.target.x = player.head.position.x + cos(angle) * 100;
            player.target.y = player.head.position.y + sin(angle) * 100;

            player.movementPower = force;
        }
    } else if (inputMode === INPUT_MODE_GAMEPAD) {

    }
};

oncontextmenu = (event) => {
    mouseDown = false;
    event.preventDefault();
};
