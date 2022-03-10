import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { getFallbackLanguage } from './config';
import languageEN from './locales/en.json';
import languageFR from './locales/fr.json';
import languageNL from './locales/nl.json';

const DEFAULT_LANGUAGE = 'en';

export function AutomaticIntlProvider({ children }) {
    const { data: selectedLanguage } = useSelector(state => state.language)
    const locale = selectedLanguage || getFallbackLanguage();

    function messagesFor(locale) {
        const languageCode = locale && locale.split('-')[0]
        if(languageCode === 'en') {
            return languageEN;
        } else if(languageCode === 'fr') {
            return languageFR;
        } else if(languageCode === 'nl') {
            return languageNL;
        } else {
            return null;
        }
    }

    return (
        <IntlProvider messages={messagesFor(locale)} locale={locale} defaultLocale={DEFAULT_LANGUAGE}>
            {children}
        </IntlProvider>
    );
}

AutomaticIntlProvider.propTypes = {
    children: PropTypes.any.isRequired,
};
