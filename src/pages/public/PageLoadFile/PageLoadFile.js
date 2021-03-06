import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Alert,
    Button,
    Card,
    Col, Dropdown,
    DropdownButton,
    Form,
    FormControl,
    InputGroup,
    OverlayTrigger, ProgressBar,
    Row, Spinner,
    Tooltip,
} from 'react-bootstrap';
import {
    CodeSlash,
    Download, FileEarmark,
    Github,
    QuestionCircleFill,
    ShieldLockFill,
} from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { APP_NAME, SENTRY_ENABLED } from '../../../config';
import { AVAILABLE_SAMPLE_FILES } from '../../../i18n';
import { PublicLayout } from '../PublicLayout';

class LoadFileLocal extends Component {
    state = {
        selection: null,
    };

    handleFileChange = e => {
        const { loading, onFileSubmit } = this.props;
        const fileList = e.target.files;
        if (!loading && fileList.length > 0) {
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
                            label={selection !== null ? selection : <FormattedMessage id="page.load.select_file"/>}
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

LoadFileLocal.propTypes = {
    loading: PropTypes.bool.isRequired,
    onFileSubmit: PropTypes.func.isRequired,
};

export class LoadFileURL extends Component {
    state = {
        value: '',
    };

    render() {
        const { loading, onUrlSubmit } = this.props;
        const { value } = this.state;
        const isValidUrl = value.startsWith('https://');
        return (
            <InputGroup disabled>
                <FormattedMessage id="page.load.example_url">
                    {url => (
                        <FormControl
                            placeholder={url}
                            aria-label={url}
                            disabled={loading}
                            value={value}
                            onChange={event => this.setState({ value: event.target.value})}
                        />
                    )}
                </FormattedMessage>
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={() => onUrlSubmit(value)} disabled={loading || !isValidUrl}>
                        <Download className="icon"/>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        );
    }
}

LoadFileURL.propTypes = {
    loading: PropTypes.bool.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
};

export class LoadFileSample extends Component {
    handleSampleLoad = file => {
        const { onUrlSubmit } = this.props;
        onUrlSubmit(`/gedcoms/${file}`); // TODO should build the path instead
    }

    renderItem = ({ id, file }) => (
        <Dropdown.Item href="#" key={id} onClick={() => this.handleSampleLoad(file)}>
            <FileEarmark className="icon mr-2"/>
            <FormattedMessage id={`page.load.samples_names.${id}`}/>
        </Dropdown.Item>
    );

    render() {
        const { loading } = this.props;
        return (
            <DropdownButton title={<FormattedMessage id="page.load.samples"/>} disabled={loading}>
                {AVAILABLE_SAMPLE_FILES.map(this.renderItem)}
            </DropdownButton>
        );
    }
}

LoadFileSample.propTypes = {
    loading: PropTypes.bool.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
};

export class PageLoadFile extends Component {
    state = {
        isSentryRequested: SENTRY_ENABLED, // Checked by default if enabled
    };

    componentDidMount() {
        // eslint-disable-next-line
        const { loadGedcomUrl } = this.props;
        const environment = process.env.NODE_ENV;
        const isDevelopment = !environment || environment === 'development';
        if(isDevelopment) {
//            loadGedcomUrl('./test.ged');
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

    renderProgress = () => {
        const { loading, loadingPhase, loadingPhaseProgress } = this.props;
        const firstPhaseWeight = 2 / 3;
        let progress;
        if (loadingPhase === 0) {
            progress = firstPhaseWeight * loadingPhaseProgress;
        } else if (loadingPhase === 1) {
            progress = firstPhaseWeight + (1 - firstPhaseWeight) * loadingPhaseProgress;
        } else {
            progress = 1;
        }
        const loadingState = ['decoding', 'structuring', 'indexing'][loadingPhase];
        return loading && (
            <>
                <div className="d-flex justify-content-center pt-2">
                    <Spinner animation="border" />
                </div>
                <Row className="justify-content-center pt-3 pb-4">
                    <Col md={8} lg={6}>
                        <ProgressBar now={progress} max={1} animated={loadingPhaseProgress === null} label={<FormattedMessage id={`page.load.loading_state.${loadingState}`} />} />
                    </Col>
                </Row>
            </>
        )
    }

    handleSubmit = () => {
        const { activateSentry, isSentryEnabled } = this.props;
        const { isSentryRequested } = this.state;
        if(SENTRY_ENABLED && isSentryRequested && !isSentryEnabled) {
            activateSentry();
        }
    }

    handleFileSubmit = file => {
        const { loadGedcomFile, isSentryEnabled } = this.props;
        const { isSentryRequested } = this.state;
        this.handleSubmit();
        loadGedcomFile(file, SENTRY_ENABLED && (isSentryRequested || isSentryEnabled));
    };

    handleUrlSubmit = url => {
        const { loadGedcomUrl, isSentryEnabled } = this.props;
        const { isSentryRequested } = this.state;
        this.handleSubmit();
        loadGedcomUrl(url, SENTRY_ENABLED && (isSentryRequested || isSentryEnabled));
    };

    render() {
        const { loading, isSentryEnabled } = this.props;
        const { isSentryRequested } = this.state;
        return (
            <PublicLayout>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FileEarmark className="icon mr-2"/>
                            <FormattedMessage id="page.load.title"/>
                        </Card.Title>
                        <Row className="justify-content-center mt-4">
                            <Col md={8}>
                                {this.renderError()}
                            </Col>
                        </Row>
                        {this.renderProgress()}
                        <Row className="justify-content-center">
                            <Col md={6} lg={4}>
                                <LoadFileLocal loading={loading} onFileSubmit={this.handleFileSubmit} />
                            </Col>
                        </Row>
                        <p className="text-center">
                            <small><FormattedMessage id="page.load.file_constraints"/></small>
                        </p>
                        <p className="mt-4 text-center text-muted">
                            <ShieldLockFill className="icon mr-1"/>
                            <FormattedMessage id="page.load.disclaimer"/>
                        </p>
                        <Row className="justify-content-center">
                            <Col sm={10} md={8} lg={6}>
                                <div className="divider-text">
                                    <FormattedMessage id="page.load.or"/>
                                </div>
                            </Col>
                        </Row>
                        {/*<Row className="justify-content-center mt-3">
                            <Col sm={12} md={9} lg={7}>
                                <LoadFileURL loading={loading} onUrlSubmit={this.handleUrlSubmit}/>
                            </Col>
                        </Row>
                        <p className="text-center">
                            <small><FormattedMessage id="page.load.url_constraints"/></small>
                        </p>
                        <Row className="justify-content-center">
                            <Col sm={10} md={8} lg={6}>
                                <div className="divider-text">
                                    <FormattedMessage id="page.load.or"/>
                                </div>
                            </Col>
                        </Row>*/}
                        <Row className="justify-content-center mt-3">
                            <LoadFileSample loading={loading} onUrlSubmit={this.handleUrlSubmit}/>
                        </Row>
                        <p className="text-center mb-0">
                            <small><FormattedMessage id="page.load.samples_constraints"/></small>
                        </p>
                        {SENTRY_ENABLED && !isSentryEnabled && (
                            <Form>
                                <Form.Group controlId="crashes" className="text-center mb-0 mt-5">
                                    <FormattedMessage id="page.load.crashes">
                                        {text => (
                                            <Form.Check type="checkbox" label={text} checked={isSentryRequested} onChange={event => this.setState({ isSentryRequested: event.target.checked })} disabled={loading}/>
                                        )}
                                    </FormattedMessage>
                                </Form.Group>
                            </Form>
                        )}
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
                                        i: chunk => <em>{chunk}</em>,
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
                                        name: APP_NAME,
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
                        <FormattedMessage id="page.load.about.open_source" values={{ b: chunk => <strong>{chunk}</strong>, i: chunk => <em>{chunk}</em>, name: APP_NAME }}/>
                    </p>
                    <p>
                        <a href="https://github.com/arbre-app" target="_blank" rel="noreferrer">
                            <CodeSlash className="icon mr-1"/>
                            <FormattedMessage id="page.load.about.source_code"/>
                        </a>
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
    loadingPhase: PropTypes.number,
    loadingPhaseProgress: PropTypes.number,
    error: PropTypes.string,
    isSentryEnabled: PropTypes.bool.isRequired,
    loadGedcomFile: PropTypes.func.isRequired,
    loadGedcomUrl: PropTypes.func.isRequired,
    clearNotifications: PropTypes.func.isRequired,
    activateSentry: PropTypes.func.isRequired,
};

PageLoadFile.defaultProps = {
    error: null,
};
