import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PrivateLayout } from '../private';
import { PublicLayout } from '../public';

export function MixedLayout({ children }) {
    const { data } = useSelector(state => state.gedcomFile);
    const isFileLoaded = !!data;
    return isFileLoaded ? (
        <PrivateLayout>
            {children}
        </PrivateLayout>
    ) : (
        <PublicLayout>
            {children}
        </PublicLayout>
    );
}

MixedLayout.propTypes = {
    children: PropTypes.any,
};

MixedLayout.defaultProps = {
    children: null,
};
