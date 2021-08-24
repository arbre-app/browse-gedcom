import PropTypes from 'prop-types';
import { Content } from '../Content';
import { Footer } from '../Footer';
import { HelmetBase } from '../HelmetBase';
import { MenuBase } from '../MenuBase';

export function PublicLayout({ children }) {
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

PublicLayout.propTypes = {
    children: PropTypes.any,
};

PublicLayout.defaultProps = {
    children: null,
};
