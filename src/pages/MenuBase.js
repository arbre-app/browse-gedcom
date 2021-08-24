import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { ChooseLanguage } from '../components/ChooseLanguage';
import { APP_NAME_HTML } from '../config';
import { AppRoutes } from '../routes';

export function MenuBase({ left, right }) {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to={AppRoutes.home}>
                    <Navbar.Brand dangerouslySetInnerHTML={{ __html: APP_NAME_HTML }}/>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {left}
                        <LinkContainer to={AppRoutes.about}>
                            <Nav.Link><FormattedMessage id="menu.about"/></Nav.Link>
                        </LinkContainer>
                    </Nav>
                    {right}
                    <ChooseLanguage className="ml-lg-2 mt-lg-0 mt-2"/>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

MenuBase.propTypes = {
    left: PropTypes.any,
    right: PropTypes.any,
};

MenuBase.defaultProps = {
    left: null,
    right: null,
};
