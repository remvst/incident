const touchPosition = {};
const touchStartPosition = {};
let hasTouchDown;

ontouchstart = (event) => {
    event.preventDefault();

    inputMode = INPUT_MODE_TOUCH;

    hasTouchDown = true;

    getEventPosition(event.touches[0], touchStartPosition);
    getEventPosition(event.touches[0], touchPosition);
};

ontouchmove = (event) => {
    event.preventDefault();
    getEventPosition(event.touches[0], touchPosition);
};

ontouchend = () => {
    hasTouchDown = false;
};
