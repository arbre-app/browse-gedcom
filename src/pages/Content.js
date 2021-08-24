import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

export function Content({ children }) {
    return (
        <Container className="mt-2 mb-2">
            {children}
        </Container>
    );
}

Content.propTypes = {
    children: PropTypes.any,
};

Content.defaultProps = {
    children: null,
};
