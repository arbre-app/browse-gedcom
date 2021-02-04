import React from 'react';
import { Accordion, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FileDiff, PeopleFill, Pin } from 'react-bootstrap-icons';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { HelmetBase } from '../../HelmetBase';
import { MixedLayout } from '../MixedLayout';
import { version as currentVersion } from '../../../../package.json';
import changelog from './changelog.json';

export const PageChangelog = () => {
    const intl = useIntl();

    const renderI18n = i18nText => {
        return i18nText[intl.locale] || i18nText[intl.defaultLocale];
    };

    const renderSection = (content, titleKey) => {
        if(!content || content.length === 0) {
            return null;
        }
        return (
            <>
                <h6><FormattedMessage id={titleKey}/></h6>
                <ul>
                    {content.map((item, i) => (
                        <li key={i}>
                            {renderI18n(item)}
                            {item.authors && item.authors.length > 0 && (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={(
                                        <Tooltip id="tooltip-authors">
                                            <FormattedMessage id="page.changelog.thanks_to" values={{ authors: item.authors.join(', ') }}/>
                                        </Tooltip>
                                    )}>
                                    <PeopleFill className="icon ml-2 hoverable"/>
                                </OverlayTrigger>
                            )}
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    return (
        <MixedLayout>
            <FormattedMessage id="page.changelog.head.title">
                {([title]) => <HelmetBase title={title} />}
            </FormattedMessage>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FileDiff className="icon mr-2"/>
                        <FormattedMessage id="page.changelog.title"/>
                    </Card.Title>
                    <Accordion defaultActiveKey={currentVersion}>
                        {Object.entries(changelog).map(([version, changes]) => (
                            <Card key={version}>
                                <Accordion.Toggle as={Card.Header} eventKey={version}>
                                    <h3>{version}{version === currentVersion && <Pin className="icon ml-2" />}</h3>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={version}>
                                    <Card.Body>
                                        <p><em><FormattedDate value={changes.date}/></em></p>
                                        {changes.description && <p>{renderI18n(changes.description)}</p>}
                                        {renderSection(changes.additions, "page.changelog.features")}
                                        {renderSection(changes.fixes, "page.changelog.fixes")}
                                        {renderSection(changes.deletions, "page.changelog.dropped")}
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        ))}
                    </Accordion>
                </Card.Body>
            </Card>
        </MixedLayout>
    );
};
