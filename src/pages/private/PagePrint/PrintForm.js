import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Form as FinalForm } from 'react-final-form';
import { NumberField } from '../../../components';

export class PrintForm extends Component {

    submitHandler = data => {
        const { onSubmit } = this.props;
        // TODO validation
        onSubmit(data);
    };

    renderForm = ({ form: { mutators: { setValue } }, handleSubmit }) => {
        const { disabled } = this.props;
        return (
            <Form
                onSubmit={handleSubmit}
            >

                <NumberField name="generations.ascending" setValue={setValue} min={1} max={10} />

                <Button variant="primary" type="submit" disabled={disabled} >
                    Submit
                </Button>
            </Form>
        );
    };

    render() {
        return (
            <FinalForm
                onSubmit={this.submitHandler}
                mutators={{
                    setValue: ([field, value], state, { changeValue }) => changeValue(state, field, () => value)
                }}
                render={this.renderForm}
            />
        );
    }
}

PrintForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

PrintForm.defaultProps = {
    disabled: false,
};
