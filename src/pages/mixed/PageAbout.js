import { Fragment } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CodeSlash, Envelope, InfoCircle, People } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { AVAILABLE_LANGUAGES } from '../../i18n';
import { HelmetBase } from '../HelmetBase';
import { MixedLayout } from './MixedLayout';
import { name } from '../../../package.json';

export function PageAbout() {
    const renderContactEmail = () => {
        // Stupid method that prevents scrapers from accessing the address
        const email = [...window.atob('cHBhLmVyYnJhQHRjYXRub2M=')].reverse().join('');
        return <strong><a href={`mailto:${email}`} target="_blank" rel="noreferrer">{email}</a></strong>;
    };

    return (
        <MixedLayout>
            <FormattedMessage id="page.about.head.title">
                {([title]) => <HelmetBase title={title} />}
            </FormattedMessage>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <InfoCircle className="icon mr-2"/>
                        <FormattedMessage id="page.about.about.title"/>
                    </Card.Title>
                    <p>
                        <FormattedMessage id="page.about.about.description" values={{ name: <strong><a href="https://florian.cassayre.me" target="_blank" rel="noreferrer">Florian Cassayre</a></strong> }}/>
                    </p>
                        <FormattedMessage id="page.about.about.translations" />
                    <ul>
                        {AVAILABLE_LANGUAGES
                            .filter(({ authors }) => authors && authors.length > 0)
                            .map(({ locale, name, authors, iconComponent: IconComponent }) => (
                                <li key={locale}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={props => (
                                            <Tooltip id={`tooltip-${locale}`} {...props}>
                                                {name} ({locale.toUpperCase()})
                                            </Tooltip>
                                        )}
                                    >
                                        <IconComponent className="icon mr-2" />
                                    </OverlayTrigger>
                                    {authors.map((author, i) => (
                                        <Fragment key={i}>
                                            {author}
                                        </Fragment>
                                    ))}
                                </li>
                            ))}
                    </ul>

                    <Card.Title>
                        <Envelope className="icon mr-2"/>
                        <FormattedMessage id="page.about.contact.title"/>
                    </Card.Title>
                    <p>
                        <FormattedMessage id="page.about.contact.description" values={{ email: renderContactEmail() }}/>
                    </p>
                    <Card.Title>
                        <People className="icon mr-2"/>
                        <FormattedMessage id="page.about.contribute.title"/>
                    </Card.Title>
                    <p>
                        <FormattedMessage id="page.about.contribute.thank_you"/>
                    </p>
                    <ul>
                        <li>
                            <FormattedMessage id="page.about.contribute.suggestions_bugs"/>
                        </li>
                        <li>
                            <FormattedMessage
                                id="page.about.contribute.translations"
                                values={{
                                    a: chunk => <a href="https://crowdin.com/project/monarbreapp" target="_blank" rel="noreferrer">{chunk}</a>,
                                }}
                            />
                        </li>
                        <li>
                            <FormattedMessage id="page.about.contribute.development"/>
                        </li>
                    </ul>
                    <p>
                        <FormattedMessage id="page.about.contribute.contact"/>
                    </p>

                    <Card.Title>
                        <CodeSlash className="icon mr-2" />
                        <FormattedMessage id="page.about.developers.title"/>
                    </Card.Title>
                    <p>
                        <FormattedMessage id="page.about.developers.description"/>
                    </p>
                    <ul>
                        <li>
                            <FormattedMessage id="page.about.developers.read_gedcom" values={{ name: <a href="https://github.com/arbre-app/read-gedcom" target="_blank" rel="noreferrer">read-gedcom</a> }}/>
                        </li>
                        <li>
                            <FormattedMessage id="page.about.developers.genealogy_visualizations" values={{ name: <a href="https://github.com/arbre-app/genealogy-visualizations" target="_blank" rel="noreferrer">genealogy-visualizations</a> }}/>
                        </li>
                        <li>
                            <FormattedMessage id="page.about.developers.public_gedcoms" values={{ name: <a href="https://github.com/arbre-app/public-gedcoms" target="_blank" rel="noreferrer">public-gedcoms</a> }}/>
                        </li>
                        <li>
                            <FormattedMessage id="page.about.developers.browse_gedcom" values={{ name: <a href="https://github.com/arbre-app/browse-gedcom" target="_blank" rel="noreferrer">{name}</a> }}/>
                        </li>
                    </ul>
                </Card.Body>
            </Card>
        </MixedLayout>
    );
}
