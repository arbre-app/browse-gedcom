import { ENABLE } from './actions';

export const initialState = {
    enabled: false,
};

// eslint-disable-next-line
export default (state = initialState, action) => {
    switch (action.type) {
        case ENABLE:
            return {
                enabled: true,
            };
        default:
            return state;
    }
}
