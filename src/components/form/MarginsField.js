import PropTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import {
    AlignBottom,
    AlignEnd,
    AlignStart,
    AlignTop,
} from 'react-bootstrap-icons';
import { Field } from 'react-final-form';
import { NumberField } from './NumberField';

const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const DIRECTION_TOP = 'top';
const DIRECTION_BOTTOM = 'bottom';

const SYNCHRONIZATION_SIDES = 'sides';
const SYNCHRONIZATION_DUAL = 'dual';
const SYNCHRONIZATION_ALL = 'all';

export function MarginsField({ name, setValue, variant, min, max, className, style }) {
    const directions = [
        { id: DIRECTION_LEFT, label: 'Gauche', icon: AlignStart },
        { id: DIRECTION_RIGHT, label: 'Droite', icon: AlignEnd },
        { id: DIRECTION_TOP, label: 'Haut', icon: AlignTop },
        { id: DIRECTION_BOTTOM, label: 'Bas', icon: AlignBottom },
    ];

    const synchronizations = [
        { id: SYNCHRONIZATION_SIDES, label: 'Côtés gauche et droit identiques', synchronized: [[DIRECTION_LEFT, DIRECTION_RIGHT]] },
        { id: SYNCHRONIZATION_DUAL, label: 'Côtés deux à deux identiques', synchronized: [[DIRECTION_LEFT, DIRECTION_RIGHT], [DIRECTION_TOP, DIRECTION_BOTTOM]] },
        { id: SYNCHRONIZATION_ALL, label: 'Quatre côtés identiques', synchronized: [[DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_TOP, DIRECTION_BOTTOM]] },
    ];

    const nameForChild = child => `${name}.${child}`;

    /*const form = useForm();
    useEffect(() => {
        const calculator = createDecorator(
            {
                field: new RegExp(`${name}\\.*`).compile(),
                updates:
                  Object.fromEntries(directions.map(({ id }) => {
                      const update = (value, allValues) => {
                          const synchronization = allValues[nameForChild(name, 'synchronization')];

                          return value;
                      };

                      return [nameForChild(name, id), update];
                  })),

                    /*{
                    maximum: (value, allValues) =>
                        Math.max(value || 0, allValues.maximum || 0)
                }
            },
        );

        const unsubscribe = calculator(form);
        return () => unsubscribe();
    }, []);*/

    return (
        <Row className={`align-items-center${className ? ` ${className}` : ''}`}>
            <Col xs={8} md={7}>
                <Row noGutters>
                    {directions.map(({ id, label, icon }, i) => (
                        <NumberField
                            key={id}
                            name={nameForChild(id)}
                            setValue={setValue}
                            variant={variant}
                            placeholder={label}
                            icon={icon}
                            className={i > 0 ? 'mt-1' : ''}
                            min={min}
                            max={max}
                        />
                    ))}
                </Row>
            </Col>
            <Col xs={4} md={5} className="text-center">
                <Field name={nameForChild('synchronized')} type="checkbox" render={({ input, meta }) => (
                    <>
                        <Form.Check
                            {...input}
                            id={nameForChild('synchronized')}
                            type="switch"
                            label="Synchroniser"
                            className="mb-1"
                        />
                        <Field name={nameForChild('synchronization')} type="checkbox" render={({ input: childInput, meta }) => (
                            <Form.Control as="select" custom disabled={!input.checked} {...childInput}>
                                {synchronizations.map(({ id, label }) => (
                                    <option key={id} value={id}>{label}</option>
                                ))}
                            </Form.Control>
                        )} />
                    </>
                )} />
            </Col>
        </Row>
    );
}

MarginsField.propTypes = {
    name: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    variant: PropTypes.string,
};

MarginsField.defaultProps = {
    min: null,
    max: null,
    variant: 'outline-secondary',
};
