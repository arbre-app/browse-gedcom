import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Search } from 'react-bootstrap-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Container, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { AppRoutes } from '../../routes';
import { version } from '../../../package.json'

export class PrivateLayout extends Component {
    render() {
        const { children } = this.props;
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <LinkContainer to={AppRoutes.home}>
                            <Navbar.Brand>browse-gedcom</Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <LinkContainer to={AppRoutes.home}>
                                    <Nav.Link>Overview</Nav.Link>
                                </LinkContainer>
                                <NavDropdown title="Explore" id="basic-nav-dropdown">
                                </NavDropdown>
                            </Nav>
                            <Form inline>
                                <FormControl type="text" placeholder="Global search..." className="mr-sm-2"/>
                                <Button variant="outline-secondary">
                                    <Search/>
                                </Button>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container className="mt-2 mb-2">
                    {children}
                </Container>
                <footer className="text-center text-muted mb-2">
                    Version {version}
                </footer>
            </>
        );
    }
}

PrivateLayout.propTypes = {
    children: PropTypes.any,
};

PrivateLayout.defaultProps = {
    children: null,
};
