function breadthFirstSearch(root, initialIndividuals, neighboursOf) {
    const visited = new Set(initialIndividuals.map(individual => individual.pointer()[0]));
    let current = new Set(initialIndividuals);
    while (current.size > 0) {
        const next = new Set();
        for(const individual of current.values()) {
            neighboursOf(individual)
                .filter(other => other.length > 0)
                .forEach(other => {
                    const id = other.pointer()[0];
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
        .arraySelect()
        .flatMap(ind => [ind.getHusband(), ind.getWife()])
        .map(ref => ref.getIndividualRecord());

const descendantRelation = individual =>
    individual
        .getFamilyAsSpouse()
        .getChild()
        .getIndividualRecord()
        .arraySelect();

export function computeAncestors(root, initialIndividual) {
    return breadthFirstSearch(root, [initialIndividual], ancestorRelation);
}

export function computeDescendants(root, initialIndividual) {
    return breadthFirstSearch(root, [initialIndividual], descendantRelation);
}

export function computeRelated(root, ancestorsIdSet) {
    return breadthFirstSearch(root, Array.from(ancestorsIdSet).map(id => root.getIndividualRecord(id)), descendantRelation);
}

export function topologicalSort(root) {
    // DFS recursive marking algorithm

    const sorted = []; // Sorted ids, in reverse order
    const marks = {};
    const nonPermanentlyMarked = new Set();

    root.getIndividualRecord().arraySelect().forEach(individual => nonPermanentlyMarked.add(individual.pointer()[0]));

    const PERMANENT_MARK = true, TEMPORARY_MARK = false;

    function visit(individual) {
        const id = individual.pointer()[0];
        const mark = marks[id];
        if(mark === PERMANENT_MARK) {
            return;
        } else if(mark === TEMPORARY_MARK) {
            throw new Error(); // Contains a cycle (illegal)
        }
        nonPermanentlyMarked.add(id);
        marks[id] = TEMPORARY_MARK;
        individual.getFamilyAsSpouse().arraySelect()
            .filter(family => [family.getHusband(), family.getWife()].some(ref => marks[ref.value()[0]] === undefined))
            .forEach(family => family.getChild().getIndividualRecord().arraySelect().forEach(child => visit(child)));
        nonPermanentlyMarked.delete(id);
        marks[id] = PERMANENT_MARK;
        sorted.push(id);
    }

    while(nonPermanentlyMarked.size > 0) {
        const firstId = nonPermanentlyMarked.values().next().value;
        const individual = root.getIndividualRecord(firstId);
        visit(individual);
    }

    const reverse = []; // Sorted ids
    const index = {}; // id -> index
    for(let i = 0; i < sorted.length; i++) {
        const id = sorted[sorted.length - i - 1];
        reverse.push(id);
        index[id] = i;
    }
    return { topologicalArray: reverse, topologicalOrdering: index };
}

function computeCoefficient(root, topologicalOrdering, inbreedingMap, isModeInbreed, individual1, individual2) {
    function keyFor(id1, id2) {
        if(id1 < id2) {
            return `${id1}${id2}`;
        } else {
            return `${id2}${id1}`;
        }
    }
    function memoizedInbreeding(individual1, individual2) {
        if(individual1.length === 0 || individual2.length === 0) {
            return 0.0;
        }
        const id1 = individual1[0].pointer, id2 = individual2[0].pointer;
        const key = keyFor(id1, id2);
        if(inbreedingMap.has(key)) {
            return inbreedingMap.get(key);
        }
        let value;
        if(id1 === id2) {
            if(isModeInbreed) {
                const family = individual1.getFamilyAsChild();
                const father = family.getHusband().getIndividualRecord(), mother = family.getWife().getIndividualRecord();
                value = 0.5 * (1 + memoizedInbreeding(father, mother));
            } else {
                value = 1.0;
            }
        } else {
            if(topologicalOrdering[id1] < topologicalOrdering[id2]) {
                const family2 = individual2.getFamilyAsChild();
                const father2 = family2.getHusband().getIndividualRecord(), mother2 = family2.getWife().getIndividualRecord();
                value = 0.5 * (memoizedInbreeding(individual1, father2) + memoizedInbreeding(individual1, mother2));
            } else {
                const family1 = individual1.getFamilyAsChild();
                const father1 = family1.getHusband().getIndividualRecord(), mother1 = family1.getWife().getIndividualRecord();
                value = 0.5 * (memoizedInbreeding(father1, individual2) + memoizedInbreeding(mother1, individual2));
            }
        }
        inbreedingMap.set(key, value);
        return value;
    }
    return memoizedInbreeding(individual1, individual2);
}

export function computeInbreedingCoefficient(root, topologicalOrdering, inbreedingMap, individual) {
    return 2 * (computeCoefficient(root, topologicalOrdering, inbreedingMap, true, individual, individual) - 0.5);
}

export function computeRelatednessCoefficient(root, topologicalOrdering, relatednessMap, individual1, individual2) {
    return computeCoefficient(root, topologicalOrdering, relatednessMap, false, individual1, individual2);
}

export function setIntersectionSize(set1, set2) {
    let larger, smaller;
    if(set1.size > set2.size) {
        larger = set1;
        smaller = set2;
    } else {
        larger = set2;
        smaller = set1;
    }
    let count = 0;
    smaller.forEach(v => {
        if(larger.has(v)) {
            count++;
        }
    });
    return count;
}
