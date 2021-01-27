import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { HelmetBase } from '../../HelmetBase';
import { PublicLayout } from '../PublicLayout';

export class PageNotFound extends Component {
    render() {
        return (
            <PublicLayout>
                <FormattedMessage id="page.not_found.head.title">
                    {([title]) => <HelmetBase title={title} />}
                </FormattedMessage>
                <FormattedMessage id="page.not_found.not_found"/>
            </PublicLayout>
        );
    }
}
