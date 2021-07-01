import { GedcomSelection } from 'read-gedcom';

export function createInitialSettings(root) {
    const individualOpt = root.getIndividualRecord(); // TODO make this more efficient
    return {
        rootIndividual: individualOpt.length === 0 ? null : GedcomSelection.Any.of(individualOpt, individualOpt[0]).as(GedcomSelection.IndividualRecord),
    };
}
