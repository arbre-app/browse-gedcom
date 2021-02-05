import { connect } from 'react-redux';
import { clearGedcomFile } from '../../../state/gedcom/actions';
import { PrivateLayout as PrivateLayoutComponent } from './PrivateLayout';

const mapStateToProps = state => ({
    loading: state.gedcomFile.loading,
});

const mapDispatchToProps = dispatch => ({
    clearGedcomFile: () => dispatch(clearGedcomFile()),
});

export const PrivateLayout = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PrivateLayoutComponent);
