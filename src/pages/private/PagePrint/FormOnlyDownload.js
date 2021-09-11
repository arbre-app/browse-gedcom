import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Download, FileEarmark } from 'react-bootstrap-icons';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { Field } from 'react-final-form';
import { browserSaveFile, MIMETYPE_SVG } from '../../../util';

const FILETYPE_PNG = 'png';
const FILETYPE_JPEG = 'jpeg';
const FILETYPE_PDF = 'pdf';
const FILETYPE_SVG = 'svg';

export function FormOnlyDownload({ disabled, refreshCallback }) {

    const filetypeLabels = {
        [FILETYPE_PNG]: 'Image PNG',
        [FILETYPE_JPEG]: 'Image JPEG',
        [FILETYPE_PDF]: 'Document PDF',
        [FILETYPE_SVG]: 'Image vectorielle SVG',
    }

    const createFileInformations = (ref, data) => {
        if(data.filetype === FILETYPE_SVG) {
            return {
                fileData: ref.current.innerHTML,
                mimeType: MIMETYPE_SVG,
                extension: FILETYPE_SVG,
            }
        } else if(data.filetype === FILETYPE_PNG) {
            throw new Error();
        } else {
            throw new Error();
        }
    };

    const submitHandler = data => {
        const ref = refreshCallback();

        const { fileData, mimeType, extension } = createFileInformations(ref, data);

        browserSaveFile(`${data.filename || 'Fichier'}.${extension}`, mimeType, fileData);
    };

    const renderForm = ({ form, handleSubmit }) => (
        <Form
            onSubmit={handleSubmit}
        >
            <h5>
                <FileEarmark className="icon mr-2" />
                Fichier
            </h5>

            <Field name="filetype" render={({ input, meta }) => (
                <Form.Group>
                    <Form.Label>Type de fichier :</Form.Label>
                    <Form.Control custom as="select" {...input}>
                        {[FILETYPE_PNG, FILETYPE_SVG].map(filetype => (
                            <option key={filetype} value={filetype}>{filetypeLabels[filetype]}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            )} />

            {/*<Field name="svg.minify" type="checkbox" render={({ input, meta }) => (
                <Form.Check
                    {...input}
                    id="svg-minify"
                    type="switch"
                    label="Minifier le code XML"
                />
            )} />*/}

            <Field name="filename" render={({ input, meta }) => (
                <Form.Group>
                    <Form.Label>Nom du fichier (optionnel) :</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" placeholder="..." {...input} />
                        <InputGroup.Append>
                            <FormSpy subscription={{ values: true }}>
                                {({ values: { filetype } }) => (
                                    <InputGroup.Text>.{filetype}</InputGroup.Text>
                                )}
                            </FormSpy>

                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            )} />

            <Button type="submit" disabled={disabled} variant="secondary" className="w-100">
                <Download className="icon mr-2" />
                Enregistrer
            </Button>
        </Form>
    );

    return (
        <FinalForm
            onSubmit={submitHandler}
            mutators={{
                setValue: ([field, value], state, { changeValue }) => changeValue(state, field, () => value),
            }}
            initialValues={{
                filetype: FILETYPE_SVG,
                filename: 'Fichier'
            }}
            keepDirtyOnReinitialize
            render={renderForm}
        />
    );
}

FormOnlyDownload.propTypes = {
    refreshCallback: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

FormOnlyDownload.defaultProps = {
    disabled: false,
};
