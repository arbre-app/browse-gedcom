import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';
import { AppRoutes } from '../../routes';
import { Content } from '../Content';
import { Footer } from '../Footer';
import { MenuBase } from '../MenuBase';

export class PublicLayout extends Component {
    render() {
        const { children } = this.props;
        return (
            <>
                <MenuBase
                    left={(
                        <>
                            {/*
                            <LinkContainer to={AppRoutes.about}>
                                <Nav.Link><FormattedMessage id="menu.about"/></Nav.Link>
                            </LinkContainer>
                            */}
                        </>
                    )}
                />
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
