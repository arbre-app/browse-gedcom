import * as Sentry from '@sentry/react';
import { selectGedcom } from 'read-gedcom';
import {
    computeAncestors,
    computeDescendants,
    computeRelated,
    createInitialSettings,
    topologicalSort,
} from '../../util';
import { workerApi } from '../../workerApi';
import * as Comlink from 'comlink';

export const LOADING = 'gedcomFile/LOADING';
export const LOADING_PROGRESS = 'gedcomFile/LOADING_PROGRESS';
export const SUCCESS = 'gedcomFile/SUCCESS';
export const CLEAR_FILE = 'gedcomFile/CLEAR_FILE';
export const BLOCK = 'gedcomFile/BLOCK';
export const SET_ROOT = 'gedcomFile/SET_ROOT';
export const ERROR = 'gedcomFile/ERROR';
export const CLEAR_NOTIFICATIONS = 'gedcomFile/CLEAR_NOTIFICATIONS';

const readGedcomFromBuffer = dispatch => buffer => new Promise((resolve, reject) => {
    let running = true;
    const progressCallback = (phase, phaseProgress) => {
        if (running) {
            dispatch({
                type: LOADING_PROGRESS,
                data: {
                    phase,
                    phaseProgress,
                },
            });
        }
    };
    workerApi.parseGedcom(buffer, Comlink.proxy(progressCallback))
        .then(node => {
            running = false;
            resolve(selectGedcom(node));
        }, error => {
            running = false;
            reject(error);
        });
});

export const loadGedcomUrl = (url, isSentryEnabled = false) => async dispatch => {
    dispatch({
        type: LOADING,
    });
    let root = null;
    try {
        const result = await fetch(url);
        const buffer = await result.arrayBuffer();
        root = await readGedcomFromBuffer(dispatch)(buffer);
    } catch (error) {
        console.error(error);
        if(isSentryEnabled) {
            Sentry.captureException(error);
        }
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

export const loadGedcomFile = (file, isSentryEnabled = false) => async dispatch => {
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
        root = await readGedcomFromBuffer(dispatch)(buffer);
    } catch (error) {
        console.error(error);
        if(isSentryEnabled) {
            Sentry.captureException(error);
        }
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

export const clearGedcomFile = () => async dispatch => {
    dispatch({
        type: CLEAR_FILE,
    })
}

export const clearNotifications = () => async dispatch => {
    dispatch({
        type: CLEAR_NOTIFICATIONS,
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
    const { topologicalArray, topologicalOrdering } = topologicalSort(root);
    const inbreedingMap = new Map(), relatednessMap = new Map();
    const dependant = computeDependantFields(root, settings.rootIndividual);
    return { settings, topologicalArray, topologicalOrdering, inbreedingMap, relatednessMap, ...dependant };
};

const computeDependantFields = (root, rootIndividual) => {
    const ancestors = rootIndividual ? computeAncestors(root, rootIndividual) : null;
    const descendants = rootIndividual ? computeDescendants(root, rootIndividual) : null;
    const related = rootIndividual ? computeRelated(root, ancestors) : null;
    const statistics = computeStatistics(root, ancestors, descendants, related);
    return { ancestors, descendants, related, statistics };
};

const computeStatistics = (root, ancestors, descendants, related) => {
    const totalIndividuals = root.getIndividualRecord().length;
    const totalAncestors = ancestors !== null ? ancestors.size - 1 : null;
    const totalDescendants = descendants !== null ? descendants.size - 1 : null;
    const totalRelated = related !== null ? related.size - 1 : null;
    return { totalIndividuals, totalAncestors, totalDescendants, totalRelated };
};
