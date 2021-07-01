import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { GedcomSelection } from 'read-gedcom';
import './style.css';
import { IndividualName } from '../IndividualName';

export class AncestorsTreeChart extends Component {

    renderTreeLi = (individual, maxDepth, isRoot = false) => {
        const familyOpt = individual.getFamilyAsChild();
        let child = null;
        if (maxDepth > 0 && familyOpt.length > 0) {
            const family = familyOpt;
            const husband = family.getHusband().getIndividualRecord(),
                wife = family.getWife().getIndividualRecord();
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
                <span>
                    <IndividualName individual={individual} noLink={isRoot} />
                </span>
            </li>
        );
    };

    render() {
        const { individual, maxDepth } = this.props;
        return (
            <ul className="ascending-tree">
                {this.renderTreeLi(individual, maxDepth, true)}
            </ul>
        );
    }
}

AncestorsTreeChart.propTypes = {
    individual: PropTypes.instanceOf(GedcomSelection.IndividualRecord).isRequired,
    maxDepth: PropTypes.number,
};

AncestorsTreeChart.defaultProps = {
    maxDepth: 3,
};
