import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { PageAbout, PageNotFound } from '../pages/mixed';
import { PageHome, PageIndividual, PagePrint, PageSearch } from '../pages/private';
import { PageLoadFile } from '../pages/public';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { AppRoutes } from './urls';

export class AppRouter extends Component {
    render() {
        return (
            <Switch>
                <PublicRoute path={AppRoutes.loadGedcomFile} exact restricted component={PageLoadFile} />

                <PublicRoute path={AppRoutes.about} exact component={PageAbout} />

                <PrivateRoute path={AppRoutes.home} exact component={PageHome} />
                <PrivateRoute path={AppRoutes.individual} exact component={PageIndividual} />
                <PrivateRoute path={AppRoutes.search} exact component={PageSearch} />
                <PrivateRoute path={AppRoutes.print} exact component={PagePrint} />

                <PublicRoute component={PageNotFound} />
            </Switch>
        );
    }
}
