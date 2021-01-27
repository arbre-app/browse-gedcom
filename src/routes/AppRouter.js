import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PageHome, PageIndividual, PagePrint, PageSearch } from '../pages/private';
import { PageLoadFile, PageNotFound } from '../pages/public';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { AppRoutes } from './urls';

export class AppRouter extends Component {
    render() {
        return (
            <Switch>
                <PublicRoute path={AppRoutes.loadGedcomFile} exact restricted component={PageLoadFile} />

                <PrivateRoute path={AppRoutes.home} exact component={PageHome} />
                <PrivateRoute path={AppRoutes.individual} exact component={PageIndividual} />
                <PrivateRoute path={AppRoutes.search} exact component={PageSearch} />
                <PrivateRoute path={AppRoutes.print} exact component={PagePrint} />

                <PublicRoute component={PageNotFound} />
            </Switch>
        );
    }
}
