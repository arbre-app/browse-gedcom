import PropTypes from 'prop-types';

export const PropRef = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
]);
