export const round = (number, decimalPlaces) => {
    return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
}

export const extractIva = (item, iva) => {
    return item / ((100 + iva) / 100)
};
