export function displayName(individual, placeholder = '') {
    const name = individual
        .getName()
        .valueAsParts()
        .all()
        .filter(v => v != null)
        .map(v => v.filter(s => s).join(' '))[0];
    return name ? name : placeholder;
}
