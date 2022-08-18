fullScreenMessage = (message) => {
    screen = new PromptScreen(message);
    return screen.wait();
}

fullScreenTimedMessage = (message) => {
    return fullScreenMessage(timeLabel() + message);
};

worldScreen = world => {
    screen = world;
    return screen.wait();
};

story = async () => {
    while (true) {
        try {
            await fullScreenMessage(nomangle('August 13th 2022 - BIO13K research lab'));
            await fullScreenTimedMessage(nomangle('Specimen BRT-379 escapes containment'));
            await worldScreen(new MovementTutorialWorld());
            await fullScreenTimedMessage(nomangle('Specimen BRT-379 demonstrates dashing capabilities'));
            await worldScreen(new DashTutorialWorld());
            await fullScreenTimedMessage(nomangle(`Janitorial team #${~~(Math.random() * 10)} encounters specimen`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass janitors
            await fullScreenTimedMessage(nomangle(`Janitorial team #${~~(Math.random() * 10)}'s location unknown`));
            await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} notice the incident`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass interns
            await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} removed from payroll`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Specimen escapes initial containment lab`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Security team is dispatched dispatched`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Security team terminated by specimen`));
            await fullScreenTimedMessage(nomangle(`Specimen starts navigating to upper lab floors`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Emergency response team dispatched`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Emergency team terminated by specimen`));
            await fullScreenTimedMessage(nomangle(`Specimen starts navigating to lab exit`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Specimen location lost`));
            await fullScreenTimedMessage(nomangle(`BIO13K CEO Andre Matur announces new round of hiring`));
        } catch (e) {
            await fullScreenTimedMessage(nomangle(`Specimen contained`));
        }
    }
};
