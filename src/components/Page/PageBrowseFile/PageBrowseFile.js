import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Container, Table } from 'react-bootstrap';
import { CodeSlash, FileEarmarkText, HouseDoor } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';

export class PageBrowseFile extends Component {
    getOrUnknown = option => {
        return option.length > 0 ? option[0] : undefined;
    };

    render() {
        const { file } = this.props;
        const individual = file.getIndividualRecord('@I0000@');
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <CodeSlash className="mr-2" />
                            Welcome!
                        </Card.Title>
                        This application is under development, some features may be missing or not fully working.
                        Thank you for testing it!
                    </Card.Body>
                </Card>

                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>
                            <FileEarmarkText className="mr-2" />
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
                        <Card.Title>
                            <HouseDoor className="mr-2" />
                            Root individual
                        </Card.Title>
                        {this.getOrUnknown(individual.getName().valueAsParts().map(v => v.filter(s => s).join(' ')))}
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

PageBrowseFile.propTypes = {
    file: PropTypes.instanceOf(Gedcom).isRequired,
};
