import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import {
    BoxArrowUpRight, Bug,
    CodeSlash, Envelope,
    FileEarmarkText, Gear,
    HouseDoor, Percent, Person,
} from 'react-bootstrap-icons';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Gedcom, IndividualRecord } from 'read-gedcom';
import { DebugGedcom, IndividualName } from '../../../components';
import { displayName } from '../../../util';
import { HelmetBase } from '../../HelmetBase';
import { PrivateLayout } from '../PrivateLayout';

export class PageHome extends Component {

    renderRootIndividual = () => {
        const { settings: { rootIndividual } } = this.props;
        return rootIndividual && (
            <>
                <Card.Title>
                    <HouseDoor className="icon mr-2"/>
                    <FormattedMessage id="page.home.root.title"/>
                </Card.Title>
                <p className="mb-3">
                    <IndividualName individual={rootIndividual} noAncestry />
                </p>
            </>
        );
    };

    renderProvider = () => {
        const { file } = this.props;
        const source = file.getHeader().getSourceSystem();
        const provider = source.value().option();
        const webAltTag = '_ADDR';
        const url = source.getCorporation().getWebAddress().value().option() || source.getCorporation().get(webAltTag).value().option();
        if(provider && url) {
            return (
                <a href={url} target="_blank" rel="noreferrer">
                    {provider}
                    <BoxArrowUpRight className="icon ml-2" />
                </a>
            )
        } else {
            return provider;
        }
    }

    renderSubmitter = () => {
        const { file } = this.props;
        const submitter = file.getSubmitterRecord(null, 1);
        const name = displayName(submitter.as(IndividualRecord), '?'); // Same API, but beware of changes
        const email = submitter.get(['EMAIL', '_MAIL']).value().option();
        if(email) {
            return (
                <a href={`mailto:${email}`} target="_blank" rel="noreferrer">
                    {name}
                    <Envelope className="icon ml-2" />
                </a>
            );
        } else {
            return name;
        }
    }

    render() {
        const { file, statistics } = this.props;
        return (
            <PrivateLayout>
                <FormattedMessage id="page.home.head.title">
                    {([title]) => <HelmetBase title={title}/>}
                </FormattedMessage>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <CodeSlash className="icon mr-2"/>
                            <FormattedMessage id="page.home.welcome.title"/>
                        </Card.Title>
                        <FormattedMessage id="page.home.welcome.content"/>
                    </Card.Body>
                </Card>

                <Card className="mt-3">
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                {this.renderRootIndividual()}
                            </Col>
                            <Col md={6}>
                                <Card.Title>
                                    <Percent className="icon mr-2"/>
                                    <FormattedMessage id="page.home.statistics.title"/>
                                </Card.Title>
                                <Table borderless size="sm">
                                    <tbody>
                                    <tr>
                                        <td><FormattedMessage id="page.home.statistics.individuals"/></td>
                                        <td><strong><FormattedNumber value={statistics.totalIndividuals}/></strong></td>
                                    </tr>
                                    {statistics.totalAncestors !== null && (
                                        <tr>
                                            <td><FormattedMessage id="page.home.statistics.ancestors"/></td>
                                            <td><strong><FormattedNumber value={statistics.totalAncestors}/></strong></td>
                                        </tr>
                                    )}
                                    {statistics.totalDescendants !== null && (
                                        <tr>
                                            <td><FormattedMessage id="page.home.statistics.descendants"/></td>
                                            <td><strong><FormattedNumber value={statistics.totalDescendants}/></strong></td>
                                        </tr>
                                    )}
                                    {statistics.totalRelated !== null && (
                                        <tr>
                                            <td><FormattedMessage id="page.home.statistics.related"/></td>
                                            <td><strong><FormattedNumber value={statistics.totalRelated}/></strong></td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Card.Title>
                                    <FileEarmarkText className="icon mr-2"/>
                                    <FormattedMessage id="page.home.metadata.title"/>
                                </Card.Title>
                                <Table borderless size="sm">
                                    <tbody>
                                    <tr>
                                        <td><FormattedMessage id="page.home.metadata.name"/></td>
                                        <td>{file.getHeader().getFilename().value().option()}</td>
                                    </tr>
                                    <tr>
                                        <td><FormattedMessage id="page.home.metadata.provider"/></td>
                                        <td>{this.renderProvider()}</td>
                                    </tr>
                                    <tr>
                                        <td><FormattedMessage id="page.home.metadata.version"/></td>
                                        <td>{file.getHeader().getSourceSystem().getVersion().value().option()}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={6}>
                                <Card.Title>
                                    <Person className="icon mr-2"/>
                                    <FormattedMessage id="page.home.author.title"/>
                                </Card.Title>
                                <Table borderless size="sm">
                                    <tbody>
                                    <tr>
                                        <td><FormattedMessage id="page.home.author.name"/></td>
                                        <td>{this.renderSubmitter()}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Card.Title>
                            <Gear className="icon mr-2"/>
                            <FormattedMessage id="page.home.tools.title"/>
                        </Card.Title>
                        <p className="mb-3">
                            <DebugGedcom triggerComponent={({ onClick }) =>
                                <Button variant="outline-secondary" size="sm" onClick={onClick}>
                                    <Bug className="icon mr-1" />
                                    <FormattedMessage id="page.home.tools.debug"/>
                                </Button>
                            } node={file} />
                        </p>
                    </Card.Body>
                </Card>
            </PrivateLayout>
        );
    }
}

PageHome.propTypes = {
    file: PropTypes.instanceOf(Gedcom).isRequired,
    settings: PropTypes.object.isRequired,
    statistics: PropTypes.object.isRequired,
};
