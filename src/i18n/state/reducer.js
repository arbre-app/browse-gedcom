import { SET_LANGUAGE } from './actions';

export const initialState = {
    data: null,
};

// eslint-disable-next-line
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                data: action.data,
            };
        default:
            return state;
    }
}
