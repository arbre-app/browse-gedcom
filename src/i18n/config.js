import { Fr, Gb, Nl } from 'react-flags-select';

export const DEFAULT_LANGUAGE = 'en';

export function getFallbackLanguage() {
    if(navigator.language) {
        return navigator.language.split('-')[0];
    } else {
        return DEFAULT_LANGUAGE;
    }
}

export const AVAILABLE_LANGUAGES = [
    { locale: 'en', name: 'English', iconComponent: Gb },
    { locale: 'fr', name: 'Français', iconComponent: Fr },
    { locale: 'nl', name: 'Nederlands', iconComponent: Nl, authors: ['Bart Kummel'] }
];

export const AVAILABLE_SAMPLE_FILES = [
    { id: 'royal92', file: 'royal92.ged' },
    { id: 'pres2020', file: 'pres2020.ged' },
];
