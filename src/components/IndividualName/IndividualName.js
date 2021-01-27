import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Question, Record2Fill } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { IndividualRecord, Sex } from 'read-gedcom';
import { AppRoutes } from '../../routes';
import { displayName } from '../../util';
import { GenderFemale, GenderMale } from '../icons';
import { NormalLink } from '../NormalLink';

export class IndividualName extends Component {

    render() {
        const { individual, placeholder, gender, noLink, noAncestry, settings, ancestors, descendants } = this.props;
        const name = displayName(individual);
        const content = name ? name : placeholder;
        const id = individual.pointer().option();
        const isAncestor = ancestors && ancestors.has(id);
        const isDescendant = descendants && descendants.has(id);
        const hasAncestorIcon = !noAncestry && (isAncestor || isDescendant);
        const rootIndividualName = hasAncestorIcon && displayName(settings.rootIndividual, '?')
        const genderValue = individual.getSex().value().option();
        const genderClass = `icon${hasAncestorIcon ? '' : ' mr-1'}`;
        return individual.isEmpty() ? content : (
            <>
                {gender && (genderValue === Sex.MALE ? <GenderMale className={`${genderClass} color-male`} /> : genderValue === Sex.FEMALE ? <GenderFemale className={`${genderClass} color-female`} /> : <Question className={genderClass} />)}
                {hasAncestorIcon && (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id="tooltip-ancestry">
                                {isAncestor && isDescendant ?
                                    <FormattedMessage id="component.ancestry.root" values={{ name: rootIndividualName, gender: genderValue }}/>
                                    : isAncestor ?
                                        <FormattedMessage id="component.ancestry.ancestor" values={{ name: rootIndividualName, gender: genderValue }}/>
                                        :
                                        <FormattedMessage id="component.ancestry.descendant" values={{ name: rootIndividualName, gender: genderValue }}/>
                                }
                            </Tooltip>
                        }
                    >
                        <Record2Fill className={`icon ${isAncestor && isDescendant ? 'text-info' : isAncestor ? 'text-success' : 'text-primary'}`} />
                    </OverlayTrigger>
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
    settings: PropTypes.object.isRequired,
    ancestors: PropTypes.instanceOf(Set), // Both nullable
    descendants: PropTypes.instanceOf(Set),
};

IndividualName.defaultProps = {
    placeholder: '?',
    gender: false,
    noLink: false,
    noAncestry: false,
    ancestors: null,
    descendants: null,
};
