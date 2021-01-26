function breadthFirstSearch(root, initialIndividual, neighboursOf) {
    const visited = new Set([initialIndividual.pointer().one()]);
    let current = new Set([initialIndividual]);
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

export function computeAncestors(root, initialIndividual) {
    return breadthFirstSearch(root, initialIndividual, individual =>
        individual
            .getFamilyAsChild()
            .array()
            .flatMap(ind => [ind.getHusband(), ind.getWife()])
            .map(ref => ref.getIndividualRecord())
    );
}

export function computeDescendants(root, initialIndividual) {
    return breadthFirstSearch(root, initialIndividual, individual =>
        individual
            .getFamilyAsSpouse()
            .getChild()
            .getIndividualRecord()
            .array()
    );
}
