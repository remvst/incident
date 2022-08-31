const w = window;

let can;
let ctx;

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

let inputMode = INPUT_MODE_MOUSE;
