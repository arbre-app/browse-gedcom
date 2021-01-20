import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Record2Fill } from 'react-bootstrap-icons';
import { IndividualRecord } from 'read-gedcom';
import { AppRoutes } from '../../routes';
import { displayName } from '../../util';
import { NormalLink } from '../NormalLink';

export class IndividualName extends Component {

    render() {
        const { ancestors, individual, placeholder, noLink, noAncestry } = this.props;
        const name = displayName(individual);
        const content = name ? name : placeholder;
        return individual.isEmpty() ? content : (
            <>
                {!noAncestry && ancestors && ancestors.has(individual.pointer().one()) && (
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
    noLink: PropTypes.bool,
    noAncestry: PropTypes.bool,
    /* Redux */
    ancestors: PropTypes.instanceOf(Set), // Nullable
};

IndividualName.defaultProps = {
    placeholder: '?',
    noLink: false,
    noAncestry: false,
};
