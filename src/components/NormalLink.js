import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Link as RouterLink } from 'react-router-dom';

export function NormalLink({ to, children, ...other }) {
    return (
        <LinkContainer to={to} {...other}>
            <RouterLink to={to}>
                {children}
            </RouterLink>
        </LinkContainer>
    );
}

NormalLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.any,
};

NormalLink.defaultProps = {
    children: null,
};
