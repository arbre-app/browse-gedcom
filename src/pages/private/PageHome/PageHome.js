import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import {
    BoxArrowUpRight,
    CodeSlash, Envelope,
    FileEarmarkText,
    HouseDoor, Person,
} from 'react-bootstrap-icons';
import { Gedcom, IndividualRecord } from 'read-gedcom';
import { NormalLink } from '../../../components';
import { AppRoutes } from '../../../routes';
import { displayName } from '../../../util';
import { PrivateLayout } from '../PrivateLayout';

export class PageHome extends Component {
    getOrUnknown = option => {
        return option.length > 0 ? option[0] : undefined;
    };

    renderRootIndividual = () => {
        const { settings: { rootIndividual } } = this.props;
        return rootIndividual && (
            <>
                <Card.Title>
                    <HouseDoor className="icon mr-2"/>
                    Root individual
                </Card.Title>
                <p className="mb-3">
                    <NormalLink to={AppRoutes.individualFor(rootIndividual.pointer().one())}>
                        {displayName(rootIndividual, '?')}
                    </NormalLink>
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
        const { file } = this.props;
        return (
            <PrivateLayout>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <CodeSlash className="icon mr-2"/>
                            Welcome!
                        </Card.Title>
                        This application is under development, some features may be missing or not fully working.
                        Thank you for testing it!
                    </Card.Body>
                </Card>

                <Card className="mt-3">
                    <Card.Body>
                        {this.renderRootIndividual()}
                        <Row>
                            <Col md={6}>
                                <Card.Title>
                                    <FileEarmarkText className="icon mr-2"/>
                                    File metadata
                                </Card.Title>
                                <Table borderless size="sm">
                                    <tbody>
                                    <tr>
                                        <td>Name:</td>
                                        <td>{file.getHeader().getFilename().value().option()}</td>
                                    </tr>
                                    <tr>
                                        <td>Provider:</td>
                                        <td>{this.renderProvider()}</td>
                                    </tr>
                                    <tr>
                                        <td>Version:</td>
                                        <td>{file.getHeader().getSourceSystem().getVersion().value().option()}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col md={6}>
                                <Card.Title>
                                    <Person className="icon mr-2"/>
                                    Author details
                                </Card.Title>
                                <Table borderless size="sm">
                                    <tbody>
                                    <tr>
                                        <td>Name:</td>
                                        <td>{this.renderSubmitter()}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                    </Card.Body>
                </Card>
            </PrivateLayout>
        );
    }
}

PageHome.propTypes = {
    file: PropTypes.instanceOf(Gedcom).isRequired,
    settings: PropTypes.object.isRequired,
};
