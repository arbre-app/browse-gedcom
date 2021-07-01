import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Field } from 'react-final-form'

export class PaperSizeField extends Component {
    paperSizes = {
        a0: {
            name: 'A0',
            size: [1189, 841],
        },
        a1: {
            name: 'A1',
            size: [841, 594],
        },
        a2: {
            name: 'A2',
            size: [594, 420],
        },
        a3: {
            name: 'A3',
            size: [420, 297],
        },
        a4: {
            name: 'A4',
            size: [297, 210],
        },
        a5: {
            name: 'A5',
            size: [210, 148],
        },
    }

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

PaperSizeField.propTypes = {
    name: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
};

PaperSizeField.defaultProps = {};
