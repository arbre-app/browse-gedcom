import { connect } from 'react-redux';
import { clearNotifications, loadGedcomFile, loadGedcomUrl } from '../../../gedcom/actions';
import { PageLoadFile as PageLoadFileComponent } from './PageLoadFile';

const mapStateToProps = state => ({
    loading: state.gedcomFile.loading,
    error: state.gedcomFile.error,
});

const mapDispatchToProps = dispatch => ({
    loadGedcomFile: file => dispatch(loadGedcomFile(file)),
    loadGedcomUrl: url => dispatch(loadGedcomUrl(url)),
    clearNotifications: () => dispatch(clearNotifications()),
});

export const PageLoadFile = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageLoadFileComponent);
