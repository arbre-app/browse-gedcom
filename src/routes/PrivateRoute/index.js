import { connect } from 'react-redux';
import { PrivateRoute as PrivateRouteComponent } from './PrivateRoute';

const mapStateToProps = state => ({
    file: state.gedcomFile.data,
});

export const PrivateRoute = connect(
    mapStateToProps,
    null,
)(PrivateRouteComponent);
