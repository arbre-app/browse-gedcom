import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link as RouterLink } from 'react-router-dom';

export class NormalLink extends Component {
    render() {
        const { to, children, ...other } = this.props;
        return (
            <LinkContainer to={to} {...other}>
                <RouterLink to={to}>
                    {children}
                </RouterLink>
            </LinkContainer>
        );
    }
}

NormalLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.any,
};

NormalLink.defaultProps = {
    children: null,
};