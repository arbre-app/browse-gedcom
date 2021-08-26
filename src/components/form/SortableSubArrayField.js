import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonGroup, Col, ListGroup, Row } from 'react-bootstrap';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'react-bootstrap-icons';
import { FieldArray } from 'react-final-form-arrays';

export function SortableSubArrayField({ name, push, availableValues }) {

    const variantButton = 'outline-secondary';
    const variantItem = null;

    const renderField = ({ fields }) => {
        const ArrayItem = ({ id, index, length, sortable }) => (
            <ListGroup.Item key={id} variant={variantItem} className="px-3"> {/* className="px-3 py-2" */}
                {sortable && (
                    <ButtonGroup className="mr-2">
                        <Button variant={variantButton} size="sm" disabled={index === 0} onClick={() => fields.move(index, index - 1)}><ChevronUp className="icon" /></Button>
                        <Button variant={variantButton} size="sm" disabled={index === length - 1} onClick={() => fields.move(index, index + 1)}><ChevronDown className="icon" /></Button>
                    </ButtonGroup>
                )}
                {!sortable && (
                    <Button variant={variantButton} size="sm" className="mr-2" onClick={() => push(name, id)}><ChevronLeft className="icon" /></Button>
                )}
                {availableValues.find(item => item.id === id).label}
                {sortable && (
                    <Button variant={variantButton} size="sm" onClick={() => fields.remove(index)} className="ml-2 float-right"><ChevronRight className="icon" /></Button>
                )}
            </ListGroup.Item>
        );

        const filteredAvailable = availableValues.filter(item => !(fields.value || []).includes(item.id));

        return (
            <Row>
                <Col xs={6}>
                    <small>Sélection et ordre :</small>
                    {fields.length > 0 ? (
                        <ListGroup>
                            {fields.map((name, index) => (
                                <ArrayItem key={fields.value[index]} id={fields.value[index]} index={index} length={fields.length} sortable />
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-muted text-center">
                            Aucun champ sélectionné.
                        </div>
                    )}
                </Col>
                <Col xs={6}>
                    <small>Données disponibles :</small>
                    {filteredAvailable.length > 0 ? (
                        <ListGroup>
                            {filteredAvailable.map(({ id }, index) => (
                                <ArrayItem key={id} id={id} index={index} length={filteredAvailable.length} sortable={false} />
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-muted text-center">
                            Tous les champs ont été sélectionnés.
                        </div>
                    )}
                </Col>
            </Row>
        );
    };

    return (
        <FieldArray name={name} render={renderField} />
    );
}

SortableSubArrayField.propTypes = {
    name: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    availableValues: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired).isRequired,
};

SortableSubArrayField.defaultProps = {
};
