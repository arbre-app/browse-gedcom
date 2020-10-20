import { readGedcom } from 'read-gedcom';
import { createInitialSettings } from '../util/settings';

export const LOADING = 'gedcomFile/LOADING';
export const SUCCESS = 'gedcomFile/SUCCESS';
export const ERROR = 'gedcomFile/ERROR';
export const CLEAR = 'gedcomFile/CLEAR';

export const loadGedcomUrl = url => async dispatch => {
    dispatch({
        type: LOADING,
    });
    try {
        const result = await fetch(url);
        const buffer = await result.arrayBuffer();
        const root = readGedcom(buffer);
        const settings = createInitialSettings(root);
        dispatch({
            type: SUCCESS,
            data: {
                root,
                settings,
            },
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            error: error.message,
        });
    }
};

export const loadGedcomFile = file => async dispatch => {
    dispatch({
        type: LOADING,
    });
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
        reader.onload = e => {
            const buffer = e.target.result;
            resolve(buffer);
        };
        reader.onerror = e => {
            reject(new Error(e.message));
        };
        reader.readAsArrayBuffer(file);
    });
    try {
        const buffer = await promise;
        const root = readGedcom(buffer);
        const settings = createInitialSettings(root);
        dispatch({
            type: SUCCESS,
            data: {
                root,
                settings,
            },
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            error: error.message,
        });
    }
};

export const clearNotifications = () => async dispatch => {
    dispatch({
        type: CLEAR,
    });
};
