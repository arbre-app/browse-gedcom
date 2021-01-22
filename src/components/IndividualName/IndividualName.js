import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Question, Record2Fill } from 'react-bootstrap-icons';
import { IndividualRecord, Sex } from 'read-gedcom';
import { AppRoutes } from '../../routes';
import { displayName } from '../../util';
import { GenderFemale, GenderMale } from '../icons';
import { NormalLink } from '../NormalLink';

export class IndividualName extends Component {

    render() {
        const { ancestors, individual, placeholder, gender, noLink, noAncestry } = this.props;
        const name = displayName(individual);
        const content = name ? name : placeholder;
        const hasAncestorIcon = !noAncestry && ancestors && ancestors.has(individual.pointer().option());
        const genderValue = individual.getSex().value().option();
        const genderClass = `icon${hasAncestorIcon ? '' : ' mr-1'}`;
        return individual.isEmpty() ? content : (
            <>
                {gender && (genderValue === Sex.MALE ? <GenderMale className={`${genderClass} color-male`} /> : genderValue === Sex.FEMALE ? <GenderFemale className={`${genderClass} color-female`} /> : <Question className={genderClass} />)}
                {hasAncestorIcon && (
                    <Record2Fill className="icon text-success" />
                    )}
                {noLink ? content : (
                    <NormalLink to={AppRoutes.individualFor(individual.pointer().one())}>
                        {content}
                    </NormalLink>
                )}
            </>
        )
    }
}

IndividualName.propTypes = {
    individual: PropTypes.instanceOf(IndividualRecord).isRequired,
    placeholder: PropTypes.string,
    gender: PropTypes.bool,
    noLink: PropTypes.bool,
    noAncestry: PropTypes.bool,
    /* Redux */
    ancestors: PropTypes.instanceOf(Set), // Nullable
};

IndividualName.defaultProps = {
    placeholder: '?',
    gender: false,
    noLink: false,
    noAncestry: false,
};
