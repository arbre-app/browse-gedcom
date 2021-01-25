import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import { AutomaticIntlProvider } from './i18n';
import { PageLoadFile, PageNotFound } from './pages/public';
import { PageHome, PageIndividual, PagePrint, PageSearch } from './pages/private';
import { AppRoutes, PublicRoute, PrivateRoute } from './routes';
import store from './store';
import history from './history';

export function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <AutomaticIntlProvider>
                    <Router history={history}>
                        <Switch>
                            <PublicRoute path={AppRoutes.loadGedcomFile} exact restricted component={PageLoadFile} />

                            <PrivateRoute path={AppRoutes.home} exact component={PageHome} />
                            <PrivateRoute path={AppRoutes.individual} exact component={PageIndividual} />
                            <PrivateRoute path={AppRoutes.search} exact component={PageSearch} />
                            <PrivateRoute path={AppRoutes.print} exact component={PagePrint} />

                            <PublicRoute component={PageNotFound} />
                        </Switch>
                    </Router>
                </AutomaticIntlProvider>
            </Provider>
        </div>
    );
}
