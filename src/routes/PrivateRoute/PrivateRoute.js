import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { Gedcom } from 'read-gedcom';
import { AppRoutes } from '../urls';

export class PrivateRoute extends Component {
    render() {
        const { location: { pathname }, component: Component, file, settings, ...rest } = this.props;
        const isFileLoaded = !!file;
        return (
            <Route {...rest}
                   render={props => isFileLoaded ?
                       <Component file={file} settings={settings} {...props} /> :
                       <Redirect to={AppRoutes.loadGedcomFileRedirectTo(pathname)} />}
            />
        );
    }
}

PrivateRoute.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
    component: PropTypes.any.isRequired,
    /* Redux */
    file: PropTypes.instanceOf(Gedcom),
    settings: PropTypes.object,
};

PrivateRoute.defaultProps = {
    file: null,
    settings: null,
};
