import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { AppRoutes } from '../../routes';

export class RedirectWall extends Component {
    render() {
        const { isFileLoaded, children } = this.props;
        if (isFileLoaded) {
            return children;
        } else {
            return <Redirect to={AppRoutes.loadGedcomFile} />;
        }
    }
}

RedirectWall.propTypes = {
    isFileLoaded: PropTypes.bool,
};

RedirectWall.defaultProps = {
    isFileLoaded: false,
};
