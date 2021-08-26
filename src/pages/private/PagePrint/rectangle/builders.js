export const buildInitialLayerValues = key => ({
    key,
    textValues: ['surname', 'given_name'],
});

export const buildInitialFormValues = ({ initialIndividualId }) => ({
    data: {
        individual: initialIndividualId,
    },
    generations: {
        ascending: 4,
    },
    layers: [
        buildInitialLayerValues(0),
    ],
});

export const buildData = (file, formConfig) => {
    // Ascending

    const rootId = formConfig.data.individual || '@I0000@';
    const ascendingGenerations = formConfig.generations.ascending;
    //const descendingGenerations = 0;

    const individualsData = {};
    const familiesData = {};
    const ascendingData = {};
    let currentGeneration = new Set([rootId]);
    const allGenerations = new Set();
    for(let i = 0; i < ascendingGenerations; i++) {
        const nextGeneration = new Set();
        for(const id of currentGeneration.values()) {
            if (!allGenerations.has(id)) {
                allGenerations.add(id);

                const individualRecord = file.getIndividualRecord(id);
                if (individualRecord.length === 0) {
                    throw new Error('No matching individual!');
                }

                const familyData = {};

                const parentFamilyRecord = individualRecord.getFamilyAsChild();
                if(parentFamilyRecord.length > 0) {
                    const husbandId = parentFamilyRecord.getHusband().value()[0];
                    if (husbandId) {
                        familyData.husbandIndividualId = husbandId;
                        nextGeneration.add(husbandId);
                    }
                    const wifeId = parentFamilyRecord.getWife().value()[0];
                    if (wifeId) {
                        familyData.wifeIndividualId = wifeId;
                        nextGeneration.add(wifeId);
                    }

                    const familyId = parentFamilyRecord[0].pointer;
                    familiesData[familyId] = familyData;
                    ascendingData[id] = familyId;
                }

                const nameParts = individualRecord.getName().valueAsParts()[0] || [];

                individualsData[id] = {
                    surname: nameParts[1],
                    givenName: nameParts[0],
                };

            }
        }

        currentGeneration = nextGeneration;
    }

    // Descending

    // TODO


    return {
        rootIndividualId: rootId,
        individuals: individualsData,
        families: familiesData,
        ascendingRelation: ascendingData,
        descendingRelation: {},
    };
};

export const buildConfig = form => {
    console.log(form);
    const { data: _, margin, layers, size, ...config } = form; // Remove the `data` field
    const final = {
        // TODO
        layers: Object.fromEntries(layers.map(({ textValues }, index) => [index.toString(), {
            texts: textValues.map(value => ({ value })),
        }])),
        ...config
    };
    console.log(final);
    return final;
};
