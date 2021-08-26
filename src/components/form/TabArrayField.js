import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Card, Nav, Tab } from 'react-bootstrap';
import { Plus, XLg } from 'react-bootstrap-icons';
import { FieldArray } from 'react-final-form-arrays';

export function TabArrayField({ name, push, createInitialNewData, renderLabel, renderField: renderElementField, header: Header, nonEmpty }) {
    const [key, setKey] = useState(0);

    const uniqueIdRef = useRef(1);

    const renderField = ({ fields }) => {
        const selectHandler = selectedKey => {
            const selectedKeyNumber = parseInt(selectedKey);
            if (selectedKeyNumber >= 0) { // Actual pane
                setKey(selectedKeyNumber);
            } else { // Add button
                setKey(fields.length);
                push(name, createInitialNewData(uniqueIdRef.current++));
            }
        };

        const removeHandler = (e, index, length) => {
            e.stopPropagation();
            e.preventDefault();
            fields.remove(index);
            if(index === length - 1 || index < key) {
                setKey(Math.max(key - 1, 0))
            }
        };


        return (
            <Tab.Container id="left-tabs-example" activeKey={key} transition={false} onSelect={selectHandler}>
                <Card>
                    <Card.Header>
                        {Header && <Header />}
                        <Nav variant="tabs">
                            {fields.map((name, index) => (
                                <Nav.Item key={fields.value[index].key}>
                                    <Nav.Link eventKey={index.toString()}>
                                        {renderLabel(fields, name, index)}
                                        {(!nonEmpty || index !== 0) && (
                                            <XLg className="icon ml-2 text-danger" onClick={e => removeHandler(e, index, fields.length)} />
                                        )}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                            <Nav.Item>
                                <Nav.Link eventKey={(-1).toString()}><Plus className="icon" /></Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Tab.Content>
                            {fields.map((name, index) => (
                                <Tab.Pane key={fields.value[index].key} eventKey={index.toString()}>
                                    {renderElementField(fields, name, index)}
                                </Tab.Pane>
                            ))}
                        </Tab.Content>
                    </Card.Body>
                </Card>
            </Tab.Container>
        );
    };

    return (
        <FieldArray name={name} render={renderField} />
    );
}

TabArrayField.propTypes = {
    name: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    createInitialNewData: PropTypes.func.isRequired,
    renderLabel: PropTypes.func.isRequired,
    renderField: PropTypes.func.isRequired,
    header: PropTypes.func,
    nonEmpty: PropTypes.bool,
};

TabArrayField.defaultProps = {
    header: null,
    labels: null,
    nonEmpty: false,
};
