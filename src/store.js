import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import gedcomFileReducer from './state/gedcom/reducer';
import sentryReducer from './state/sentry/reducer';
import languageReducer from './i18n/state/reducer';

const rootReducer = combineReducers({
    gedcomFile: gedcomFileReducer,
    language: languageReducer,
    sentry: sentryReducer,
});

const store = createStore(
    rootReducer,
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(
        applyMiddleware(thunk)
    )
);

export default store;
