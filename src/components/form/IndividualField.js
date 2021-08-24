import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Field } from 'react-final-form'
import { GedcomSelection } from 'read-gedcom';
import { displayName } from '../../util';

export function IndividualField({ name, setValue, file, variant, ...other }) {
    const renderField = ({ input, meta }) => {
        const { value } = input;
        const individual = file.getIndividualRecord(value || '');
        const isEmpty = individual.length === 0;
        return (
            <Button variant={variant} disabled {...other}>
                <Person className="icon mr-2"/>
                {isEmpty ? 'Select...' : displayName(individual)}
            </Button>
        );
    };

    return (
        <Field name={name} render={renderField} />
    );
}

IndividualField.propTypes = {
    name: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    file: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
    variant: PropTypes.string,
};

IndividualField.defaultProps = {
    variant: "light",
};
