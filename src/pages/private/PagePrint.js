import { drawRectangle } from 'genealogy-visualizations';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Accordion, Button, Card, Spinner } from 'react-bootstrap';
import {
    ArrowDown, Braces, Diagram2, ListUl, Pencil,
    Printer,
    RecordCircle,
    ZoomIn,
    ZoomOut,
} from 'react-bootstrap-icons';
import { GedcomSelection } from 'read-gedcom';
import { PrivateLayout } from './PrivateLayout';
import { PrintForm } from '../../components/form/PrintForm';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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

    const [isDrawn, setDrawn] = useState(false);
    const [initialData, setInitialData] = useState({});

    const updateDrawing = formConfig => {
        const data = buildData(formConfig.data.individual || '@I0000@', formConfig.generations.ascending, 0); // TODO
        const { data: _, ...config } = formConfig; // Remove the `data` field, `config` will be the final config
        const newConfig = { style: { height: '100%' }, ...config }

        if(divRef.current) {
            // FIXME
            setLoading(true);
            drawRectangle(data, newConfig, divRef.current)
                //.catch(error => this.setState({ isLoading: false }))
                .then(svg => {
                    //console.log(svg);
                    setDrawn(true);
                    setLoading(false);

                    const div = divRef.current;
                    const container = div.parentNode.parentNode;
                    setInitialData({
                        initialPositionX: (container.offsetWidth - div.offsetWidth) / 2,
                        initialPositionY: (container.offsetHeight - div.offsetHeight) / 2,
                    });
                });
        }
    }

    const ToolButton = ({ onClick, iconCmp: Icon }) => (
        <Button
            variant="light"
            onClick={() => onClick()}
            className="d-block m-1"
            style={{ pointerEvents: 'auto' }}
        >
            <Icon className="icon" />
        </Button>
    );

    return (
        <PrivateLayout>
            <Card>
                <Card.Header>
                    <Card.Title className="mb-0">
                        <Printer className="icon mr-2" />
                        Impression
                    </Card.Title>
                </Card.Header>
                <Card.Body className="p-0">
                    {!isDrawn && (
                        <div style={{ position: 'absolute', width: '100%', top: '50%', transform: 'translateY(-50%)' }} className="p-3 text-center text-muted">
                            <h1>
                                <Braces className="icon" />
                            </h1>
                            <ArrowDown className="icon animation-up-down-arrow mr-1" />
                            Commencez par sélectionner les données de votre graphique
                            <ArrowDown className="icon animation-up-down-arrow ml-1" />
                        </div>
                    )}

                    <TransformWrapper
                        disabled={!isDrawn || isLoading}
                        minScale={0.5}
                        {...initialData}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                {isDrawn && (
                                    <div className="p-3" style={{ position: 'absolute', zIndex: 100 }}>
                                        <ToolButton onClick={zoomIn} iconCmp={ZoomIn} />
                                        <ToolButton onClick={resetTransform} iconCmp={RecordCircle} />
                                        <ToolButton onClick={zoomOut} iconCmp={ZoomOut} />
                                    </div>
                                )}
                                <TransformComponent>
                                    <div style={{ visibility: isLoading ? 'hidden' : 'visible', height: '500px' }} ref={divRef} />
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>

                    {isLoading && (
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    )}
                </Card.Body>
            </Card>
            <Accordion className="accordion-clickable mt-3" defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <Card.Title className="mb-0"><Diagram2 className="icon mr-2" />Modèle</Card.Title>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <PrintForm onSubmit={updateDrawing} disabled={isLoading} file={file} initialIndividualId={state && state.initialIndividualId}/>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        <Card.Title className="mb-0"><ListUl className="icon mr-2" />Données</Card.Title>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} className="disabled" eventKey="2">
                        <Card.Title className="mb-0"><Pencil className="icon mr-2" />Personnalisation</Card.Title>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
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
