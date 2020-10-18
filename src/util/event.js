const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export function displayDate(dateGedcom) {
    const first = dateGedcom.first();
    const obj = first.valueAsDate();
    if (obj !== null) {
        if (obj.isDatePunctual && obj.date.calendar.isGregorian && !obj.date.year.isDual) {
            const date = obj.date;
            const strApproximationOpt = obj.isDateApproximate ? 'about ' : '';
            const strBceOpt = date.year.isBce ? ' BCE' : '';
            const strYear = date.year.value;
            const strMonthOpt = date.month !== undefined ? `${MONTHS[date.month - 1]} ` : '';
            const strDayOpt = date.day !== undefined ? `${date.day} ` : '';

            return `${strApproximationOpt}${strDayOpt}${strMonthOpt}${strYear}${strBceOpt}`;
        } else {
            return first.value();
        }
    } else {
        return first.value();
    }
}

export function displayEvent(eventGedcom, eventAction, withNameIfEmpty) {
    const first = eventGedcom.first();
    const eventDate = first.getDate().option().array().map(displayDate)[0];
    const eventPlace = first.getPlace().value()[0];
    let strEvent;
    if (eventDate && eventPlace) {
        strEvent = ` ${eventDate} - ${eventPlace}`;
    } else if (eventDate) {
        strEvent = ` ${eventDate}`;
    } else if (eventPlace) {
        strEvent = ` - ${eventPlace}`;
    } else {
        strEvent = '';
    }
    return strEvent || withNameIfEmpty ? `${eventAction}${strEvent}` : '';
}
