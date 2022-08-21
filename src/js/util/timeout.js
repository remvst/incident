timeouts = [];

timeout = (delay) => {
    return new Promise((resolve) => {
        timeouts.push({
            resolve,
            tapeTime: tapeTime + delay,
        });
        timeouts.sort((a, b) => a.tapeTime - b.tapeTime);
    });
}

cycleTimeouts = () => {
    while (timeouts.length && timeouts[0].tapeTime < tapeTime) {
        const timeout = timeouts.shift();
        timeout.resolve();
    }
}
