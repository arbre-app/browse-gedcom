export function createInitialSettings(root) {
    const individualOpt = root.getIndividualRecord().option();
    return {
        rootIndividual: individualOpt.isEmpty() ? null : individualOpt.first(),
    };
}
