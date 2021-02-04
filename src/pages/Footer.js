import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { version } from '../../package.json';
import { NormalLink } from '../components';
import { AppRoutes } from '../routes';

export class Footer extends Component {
    render() {
        return (
            <footer className="text-center text-muted mb-2">
                <div>
                    <FormattedMessage
                        id="footer.version"
                        values={{ version }}
                    />
                </div>
                <div>
                    <FormattedMessage
                        id="footer.changelog"
                        values={{ a: chunk => <NormalLink to={AppRoutes.changelog}>{chunk}</NormalLink> }}
                    />
                </div>
            </footer>
        );
    }
}

Footer.propTypes = {
};
