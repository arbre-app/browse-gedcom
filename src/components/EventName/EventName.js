import PropTypes from 'prop-types';
import { Component } from 'react';
import { Event as EventFact } from 'read-gedcom';
import { displayDate } from '../../util';

export class EventName extends Component {

    render() {
        const { event, name, nameAlt, simpleDate, simplePlace, noDate, noPlace } = this.props;
        if(event.isEmpty()) {
            throw new Error('Event cannot be empty'); // TODO
        }
        const eventDate = !noDate && event.getDate().array().map(date => displayDate(date, simpleDate))[0];
        const eventPlace = !noPlace && event.getPlace().value().map(place => simplePlace ? simplePlace.split(',').map(s => s.trim()).filter(s => !s)[0] : place).option(); // TODO improve
        const space = name ? ' ' : '';
        let strEvent;
        if (eventDate && eventPlace) {
            strEvent = `${space}${eventDate} - ${eventPlace}`;
        } else if (eventDate) {
            strEvent = `${space}${eventDate}`;
        } else if (eventPlace) {
            strEvent = `${space}- ${eventPlace}`;
        } else {
            strEvent = '';
        }
        return `${strEvent || nameAlt === null ? name : nameAlt}${strEvent}`;
    }
}

EventName.propTypes = {
    event: PropTypes.instanceOf(EventFact).isRequired,
    name: PropTypes.string,
    nameAlt: PropTypes.string,
    simpleDate: PropTypes.bool,
    simplePlace: PropTypes.bool,
    noDate: PropTypes.bool,
    noPlace: PropTypes.bool,
};

EventName.defaultProps = {
    name: '',
    nameAlt: null,
    simpleDate: false,
    simplePlace: false,
    noDate: false,
    noPlace: false,
};
