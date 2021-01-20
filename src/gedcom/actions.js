import { readGedcom } from 'read-gedcom';
import { computeAncestors, createInitialSettings } from '../util';

export const LOADING = 'gedcomFile/LOADING';
export const SUCCESS = 'gedcomFile/SUCCESS';
export const ERROR = 'gedcomFile/ERROR';
export const CLEAR = 'gedcomFile/CLEAR';

export const loadGedcomUrl = url => async dispatch => {
    dispatch({
        type: LOADING,
    });
    let root = null;
    try {
        const result = await fetch(url);
        const buffer = await result.arrayBuffer();
        root = readGedcom(buffer);
    } catch (error) {
        dispatch({
            type: ERROR,
            error: error.message,
        });
        return;
    }
    const other = initializeFields(root);
    dispatch({
        type: SUCCESS,
        data: {
            root,
            ...other,
        },
    });
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
    let root = null;
    try {
        const buffer = await promise;
        root = readGedcom(buffer);
    } catch (error) {
        dispatch({
            type: ERROR,
            error: error.message,
        });
        return;
    }
    const other = initializeFields(root);
    dispatch({
        type: SUCCESS,
        data: {
            root,
            ...other,
        },
    });
};

const initializeFields = root => {
    const settings = createInitialSettings(root);
    let ancestors = initializeAncestry(root, settings);
    return { settings, ancestors };
};

const initializeAncestry = (root, settings) => {
    return settings.rootIndividual ? computeAncestors(root, settings.rootIndividual) : null;
}

export const clearNotifications = () => async dispatch => {
    dispatch({
        type: CLEAR,
    });
};
