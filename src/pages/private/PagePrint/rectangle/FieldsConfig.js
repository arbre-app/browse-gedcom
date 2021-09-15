import PropTypes from 'prop-types';
import { Button, Col, Row } from 'react-bootstrap';
import { SelectionGedcom } from 'read-gedcom';
import { MarginsField, PaperSizeField, SortableSubArrayField, TabArrayField } from '../../../../components';
import { buildInitialLayerValues } from './builders';

export function FieldsConfig({ form: { mutators: { setValue, push, pop } }, disabled }) {
    return (
        <>
            <Row>
                <Col xs={6}>
                    <PaperSizeField name="size" setValue={setValue}/>

                    <Button variant="primary" type="submit" disabled={disabled} >
                        Refresh
                    </Button>
                </Col>
                <Col xs={12}>
                    <TabArrayField
                        name="layers"
                        push={push}
                        createInitialNewData={buildInitialLayerValues}
                        renderLabel={(fields, name, index) => `Couche #${fields.value[index].key}`}
                        renderField={(fields, name, index) => (
                            <>
                                <Row>
                                    <Col xs={12} lg={6}>
                                        <MarginsField name={`${name}.margin`} setValue={setValue} className="my-2" />
                                    </Col>
                                    <Col xs={12} lg={6}>

                                    </Col>
                                </Row>


                                <SortableSubArrayField
                                    name={`${name}.textValues`}
                                    push={push}
                                    availableValues={[
                                        { id: 'surname', label: 'Nom(s)' },
                                        { id: 'given_name', label: 'Prénom(s)' },
                                        /*{ id: 'birth_date', label: 'Date de naissance' },
                                        { id: 'birth_place', label: 'Lieu de naissance' },
                                        { id: 'death_date', label: 'Date de décès' },
                                        { id: 'death_place', label: 'Lieu de décès' },
                                        { id: 'occupation', label: 'Profession' },*/
                                    ]}
                                />
                            </>
                        )}
                        nonEmpty
                    />
                </Col>
            </Row>

        </>
    );
}

FieldsConfig.propTypes = {
    form: PropTypes.object.isRequired,
    file: PropTypes.instanceOf(SelectionGedcom).isRequired,
    disabled: PropTypes.bool,
};

FieldsConfig.defaultProps = {
    disabled: false,
};
