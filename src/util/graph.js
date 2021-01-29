function breadthFirstSearch(root, initialIndividuals, neighboursOf) {
    const visited = new Set(initialIndividuals.map(individual => individual.pointer().one()));
    let current = new Set(initialIndividuals);
    while (current.size > 0) {
        const next = new Set();
        for(const individual of current.values()) {
            neighboursOf(individual)
                .filter(other => !other.isEmpty())
                .forEach(other => {
                    const id = other.pointer().one();
                    if(!visited.has(id)) {
                        next.add(other);
                        visited.add(id);
                    }
                });
        }
        current = next;
    }
    return visited;
}

const ancestorRelation = individual =>
    individual
        .getFamilyAsChild()
        .array()
        .flatMap(ind => [ind.getHusband(), ind.getWife()])
        .map(ref => ref.getIndividualRecord());

const descendantRelation = individual =>
    individual
        .getFamilyAsSpouse()
        .getChild()
        .getIndividualRecord()
        .array();

export function computeAncestors(root, initialIndividual) {
    return breadthFirstSearch(root, [initialIndividual], ancestorRelation);
}

export function computeDescendants(root, initialIndividual) {
    return breadthFirstSearch(root, [initialIndividual], descendantRelation);
}

export function computeRelated(root, ancestorsIdSet) {
    return breadthFirstSearch(root, Array.from(ancestorsIdSet).map(id => root.getIndividualRecord(id)), descendantRelation);
}
