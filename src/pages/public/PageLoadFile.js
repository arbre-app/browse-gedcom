import PropTypes from 'prop-types';
import React, { useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { APP_NAME, SENTRY_ENABLED } from '../../config';
import { AVAILABLE_SAMPLE_FILES } from '../../i18n';
import { clearNotifications, loadGedcomFile, loadGedcomUrl } from '../../state/gedcom/actions';
import { activateSentry } from '../../state/sentry/actions';
import { PublicLayout } from './PublicLayout';

function LoadFileLocal({ loading, onFileSubmit }) {
    const [selection, setSelection] = useState(null);

    const handleFileChange = e => {
        const fileList = e.target.files;
        if (!loading && fileList.length > 0) {
            const file = fileList[0];
            setSelection(file.name);
            onFileSubmit(file);
        }
    };

    return (
        <Form>
            <FormattedMessage id="page.load.browse">
                {browse =>
                    <Form.File
                        label={selection !== null ? selection : <FormattedMessage id="page.load.select_file"/>}
                        custom
                        data-browse={browse}
                        disabled={loading}
                        onChange={handleFileChange}
                    />
                }
            </FormattedMessage>
        </Form>
    );
}

LoadFileLocal.propTypes = {
    loading: PropTypes.bool.isRequired,
    onFileSubmit: PropTypes.func.isRequired,
};

export function LoadFileURL({ loading, onUrlSubmit }) {
    const [value, setValue] = useState('');

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
                        onChange={event => setValue(event.target.value)}
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

LoadFileURL.propTypes = {
    loading: PropTypes.bool.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
};

export function LoadFileSample({ loading, onUrlSubmit }) {
    const handleSampleLoad = file => onUrlSubmit(`/gedcoms/${file}`); // TODO should build the path instead

    const renderItem = ({ id, file }) => (
        <Dropdown.Item href="#" key={id} onClick={() => handleSampleLoad(file)}>
            <FileEarmark className="icon mr-2"/>
            <FormattedMessage id={`page.load.samples_names.${id}`}/>
        </Dropdown.Item>
    );

    return (
        <DropdownButton title={<FormattedMessage id="page.load.samples"/>} disabled={loading}>
            {AVAILABLE_SAMPLE_FILES.map(renderItem)}
        </DropdownButton>
    );
}

LoadFileSample.propTypes = {
    loading: PropTypes.bool.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
};

export function PageLoadFile() {
    const { loading, loadingPhase, error, loadingPhaseProgress } = useSelector(state => state.gedcomFile);
    const { enabled: isSentryEnabled } = useSelector(state => state.sentry);
    const dispatch = useDispatch();
    const loadGedcomFileDispatch = (file, isSentryEnabled) => dispatch(loadGedcomFile(file, isSentryEnabled));
    const loadGedcomUrlDispatch = (url, isSentryEnabled) => dispatch(loadGedcomUrl(url, isSentryEnabled));
    const clearNotificationsDispatch = () => dispatch(clearNotifications());
    const activateSentryDispatch = () => dispatch(activateSentry());

    const [isSentryRequested, setSentryRequested] = useState(SENTRY_ENABLED);

    const environment = process.env.NODE_ENV;
    const isDevelopment = !environment || environment === 'development';
    if(isDevelopment) {
//            loadGedcomUrlDispatch('./test.ged');
    }

    const renderError = () => {
        return error !== null && (
            <Alert variant="danger" onClose={() => clearNotificationsDispatch()} dismissible>
                <Alert.Heading>{error}</Alert.Heading>
                <p>
                    <FormattedMessage id="page.load.error.general"/>
                </p>
            </Alert>
        );
    };

    const renderProgress = () => {
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

    const handleSubmit = () => {
        if(SENTRY_ENABLED && isSentryRequested && !isSentryEnabled) {
            activateSentryDispatch();
        }
    }

    const handleFileSubmit = file => {
        handleSubmit();
        loadGedcomFileDispatch(file, SENTRY_ENABLED && (isSentryRequested || isSentryEnabled));
    };

    const handleUrlSubmit = url => {
        handleSubmit();
        loadGedcomUrlDispatch(url, SENTRY_ENABLED && (isSentryRequested || isSentryEnabled));
    };

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
                            {renderError()}
                        </Col>
                    </Row>
                    {renderProgress()}
                    <Row className="justify-content-center">
                        <Col md={6} lg={4}>
                            <LoadFileLocal loading={loading} onFileSubmit={handleFileSubmit} />
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
                        <LoadFileSample loading={loading} onUrlSubmit={handleUrlSubmit}/>
                    </Row>
                    <p className="text-center mb-0">
                        <small><FormattedMessage id="page.load.samples_constraints"/></small>
                    </p>
                    {SENTRY_ENABLED && !isSentryEnabled && (
                        <Form>
                            <Form.Group controlId="crashes" className="text-center mb-0 mt-5">
                                <FormattedMessage id="page.load.crashes">
                                    {text => (
                                        <Form.Check type="checkbox" label={text} checked={isSentryRequested} onChange={event => setSentryRequested(event.target.checked)} disabled={loading}/>
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

PageLoadFile.propTypes = {
};
