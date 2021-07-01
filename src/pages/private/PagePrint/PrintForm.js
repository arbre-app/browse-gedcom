import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Form as FinalForm } from 'react-final-form';
import { GedcomSelection } from 'read-gedcom';
import { IndividualField, NumberField, PaperSizeField } from '../../../components';

export class PrintForm extends Component {

    submitHandler = data => {
        const { onSubmit } = this.props;
        // TODO validation
        onSubmit(data);
    };

    renderForm = ({ form: { mutators: { setValue } }, handleSubmit }) => {
        const { disabled, file } = this.props;
        return (
            <Form
                onSubmit={handleSubmit}
            >
                <IndividualField name="data.individual" setValue={setValue} file={file}/>
                <PaperSizeField name="size" setValue={setValue}/>
                <NumberField name="generations.ascending" setValue={setValue} min={1} max={10} />

                <Button variant="primary" type="submit" disabled={disabled} >
                    Refresh
                </Button>
            </Form>
        );
    };

    render() {
        const { initialIndividualId } = this.props;
        return (
            <FinalForm
                onSubmit={this.submitHandler}
                mutators={{
                    setValue: ([field, value], state, { changeValue }) => changeValue(state, field, () => value)
                }}
                initialValues={{
                    data: {
                        individual: initialIndividualId,
                    },
                    generations: {
                        ascending: 4,
                    }
                }}
                //initialValuesEqual={null}
                keepDirtyOnReinitialize
                render={this.renderForm}
            />
        );
    }
}

PrintForm.propTypes = {
    file: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    initialIndividualId: PropTypes.string,
};

PrintForm.defaultProps = {
    disabled: false,
    initialIndividualId: '',
};
