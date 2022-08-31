updateControls = () => {
    // Detect if the user is using a gamepad at all
    if (navigator.getGamepads && inputMode !== INPUT_MODE_GAMEPAD) {
        for (const gamepad of navigator.getGamepads()) {
            if (gamepad) {
                for (const button of gamepad.buttons) {
                    if (button.pressed) {
                        inputMode = INPUT_MODE_GAMEPAD;
                        break;
                    }
                }
            }
        }
    }

    if (inputMode === INPUT_MODE_MOUSE) {
        player.target.x = mousePosition.x + camera.x;
        player.target.y = mousePosition.y + camera.y;
        player.movementPower = mouseDown ? 1 : 1 / 4;
    } else if (inputMode === INPUT_MODE_TOUCH) {
        if (!hasTouchDown) {
            player.target.x = player.head.position.x;
            player.target.y = player.head.position.y;
        } else {
            const angle = angleBetween(touchStartPosition, touchPosition);
            const force = dist(touchStartPosition, touchPosition) / TOUCH_JOYSTICK_MAX_RADIUS;

            player.target.x = player.head.position.x + cos(angle) * force * 100;
            player.target.y = player.head.position.y + sin(angle) * force * 100;

            player.movementPower = force;
        }
    } else if (inputMode === INPUT_MODE_GAMEPAD) {
        for (const gamepad of navigator.getGamepads()) {
            if (gamepad) {
                const angle = atan2(gamepad.axes[1], gamepad.axes[0]);
                let force = distP(0, 0, gamepad.axes[0], gamepad.axes[1]) * 1 / 4;

                for (const button of gamepad.buttons) {
                    if (button.pressed) {
                        force = 1;
                        break;
                    }
                }

                player.target.x = player.head.position.x + cos(angle) * 100;
                player.target.y = player.head.position.y + sin(angle) * 100;

                player.movementPower = force;
            }
        }
    }
};

oncontextmenu = (event) => {
    mouseDown = false;
    event.preventDefault();
};
