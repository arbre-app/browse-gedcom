import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form'

export function PaperOrientationField({ name, setValue, ...other }) {
    //orientations =

    const renderField = ({ input, meta }) => {
        return ( // TODO intl
            <Form.Control as="select" custom {...other} {...input}>
                {/*paperSizes*/}
                {Object.entries({}).map(([key, { name, size: [width, height] }]) => (
                    <option key={key}>{name} ({width} &times; {height})</option>
                ))}
            </Form.Control>
        );
    };

    return (
        <Field name={name} render={renderField} />
    );
}

PaperOrientationField.propTypes = {
    name: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
};

PaperOrientationField.defaultProps = {};
