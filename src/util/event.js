import { FormattedDate, FormattedMessage } from 'react-intl';

function isValidDate(dateObject){
    return dateObject.toString() !== 'Invalid Date';
}

export function displayDate(dateGedcom, isShort = false) {
    const first = dateGedcom;
    const obj = first.valueAsDate()[0];
    if (obj !== null) {
        if (obj.isDatePunctual && obj.date.calendar.isGregorian && !obj.date.year.isDual) {
            const date = obj.date;

            const jsDate = new Date(
                parseInt(date.year.value) * (date.year.isBce ? -1 : 1),
                date.month ? parseInt(date.month) - 1 : 0,
                date.day ? parseInt(date.day) : 1
            );

            if(isValidDate(jsDate)) {
                return (
                    <>
                        {obj.isDateApproximate && (
                            <>
                                <FormattedMessage id="common.date.about_lower"/>
                                {' '}
                            </>
                        )}
                        <FormattedDate
                            value={jsDate}
                            year="numeric"
                            month={!date.month || isShort ? undefined : 'long'}
                            day={!date.day || isShort ? undefined : 'numeric'}
                        />
                    </>
                );
            } else {
                return first[0].value;
            }

        } else {
            return first[0].value;
        }
    } else {
        return first[0].value;
    }
}

export function isEventEmpty(eventGedcom, withDate = true, withPlace = true) {
    return !(
        (eventGedcom.getDate().value()[0] && withDate)
        || (eventGedcom.getPlace().value()[0] && withPlace)
    );
}

export function displayDateExact(dateGedcom, withTime) {
    const date = dateGedcom.valueAsExactDate()[0];
    const time = dateGedcom.getExactTime().valueAsExactTime()[0];
    if(date) {
        const jsDate = new Date(
            parseInt(date.year),
            parseInt(date.month) - 1,
            parseInt(date.day)
        );
        if(isValidDate(jsDate)) {
            if(withTime && time) {
                jsDate.setHours(
                    parseInt(time.hours),
                    parseInt(time.minutes),
                    time.seconds !== undefined ? parseInt(time.seconds) : 0,
                    time.centiseconds !== undefined ? parseInt(time.centiseconds) * 10 : 0,
                );
                return (
                    <FormattedDate
                        value={jsDate}
                        year="numeric"
                        month="long"
                        day="numeric"
                        hour="numeric"
                        minute="numeric"
                        second="numeric"
                    />
                );
            } else {
                return (
                    <FormattedDate
                        value={jsDate}
                        year="numeric"
                        month="long"
                        day="numeric"
                    />
                );
            }
        } else {
            return dateGedcom.value()[0];
        }
    } else {
        return dateGedcom.value()[0];
    }
}
