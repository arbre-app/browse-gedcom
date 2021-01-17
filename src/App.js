import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { PageLoadFile, PageNotFound } from './pages/public';
import { PageHome, PageIndividual, PagePrint } from './pages/private';
import { AppRoutes, PublicRoute, PrivateRoute } from './routes';
import store from './store';

export function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <Router>
                    <Switch>
                        <PublicRoute path={AppRoutes.loadGedcomFile} exact restricted component={PageLoadFile} />

                        <PrivateRoute path={AppRoutes.home} exact component={PageHome} />
                        <PrivateRoute path={AppRoutes.individual} exact component={PageIndividual} />
                        <PrivateRoute path={AppRoutes.print} exact component={PagePrint} />

                        <PublicRoute component={PageNotFound} />
                    </Switch>
                </Router>
            </Provider>
        </div>
    );
}
