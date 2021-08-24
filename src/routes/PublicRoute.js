import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AppRoutes } from './urls';
import { parse } from 'query-string';

export function PublicRoute({ location: { search }, component: Component, restricted, ...rest }) {
    const { data } = useSelector(state => state.gedcomFile);
    const isFileLoaded = !!data;
    if (restricted && isFileLoaded) {
        const redirect = parse(search).r;
        return <Redirect to={redirect !== undefined ? redirect : AppRoutes.home}/>;
    } else {
        return (
            <Route {...rest} render={props => <Component {...props} />}/>
        );
    }
}

PublicRoute.propTypes = {
    location: PropTypes.shape({
        search: PropTypes.string.isRequired,
    }),
    component: PropTypes.any.isRequired,
    restricted: PropTypes.bool,
};

PublicRoute.defaultProps = {
    restricted: false,
};
