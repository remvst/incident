const DOWN = {};
onkeydown = e => {
    DOWN[e.keyCode] = true;

    if (e.keyCode === 27 || e.keyCode === 80) {
        tapePlaying = !tapePlaying;
    }
};

onkeyup = e => DOWN[e.keyCode] = false;
