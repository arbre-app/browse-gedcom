import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { ChooseLanguage } from '../components/ChooseLanguage';
import { AppRoutes } from '../routes';
import { name } from '../../package.json';

export class MenuBase extends Component {
    render() {
        const { left, right } = this.props;
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <LinkContainer to={AppRoutes.home}>
                        <Navbar.Brand>{name}</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {left}
                        </Nav>
                        {right}
                        <ChooseLanguage className="ml-2"/>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

MenuBase.propTypes = {
    left: PropTypes.any,
    right: PropTypes.any,
};

MenuBase.defaultProps = {
    left: null,
    right: null,
};
