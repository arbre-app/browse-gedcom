export const SET_LANGUAGE = 'i18n/SET_LANGUAGE';

export const setLanguage = locale => async dispatch => {
    dispatch({
        type: SET_LANGUAGE,
        data: locale,
    });
};
