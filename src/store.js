import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import gedcomFileReducer from './gedcom/reducer';

const rootReducer = combineReducers({
    gedcomFile: gedcomFileReducer,
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk),
);

export default store;
