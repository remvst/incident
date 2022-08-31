const w = window;

let can;
let ctx;

let joystickCan;
let joystickCtx;

let camera;
let world;
let player;

let screen;

let fastForward;
let tapePlaying;
let tapeTime = 0;

let isInfiniteMode;

let escaped = false;

const mousePosition = {'x': 0, 'y': 0};
let mouseDown;

let hasGamepad;

let inputMode = navigator.userAgent.match(nomangle(/andro|ipho|ipa|ipo/i)) ? INPUT_MODE_TOUCH : INPUT_MODE_MOUSE;
