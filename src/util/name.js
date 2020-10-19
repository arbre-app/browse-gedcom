export function displayName(individual, placeholder = '') {
    const name = individual
        .getName()
        .valueAsParts()
        .filter(v => v !== undefined)
        .map(v => v.filter(s => s).join(' '))[0];
    return name ? name : placeholder;
}
