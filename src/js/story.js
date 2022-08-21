fullScreenMessage = async (message) => {
    mouseDown = false;
    screen = new PromptScreen(message);
    await timeout(3);
    screen.message = [];
    await timeout(1);
}

fullScreenTimedMessage = (message) => {
    return fullScreenMessage([timeLabel(), message]);
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
    screen.resolveCondition = () => false;
    screen.instruction = null;
};

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
    tapeTime = 6 * 3600 + 24 * 60;
    timeouts = [];

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

            screen = new IntroScreen();
            await timeout(1);

            // Test stuff
            // {
            //     world.expand(999);
            //     // player.head.position.x = world.flamethrowerRoom.centerX;
            //     // player.head.position.y = world.flamethrowerRoom.centerY;

            //     // const securityTeam = spawnHumanGroup(SecurityDude, world.initialRoom.centerX, world.initialRoom.centerY, 1);
            //     const securityTeam = spawnHumanGroup(Intern, world.initialRoom.centerX, world.initialRoom.centerY, 5);
            //     await worldScreen(null, () => !world.hasAny(securityTeam));
            //     await timeout(999999);
            // }
            // {
            //     world.expand(4);
            //     player.head.position.x = world.longHallwayExit.centerX;
            //     player.head.position.y = world.longHallwayExit.centerY;

            //     const securityTeam = spawnHumanGroup(SecurityDude, world.securityRoom.centerX, world.securityRoom.centerY, 2);
            //     await fullScreenTimedMessage(nomangle(`Initial security team is dispatched`));
            //     await worldScreen(null, () => !world.hasAny(securityTeam));
            //     await timeout(2000);
            //     await fullScreenTimedMessage(nomangle(`Security team terminated by K-31`));
            //     world.expand(5);
            // }

            await fullScreenMessage(nomangle(['August 13th 2022', 'BIO13K research lab']));

            // Movement tutorial
            {
                await fullScreenTimedMessage(nomangle('Specimen K-31 escapes containment'));
                await worldScreen(nomangle('[Use mouse to move]'), () => player.travelledDistance > CELL_SIZE * 10);
                await timeout(2);
            }

            // Dash tutorial
            {
                await fullScreenTimedMessage(nomangle('Specimen K-31 demonstrates fast movement'));
                await worldScreen(nomangle('[Click to dash]'), () => player.dashDistance > CELL_SIZE * 10);
                await timeout(2);
            }

            // Janitors: learn to absorb
            {
                const janitors = spawnHumanGroup(Janitor, world.initialRoom.centerX, world.initialRoom.centerY, 2);
                await fullScreenTimedMessage(nomangle(`Janitorial team #${~~(Math.random() * 10)} encounters specimen`));
                await worldScreen(nomangle('Move towards humans to attack them'), () => !world.hasAny(janitors));
                await timeout(2);
                await fullScreenTimedMessage(nomangle(`K-31 starts showing absorption behavior`));
            }

            // Interns: absorb more
            {
                const interns = spawnHumanGroup(Intern, world.initialRoom.centerX, world.initialRoom.centerY, 2);
                await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} notice the incident`));
                await worldScreen(null, () => !world.hasAny(interns));
                await timeout(2);
                await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} removed from payroll`));
            }

            // Escape from initial room
            {
                world.expand(2);
                const target = world.add(world.lastRoom.asTarget);
                await fullScreenTimedMessage(nomangle(`K-31 escapes initial containment lab`));
                await worldScreen(null, () => !world.hasAny([target]));
                world.expand(3);

                // TODO spawn a bunch of randos
            }

            // Reach the security room
            {
                const target = world.add(world.longHallwayExit.asTarget);
                await worldScreen(null, () => !world.hasAny([target]));
            }

            // Security is dispatched
            {
                world.expand(4);
                const securityTeam = spawnHumanGroup(SecurityDude, world.securityRoom.centerX, world.securityRoom.centerY, 2);
                await fullScreenTimedMessage(nomangle(`Initial security team is dispatched`));
                await worldScreen(null, () => !world.hasAny(securityTeam));


                for (const sec of securityTeam) {
                    if (world.hasAny([sec])) {
                        console.log('still there');
                    }
                }
                
                console.log('KILLED EM')
                await timeout(2);
                await fullScreenTimedMessage(nomangle(`Security team terminated by K-31`));
            }

            // Progress through map
            {
                world.expand(5);
                await timeout(99999999);
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

timeLabel = () => {
    const decomposed = decomposeTime(tapeTime);
    return `${addZeroes(decomposed.hours, 2)}:${addZeroes(decomposed.minutes, 2)}`;
};

decomposeTime = () => {
    let time = tapeTime;
    const hours = ~~(time / 3600);
    time -= hours * 3600;
    const minutes = ~~(time / 60);
    time -= minutes * 60;
    const seconds = ~~time;
    time -= seconds;
    const milliseconds = time;
    return { hours, minutes, seconds, milliseconds };
}
