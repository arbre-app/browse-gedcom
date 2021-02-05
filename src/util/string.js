export function normalize(string) {
    return string
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/(\s|-)+/g, ' ')
        .trim();
}
