mouseUpdate = () => {
    fastForward = DOWN[70];

    if (mouseDown) {
        tapePlaying = true;
    }

    if (player) {
        player.target.x = mousePosition.x + camera.x;
        player.target.y = mousePosition.y + camera.y;
        player.movementPower = mouseDown ? 1 : 1 / 4;
    }
};

touchUpdate = () => {
    fastForward = false;

    if (player) {
        if (!hasTouchDown) {
            player.target.x = player.head.position.x;
            player.target.y = player.head.position.y;
        } else {
            tapePlaying = true;

            const angle = angleBetween(touchStartPosition, touchPosition);
            const force = dist(touchStartPosition, touchPosition) / TOUCH_JOYSTICK_MAX_RADIUS;

            player.target.x = player.head.position.x + cos(angle) * force * 100;
            player.target.y = player.head.position.y + sin(angle) * force * 100;

            player.movementPower = force;
        }
    }
};

gamepadUpdate = () => {
    for (const gamepad of navigator.getGamepads()) {
        if (gamepad) {
            const angle = atan2(gamepad.axes[1], gamepad.axes[0]);
            let force = distP(0, 0, gamepad.axes[0], gamepad.axes[1]) * 1 / 4;
            if (gamepad.buttons[0] && gamepad.buttons[0].pressed) {
                force = 1;
            }

            if (player) {
                player.target.x = player.head.position.x + cos(angle) * 100;
                player.target.y = player.head.position.y + sin(angle) * 100;
                player.movementPower = force;
            }

            tapePlaying = gamepad.buttons[0] && gamepad.buttons[0].pressed;
            fastForward = gamepad.buttons[2] && gamepad.buttons[2].pressed;
        }
    }
};

updateControls = () => {
    // Detect if the user is using a gamepad at all
    if (navigator.getGamepads) {
        for (const gamepad of navigator.getGamepads()) {
            if (gamepad) {
                hasGamepad = true;

                for (const button of gamepad.buttons) {
                    if (button.pressed) {
                        inputMode = INPUT_MODE_GAMEPAD;
                        break;
                    }
                }
            }
        }
    }

    mapInput(
        mouseUpdate,
        touchUpdate,
        gamepadUpdate
    )();
};

oncontextmenu = (event) => {
    mouseDown = false;
    event.preventDefault();
};

mapInput = (
    mouseParam,
    touchParam,
    gamepadParam,
) => {
    switch (inputMode) {
    case INPUT_MODE_MOUSE: return mouseParam;
    case INPUT_MODE_TOUCH: return touchParam;
    case INPUT_MODE_GAMEPAD: return gamepadParam;
    }
};
