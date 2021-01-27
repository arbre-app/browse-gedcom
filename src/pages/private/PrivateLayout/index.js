import { connect } from 'react-redux';
import { PrivateLayout as PrivateLayoutComponent } from './PrivateLayout';

const mapStateToProps = state => ({
    loading: state.gedcomFile.loading,
});

export const PrivateLayout = connect(
    mapStateToProps,
    null,
)(PrivateLayoutComponent);
