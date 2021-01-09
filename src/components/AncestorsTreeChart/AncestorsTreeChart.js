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
                <NormalLink to={AppRoutes.individualFor(individualOpt.pointer().one())}>
                    {name ? name : this.placeholderString}
                </NormalLink>
            );
        } else {
            return this.placeholderString;
        }
    };

    renderTreeLi = (individual, maxDepth) => {
        const familyOpt = individual.getFamilyAsChild(1);
        let child = null;
        if (maxDepth > 0 && !familyOpt.isEmpty()) {
            const family = familyOpt;
            const husband = family.getHusband(1).getIndividualRecord(),
                wife = family.getWife(1).getIndividualRecord();
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
                <span>{this.renderNodeValue(individual)}</span>
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
