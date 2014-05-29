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
            // The time object may have just today's hours
            // or be an object with today's and tomorrow's hours
            var time = time !== undefined && time.today !== undefined ? time.today : time;

            // Checking if thruthy needed for async calls
            if (time) {
                if (time.open === null) {
                    return 'Closed';
                }
                return clockTime(time.open) + ' - ' + clockTime(time.close);
            } else {
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

        function getHoursObject(time) {
            return _.object(
                        ['hours', 'mins', 'meridian'],
                        [String(((parseInt(time[0], 10) + 11) % 12 + 1)),
                        time[1],
                        (time[0] >= 12 ? 'pm' : 'am')]
                    );
        }

        return function (elem, type) {
            var open_time, closed_time, time, formatted_time,
                now = new Date(),
                today, tomorrow,
                tomorrow_open_time, tomorrow_close_time,
                hour_now = (parseInt(now.getHours() + 11, 10) % 12 + 1);

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

                if (!today.open || !today.close) {
                    console.log("Returned object is undefined for open/closed elems");
                    return 'Closed today';
                }

                if (hour_now < open_time.hours 
                    && hour_now > closed_time.hours
                    && hour_now < 6) {
                        return 'Open tomorrow ' + tomorrow_open_time.hours +
                            (parseInt(tomorrow_open_time.mins, 10) !== 0 ?
                                ':' + tomorrow_open_time.mins :
                                '') + tomorrow_close_time.meridian +
                            '-' + tomorrow_close_time.hours +
                            (parseInt(tomorrow_close_time.mins, 10) !== 0 ?
                                ':' + tomorrow_close_time.mins :
                                '') +
                            tomorrow_close_time.meridian;
                }

                if (hour_now > 6 && hour_now < open_time.hours) {
                    type = 'long';
                }

                // Multiple cases for args w/ default
                switch (type) {
                case 'short':
                    formatted_time = 'Open today until ' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                            ':' + closed_time.mins :
                            '')
                        + closed_time.meridian;
                    break;

                case 'long':
                    formatted_time = 'Open today ' + open_time.hours +
                        (parseInt(open_time.mins, 10) !== 0 ?
                            ':' + open_time.mins :
                            '') +
                        open_time.meridian + '-' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                            ':' + closed_time.mins :
                            '')
                        + closed_time.meridian;
                    break;

                default:
                    formatted_time = open_time.hours + ':' + open_time.mins +
                        open_time.meridian + '-' + closed_time.hours +
                        ':' + closed_time.mins + closed_time.meridian;
                    break;
                }

                return formatted_time;
            } else {
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
            } else {
                return String(text).substring(0, length-end.length) + end;
            }
        };
    }
]);