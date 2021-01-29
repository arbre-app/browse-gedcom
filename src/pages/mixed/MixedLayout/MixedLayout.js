import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { AppRoutes } from '../../../routes';
import { Content } from '../../Content';
import { Footer } from '../../Footer';
import { HelmetBase } from '../../HelmetBase';
import { MenuBase } from '../../MenuBase';
import { LinkContainer } from 'react-router-bootstrap';
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
