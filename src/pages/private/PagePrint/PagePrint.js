import { drawRectangle } from 'genealogy-visualizations';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Gedcom } from 'read-gedcom';
import { PrivateLayout } from '../PrivateLayout';
import { PrintForm } from './PrintForm';

export class PagePrint extends Component {
    state = {
        divRef: null,
        isLoading: false,
    };

    buildData = (ascendingGenerations, descendingGenerations) => {
        const { file, location: { state } } = this.props;

        // TODO
        const rootId = state && state.initialIndividualId ? state.initialIndividualId : '@I0000@';

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
                    if (individualRecord.isEmpty()) {
                        throw new Error('No matching individual!');
                    }

                    const familyData = {};

                    const parentFamilyRecord = individualRecord.getFamilyAsChild();
                    if(!parentFamilyRecord.isEmpty()) {
                        const husbandId = parentFamilyRecord.getHusband().value().option();
                        if (husbandId) {
                            familyData.husbandIndividualId = husbandId;
                            nextGeneration.add(husbandId);
                        }
                        const wifeId = parentFamilyRecord.getWife().value().option();
                        if (wifeId) {
                            familyData.wifeIndividualId = wifeId;
                            nextGeneration.add(wifeId);
                        }

                        const familyId = parentFamilyRecord.pointer().one();
                        familiesData[familyId] = familyData;
                        ascendingData[id] = familyId;
                    }

                    const nameParts = individualRecord.getName().valueAsParts().option([]);

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

    setDivRef = element => {
        this.setState({ divRef: element }, () => this.updateDrawing({ generations: { ascending: 3 } })); // TODO
    }

    updateDrawing = config => {
        const { divRef } = this.state;

        const data = this.buildData(config.generations.ascending, 0);

        if(divRef) {
            this.setState({ isLoading: true }, () => {
                drawRectangle(data, config, divRef)
                    .catch(error => this.setState({ isLoading: false }))
                    .then(svg => this.setState({ isLoading: false }));
            });
        }
    }

    render() {
        const { isLoading } = this.state;
        return (
            <PrivateLayout>
                <Card>
                    <Card.Body>
                        <PrintForm onSubmit={this.updateDrawing} disabled={isLoading} />
                        <div style={{ visibility: isLoading ? 'hidden' : 'visible' }} ref={this.setDivRef} />
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
}

PagePrint.propTypes = {
    file: PropTypes.instanceOf(Gedcom).isRequired,
    location: PropTypes.shape({
        state: PropTypes.shape({
            initialIndividualId: PropTypes.string,
        }),
    }).isRequired,
};

PagePrint.defaultProps = {
};
