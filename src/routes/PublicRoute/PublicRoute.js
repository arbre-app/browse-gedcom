import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { AppRoutes } from '../urls';

export class PublicRoute extends Component {
    render() {
        const { component: Component, restricted, isFileLoaded, ...rest } = this.props;
        if(restricted && isFileLoaded) {
            return <Redirect to={AppRoutes.home} />
        } else {
            return (
                <Route {...rest} render={props => <Component {...props} />} />
            );
        }
    }
}

PublicRoute.propTypes = {
    component: PropTypes.any.isRequired,
    restricted: PropTypes.bool,
    /* Redux */
    isFileLoaded: PropTypes.bool.isRequired,
};

PublicRoute.defaultProps = {
    restricted: false,
}