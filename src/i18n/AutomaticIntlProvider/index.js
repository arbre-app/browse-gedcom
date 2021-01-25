import { AutomaticIntlProvider as AutomaticIntlProviderComponent } from './AutomaticIntlProvider';

import { connect } from 'react-redux';

const mapStateToProps = state => ({
    selectedLanguage: state.language.data,
});

export const AutomaticIntlProvider = connect(
    mapStateToProps,
    null,
)(AutomaticIntlProviderComponent);
