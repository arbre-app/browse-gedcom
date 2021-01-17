import { drawRectangle } from 'genealogy-visualizations';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Gedcom } from 'read-gedcom';
import { PrivateLayout } from '../PrivateLayout';

export class PagePrint extends Component {
    buildData = () => {
        const { file } = this.props;

        // TODO
        const rootId = '@I0001@';
        const generations = 6; // > 0

        const individualsData = {};
        let currentGeneration = new Set([rootId]);
        const allGenerations = new Set();
        for(let i = 0; i < generations; i++) {
            const nextGeneration = new Set();
            for(const id of currentGeneration.values()) {
                if (!allGenerations.has(id)) {
                    allGenerations.add(id);

                    const individualRecord = file.getIndividualRecord(id);
                    if (individualRecord.isEmpty()) {
                        throw new Error('No matching individual!');
                    }

                    const parentsData = {};

                    const parentFamilyRecord = individualRecord.getFamilyAsChild();

                    const husbandId = parentFamilyRecord.getHusband().value().option();
                    if (husbandId) {
                        parentsData.husbandIndividualId = husbandId;
                        nextGeneration.add(husbandId);
                    }
                    const wifeId = parentFamilyRecord.getWife().value().option();
                    if (wifeId) {
                        parentsData.wifeIndividualId = wifeId;
                        nextGeneration.add(wifeId);
                    }

                    const nameParts = individualRecord.getName().valueAsParts().option([]);

                    individualsData[id] = {
                        surname: nameParts[1],
                        givenName: nameParts[0],
                        parents: parentsData,
                    };
                }
            }

            currentGeneration = nextGeneration;
        }

        return {
            rootIndividualId: rootId,
            individuals: individualsData,
        };
    };

    render() {
        const data = this.buildData();
        const config = {
            style: {},
            generations: 6,
        };
        const svg = drawRectangle(data, config); // TODO
        return (
            <PrivateLayout>
                <Card>
                    <Card.Body>
                        <div ref={(nodeElement) => {nodeElement && nodeElement.appendChild(svg)}}/>
                    </Card.Body>
                </Card>
            </PrivateLayout>
        );
    }
}

PagePrint.propTypes = {
    file: PropTypes.instanceOf(Gedcom).isRequired,
};

PagePrint.defaultProps = {
};
