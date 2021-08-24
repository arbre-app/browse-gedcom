import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { Form as FinalForm } from 'react-final-form';
import { GedcomSelection } from 'read-gedcom';
import { IndividualField, NumberField, PaperSizeField } from '../index';

export function PrintForm({ file, onSubmit, disabled, initialIndividualId }) {

    const submitHandler = data => {
        // TODO validation
        onSubmit(data);
    };

    const renderForm = ({ form: { mutators: { setValue } }, handleSubmit }) => (
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

    return (
        <FinalForm
            onSubmit={submitHandler}
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
            render={renderForm}
        />
    );
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
