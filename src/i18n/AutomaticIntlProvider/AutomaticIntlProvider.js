import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { getFallbackLanguage } from '../config';
import languageEN from '../locales/en.json';
import languageFR from '../locales/fr.json';

const DEFAULT_LANGUAGE = 'en';

export function AutomaticIntlProvider({ children, selectedLanguage }) {
    const locale = selectedLanguage || getFallbackLanguage();

    function messagesFor(locale) {
        const languageCode = locale && locale.split('-')[0]
        if(languageCode === 'en') {
            return languageEN;
        } else if(languageCode === 'fr') {
            return languageFR;
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
    /* Redux */
    selectedLanguage: PropTypes.string,
};
