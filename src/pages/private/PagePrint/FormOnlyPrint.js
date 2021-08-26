import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Printer } from 'react-bootstrap-icons';
import { Form as FinalForm } from 'react-final-form';

export function FormOnlyPrint({ disabled, refreshCallback }) {

    const submitHandler = data => {
        const ref = refreshCallback();
        console.log('submitted');
    };

    const renderForm = ({ form, handleSubmit }) => (
        <Form
            onSubmit={handleSubmit}
        >
            <h5>
                <Printer className="icon mr-2" />
                Impression
            </h5>

            <Button type="submit" disabled={disabled} className="w-100">
                <Printer className="icon mr-2" />
                Imprimer
            </Button>
        </Form>
    );

    return (
        <FinalForm
            onSubmit={submitHandler}
            mutators={{
                setValue: ([field, value], state, { changeValue }) => changeValue(state, field, () => value),
            }}
            initialValues={{}}
            keepDirtyOnReinitialize
            render={renderForm}
        />
    );
}

FormOnlyPrint.propTypes = {
    refreshCallback: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

FormOnlyPrint.defaultProps = {
    disabled: false,
};
