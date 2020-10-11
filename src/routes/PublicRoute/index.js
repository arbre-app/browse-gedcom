import { connect } from 'react-redux';
import { PublicRoute as PublicRouteComponent } from './PublicRoute';

const mapStateToProps = state => ({
    isFileLoaded: !!state.gedcomFile.data,
});

export const PublicRoute = connect(
    mapStateToProps,
    null,
)(PublicRouteComponent);
