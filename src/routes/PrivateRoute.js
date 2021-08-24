import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AppRoutes } from './urls';

export function PrivateRoute({ location: { pathname }, component: Component, ...rest }) {
    const gedcomFile = useSelector(state => state.gedcomFile);
    const file = gedcomFile.data && gedcomFile.data.root;
    const settings = gedcomFile.data && gedcomFile.data.settings;

    const isFileLoaded = !!file;
    return (
        <Route {...rest}
               render={props => isFileLoaded ?
                   <Component file={file} settings={settings} {...props} /> :
                   <Redirect to={AppRoutes.loadGedcomFileRedirectTo(pathname)} />}
        />
    );
}

PrivateRoute.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
    component: PropTypes.any.isRequired,
};
