import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { HelmetBase } from '../../HelmetBase';
import { MixedLayout } from '../MixedLayout';

export class PageNotFound extends Component {
    render() {
        return (
            <MixedLayout>
                <FormattedMessage id="page.not_found.head.title">
                    {([title]) => <HelmetBase title={title} />}
                </FormattedMessage>
                <FormattedMessage id="page.not_found.not_found"/>
            </MixedLayout>
        );
    }
}
