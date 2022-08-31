const touchPosition = {};
const touchStartPosition = {};
let hasTouchDown;

ontouchstart = (event) => {
    event.preventDefault();

    inputMode = INPUT_MODE_TOUCH;

    hasTouchDown = true;

    touchStartPosition.x = touchPosition.x = event.touches[0].pageX;
    touchStartPosition.y = touchPosition.y = event.touches[0].pageY;
};

ontouchmove = (event) => {
    event.preventDefault();
    touchPosition.x = event.touches[0].pageX;
    touchPosition.y = event.touches[0].pageY;
};

ontouchend = (event) => {
    event.preventDefault();
    hasTouchDown = false;
};
