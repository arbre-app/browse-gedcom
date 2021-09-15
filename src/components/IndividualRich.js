import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { SelectionIndividualRecord } from 'read-gedcom';
import { isEventEmpty } from '../util';
import { EventName } from './EventName';
import { IndividualName } from './IndividualName';

export function IndividualRich({ individual, gender, simpleDate, simplePlace, simpleRange, noDate, noPlace }) {
    const props = { simpleDate, simplePlace, noDate, noPlace };
    const visible = !noDate || !noPlace;
    const birth = individual.getEventBirth(), death = individual.getEventDeath();
    const showBirth = visible && !isEventEmpty(birth, !noDate, !noPlace), showDeath = visible && (simpleRange ? !isEventEmpty(death, !noDate, !noPlace) : death.length > 0); // Birth is not shown if fruitless
    const hasSuffix = showBirth || showDeath;
    const sex = individual.getSex().value()[0];
    return (
        <>
            <IndividualName individual={individual} gender={gender} />
            {hasSuffix && ' ('}
            {showBirth && (
                <EventName event={birth} name={simpleRange ? '' : <FormattedMessage id="common.event.born_lower" values={{ gender: sex }}/>} {...props}  />
            )}
            {showBirth && showDeath && (simpleRange ? ' - ' : ', ')}
            {showDeath && !showBirth && simpleRange && '? - '}
            {showDeath && (
                <EventName event={death} name={simpleRange ? '' : <FormattedMessage id="common.event.deceased_lower" values={{ gender: sex }}/>} {...props}  />
            )}
            {hasSuffix && ')'}
        </>
    );
}

IndividualRich.propTypes = {
    individual: PropTypes.instanceOf(SelectionIndividualRecord).isRequired,
    gender: PropTypes.bool,
    simpleDate: PropTypes.bool,
    simplePlace: PropTypes.bool,
    simpleRange: PropTypes.bool,
    noDate: PropTypes.bool,
    noPlace: PropTypes.bool,
};

IndividualRich.defaultProps = {
    gender: false,
    simpleDate: false,
    simplePlace: false,
    noDate: false,
    noPlace: false,
};
