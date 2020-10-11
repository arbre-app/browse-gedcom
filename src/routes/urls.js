import { generatePath } from 'react-router-dom';

const RoutesList = {
    home: '/',
    loadGedcomFile: '/load',
    individual: '/individual/:individualId',
};

const RouteGenearators = {
    individualFor: individualId => generatePath(RoutesList.individual, { individualId }),
};

export const AppRoutes = {
    ...RoutesList,
    ...RouteGenearators,
};
