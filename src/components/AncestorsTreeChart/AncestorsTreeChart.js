import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { IndividualRecord } from 'read-gedcom';
import './style.css';
import { AppRoutes } from '../../routes';
import { displayName } from '../../util';
import { NormalLink } from '../NormalLink';

export class AncestorsTreeChart extends Component {
    placeholderString = '?';

    renderNodeValue = individualOpt => {
        if (!individualOpt.isEmpty()) {
            const name = displayName(individualOpt, this.placeholderString);
            return (
                <NormalLink to={AppRoutes.individualFor(individualOpt.pointer()[0])}>
                    {name ? name : this.placeholderString}
                </NormalLink>
            );
        } else {
            return this.placeholderString;
        }
    };

    renderTreeLi = (individual, maxDepth) => {
        const familyOpt = individual.getFamilyAsChild().option();
        let child = null;
        if (maxDepth > 0 && !familyOpt.isEmpty()) {
            const family = familyOpt.first();
            const husband = family.getHusband().getIndividualRecord().option(),
                wife = family.getWife().getIndividualRecord().option();
            const currentDepth = maxDepth - 1;
            child = (
                <ul>
                    {this.renderTreeLi(husband, currentDepth)}
                    {this.renderTreeLi(wife, currentDepth)}
                </ul>
            );
        }
        return (
            <li>
                {child}
                <span>{this.renderNodeValue(individual.option())}</span>
            </li>
        );
    };

    render() {
        const { individual, maxDepth } = this.props;
        return (
            <ul className="ascending-tree">
                {this.renderTreeLi(individual, maxDepth)}
            </ul>
        );
    }
}

AncestorsTreeChart.propTypes = {
    individual: PropTypes.instanceOf(IndividualRecord).isRequired,
    maxDepth: PropTypes.number,
};

AncestorsTreeChart.defaultProps = {
    maxDepth: 3,
};
