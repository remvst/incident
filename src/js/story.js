fullScreenPrompt = async (prompt) => {
    mouseDown = false;
    screen = prompt;
    await timeout(3);
    screen.message = [];
    await timeout(1);
};

fullScreenMessage = (message) => fullScreenPrompt(new PromptScreen(message));

fullScreenTimedMessage = (message) => {
    tapeTime += 60 * 2;
    return fullScreenMessage([formatTimeShort(tapeTime), message]);
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

infiniteMode = async () => {
    try {
        world.expand(1);
        player.head.position.x = world.lastRoom.centerX;
        player.head.position.y = world.lastRoom.centerY;

        await fullScreenMessage([nomangle(`Endless Mode`), nomangle('(Coil subscribers only)')]);
        await fullScreenMessage([nomangle(`Absorb as many humans as you can`)]);

        let extensionCount = 0;
        while (true) {
            extensionCount++;

            for (const room of world.addRandomChunk()) {
                room.spawnHumanGroup(Intern, ~~rnd(1, 3));

                const maxSecurityDudes = limit(0, (extensionCount - 2 * 0.2), 4);
                room.spawnHumanGroup(SecurityDude, ~~rnd(0, maxSecurityDudes));


                const maxFireDudes = limit(0, (extensionCount - 4 * 0.2), 4);
                room.spawnHumanGroup(SecurityDude, ~~rnd(0, maxFireDudes));
            }

            const target = world.add(world.lastRoom.asTarget);
            await worldScreen(null, () => !world.hasAny([target]));
        }
    } catch (e) {
        console.error(e);
        await fullScreenTimedMessage(nomangle(`K-31 is contained`));
        await fullScreenTimedMessage(nomangle(`Absorbed humans: ${player.totalKills}`));
    }
};

storyMode = async () => {
    try {
        await fullScreenMessage(nomangle(['August 13th 2022', 'BIO13K research lab']));

        // Movement tutorial
        {
            await fullScreenTimedMessage(nomangle('Specimen K-31 is held in containment'));
            await worldScreen(
                inputMode === INPUT_MODE_MOUSE 
                    ? nomangle('Use mouse to move')
                    : inputMode === INPUT_MODE_TOUCH 
                    ? nomangle('Touch screen to move')
                    : nomangle('Use left joystick to move'), 
                () => player.travelledDistance > CELL_SIZE * 10,
            );
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
            await fullScreenTimedMessage(nomangle('K-31 starts moving faster'));
            await worldScreen(
                inputMode === INPUT_MODE_MOUSE 
                    ? nomangle('Hold [CLICK] to dash')
                    : inputMode === INPUT_MODE_TOUCH 
                    ? nomangle('Drag joystick further to dash')
                    : nomangle('Hold [A] to dash'), 
                () => player.dashDistance > CELL_SIZE * 10,
            );
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
            const target = world.add(world.initialConnection.asTarget);
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

            world.longWallHallway.spawnHumanGroup(SecurityDude, 4);

            world.officesHallway.spawnHumanGroup(SecurityDude, 3);
            world.officesHallway.spawnHumanGroup(Intern, 4);

            const target = world.add(world.flamethrowersConnection.asTarget);
            await worldScreen(null, () => !world.hasAny([target]));
            world.expand(8);
        }

        // Flamethrowers tutorial
        {
            const flamethrowers = world.flamethrowerRoom.spawnHumanGroup(FireDude, 5);
            world.flamethrowerRoom.spawnHumanGroup(Intern, 4);
            await fullScreenTimedMessage(nomangle(`Emergency response team is dispatched`));
            await worldScreen(nomangle('Eliminate emergency response team'), () => !world.hasAny(flamethrowers));
            await timeout(2);

            await fullScreenTimedMessage(nomangle(`Emergency response team terminated`));
            world.expand(9);
        }

        // Exit flamethrowers room
        {
            const target = world.add(world.afterFlamethrowersConnection.asTarget);
            await fullScreenTimedMessage(nomangle(`K-31 continues to progress through the building`));
            await worldScreen(null, () => !world.hasAny([target]));
            world.expand(10);
        }

        // Progress until final hallway
        {
            world.afterFlameThrowersRoom.spawnHumanGroup(Intern, 4);
            // world.afterFlameThrowersRoom.spawnHumanGroup(SecurityDude, 2);

            world.largeHallway.spawnHumanGroup(FireDude, 2);
            world.largeHallway.spawnHumanGroup(SecurityDude, 2);

            world.roomToHallway.spawnHumanGroup(Intern, 3);

            world.nextWallRoom.spawnHumanGroup(Intern, 3);
            world.nextWallRoom.spawnHumanGroup(SecurityDude, 4);
            world.nextWallRoom.spawnHumanGroup(FireDude, 6);

            world.hallwayToSecondOffices.spawnHumanGroup(SecurityDude, 2);
            world.hallwayToSecondOffices.spawnHumanGroup(Intern, 2);

            world.secondOfficesHallway.spawnHumanGroup(Intern, 5);
            world.secondOfficesHallway.spawnHumanGroup(FireDude, 6);

            world.connectionToLastLobby.spawnHumanGroup(Intern, 5);

            const target = world.add(world.connectionToLastLobby.asTarget);
            await worldScreen(null, () => !world.hasAny([target]));
            await fullScreenTimedMessage(nomangle(`K-31 reaches the top floor`));
            world.expand(11);
        }

        // Final exit
        {
            // Spawn a ton of enemies
            world.lastLobby.spawnHumanGroup(FireDude, 5);
            world.lastLobby.spawnHumanGroup(SecurityDude, 5);
            world.lastLobby.spawnHumanGroup(Intern, 6);

            const target = world.add(world.lastConnection.asTarget);
            await worldScreen(null, () => !world.hasAny([target]));
            escaped = true;
        }

        const bestEscape = parseFloat(localStorage['BEST_ESCAPE_KEY']) || Number.MAX_SAFE_INTEGER;
        localStorage['BEST_ESCAPE_KEY'] = min(bestEscape, tapeTime);

        await fullScreenTimedMessage(nomangle(`K-31 location lost`));
    } catch (e) {
        console.error(e);
        await fullScreenTimedMessage(nomangle(`K-31 is contained`));
    }

    await fullScreenTimedMessage(nomangle(`Human casualties: ${player.totalKills}`));
    await fullScreenTimedMessage(nomangle(`BIO13K CEO Andre Matur announces new round of hiring`)); 

    tapePlaying = false;
    await fullScreenPrompt(new FinalScreen());
}

gameLoop = async () => {
    while (true) {
        screen = new StaticScreen();
        await new Promise(r => setTimeout(r, 2000));

        // Globals
        tapeTime = 6 * 3600 + 24 * 60;
        timeouts = [];
        escaped = false;

        // World
        world = new World();
        world.expand(1);

        // Player
        player = new Player();
        player.head.resolve();
        player.head.realign();
        world.add(player);

        // Forcefully realign camera
        camera.cycle(10);

        tapePlaying = false;
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
        if (isInfiniteMode) {
            await infiniteMode();
        } else {
            await storyMode();
        }
    }
};

mappable = size => Array(size).fill(0);

formatTimeShort = (time) => {
    const decomposed = decomposeTime(time);
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
