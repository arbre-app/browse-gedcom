import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Search, XCircle } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Form, FormControl, InputGroup, Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { AppRoutes } from '../../../routes';
import history from '../../../history';
import { Content } from '../../Content';
import { Footer } from '../../Footer';
import { HelmetBase } from '../../HelmetBase';
import { MenuBase } from '../../MenuBase';

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
        const { children, loading, clearGedcomFile } = this.props;
        const { searchQuery } = this.state;
        return (
            <>
                <HelmetBase /> {/* Helmet fallback */}
                <MenuBase
                    left={(
                        <>
                            <LinkContainer to={AppRoutes.home} exact>
                                <Nav.Link><FormattedMessage id="menu.overview"/></Nav.Link>
                            </LinkContainer>
                            <NavDropdown title={<FormattedMessage id="menu.file.title"/>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#" onClick={clearGedcomFile}>
                                    <XCircle className="icon mr-2"/>
                                    <FormattedMessage id="menu.file.close"/>
                                </NavDropdown.Item>
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
                    {loading ? (
                        <div className="my-4 text-center">
                            <Spinner animation="border" role="status">
                                <span className="sr-only"><FormattedMessage id="page.common.loading"/></span>
                            </Spinner>
                        </div>
                    ) : children}
                </Content>
                <Footer/>
            </>
        );
    }
}

PrivateLayout.propTypes = {
    children: PropTypes.any,
    /* Redux */
    loading: PropTypes.bool.isRequired,
    clearGedcomFile: PropTypes.func.isRequired,
};

PrivateLayout.defaultProps = {
    children: null,
};
