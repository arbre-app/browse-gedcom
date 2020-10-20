import { connect } from 'react-redux';
import { PrivateRoute as PrivateRouteComponent } from './PrivateRoute';

const mapStateToProps = state => ({
    file: state.gedcomFile.data && state.gedcomFile.data.root,
    settings: state.gedcomFile.data && state.gedcomFile.data.settings,
});

export const PrivateRoute = connect(
    mapStateToProps,
    null,
)(PrivateRouteComponent);
