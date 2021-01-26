import { readGedcom } from 'read-gedcom';
import { computeAncestors, computeDescendants, createInitialSettings } from '../util';

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
    const ancestors = settings.rootIndividual ? computeAncestors(root, settings.rootIndividual) : null;
    const descendants = settings.rootIndividual ? computeDescendants(root, settings.rootIndividual) : null;
    const statistics = computeStatistics(root, settings, ancestors, descendants);
    return { settings, ancestors, descendants, statistics };
};

const computeStatistics = (root, settings, ancestors, descendants) => {
     const totalIndividuals = root.getIndividualRecord().count();
     const totalAncestors = ancestors !== null ? ancestors.size - 1 : null;
    const totalDescendants = descendants !== null ? descendants.size - 1 : null;
    return { totalIndividuals, totalAncestors, totalDescendants };
};

export const clearNotifications = () => async dispatch => {
    dispatch({
        type: CLEAR,
    });
};
