import { connect } from 'react-redux';
import { clearNotifications, loadGedcomFile, loadGedcomUrl } from '../../../state/gedcom/actions';
import { activateSentry } from '../../../state/sentry/actions';
import { PageLoadFile as PageLoadFileComponent } from './PageLoadFile';

const mapStateToProps = state => ({
    loading: state.gedcomFile.loading,
    error: state.gedcomFile.error,
    isSentryEnabled: state.sentry.enabled,
});

const mapDispatchToProps = dispatch => ({
    loadGedcomFile: (file, isSentryEnabled) => dispatch(loadGedcomFile(file, isSentryEnabled)),
    loadGedcomUrl: (url, isSentryEnabled) => dispatch(loadGedcomUrl(url, isSentryEnabled)),
    clearNotifications: () => dispatch(clearNotifications()),
    activateSentry: () => dispatch(activateSentry()),
});

export const PageLoadFile = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageLoadFileComponent);
