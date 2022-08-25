fullScreenMessage = async (message) => {
    mouseDown = false;
    screen = new PromptScreen(message);
    await timeout(3);
    screen.message = [];
    await timeout(1);
}

fullScreenTimedMessage = (message) => {
    tapeTime += 60 * 2;
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

            camera.cycle(10);

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
            //     world.expand(99);
            //     player.head.position.x = world.lastRoom.centerX;
            //     player.head.position.y = world.lastRoom.centerY;
            //     // world.initialRoom.spawnHumanGroup(FireDude, 3);
            //     await worldScreen(null, () => false);
            //     await timeout(9999999);
            // }

            await fullScreenMessage(nomangle(['August 13th 2022', 'BIO13K research lab']));

            // Movement tutorial
            {
                await fullScreenTimedMessage(nomangle('Specimen K-31 is held in containment'));
                await worldScreen(nomangle('Use mouse to move'), () => player.travelledDistance > CELL_SIZE * 10);
                await timeout(2);
            }

            // Escape containment
            {
                world.expand(2);
                const target = world.add(world.containmentRoomExit.asTarget);
                await fullScreenTimedMessage(nomangle('K-31 escapes containment cell'));
                await worldScreen(null, () => !world.hasAny([target]));
                world.expand(3);
                await timeout(2);
            }

            // Janitors: learn to absorb
            {
                const janitors = world.initialRoom.spawnHumanGroup(Janitor, 2);
                await fullScreenTimedMessage(nomangle(`Janitorial team #${~~(Math.random() * 10)} encounters specimen`));
                await worldScreen(nomangle('Move towards humans to interact with them'), () => !world.hasAny(janitors));
                await timeout(2);
                await fullScreenTimedMessage(nomangle(`K-31 shows significant increase in body mass`));
            }

            // Dash tutorial
            {
                await fullScreenTimedMessage(nomangle('K-31 starts showing faster movement'));
                await worldScreen(nomangle('Hold click to dash'), () => player.dashDistance > CELL_SIZE * 10);
                await timeout(2);
            }

            // Interns: absorb more
            {
                const interns = world.initialRoom.spawnHumanGroup(Intern, 2);
                await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} notice the incident`));
                await worldScreen(null, () => !world.hasAny(interns));
                await timeout(2);
                await fullScreenTimedMessage(nomangle(`Interns #${~~(Math.random() * 300)} and #${~~(Math.random() * 300)} removed from payroll`));
            }

            // Escape from initial room
            {
                world.expand(4);
                const target = world.add(world.lastRoom.asTarget);
                await fullScreenTimedMessage(nomangle(`K-31 escapes initial containment lab`));
                await worldScreen(null, () => !world.hasAny([target]));
                world.expand(5);

                world.secondRoom.spawnHumanGroup(Intern, 2);
                world.secondRoomLeft.spawnHumanGroup(Intern, 2);
                world.secondRoomRight.spawnHumanGroup(Intern, 2);
                world.secondRoomUp.spawnHumanGroup(Intern, 2);

            }

            // Reach the security room
            {
                const target = world.add(world.longHallwayExit.asTarget);
                await worldScreen(null, () => !world.hasAny([target]));
            }

            // Security is dispatched
            {
                world.expand(6);
                const securityTeam = world.securityRoom.spawnHumanGroup(SecurityDude, 3);
                await fullScreenTimedMessage(nomangle(`Initial security team is dispatched`));
                await worldScreen(null, () => !world.hasAny(securityTeam));
                await timeout(2);
                await fullScreenTimedMessage(nomangle(`Security team is terminated by K-31`));
                await fullScreenTimedMessage(nomangle(`Shooting K-31 seems to decrease its body mass`));
            }

            // Progress through map
            {
                world.expand(7);

                world.centerWallRoomRight.spawnHumanGroup(Intern, 1);
                world.centerWallRoomLeft.spawnHumanGroup(Intern, 1)
                world.centerWallRoom.spawnHumanGroup(SecurityDude, 3);

                world.longWallHallway.spawnHumanGroup(SecurityDude, 3);
                world.longWallHallway.spawnHumanGroup(SecurityDude, 3);

                world.officesHallway.spawnHumanGroup(SecurityDude, 3);
                world.officesHallway.spawnHumanGroup(Intern, 4);

                const target = world.add(world.flamethrowersConnection.asTarget);
                await worldScreen(null, () => !world.hasAny([target]));
                world.expand(8);
            }

            // Flamethrowers tutorial
            {
                const flamethrowers = world.flamethrowerRoom.spawnHumanGroup(FireDude, 4);
                world.flamethrowerRoom.spawnHumanGroup(Intern, 4);
                await fullScreenTimedMessage(nomangle(`Emergency response team is dispatched`));
                await worldScreen(null, () => !world.hasAny(flamethrowers));
                await timeout(2);

                await fullScreenTimedMessage(nomangle(`Emergency response team terminated`));
                world.expand(9);
            }

            // Exit flamethrowers room
            {
                // TODO spawn a few people
                const target = world.add(world.flamethrowersExit.asTarget);
                await fullScreenTimedMessage(nomangle(`K-31 continues its progress through the building`));
                await worldScreen(null, () => !world.hasAny([target]));
                world.expand(10);
            }

            // Progress until final hallway
            {
                // TODO spawn a ton of enemies
                const target = world.add(world.connectionToLastRoom.asTarget);
                await worldScreen(null, () => !world.hasAny([target]));
                await fullScreenTimedMessage(nomangle(`K-31 reaches the top floor`));
                world.expand(11);
            }

            // Final exit
            {
                const target = world.add(world.finalRoom.asTarget);
                await worldScreen(null, () => !world.hasAny([target]));
            }
        } catch (e) {
            console.error(e);
            await fullScreenTimedMessage(nomangle(`Specimen contained`));
            await fullScreenTimedMessage(nomangle(`Human casualties reported: 69`));
        }
        
        await fullScreenTimedMessage(nomangle(`K-31 location lost`));
        await fullScreenTimedMessage(nomangle(`Human casualties: ${player.totalKills}`));
        await fullScreenTimedMessage(nomangle(`BIO13K CEO Andre Matur announces new round of hiring`)); 

        // TODO final screen, rewind

        tapePlaying = false;
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
