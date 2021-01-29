import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Content } from '../Content';
import { Footer } from '../Footer';
import { HelmetBase } from '../HelmetBase';
import { MenuBase } from '../MenuBase';

export class PublicLayout extends Component {
    render() {
        const { children } = this.props;
        return (
            <>
                <HelmetBase /> {/* Helmet fallback */}
                <MenuBase/>
                <Content>
                    {children}
                </Content>
                <Footer/>
            </>
        );
    }
}

PublicLayout.propTypes = {
    children: PropTypes.any,
};

PublicLayout.defaultProps = {
    children: null,
};
