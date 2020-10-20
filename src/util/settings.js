import { Tag } from 'read-gedcom';

export function createInitialSettings(root) {
    const individuals = root._data.tree.by_tag_pointer[Tag.INDIVIDUAL]; // TODO update API
    let firstIndividual = null;
    for (const key in individuals) {
        firstIndividual = root.getIndividualRecord(key).first();
        break;
    }

    return {
        rootIndividual: firstIndividual,
    };
}