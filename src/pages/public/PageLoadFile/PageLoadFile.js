import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Github, QuestionCircleFill, ShieldLock, Upload } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { PublicLayout } from '../PublicLayout';
import { name } from '../../../../package.json';

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
            <PublicLayout>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <Upload className="icon mr-2"/>
                            <FormattedMessage id="page.load.title"/>
                        </Card.Title>
                        <Row className="justify-content-md-center">
                            <Col md={8}>
                                {this.renderError()}
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md={6} lg={4}>
                                <LoadFileButton loading={loading} onFileSubmit={this.handleFileSubmit} />
                            </Col>
                        </Row>
                        <p className="mt-4 text-center text-muted">
                            <ShieldLock className="icon mr-1"/>
                            <FormattedMessage id="page.load.disclaimer"/>
                        </p>
                    </Card.Body>
                </Card>
                <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-xs-12 offset-xs-0 mt-3 text-center text-muted">
                    <h5>
                        <QuestionCircleFill className="icon mr-2"/>
                        <FormattedMessage id="page.load.about.title"/>
                    </h5>
                    <p className="text-justify">
                        <FormattedMessage id="page.load.about.gedcom_file.url">
                            { url => (
                                <FormattedMessage
                                    id="page.load.about.description"
                                    values={{
                                        b: chunk => <strong>{chunk}</strong>,
                                        a: chunk => (
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-gedcom">
                                                        <QuestionCircleFill className="icon mr-1" />
                                                        <FormattedMessage id="page.load.about.gedcom_file.about"/>
                                                    </Tooltip>
                                                }
                                            >
                                                <a href={url} target="_blank" rel="noreferrer">{chunk}</a>
                                            </OverlayTrigger>
                                        ),
                                        name,
                                    }}
                                />
                            )}
                        </FormattedMessage>
                    </p>
                    <p className="text-justify">
                        <FormattedMessage id="page.load.about.note"/>
                    </p>
                    <h1>
                        <a href="https://github.com/arbre-app" target="_blank" rel="noreferrer" className="link-inherit link-hover-dark"><Github className="icon"/></a>
                    </h1>
                    <p>
                        <FormattedMessage id="page.load.about.open_source" values={{ b: chunk => <strong>{chunk}</strong>, i: chunk => <em>{chunk}</em>, name }}/>
                        <br />
                        <a href="https://github.com/arbre-app" target="_blank" rel="noreferrer"><FormattedMessage id="page.load.about.source_code"/></a>
                    </p>
                    <hr/>
                </div>
            </PublicLayout>
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
