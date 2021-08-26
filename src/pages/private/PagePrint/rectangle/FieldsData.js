import PropTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import { GedcomSelection } from 'read-gedcom';
import { IndividualField, NumberField } from '../../../../components';

export function FieldsData({ form: { mutators: { setValue } }, file, disabled }) {
    return (
        <>
            <Row>
                <Col xs={6}>
                    <Form.Label className="d-block">Individu souche :</Form.Label>
                    <IndividualField name="data.individual" setValue={setValue} file={file} className="w-100" />
                </Col>
                <Col xs={3}>
                    <Form.Label className="d-block">Générations ascendantes :</Form.Label>
                    <NumberField name="generations.ascending" setValue={setValue} min={1} max={10} />
                </Col>
                <Col xs={3}>
                    <Form.Label className="d-block">Générations descendantes :</Form.Label>
                    <NumberField name="generations.descending" setValue={setValue} min={1} max={10} disabled />
                </Col>
            </Row>
        </>
    );
}

FieldsData.propTypes = {
    form: PropTypes.object.isRequired,
    file: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
    disabled: PropTypes.bool,
};

FieldsData.defaultProps = {
    disabled: false,
};
