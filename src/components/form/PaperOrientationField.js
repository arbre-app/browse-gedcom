import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form'

export class PaperOrientationField extends Component {
    //orientations =

    renderField = ({ input, meta }) => {
        const { setValue, ...other } = this.props;
        return ( // TODO intl
            <Form.Control as="select" custom {...other} {...input}>
                {Object.entries(this.paperSizes).map(([key, { name, size: [width, height] }]) => (
                    <option key={key}>{name} ({width} x {height})</option>
                ))}
            </Form.Control>
        );
    };

    render() {
        const { name } = this.props;
        return (
            <Field name={name} render={this.renderField} />
        );
    }
}

PaperOrientationField.propTypes = {
    name: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
};

PaperOrientationField.defaultProps = {};
