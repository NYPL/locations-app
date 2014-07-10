/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, console, _ */

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

        return function (timeObj) {
            // The time object may have just today's hours
            // or be an object with today's and tomorrow's hours
            var time = timeObj !== undefined && timeObj.today !== undefined ?
                    timeObj.today :
                    timeObj;

            // Checking if thruthy needed for async calls
            if (time) {
                if (time.open === null) {
                    return 'Closed';
                }
                return clockTime(time.open) + ' - ' + clockTime(time.close);
            }

            console.log('timeFormat() filter function error: Argument is' +
                ' not defined or empty, verify API response for time');
            return '';
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

nypl_locations.filter('capitalize', [
    function () {
        'use strict';

        return function (input) {
            return input.replace(/(^|\s)([a-z])/g, function (str) {
                return str.toUpperCase();
            });
        };
    }]);

nypl_locations.filter('hoursTodayFormat', [
    function () {
        'use strict';

        function getHoursObject(time) {
            return _.object(
                ['hours', 'mins', 'meridian', 'military'],
                [((parseInt(time[0], 10) + 11) % 12 + 1),
                    time[1],
                    (time[0] >= 12 ? 'pm' : 'am'),
                    time[0]]
            );
        }

        return function (elem, type) {
            var open_time, closed_time, time, formatted_time,
                now = new Date(),
                today, tomorrow,
                tomorrow_open_time, tomorrow_close_time,
                hour_now_military = now.getHours();

            // If truthy async check
            if (elem) {
                today = elem.today;
                tomorrow = elem.tomorrow;
                // Assign open time obj
                if (today.open) {
                    time = today.open.split(':');
                    open_time = getHoursObject(time);

                    time = tomorrow.open.split(':');
                    tomorrow_open_time = getHoursObject(time);
                }
                // Assign closed time obj
                if (today.close) {
                    time = today.close.split(':');
                    closed_time = getHoursObject(time);

                    time = tomorrow.close.split(':');
                    tomorrow_close_time = getHoursObject(time);
                }

                // If there are no open or close times, then it's closed today
                if (!today.open || !today.close) {
                    console.log(
                        "Returned object is undefined for open/closed elems"
                    );
                    return 'Closed today';
                }

                // If the current time is past today's closing time but
                // before midnight, display that it will be open 'tomorrow'
                if (hour_now_military > closed_time.military) {
                    return 'Open tomorrow ' + tomorrow_open_time.hours +
                        (parseInt(tomorrow_open_time.mins, 10) !== 0 ?
                                ':' + tomorrow_open_time.mins : '') +
                        tomorrow_open_time.meridian +
                        '-' + tomorrow_close_time.hours +
                        (parseInt(tomorrow_close_time.mins, 10) !== 0 ?
                                ':' + tomorrow_close_time.mins : '') +
                        tomorrow_close_time.meridian;
                }

                // If the current time is after midnight but before
                // the library's open time, display both the start and
                // end time for today
                if (hour_now_military >= 0 &&
                        hour_now_military < tomorrow_open_time.military) {
                    type = 'long';
                }

                // The default is checking when the library is currently open.
                // It will display 'Open today until ...'

                // Multiple cases for args w/ default
                switch (type) {
                case 'short':
                    formatted_time = 'Open today until ' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins : '')
                        + closed_time.meridian;
                    break;

                case 'long':
                    formatted_time = 'Open today ' + open_time.hours +
                        (parseInt(open_time.mins, 10) !== 0 ?
                                ':' + open_time.mins : '') +
                        open_time.meridian + '-' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins : '')
                        + closed_time.meridian;
                    break;

                default:
                    formatted_time = open_time.hours + ':' + open_time.mins +
                        open_time.meridian + '-' + closed_time.hours +
                        ':' + closed_time.mins + closed_time.meridian;
                    break;
                }

                return formatted_time;
            }

            return 'Not available';
        };
    }
]);

/* Truncates string text with proper arguments [length (number), end(string)] */
nypl_locations.filter('truncate', [
    function () {
        'use strict';

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

            return String(text).substring(0, length - end.length) + end;
        };
    }
]);
