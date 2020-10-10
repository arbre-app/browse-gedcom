import { generatePath } from 'react-router-dom';

const RoutesList = {
    home: '/',
    loadGedcomFile: '/load',
};

const RouteGenearators = {};

export const AppRoutes = {
    ...RoutesList,
    ...RouteGenearators,
};
