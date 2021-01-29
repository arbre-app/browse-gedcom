import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PrivateLayout } from '../../private';
import { PublicLayout } from '../../public';

export class MixedLayout extends Component {
    render() {
        const { children, isFileLoaded } = this.props;
        return isFileLoaded ? (
            <PrivateLayout>
                {children}
            </PrivateLayout>
        ) : (
            <PublicLayout>
                {children}
            </PublicLayout>
        );
    }
}

MixedLayout.propTypes = {
    children: PropTypes.any,
    /* Redux */
    isFileLoaded: PropTypes.bool.isRequired,
};

MixedLayout.defaultProps = {
    children: null,
};
