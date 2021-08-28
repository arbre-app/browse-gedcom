import PropTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import {
    AlignBottom,
    AlignEnd,
    AlignStart,
    AlignTop,
} from 'react-bootstrap-icons';
import { Field } from 'react-final-form';
import { NumberField } from './NumberField';

export function MarginsField({ name, setValue, variant, min, max, className, style }) {
    const directions = [
        { id: 'left', label: 'Gauche', icon: AlignStart },
        { id: 'right', label: 'Droite', icon: AlignEnd },
        { id: 'top', label: 'Haut', icon: AlignTop },
        { id: 'bottom', label: 'Bas', icon: AlignBottom },
    ];

    const nameForChild = child => `${name}.${child}`;

    return (
        <Row className={`align-items-center${className ? ` ${className}` : ''}`}>
            <Col>
                <Row noGutters>
                    {directions.map(({ id, label, icon }, i) => (
                        <NumberField
                            key={id}
                            name={nameForChild(id)}
                            setValue={setValue}
                            variant={variant}
                            placeholder={label}
                            icon={icon}
                            className={i > 0 ? 'mt-1' : ''}
                            min={min}
                            max={max}
                        />
                    ))}
                </Row>
            </Col>
            <Col>
                <Field name={nameForChild('synchronized')} type="checkbox" render={({ input, meta }) => (
                    <Form.Check
                        {...input}
                        type="switch"
                        label="Synchroniser"
                    />
                )} />
            </Col>
        </Row>
    );
}

MarginsField.propTypes = {
    name: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    variant: PropTypes.string,
};

MarginsField.defaultProps = {
    min: null,
    max: null,
    variant: 'outline-secondary',
};
