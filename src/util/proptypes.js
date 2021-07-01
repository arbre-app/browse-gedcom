import PropTypes from 'prop-types';

export const GedcomTreeNodeType = PropTypes.shape({
    tag: PropTypes.string,
    pointer: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.array.isRequired, // Lose type
});
