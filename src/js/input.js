updateControls = () => {
    if (inputMode === INPUT_MODE_MOUSE) {
        player.target.x = mousePosition.x + camera.x;
        player.target.y = mousePosition.y + camera.y;
        player.dashing = mouseDown;
    } else if (inputMode === INPUT_MODE_TOUCH) {
        if (!hasTouchDown) {
            player.target.x = player.head.position.x;
            player.target.y = player.head.position.y;
        } else {
            const angle = angleBetween(touchStartPosition, touchPosition);
            const force = dist(touchStartPosition, touchPosition);
            const extraForceRatio = limit(0, (dist(touchStartPosition, touchPosition) - TOUCH_JOYSTICK_RADIUS) / (TOUCH_JOYSTICK_MAX_RADIUS - TOUCH_JOYSTICK_RADIUS), 1);

            player.target.x = player.head.position.x + cos(angle) * force * 100;
            player.target.y = player.head.position.y + sin(angle) * force * 100;

            player.dashing = extraForceRatio > 0.5;
        }
    } else if (inputMode === INPUT_MODE_GAMEPAD) {

    }
};
