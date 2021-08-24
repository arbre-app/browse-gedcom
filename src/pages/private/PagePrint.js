import { drawRectangle } from 'genealogy-visualizations';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { GedcomSelection } from 'read-gedcom';
import { PrivateLayout } from './PrivateLayout';
import { PrintForm } from '../../components/form/PrintForm';

export function PagePrint({ file, location: { state } }) {
    const divRef = useRef();
    const [isLoading, setLoading] = useState(false);

    const buildData = (rootId, ascendingGenerations, descendingGenerations) => {
        // Ascending

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

    /*, () => this.updateDrawing({ generations: { ascending: 3 } })*/ // TODO

    const updateDrawing = formConfig => {
        const data = buildData(formConfig.data.individual || '@I0000@', formConfig.generations.ascending, 0); // TODO
        const { data: _, ...config } = formConfig; // Remove the `data` field, `config` will be the final config

        if(divRef) {
            // FIXME
            setLoading(true);
            drawRectangle(data, config, divRef)
                //.catch(error => this.setState({ isLoading: false }))
                .then(svg => setLoading(false));
        }
    }

    return (
        <PrivateLayout>
            <Card>
                <Card.Body>
                    <PrintForm onSubmit={updateDrawing} disabled={isLoading} file={file} initialIndividualId={state && state.initialIndividualId}/>
                    <div style={{ visibility: isLoading ? 'hidden' : 'visible' }} ref={divRef.current} />
                    {isLoading && (
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    )}
                </Card.Body>
            </Card>
        </PrivateLayout>
    );
}

PagePrint.propTypes = {
    file: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
    location: PropTypes.shape({
        state: PropTypes.shape({
            initialIndividualId: PropTypes.string,
        }),
    }).isRequired,
};

PagePrint.defaultProps = {
};
