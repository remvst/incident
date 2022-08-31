const DOWN = {};
onkeydown = e => {
    DOWN[e.keyCode] = true;

    if (screen instanceof StaticScreen) {
        return;
    }

    if (e.keyCode === 27 || e.keyCode === 80) {
        tapePlaying = !tapePlaying;
    }

    if (e.keyCode === 84 && screen instanceof FinalScreen) {
        const prefix = escaped 
            ? nomangle('I helped K-31 escape the lab by ')
            : nomangle('I caused K-31 to be contained by ')
        tweet(prefix + formatTimeShort(tapeTime));
    }

    if (e.keyCode === 73 && screen instanceof IntroScreen && !tapePlaying) {
        if (!isCoilSubscriber()) {
            alert(nomangle('This feature is only available to coil subscribers'));
            return;
        }

        screen = new StaticScreen();
        isInfiniteMode = !isInfiniteMode;
        setTimeout(() => {
            screen = new IntroScreen();
        }, 1000);
    }
};

onkeyup = e => DOWN[e.keyCode] = false;
