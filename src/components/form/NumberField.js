import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Dash, Plus } from 'react-bootstrap-icons';
import { Field } from 'react-final-form'

export function NumberField({ name, setValue, min, max, variant, ...other }) {

    const handleDecrement = ({ value }) => {
        const valueInt = parseInt(value);
        if(min === null || valueInt > min) {
            setValue(name, (valueInt - 1).toString());
        }
    };

    const handleIncrement = ({ value }) => {
        const valueInt = parseInt(value);
        if(max === null || valueInt < max) {
            setValue(name, (valueInt + 1).toString());
        }
    };

    const renderField = ({ input, meta }) => {
        const { value } = input;

        return (
            <InputGroup {...other}>
                <InputGroup.Prepend>
                    <Button variant={variant} disabled={min !== null && value !== null && value <= min} onClick={() => handleDecrement(input)}>
                        <Dash className="icon" />
                    </Button>
                </InputGroup.Prepend>
                <Form.Control {...input} type="number" min={min} max={max} {...other} />
                <InputGroup.Append>
                    <Button variant={variant} disabled={max !== null && value !== null && value >= max} onClick={() => handleIncrement(input)}>
                        <Plus className="icon" />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        );
    };

    return (
        <Field name={name} render={renderField} />
    );
}

NumberField.propTypes = {
    name: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    variant: PropTypes.string,
};

NumberField.defaultProps = {
    min: null,
    max: null,
    variant: "secondary",
};
