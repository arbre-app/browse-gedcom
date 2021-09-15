import { SelectionAny, SelectionIndividualRecord } from 'read-gedcom';

export function createInitialSettings(root) {
    const individualOpt = root.getIndividualRecord(); // TODO make this more efficient
    return {
        rootIndividual: individualOpt.length === 0 ? null : SelectionAny.of(individualOpt, individualOpt[0]).as(SelectionIndividualRecord),
    };
}
