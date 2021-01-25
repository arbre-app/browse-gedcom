import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Search } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Container, Form, FormControl, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { ChooseLanguage } from '../../components/ChooseLanguage';
import { AppRoutes } from '../../routes';
import history from '../../history';
import { name, version } from '../../../package.json';

export class PrivateLayout extends Component {
    state = {
        searchQuery: '',
    }

    handleSearchSubmit = event => {
        const { searchQuery } = this.state;
        const query = searchQuery.trim();

        event.preventDefault();
        event.stopPropagation();

        if (query) { // Empty string is no-op
            this.setState({ searchQuery: '' });
            history.push(AppRoutes.searchFor(query))
        }
    }

    render() {
        const { children } = this.props;
        const { searchQuery } = this.state;
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <LinkContainer to={AppRoutes.home}>
                            <Navbar.Brand>{ name }</Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <LinkContainer to={AppRoutes.home}>
                                    <Nav.Link><FormattedMessage id="menu.overview"/></Nav.Link>
                                </LinkContainer>
                                <NavDropdown title={<FormattedMessage id="menu.explore"/>} id="basic-nav-dropdown">
                                </NavDropdown>
                            </Nav>
                            <Form inline onSubmit={this.handleSearchSubmit}>
                                <FormattedMessage id="menu.search.placeholder">
                                    {placeholder => (
                                        <FormControl type="text" placeholder={placeholder} className="mr-sm-2" value={searchQuery} onChange={event => this.setState({ searchQuery: event.target.value })}/>
                                    )}
                                </FormattedMessage>
                                <Button variant="outline-secondary">
                                    <Search className="icon" />
                                </Button>
                            </Form>
                            <ChooseLanguage className="ml-4" />
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container className="mt-2 mb-2">
                    {children}
                </Container>
                <footer className="text-center text-muted mb-2">
                    <FormattedMessage
                        id="footer.version"
                        values={{ version }}
                    />
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
