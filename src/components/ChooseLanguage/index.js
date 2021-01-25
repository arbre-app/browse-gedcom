import { connect } from 'react-redux';
import { setLanguage } from '../../i18n/state/actions';
import { ChooseLanguage as ChooseLanguageComponent } from './ChooseLanguage';

const mapStateToProps = state => ({
    selectedLanguage: state.language.data,
});

const mapDispatchToProps = dispatch => ({
    setLanguage: locale => dispatch(setLanguage(locale)),
});

export const ChooseLanguage = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChooseLanguageComponent);
