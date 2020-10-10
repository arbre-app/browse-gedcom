import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Card, Col, Container, Form, Row } from 'react-bootstrap';

class LoadFileButton extends Component {
    state = {
        selection: null,
    };

    handleFileChange = e => {
        const { onFileSubmit } = this.props;
        const fileList = e.target.files;
        if (fileList.length > 0) {
            const file = fileList[0];
            this.setState({ selection: file.name });
            onFileSubmit(file);
        }
    };

    render() {
        const { loading } = this.props;
        const { selection } = this.state;
        return (
            <Form>
                <Form.File
                    label={loading ? selection : 'Select a gedcom file...'}
                    custom
                    disabled={loading}
                    onChange={this.handleFileChange}
                />
            </Form>
        );
    }
}

LoadFileButton.propTypes = {
    loading: PropTypes.bool.isRequired,
    onFileSubmit: PropTypes.func.isRequired,
};

export class PageLoadFile extends Component {
    renderError = () => {
        const { error, clearNotifications } = this.props;
        return error !== null && (
            <Alert variant="danger" onClose={() => clearNotifications()} dismissible>
                <Alert.Heading>{error}</Alert.Heading>
                <p>
                    Either the file you provided is not a Gedcom file, or its format was not recognized and the content could not be interpreted.
                </p>
            </Alert>
        );
    };

    handleFileSubmit = file => {
        const { loadGedcomFile } = this.props;
        loadGedcomFile(file);
    };

    render() {
        const { loading } = this.props;
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Body>
                        <Row className="justify-content-md-center">
                            <Col md={8}>
                                {this.renderError()}
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md={4}>
                                <LoadFileButton loading={loading} onFileSubmit={this.handleFileSubmit} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

PageLoadFile.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    loadGedcomFile: PropTypes.func.isRequired,
    clearNotifications: PropTypes.func.isRequired,
};

PageLoadFile.defaultProps = {
    error: null,
};
