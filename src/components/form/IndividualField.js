import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Field } from 'react-final-form'
import { GedcomSelection } from 'read-gedcom';
import { displayName } from '../../util';

export class IndividualField extends Component {

    renderField = ({ input, meta }) => {
        const { setValue, file, variant, ...other } = this.props;
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

    render() {
        const { name } = this.props;
        return (
            <Field name={name} render={this.renderField} />
        );
    }
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
