import { drawRectangle } from 'genealogy-visualizations';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import {
    ArrowDown, BoxArrowUpRight, Braces, CardImage, Diagram2, Download, FileEarmark, ListUl, Pencil,
    Printer,
    RecordCircle,
    ZoomIn,
    ZoomOut,
} from 'react-bootstrap-icons';
import { Form as FinalForm } from 'react-final-form';
import { GedcomSelection } from 'read-gedcom';
import { PrivateLayout } from '../PrivateLayout';
import { buildConfig, buildData, buildInitialFormValues } from './rectangle';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import arrayMutators from 'final-form-arrays';
import { FieldsConfig } from './rectangle';
import { FieldsData } from './rectangle';

export function PagePrint({ file, location: { state } }) {
    const divRef = useRef();
    const [isLoading, setLoading] = useState(false);

    const twRef = useRef();

    /*, () => this.updateDrawing({ generations: { ascending: 3 } })*/ // TODO

    const [isDrawn, setDrawn] = useState(false);
    const [initialData, setInitialData] = useState({});

    const updateDrawing = form => {
        const data = buildData(file, form); // TODO
        const config = buildConfig(form);

        if(divRef.current) {
            // FIXME
            setLoading(true);
            drawRectangle(data, config, divRef.current)
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
                    const { current: tw } = twRef;
                    if(tw) {
                        tw.resetTransform(0); // We don't want the animation to play
                    }
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

    const submitHandler = data => {
        // TODO validation
        updateDrawing(data);
    };

    const renderForm = ({ form, handleSubmit }) => (
        <Form
            onSubmit={handleSubmit}
        >
            <Accordion className="accordion-clickable mt-3" defaultActiveKey="2">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <Card.Title className="mb-0"><Diagram2 className="icon mr-2" />Modèle</Card.Title>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            ...
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        <Card.Title className="mb-0"><ListUl className="icon mr-2" />Données</Card.Title>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <FieldsData form={form} file={file} disabled={isLoading} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} className="disabled" eventKey="2">
                        <Card.Title className="mb-0"><Pencil className="icon mr-2" />Personnalisation</Card.Title>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <FieldsConfig form={form} file={file} disabled={isLoading} />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Card className="mt-3">
                <Card.Header>
                    <Card.Title className="mb-0">
                        <BoxArrowUpRight className="icon mr-2" />
                        Exportation
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h5>
                                <Printer className="icon mr-2" />
                                Impression
                            </h5>

                            <Button className="w-100">
                                <Printer className="icon mr-2" />
                                Imprimer
                            </Button>
                        </Col>
                        <Col md={6}>
                            <h5>
                                <FileEarmark className="icon mr-2" />
                                Fichier
                            </h5>

                            <Button variant="secondary" className="w-100">
                                <Download className="icon mr-2" />
                                Télécharger
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Form>
    );

    return (
        <PrivateLayout>
            <Card>
                <Card.Header>
                    <Card.Title className="mb-0">
                        <CardImage className="icon mr-2" />
                        Aperçu
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
                        ref={twRef}
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
                                    <div style={{ visibility: isLoading ? 'hidden' : 'visible' }} ref={divRef} className="container-svg" />
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
            <FinalForm
                onSubmit={submitHandler}
                mutators={{
                    setValue: ([field, value], state, { changeValue }) => changeValue(state, field, () => value),
                    ...arrayMutators,
                }}
                initialValues={buildInitialFormValues(state || {})}
                //initialValuesEqual={null}
                keepDirtyOnReinitialize
                render={renderForm}
            />
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
