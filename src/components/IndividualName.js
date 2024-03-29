import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Question, Record2Fill } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { SelectionIndividualRecord, ValueSex } from 'read-gedcom';
import { AppRoutes } from '../routes';
import { displayName } from '../util';
import { GenderFemale, GenderMale } from './icons';
import { NormalLink } from './NormalLink';

export function IndividualName({ individual, placeholder, gender, noLink, noAncestry }) {
    const { data: { settings, ancestors, descendants } } = useSelector(state => state.gedcomFile);

    const name = displayName(individual);
    const content = name ? name : placeholder;
    const id = individual.pointer()[0];
    const isAncestor = ancestors && ancestors.has(id);
    const isDescendant = descendants && descendants.has(id);
    const hasAncestorIcon = !noAncestry && (isAncestor || isDescendant);
    const rootIndividualName = hasAncestorIcon && displayName(settings.rootIndividual, '?')
    const genderValue = individual.getSex().value()[0];
    const genderClass = `icon${hasAncestorIcon ? '' : ' mr-1'}`;
    return individual.length === 0 ? content : (
        <>
            {gender && (genderValue === ValueSex.Male ? <GenderMale className={`${genderClass} color-male`} /> : genderValue === ValueSex.Female ? <GenderFemale className={`${genderClass} color-female`} /> : <Question className={genderClass} />)}
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
                <NormalLink to={AppRoutes.individualFor(individual[0].pointer)}>
                    {content}
                </NormalLink>
            )}
        </>
    );
}

IndividualName.propTypes = {
    individual: PropTypes.instanceOf(SelectionIndividualRecord).isRequired,
    placeholder: PropTypes.string,
    gender: PropTypes.bool,
    noLink: PropTypes.bool,
    noAncestry: PropTypes.bool,
};

IndividualName.defaultProps = {
    placeholder: '?',
    gender: false,
    noLink: false,
    noAncestry: false,
};
