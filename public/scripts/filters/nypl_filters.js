/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, console, _, angular */

(function () {
    'use strict';

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:timeFormat
     * @param {object} timeObj Object with hours for today and tomorrow.
     * @returns {string} Closed or open times for a branch.
     * @description
     * Filter formats military time to standard time
     */
    function timeFormat() {
        function clockTime(time) {
            var components = time.split(':'),
                hours = ((parseInt(components[0], 10) + 11) % 12 + 1),
                minutes = components[1],
                meridiem = components[0] >= 12 ? 'pm' : 'am';

            return hours + ":" + minutes + meridiem;
        }

        return function output(timeObj) {
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
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:dateToISO
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Coverts MYSQL Datetime stamp to ISO format
     */
    function dateToISO() {
        return function (input) {
            return new Date(input).toISOString();
        };
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:capitalize
     * @params {string} input
     * @returns {string} ...
     * @description
     * Capitalize all the words in a phrase.
     */
    function capitalize() {
        return function (input) {
            if (typeof input === 'string') {
                return input.replace(/(^|\s)([a-z])/g, function (str) {
                    return str.toUpperCase();
                });
            }
            return input;
        };
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:hoursTodayFormat
     * @param {object} elem ...
     * @param {string} type ...
     * @returns {string} ...
     * @description
     * ...
     */
    function hoursTodayFormat() {
        function getHoursObject(time) {
            time = time.split(':');
            return _.object(
                ['hours', 'mins', 'meridian', 'military'],
                [((parseInt(time[0], 10) + 11) % 12 + 1),
                    time[1],
                    (time[0] >= 12 ? 'pm' : 'am'),
                    time[0]]
            );
        }

        return function (elem, type) {
            var open_time, closed_time, formatted_time,
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
                    open_time = getHoursObject(today.open);
                }
                // Assign closed time obj
                if (today.close) {
                    closed_time = getHoursObject(today.close);
                }

                // If there are no open or close times, then it's closed today
                if (!today.open || !today.close) {
                    console.log(
                        "Returned object is undefined for open/closed elems"
                    );
                    return 'Closed today';
                }

                if (tomorrow.open !== null) {
                    tomorrow_open_time = getHoursObject(tomorrow.open);
                }
                if (tomorrow.close !== null) {
                    tomorrow_close_time = getHoursObject(tomorrow.close);
                }

                if (hour_now_military >= closed_time.military) {
                    // If the current time is past today's closing time but
                    // before midnight, display that it will be open 'tomorrow',
                    // if there is data for tomorrow's time.
                    if (tomorrow_open_time || tomorrow_close_time) {
                        return 'Open tomorrow ' + tomorrow_open_time.hours +
                            (parseInt(tomorrow_open_time.mins, 10) !== 0 ?
                                    ':' + tomorrow_open_time.mins : '') +
                            tomorrow_open_time.meridian +
                            '-' + tomorrow_close_time.hours +
                            (parseInt(tomorrow_close_time.mins, 10) !== 0 ?
                                    ':' + tomorrow_close_time.mins : '') +
                            tomorrow_close_time.meridian;
                    }
                    return "Closed today";
                }

                // If the current time is after midnight but before
                // the library's open time, display both the start and
                // end time for today
                if (tomorrow_open_time &&
                        hour_now_military >= 0 &&
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

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:truncate
     * @param {string} text ...
     * @param {number} [length] ...
     * @returns {string} [end] ...
     * @description
     * ...
     */
    function truncate() {
        return function (text, length, end) {
            if (typeof text !== 'string') {
                return text;
            }

            if (text.length < 200) {
                return text;
            }

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

    function slugify() {
        return function (text) {
            return text.replace(/\s+/g, '-').toLowerCase();
        };
    }

    angular
        .module('nypl_locations')
        .filter('timeFormat', timeFormat)
        .filter('dateToISO', dateToISO)
        .filter('capitalize', capitalize)
        .filter('hoursTodayFormat', hoursTodayFormat)
        .filter('truncate', truncate);

    angular
        .module('nypl_widget')
        .filter('hoursTodayFormat', hoursTodayFormat);

     angular
        .module('nypl_research_collections')
        .filter('timeFormat', timeFormat)
        .filter('dateToISO', dateToISO)
        .filter('capitalize', capitalize)
        .filter('hoursTodayFormat', hoursTodayFormat)
        .filter('slugify', slugify);
})();
