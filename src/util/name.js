export function displayName(individual, placeholder = '') {
    const name = individual
        .getName()
        .valueAsParts()
        .filter(v => v != null)
        .map(v => v.filter(s => s).map(s => s.replace(/_+/g, ' ')).join(' '))[0];
    return name ? name : placeholder;
}
