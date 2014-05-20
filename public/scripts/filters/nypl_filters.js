/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */

// Filter formats military time to standard time
nypl_locations.filter('timeFormat', [
    function () {
        'use strict';

        function clockTime(time) {
            var components = time.split(':'),
            hours = ((parseInt(components[0], 10) + 11) % 12 + 1),
            minutes = components[1],
            meridiem = components[0] >= 12 ? 'pm' : 'am';

            return hours + ":" + minutes + meridiem;
        }

        return function (time) {
            // Checking if thruthy needed for async calls
            if (time) {
                if (time.open === null) {
                    return 'Closed';
                }
                
                return clockTime(time.open) + ' - ' + clockTime(time.close);

            }
            else {
                console.log('timeFormat() filter function error: Argument is not defined or empty, verify API response for time');
                return '';
            }
        };
    }]);

// Coverts MYSQL Datetime stamp to ISO format
nypl_locations.filter('dateToISO', [
    function () {
        'use strict';

        return function (input) {
            input = new Date(input).toISOString();
            return input;
        };
    }]);

nypl_locations.filter('hoursTodayFormat', [
    function () {
        'use strict';

        return function (elem, type) {
            var open_time, closed_time, time, formatted_time,
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
                }

                if (!elem.open || !elem.close) {
                    time = 'closed'
                    console.log("Returned object is undefined for open/closed elems");
                }

                // Multiple cases for args w/ default
                switch (type) {
                case 'short':
                    if (time === 'closed') {
                        formatted_time = 'Closed today';
                    }
                    else if (hour_now > closed_time.hour) {
                        formatted_time = 'Open tomorrow ' + open_time.hours +
                                (parseInt(open_time.mins, 10) !== 0 ?
                                    ':' + open_time.mins :
                                    '') +
                                '-' + closed_time.hours +
                                (parseInt(closed_time.mins, 10) !== 0 ?
                                    ':' + closed_time.mins :
                                    '') +
                                closed_time.meridian;
                    }
                    else {
                        formatted_time = 'Open today until ' + closed_time.hours +
                            (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins :
                                '')
                            + closed_time.meridian;
                    }
                    break;

                case 'long':
                    if (time === 'closed') {
                        formatted_time = 'Closed today';
                    }
                    else if (hour_now > closed_time.hour) {
                        formatted_time = 'Open tomorrow ' + open_time.hours +
                                (parseInt(open_time.mins, 10) !== 0 ?
                                    ':' + open_time.mins :
                                    '') +
                                open_time.meridian + '-' + closed_time.hours +
                                (parseInt(closed_time.mins, 10) !== 0 ?
                                    ':' + closed_time.mins :
                                    '')
                                + closed_time.meridian;
                    }
                    else {
                        formatted_time = 'Open today ' + open_time.hours +
                            (parseInt(open_time.mins, 10) !== 0 ?
                                ':' + open_time.mins :
                                '') +
                            open_time.meridian + '-' + closed_time.hours +
                            (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins :
                                '')
                            + closed_time.meridian;
                    }
                    break;
                default:
                    if (time === 'closed') {
                        formatted_time = "Closed";
                    }
                    else {
                        formatted_time = open_time.hours + ':' + open_time.mins +
                            open_time.meridian + '-' + closed_time.hours +
                            ':' + closed_time.mins + closed_time.meridian;
                    }
                    break;
                }

                return formatted_time;
            }
            else {
                console.log('hoursTodayFormat() filter function error: Argument is not defined or empty, verify API response');
                return '';
            }
        };
    }
]);

/* Truncates string text with proper arguments [length (number), end(string)] */
nypl_locations.filter('truncate', [
    function () {
        return function (text, length, end) {
            if (isNaN(length)) {
                length = 200; // Default length
            }
            if (end === undefined) {
                end = "..."; // Default ending characters
            }
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    }
]);