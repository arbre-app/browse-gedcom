import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { PublicLayout } from '../PublicLayout';

export class PageNotFound extends Component {
    render() {
        return (
            <PublicLayout>
                <FormattedMessage id="page.not_found.not_found"/>
            </PublicLayout>
        );
    }
}
