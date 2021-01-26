import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { version } from '../../package.json';

export class Footer extends Component {
    render() {
        return (
            <footer className="text-center text-muted mb-2">
                <FormattedMessage
                    id="footer.version"
                    values={{ version }}
                />
            </footer>
        );
    }
}

Footer.propTypes = {
};
