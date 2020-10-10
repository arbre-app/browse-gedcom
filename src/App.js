import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Page } from './components/Page';
import store from './store';

export function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route>
                            <Page />
                        </Route>
                    </Switch>
                </Router>
            </Provider>
        </div>
    );
}
