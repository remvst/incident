castRay = (x, y, angle, maxDistance) => {
    const castHorizontal = castAgainstHorizontal(x, y, angle, maxDistance);
    const castVertical = castAgainstVertical(x, y, angle, maxDistance);

    let cast;
    if (!castHorizontal) {
        cast = castVertical;
    } else if(!castVertical) {
        cast = castHorizontal;
    } else {
        impact = distP(x, y, castHorizontal.x, castHorizontal.y) < distP(x, y, castVertical.x, castVertical.y) ? castHorizontal : castVertical;
    }

    if (distP(x, y, impact.x, impact.y) > maxDistance) {
        impact = {
            'x': x + cos(angle) * maxDistance,
            'y': y + sin(angle) * maxDistance
        };
    }

    return impact;
}

castAgainstHorizontal = (startX, startY, angle, maxDistance) => {
    const pointingDown = sin(angle) > 0;

    const y = ~~(startY / CELL_SIZE) * CELL_SIZE + (pointingDown ? CELL_SIZE : -0.01);
    const x = startX + (y - startY) / tan(angle);

    const yStep = pointingDown ? CELL_SIZE : -CELL_SIZE;
    const xStep = yStep / tan(angle);

    return doCast(x, y, xStep, yStep, maxDistance);
}

castAgainstVertical = (startX, startY, angle, maxDistance) => {
    const pointingRight = cos(angle) > 0;

    const x = ~~(startX / CELL_SIZE) * CELL_SIZE + (pointingRight ? CELL_SIZE : -0.01);
    const y = startY + (x - startX) * tan(angle);

    const xStep = pointingRight ? CELL_SIZE : -CELL_SIZE;
    const yStep = xStep * tan(angle);

    return doCast(x, y, xStep, yStep, maxDistance);
}

doCast = (startX, startY, xStep, yStep, maxDistance) => {
    let x = startX,
        y = startY;

    while (distP(x, y, startX, startY) < maxDistance) {
        if (world.hasObstacleXY(x, y)) {
            // Got a block!
            return {
                'x': x,
                'y': y
            };
        } else {
            x += xStep;
            y += yStep;
        }
    }

    return {
        'x': x,
        'y': y
    };
}
