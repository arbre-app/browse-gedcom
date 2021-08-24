import { FormattedMessage } from 'react-intl';
import { HelmetBase } from '../HelmetBase';
import { MixedLayout } from './MixedLayout';

export function PageNotFound() {
    return (
        <MixedLayout>
            <FormattedMessage id="page.not_found.head.title">
                {([title]) => <HelmetBase title={title} />}
            </FormattedMessage>
            <FormattedMessage id="page.not_found.not_found"/>
        </MixedLayout>
    );
}
