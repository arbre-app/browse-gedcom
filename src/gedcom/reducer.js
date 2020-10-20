import { LOADING, SUCCESS, ERROR, CLEAR } from './actions';

export const initialState = {
    loading: false,
    data: null,
    error: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOADING:
            return {
                loading: true,
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
        case CLEAR:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}
