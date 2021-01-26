import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Search } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Form, FormControl, InputGroup, Nav, NavDropdown } from 'react-bootstrap';
import { AppRoutes } from '../../routes';
import history from '../../history';
import { Content } from '../Content';
import { Footer } from '../Footer';
import { MenuBase } from '../MenuBase';

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
                <MenuBase
                    left={(
                        <>
                            <LinkContainer to={AppRoutes.home}>
                                <Nav.Link><FormattedMessage id="menu.overview"/></Nav.Link>
                            </LinkContainer>
                            <NavDropdown title={<FormattedMessage id="menu.explore"/>} id="basic-nav-dropdown">
                            </NavDropdown>
                        </>
                    )}
                    right={(
                        <Form inline onSubmit={this.handleSearchSubmit}>
                            <InputGroup>
                                <FormattedMessage id="menu.search.placeholder">
                                    {placeholder => (
                                        <FormControl type="text" placeholder={placeholder} value={searchQuery} onChange={event => this.setState({ searchQuery: event.target.value })}/>
                                    )}
                                </FormattedMessage>
                                <InputGroup.Append>
                                    <Button variant="outline-secondary">
                                        <Search className="icon" />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form>
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

PrivateLayout.propTypes = {
    children: PropTypes.any,
};

PrivateLayout.defaultProps = {
    children: null,
};
