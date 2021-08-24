import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Search, XCircle } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Form, FormControl, InputGroup, Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { AppRoutes } from '../../routes';
import history from '../../history';
import { clearGedcomFile } from '../../state/gedcom/actions';
import { Content } from '../Content';
import { Footer } from '../Footer';
import { HelmetBase } from '../HelmetBase';
import { MenuBase } from '../MenuBase';

export function PrivateLayout({ children }) {
    const { loading } = useSelector(state => state.gedcomFile);
    const dispatch = useDispatch();
    const clearGedcomFileDispatch = () => dispatch(clearGedcomFile());

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = event => {
        const query = searchQuery.trim();

        event.preventDefault();
        event.stopPropagation();

        if (query) { // Empty string is no-op
            setSearchQuery('');
            history.push(AppRoutes.searchFor(query))
        }
    }

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
                            <NavDropdown.Item href="#" onClick={clearGedcomFileDispatch}>
                                <XCircle className="icon mr-2"/>
                                <FormattedMessage id="menu.file.close"/>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </>
                )}
                right={(
                    <Form inline onSubmit={handleSearchSubmit}>
                        <InputGroup>
                            <FormattedMessage id="menu.search.placeholder">
                                {placeholder => (
                                    <FormControl type="text" placeholder={placeholder} value={searchQuery} onChange={event => setSearchQuery(event.target.value)}/>
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

PrivateLayout.propTypes = {
    children: PropTypes.any,
};

PrivateLayout.defaultProps = {
    children: null,
};
