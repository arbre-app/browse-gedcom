import { generatePath } from 'react-router-dom';
import { stringifyUrl } from 'query-string';

const RoutesList = {
    home: '/',
    loadGedcomFile: '/load',
    individual: '/individual/:individualId',
    print: '/print',
};

const RouteGenearators = {
    individualFor: individualId => generatePath(RoutesList.individual, { individualId }),
    loadGedcomFileRedirectTo: cleanedUrl => stringifyUrl({ url: RoutesList.loadGedcomFile, query: { r: cleanedUrl } }),
};

export const AppRoutes = {
    ...RoutesList,
    ...RouteGenearators,
};
