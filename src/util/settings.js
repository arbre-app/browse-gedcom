export function createInitialSettings(root) {
    const individualOpt = root.getIndividualRecord(null, 1);
    return {
        rootIndividual: individualOpt.isEmpty() ? null : individualOpt,
    };
}
