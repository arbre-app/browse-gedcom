import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

export class Content extends Component {
    render() {
        const { children } = this.props;
        return (
            <Container className="mt-2 mb-2">
                {children}
            </Container>
        );
    }
}

Content.propTypes = {
    children: PropTypes.any,
};

Content.defaultProps = {
    children: null,
};
