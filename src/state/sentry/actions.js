import * as Sentry from "@sentry/react";
import { SENTRY_DSN, SENTRY_ENABLED } from '../../config';
import { name, version } from '../../../package.json';

export const ENABLE = 'sentry/ENABLE';

export const activateSentry = () => async dispatch => {
    dispatch({
        type: ENABLE,
    });
    const environment = process.env.NODE_ENV;
    const isDevelopment = !environment || environment === 'development';
    if(!isDevelopment && SENTRY_ENABLED) { // SENTRY_ENABLED should always be true thanks to the UI
        Sentry.init({
            dsn: SENTRY_DSN,
            environment: isDevelopment ? 'development' : 'production',
            release: `${name}@${version}`,
        });
    }
};
