import { readGedcom } from 'read-gedcom';
import { computeAncestors, computeDescendants, computeRelated, createInitialSettings } from '../util';

export const LOADING = 'gedcomFile/LOADING';
export const SUCCESS = 'gedcomFile/SUCCESS';
export const BLOCK = 'gedcomFile/BLOCK';
export const SET_ROOT = 'gedcomFile/SET_ROOT';
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
        console.error(error);
        dispatch({
            type: ERROR,
            error: error.message,
        });
        return;
    }
    const other = initializeAllFields(root);
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
        console.error(error);
        dispatch({
            type: ERROR,
            error: error.message,
        });
        return;
    }
    const other = initializeAllFields(root);
    dispatch({
        type: SUCCESS,
        data: {
            root,
            ...other,
        },
    });
};

export const clearNotifications = () => async dispatch => {
    dispatch({
        type: CLEAR,
    });
};

export const setRootIndividual = (root, rootIndividual) => async dispatch => {
    dispatch({
        type: BLOCK,
    });
    const dependant = computeDependantFields(root, rootIndividual);
    const data = { rootIndividual, dependant };
    dispatch({
        type: SET_ROOT,
        data: data,
    });
};

const initializeAllFields = root => {
    const settings = createInitialSettings(root);
    const dependant = computeDependantFields(root, settings.rootIndividual);
    return { settings, ...dependant };
};

const computeDependantFields = (root, rootIndividual) => {
    const ancestors = rootIndividual ? computeAncestors(root, rootIndividual) : null;
    const descendants = rootIndividual ? computeDescendants(root, rootIndividual) : null;
    const related = rootIndividual ? computeRelated(root, ancestors) : null;
    const statistics = computeStatistics(root, ancestors, descendants, related);
    return { ancestors, descendants, related, statistics };
};

const computeStatistics = (root, ancestors, descendants, related) => {
    const totalIndividuals = root.getIndividualRecord().count();
    const totalAncestors = ancestors !== null ? ancestors.size - 1 : null;
    const totalDescendants = descendants !== null ? descendants.size - 1 : null;
    const totalRelated = related !== null ? related.size - 1 : null;
    return { totalIndividuals, totalAncestors, totalDescendants, totalRelated };
};
