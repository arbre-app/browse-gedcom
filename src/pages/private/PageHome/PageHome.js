import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Table } from 'react-bootstrap';
import { CodeSlash, FileEarmarkText, HouseDoor } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';
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
                    <HouseDoor className="mr-2"/>
                    Root individual
                </Card.Title>
                <NormalLink to={AppRoutes.individualFor(rootIndividual.pointer())}>
                    {displayName(rootIndividual, '?')}
                </NormalLink>
            </>
        );
    };

    render() {
        const { file } = this.props;
        return (
            <PrivateLayout>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <CodeSlash className="mr-2"/>
                            Welcome!
                        </Card.Title>
                        This application is under development, some features may be missing or not fully working.
                        Thank you for testing it!
                    </Card.Body>
                </Card>

                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>
                            <FileEarmarkText className="mr-2"/>
                            File metadata
                        </Card.Title>
                        <Table borderless size="sm">
                            <tbody>
                                <tr>
                                    <td>Provider:</td>
                                    <td>{this.getOrUnknown(file.getHeader().getSourceSystem().value())}</td>
                                </tr>
                                <tr>
                                    <td>Version:</td>
                                    <td>{this.getOrUnknown(file.getHeader().getSourceSystem().getVersion().value())}</td>
                                </tr>
                            </tbody>
                        </Table>
                        {this.renderRootIndividual()}
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
