import { LOADING, SUCCESS, ERROR, CLEAR_NOTIFICATIONS, BLOCK, SET_ROOT, CLEAR_FILE, LOADING_PROGRESS } from './actions';

export const initialState = {
    loading: false,
    data: null,
    error: null,
};

// eslint-disable-next-line
export default (state = initialState, action) => {
    switch (action.type) {
        case LOADING:
            return {
                loading: true,
                loadingPhase: 0,
                loadingPhaseProgress: 0,
                data: null,
                error: null,
            };
        case LOADING_PROGRESS:
            return {
                loading: true,
                loadingPhase: action.data.phase,
                loadingPhaseProgress: action.data.phaseProgress,
                data: null,
                error: null,
            };
        case ERROR:
            return {
                loading: false,
                data: null,
                error: action.error,
            };
        case SUCCESS:
            return {
                loading: false,
                data: action.data,
                error: null,
            };
        case CLEAR_FILE:
            return {
                loading: false,
                data: null,
                error: null,
            }
        case BLOCK:
            return {
                ...state,
                loading: true,
            };
        case SET_ROOT:
            return {
                ...state,
                loading: false,
                data: {
                    ...state.data,
                    settings: {
                        ...state.data.settings,
                        rootIndividual: action.data.rootIndividual,
                    },
                    ...action.data.dependant,
                },
            };
        case CLEAR_NOTIFICATIONS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}
