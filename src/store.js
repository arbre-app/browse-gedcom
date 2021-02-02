import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import gedcomFileReducer from './gedcom/reducer';
import languageReducer from './i18n/state/reducer';

const rootReducer = combineReducers({
    gedcomFile: gedcomFileReducer,
    language: languageReducer,
});

const store = createStore(
    rootReducer,
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
        applyMiddleware(thunk)
    )
);

export default store;
