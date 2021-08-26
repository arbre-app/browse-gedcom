import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Dash, Plus } from 'react-bootstrap-icons';
import { Field } from 'react-final-form';

export function NumberField({ name, setValue, min, max, variant, disabled, icon: Icon, placeholder, ...other }) {

    const handleDecrement = ({ value }) => {
        if(value != null && value !== '') {
            const valueInt = parseInt(value);
            if(min === null || valueInt > min) {
                setValue(name, (valueInt - 1).toString());
            }
        }
    };

    const handleIncrement = ({ value }) => {
        if(value != null && value !== '') {
            const valueInt = parseInt(value);
            if(max === null || valueInt < max) {
                setValue(name, (valueInt + 1).toString());
            }
        }
    };

    const ButtonControl = ({ input, icon: Icon, disabled: localDisabled, clickHandler }) => (
        <Button variant={variant} disabled={disabled || localDisabled} onClick={() => clickHandler(input)}>
            <Icon className="icon" />
        </Button>
    )

    const ButtonDecrement = ({ input }) => (
        <ButtonControl input={input} icon={Dash} disabled={input.value !== null && min !== null && parseInt(input.value) <= min} clickHandler={handleDecrement} />
    );

    const ButtonIncrement = ({ input }) => (
        <ButtonControl input={input} icon={Plus} disabled={input.value !== null && max !== null && parseInt(input.value) >= max} clickHandler={handleIncrement} />
    );

    const renderField = ({ input, meta }) => (
        <InputGroup {...other}>
            <InputGroup.Prepend>
                {!Icon && <ButtonDecrement input={input} />}
                {!!Icon && (
                    <InputGroup.Text>
                        <Icon className="icon" />
                    </InputGroup.Text>
                )}
            </InputGroup.Prepend>
            <Form.Control {...input} type="number" min={min} max={max} disabled={disabled} placeholder={placeholder} />
            <InputGroup.Append>
                {!!Icon && <ButtonDecrement input={input} />}
                <ButtonIncrement input={input} />
            </InputGroup.Append>
        </InputGroup>
    );

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
    disabled: PropTypes.bool,
    icon: PropTypes.object,
    placeholder: PropTypes.string,
};

NumberField.defaultProps = {
    min: null,
    max: null,
    variant: 'secondary',
    disabled: false,
    icon: null,
    placeholder: null,
};
