import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { AppRoutes } from '../urls';
import { parse } from 'query-string';

export class PublicRoute extends Component {
    render() {
        const { location: { search }, component: Component, restricted, isFileLoaded, ...rest } = this.props;
        if (restricted && isFileLoaded) {
            const redirect = parse(search).r;
            return <Redirect to={redirect !== undefined ? redirect : AppRoutes.home}/>;
        } else {
            return (
                <Route {...rest} render={props => <Component {...props} />}/>
            );
        }
    }
}

PublicRoute.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string.isRequired,
    }),
    component: PropTypes.any.isRequired,
    restricted: PropTypes.bool,
    /* Redux */
    isFileLoaded: PropTypes.bool.isRequired,
};

PublicRoute.defaultProps = {
    restricted: false,
};
