addZeroes = (x, l) => {
    x = x.toString();
    while (x.length < l) x = '0' + x;
    return x;
};
