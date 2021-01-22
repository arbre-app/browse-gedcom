import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { IndividualRecord } from 'read-gedcom';
import { isEventEmpty } from '../../util';
import { EventName } from '../EventName';
import { IndividualName } from '../IndividualName';

export class IndividualRich extends Component {

    render() {
        const { individual, gender, simpleDate, simplePlace, simpleRange, noDate, noPlace } = this.props;
        const props = { simpleDate, simplePlace, noDate, noPlace };
        const visible = !noDate || !noPlace;
        const birth = individual.getEventBirth(1), death = individual.getEventDeath(1);
        const showBirth = visible && !isEventEmpty(birth, !noDate, !noPlace), showDeath = visible && (simpleRange ? !isEventEmpty(death, !noDate, !noPlace) : !death.isEmpty()); // Birth is not shown if fruitless
        const hasSuffix = showBirth || showDeath;
        return (
            <>
                <IndividualName individual={individual} gender={gender} />
                {hasSuffix && ' ('}
                {showBirth && (
                    <EventName event={birth} name={simpleRange ? '' : 'born'} {...props}  />
                )}
                {showBirth && showDeath && (simpleRange ? ' - ' : ', ')}
                {showDeath && !showBirth && simpleRange && '? - '}
                {showDeath && (
                    <EventName event={death} name={simpleRange ? '' : 'deceased'} {...props}  />
                )}
                {hasSuffix && ')'}
            </>
        );
    }
}

IndividualRich.propTypes = {
    individual: PropTypes.instanceOf(IndividualRecord).isRequired,
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
