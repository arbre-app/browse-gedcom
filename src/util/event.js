const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export function displayDate(dateGedcom, isShort) {
    const first = dateGedcom;
    const obj = first.valueAsDate().one();
    if (obj !== null) {
        if (obj.isDatePunctual && obj.date.calendar.isGregorian && !obj.date.year.isDual) {
            const date = obj.date;
            const strApproximationOpt = obj.isDateApproximate ? 'about ' : '';
            const strBceOpt = date.year.isBce ? ' BCE' : '';
            const strYear = date.year.value;
            const strMonthOpt = date.month !== undefined && !isShort ? `${MONTHS[date.month - 1]} ` : '';
            const strDayOpt = date.day !== undefined && !isShort ? `${date.day} ` : '';

            return `${strApproximationOpt}${strDayOpt}${strMonthOpt}${strYear}${strBceOpt}`;
        } else {
            return first.value().one();
        }
    } else {
        return first.value().one();
    }
}

export function isEventEmpty(eventGedcom, withDate = true, withPlace = true) {
    return !(
        (eventGedcom.getDate().value().option() && withDate)
        || (eventGedcom.getPlace().value().option() && withPlace)
    );
}
