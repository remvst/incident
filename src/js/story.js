fullScreenMessage = (message) => {
    mouseDown = false;
    screen = new PromptScreen(message);
    return screen.wait();
}

fullScreenTimedMessage = (message) => {
    return fullScreenMessage(timeLabel() + message);
};

worldScreen = async (
    instruction,
    resolveCondition,
) => {
    mouseDown = false;
    screen = world;
    world.instruction = instruction;
    world.resolveCondition = resolveCondition;
    player.resetMetrics();
    await screen.wait();
    screen.instruction = null;
};

wait = (x) => new Promise(r => setTimeout(r, x))

spawnHumanGroup = (humanType, centerX, centerY, count) => {
    return world.addAll(mappable(count).map((_, i) => {
        const angle = (i / count) * TWO_PI;

        const human = new humanType();
        human.head.position.x = centerX + Math.cos(angle) * CELL_SIZE * 2;
        human.head.position.y = centerY + Math.sin(angle) * CELL_SIZE * 2;
        human.head.resolve();
        human.head.realign();

        if (world.hasObstacleXY(human.head.position.x, human.head.position.y)) {
            console.warn('Human spawned in obstacle');
        }

        return human;
    }));
};

story = async () => {
    while (true) {
        try {
            world = new World();
            world.expand(1);

            player = new Player();
            player.head.position.x = 0;
            player.head.position.y = 0;
            player.head.resolve();
            player.head.realign();
            world.add(player);

            await (screen = new IntroScreen).wait();

            await fullScreenMessage(nomangle('August 13th 2022 - BIO13K research lab'));

            // Test stuff
            // {
            //     // const securityTeam = spawnHumanGroup(SecurityDude, world.initialRoom.centerX, world.initialRoom.centerY, 1);
            //     const securityTeam = spawnHumanGroup(Intern, world.initialRoom.centerX, world.initialRoom.centerY, 5);
            //     await worldScreen(nomangle('Use mouse to move'), () => !world.hasAny(securityTeam));
            //     await wait(9999);
            // }

            // Movement tutorial
            {
                await fullScreenTimedMessage(nomangle('Specimen K-31 escapes containment'));
                await worldScreen(nomangle('Use mouse to move'), () => player.travelledDistance > CELL_SIZE * 10);
                await wait(2000);
            }

            // Dash tutorial
            {
                await fullScreenTimedMessage(nomangle('Specimen K-31 demonstrates fast movement'));
                await worldScreen(nomangle('Click to dash'), () => player.dashDistance > CELL_SIZE * 10);
                await wait(2000);
            }

            // Janitors: learn to absorb
            {
                const janitors = spawnHumanGroup(Janitor, world.initialRoom.centerX, world.initialRoom.centerY, 2);
                await fullScreenTimedMessage(nomangle(`Janitorial team #${~~(Math.random() * 10)} encounters specimen`));
                await worldScreen(nomangle('Move towards humans to attack them'), () => !world.hasAny(janitors));
                await wait(2000);
                await fullScreenTimedMessage(nomangle(`K-31 starts showing absorption behavior`));
            }

            // Interns: absorb more
            {
                const interns = spawnHumanGroup(Intern, world.initialRoom.centerX, world.initialRoom.centerY, 2);
                await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} notice the incident`));
                await worldScreen(null, () => !world.hasAny(interns));
                await wait(2000);
                await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} removed from payroll`));
            }

            // Escape from initial room
            {
                world.expand(2);
                const target = world.add(world.lastRoom.asTarget);
                await fullScreenTimedMessage(nomangle(`K-31 escapes initial containment lab`));
                await worldScreen(null, () => !world.hasAny([target]));
                world.expand(3);
                await wait(999999);
            }

            continue;

            // await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Security team is dispatched`));
            // await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Security team terminated by specimen`));
            await fullScreenTimedMessage(nomangle(`K-31 starts navigating to upper lab floors`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Emergency response team dispatched`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`Emergency team terminated by specimen`));
            await fullScreenTimedMessage(nomangle(`Specimen starts navigating to lab exit`));
            await worldScreen(new AttackTutorialWorld()); // TODO pass target tutorial
            await fullScreenTimedMessage(nomangle(`K-31 location lost`));
            await fullScreenTimedMessage(nomangle(`Human casualties reported: 69`));
            await fullScreenTimedMessage(nomangle(`BIO13K CEO Andre Matur announces new round of hiring`));
        } catch (e) {
            console.error(e);
            await fullScreenTimedMessage(nomangle(`Specimen contained`));
            await fullScreenTimedMessage(nomangle(`Human casualties reported: 69`));
        }
    }
};

mappable = size => Array(size).fill(0);
