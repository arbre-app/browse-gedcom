import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Dash, Plus } from 'react-bootstrap-icons';
import { Field } from 'react-final-form'

export class NumberField extends Component {

    handleDecrement = input => {
        const { name, setValue, min } = this.props;
        const { value } = input;
        const valueInt = parseInt(value);
        if(min === null || valueInt > min) {
            setValue(name, (valueInt - 1).toString());
        }
    };

    handleIncrement = input => {
        const { name, setValue, max } = this.props;
        const { value } = input;
        const valueInt = parseInt(value);
        if(max === null || valueInt < max) {
            setValue(name, (valueInt + 1).toString());
        }
    };

    renderField = ({ input, meta }) => {
        const { setValue, min, max, variant, ...other } = this.props;
        const { value } = input;

        return (
            <InputGroup {...other}>
                <InputGroup.Prepend>
                    <Button variant={variant} disabled={min !== null && value !== null && value <= min} onClick={() => this.handleDecrement(input)}>
                        <Dash className="icon" />
                    </Button>
                </InputGroup.Prepend>
                <Form.Control {...input} type="number" min={min} max={max} {...other} />
                <InputGroup.Append>
                    <Button variant={variant} disabled={max !== null && value !== null && value >= max} onClick={() => this.handleIncrement(input)}>
                        <Plus className="icon" />
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        );
    };

    render() {
        const { name } = this.props;
        return (
            <Field name={name} render={this.renderField} />
        );
    }
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
