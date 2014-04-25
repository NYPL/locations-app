/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */

// Filter formats military time to standard time
nypl_locations.filter('timeFormat', function () {
    'use strict';

    return function (time) {
        // Checking if thruthy needed for async calls
        if (time) {
            var components = time.split(':'),
                hours = ((parseInt(components[0], 10) + 11) % 12 + 1),
                minutes = components[1],
                meridiem = components[0] >= 12 ? 'pm' : 'am';

            return hours + ":" + minutes + meridiem;
        }

        return console.log('String conversion loaded after http response');
    };
});

// Coverts MYSQL Datetime stamp to ISO format
nypl_locations.filter('dateToISO', function () {
    'use strict';

    return function (input) {
        input = new Date(input).toISOString();
        return input;
    };
});

nypl_locations.filter('hoursTodayFormat', function () {
    'use strict';

    return function (elem, type) {
        var open_time, closed_time, time,
            now = new Date(),
            hour_now = (parseInt(now.getHours() + 11, 10) % 12 + 1);

        // If truthy async check
        if (elem) {
            // Assign open time obj
            if (elem.open) {
                time = elem.open.split(':');
                open_time = _.object(
                    ['hours', 'mins', 'meridian'],
                    [String(((parseInt(time[0], 10) + 11) % 12 + 1)),
                        time[1],
                        (time[0] >= 12 ? 'pm' : 'am')]
                );
            } else {
                throw new Error("Open object key is undefined");
            }

            // Assign closed time obj
            if (elem.close) {
                time = elem.close.split(':');
                closed_time = _.object(
                    ['hours', 'mins', 'meridian'],
                    [String(((parseInt(time[0], 10) + 11) % 12 + 1)),
                        time[1],
                        (time[0] >= 12 ? 'pm' : 'am')]
                );
            } else {
                throw new Error("Closed object key is undefined");
            }

            // Multiple cases for args w/ default
            switch (type) {
            case 'short':
                if (hour_now > closed_time.hour) {
                    return 'Open tomorrow ' + open_time.hours +
                            (parseInt(open_time.mins, 10) !== 0 ?
                                ':' + open_time.mins :
                                '') +
                            '-' + closed_time.hours +
                            (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins :
                                '') +
                            closed_time.meridian;
                }

                return 'Open until ' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                            ':' + closed_time.mins :
                            '')
                        + closed_time.meridian;
            case 'long':
                if (hour_now > closed_time.hour) {
                    return 'Open tomorrow ' + open_time.hours +
                            (parseInt(open_time.mins, 10) !== 0 ?
                                ':' + open_time.mins :
                                '') +
                            open_time.meridian + '-' + closed_time.hours +
                            (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins :
                                '')
                            + closed_time.meridian;
                }

                return 'Open today ' + open_time.hours +
                        (parseInt(open_time.mins, 10) !== 0 ?
                            ':' + open_time.mins :
                            '') +
                        open_time.meridian + '-' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                            ':' + closed_time.mins :
                            '')
                        + closed_time.meridian;
            default:
                return open_time.hours + ':' + open_time.mins +
                        open_time.meridian + '-' + closed_time.hours +
                        ':' + closed_time.mins + closed_time.meridian;
            }

        }
    };
});