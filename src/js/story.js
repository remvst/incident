fullScreenMessage = (message) => {
    mouseDown = false;
    screen = new PromptScreen(message);
    return screen.wait();
}

fullScreenTimedMessage = (message) => {
    return fullScreenMessage(timeLabel() + message);
};

worldScreen = async (world) => {
    mouseDown = false;
    screen = world;
    await screen.wait();
    screen.instruction = null;
    await new Promise(r => setTimeout(r, 2000));
};

story = async () => {
    while (true) {
        try {
            world = new World();
            player = new Player();

            // TODO add initial screen with title and such

            await fullScreenMessage(nomangle('August 13th 2022 - BIO13K research lab'));
            await fullScreenTimedMessage(nomangle('Specimen BRT-379 escapes containment'));
            await worldScreen(new MovementTutorialWorld());
            await fullScreenTimedMessage(nomangle('Specimen BRT-379 demonstrates fast movement'));
            await worldScreen(new DashTutorialWorld());
            await fullScreenTimedMessage(nomangle(`Janitorial team #${~~(Math.random() * 10)} encounters specimen`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass janitors
            await fullScreenTimedMessage(nomangle(`Janitorial team #${~~(Math.random() * 10)}'s location unknown`));
            await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} notice the incident`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass interns
            await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} removed from payroll`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`BRT-379 escapes initial containment lab`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Security team is dispatched`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Security team terminated by specimen`));
            await fullScreenTimedMessage(nomangle(`BRT-379 starts navigating to upper lab floors`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Emergency response team dispatched`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Emergency team terminated by specimen`));
            await fullScreenTimedMessage(nomangle(`Specimen starts navigating to lab exit`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`BRT-379 location lost`));
            await fullScreenTimedMessage(nomangle(`Human casualties reported: 69`));
            await fullScreenTimedMessage(nomangle(`BIO13K CEO Andre Matur announces new round of hiring`));
        } catch (e) {
            await fullScreenTimedMessage(nomangle(`Specimen contained`));
            await fullScreenTimedMessage(nomangle(`Human casualties reported: 69`));
        }
    }
};
