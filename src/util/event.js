import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

function isValidDate(dateObject){
    return dateObject.toString() !== 'Invalid Date';
}

export function displayDate(dateGedcom, isShort = false) {
    const first = dateGedcom;
    const obj = first.valueAsDate().one();
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
                return first.value().one();
            }

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
