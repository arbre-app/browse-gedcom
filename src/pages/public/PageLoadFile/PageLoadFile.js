import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

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
                <FormattedMessage id="page.load.browse">
                    {browse =>
                        <Form.File
                            label={loading ? selection : <FormattedMessage id="page.load.select_file"/>}
                            custom
                            data-browse={browse}
                            disabled={loading}
                            onChange={this.handleFileChange}
                        />
                    }
                </FormattedMessage>
            </Form>
        );
    }
}

LoadFileButton.propTypes = {
    loading: PropTypes.bool.isRequired,
    onFileSubmit: PropTypes.func.isRequired,
};

export class PageLoadFile extends Component {
    componentDidMount() {
        const { loadGedcomUrl } = this.props;
        const environment = process.env.NODE_ENV;
        const isDevelopment = !environment || environment === 'development';
        if(isDevelopment) {
            loadGedcomUrl('./test.ged');
        }
    }

    renderError = () => {
        const { error, clearNotifications } = this.props;
        return error !== null && (
            <Alert variant="danger" onClose={() => clearNotifications()} dismissible>
                <Alert.Heading>{error}</Alert.Heading>
                <p>
                    <FormattedMessage id="page.load.error.general"/>
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
    /* Redux */
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    loadGedcomFile: PropTypes.func.isRequired,
    loadGedcomUrl: PropTypes.func.isRequired,
    clearNotifications: PropTypes.func.isRequired,
};

PageLoadFile.defaultProps = {
    error: null,
};
