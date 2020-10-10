import { connect } from 'react-redux';
import { clearNotifications, loadGedcomFile, loadGedcomUrl } from '../../gedcom/actions';
import { Page as PageComponent } from './Page';

const mapStateToProps = state => ({
    loading: state.gedcomFile.loading,
    file: state.gedcomFile.data,
    error: state.gedcomFile.error,
});

const mapDispatchToProps = dispatch => ({
    loadGedcomFile: file => dispatch(loadGedcomFile(file)),
    loadGedcomUrl: url => dispatch(loadGedcomUrl(url)),
    clearNotifications: () => dispatch(clearNotifications()),
});

export const Page = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageComponent);
