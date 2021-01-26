import { generatePath } from 'react-router-dom';
import { stringifyUrl } from 'query-string';

const RoutesList = {
    home: '/',
    loadGedcomFile: '/load',
    about: '/about',
    individual: '/individual/:individualId',
    search: '/individuals/search',
    print: '/print',
};

const RouteGenerators = {
    individualFor: individualId => generatePath(RoutesList.individual, { individualId }),
    loadGedcomFileRedirectTo: cleanedUrl => stringifyUrl({ url: RoutesList.loadGedcomFile, query: { r: cleanedUrl } }),
    searchFor: (query, page = 1) => stringifyUrl({ url: RoutesList.search, query: { q: query, p: page } }),
};

export const AppRoutes = {
    ...RoutesList,
    ...RouteGenerators,
};
