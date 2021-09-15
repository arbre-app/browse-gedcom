import PropTypes from 'prop-types';
import { SelectionIndividualRecord } from 'read-gedcom';
import './AncestorsTreeChart.css';
import { IndividualName } from '../IndividualName';

export function AncestorsTreeChart({ individual, maxDepth }) {
    const renderTreeLi = (individual, maxDepth, isRoot = false) => {
        const familyOpt = individual.getFamilyAsChild();
        let child = null;
        if (maxDepth > 0 && familyOpt.length > 0) {
            const family = familyOpt;
            const husband = family.getHusband().getIndividualRecord(),
                wife = family.getWife().getIndividualRecord();
            const currentDepth = maxDepth - 1;
            child = (
                <ul>
                    {renderTreeLi(husband, currentDepth)}
                    {renderTreeLi(wife, currentDepth)}
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

    return (
        <ul className="ascending-tree">
            {renderTreeLi(individual, maxDepth, true)}
        </ul>
    );
}

AncestorsTreeChart.propTypes = {
    individual: PropTypes.instanceOf(SelectionIndividualRecord).isRequired,
    maxDepth: PropTypes.number,
};

AncestorsTreeChart.defaultProps = {
    maxDepth: 3,
};
