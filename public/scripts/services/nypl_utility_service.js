/*jslint nomen: true, indent: 4, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
function requestNotificationChannel($rootScope) {
    'use strict';

    // private notification messages
    var _START_REQUEST_ = '_START_REQUEST_',
        _END_REQUEST_ = '_END_REQUEST_',
        notificationChannel = {};

    // publish start request notification
    notificationChannel.requestStarted = function () {
        $rootScope.$broadcast(_START_REQUEST_);
    };

    // publish end request notification
    notificationChannel.requestEnded = function () {
        $rootScope.$broadcast(_END_REQUEST_);
    };

    // subscribe to start request notification
    notificationChannel.onRequestStarted = function ($scope, handler) {
        $scope.$on(_START_REQUEST_, function (event) {
            handler(event);
        });
    };

    // subscribe to end request notification
    notificationChannel.onRequestEnded = function ($scope, handler) {
        $scope.$on(_END_REQUEST_, function (event) {
            handler(event);
        });
    };

    return notificationChannel;
}

/** @namespace nyplUtility */
function nyplUtility($window, $sce, nyplCoordinatesService) {
    'use strict';

    var utility = {};

    /** @function nyplUtility.hoursToday
     * @param {object} hours Object with a regular property that is an array
     *  with the open and close times for every day.
     * @returns {object} An object with the open and close times for the current
     *  and tomorrow days.
     */
    utility.hoursToday = function (hours) {
        var date = new Date(),
            today = date.getDay(),
            tomorrow = today + 1,
            hoursToday;

        if (hours) {
            hoursToday = {
                'today': {
                    'day': hours.regular[today].day,
                    'open': hours.regular[today].open,
                    'close': hours.regular[today].close
                },
                'tomorrow': {
                    'day': hours.regular[tomorrow % 7].day,
                    'open': hours.regular[tomorrow % 7].open,
                    'close': hours.regular[tomorrow % 7].close
                }
            };
        }
        return hoursToday;
    };

    // Parse exception data and return as string
    utility.branchException = function (hours) {
        var exception = {};

        if (hours) {
            // If truthy, data exist for existing location
            if (!hours.exceptions) {
                return null;
            }
            if (hours.exceptions.description.trim() !== '') {
                exception.desc = hours.exceptions.description;
                // Optional set
                if (hours.exceptions.start) {
                    exception.start = hours.exceptions.start;
                }
                if (hours.exceptions.end) {
                    exception.end = hours.exceptions.end;
                }
                return exception;
            }
        }
    };

    /** @function nyplUtility.getAddressString
     * @param {object} location The full location object.
     * @param {boolean} [nicePrint] False by default. If true is passed, the
     *  returned string will have HTML so it displays nicely in a Google Maps
     *  marker infowindow.
     * @returns {string} The formatted address of the location passed. Will
     *  contain HTML if true is passed as the second parameter, with the
     *  location name linked
     */
    utility.getAddressString = function (location, nicePrint) {
        if (!location) {
            return '';
        }

        var addressBreak = " ",
            linkedName = location.name;

        if (nicePrint) {
            addressBreak = "<br />";
            linkedName = "<a href='/#/" + location.slug +
                "'>" + location.name + "</a>";
        }

        return linkedName + addressBreak +
            location.street_address + addressBreak +
            location.locality + ", " +
            location.region + ", " +
            location.postal_code;
    };

    utility.socialMediaColor = function (social_media) {
        _.each(social_media, function (sc) {
            sc.classes = 'icon-';
            switch (sc.site) {
            case 'facebook':
                sc.classes += sc.site + ' blueDarkerText';
                break;
            case 'foursquare':
                sc.classes += sc.site + ' blueText';
                break;
            case 'instagram':
                sc.classes += sc.site + ' blackText';
                break;
            // Twitter and Tumblr have a 2 in their icon class
            // name: icon-twitter2, icon-tumblr2
            case 'twitter':
                sc.classes += sc.site + '2 blueText';
                break;
            case 'tumblr':
                sc.classes += sc.site + '2 indigoText';
                break;
            case 'youtube':
            case 'pinterest':
                sc.classes += sc.site + ' redText';
                break;
            default:
                sc.classes += sc.site;
                break;
            }
        });

        return social_media;
    };

    utility.alerts = function (alerts) {
        var today = new Date(),
            todaysAlert = '',
            alert_start,
            alert_end;

        if (!alerts) {
            return null;
        }

        if (Array.isArray(alerts)) {
            _.each(alerts, function (alert) {
                alert_start = new Date(alert.start);
                alert_end = new Date(alert.end);

                if (alert_start <= today && today <= alert_end) {
                    todaysAlert += alert.body + "\n";
                }
            });

            if (!angular.isUndefined(todaysAlert)) {
                return todaysAlert;
            }
        }
        return null;
    };

    /*
    * Desc: Utility service function that opens a new window given a URL
    * Arguments:
    * link (URL), title (String), 
    * width (Int or String), height (Int or String)
    */
    utility.popupWindow = function (link, title, width, height) {
        var w, h, popUp, popUp_h, popUp_w;
        // Set width from args, defaults 300px
        if (width === undefined) {
            w = '300';
        } else if (typeof width === 'string' ||
                width instanceof String) {
            w = width;
        } else {
            w = width.toString(); // convert to string
        }

        // Set height from args, default 500px;
        if (height === undefined) {
            h = '500';
        } else if (typeof width === 'string' ||
                width instanceof String) {
            h = height;
        } else {
            h = height.toString(); // convert to string
        }

        // Check if link and title are set and assign attributes
        if (link && title) {
            popUp = $window.open(
                link,
                title,
                "menubar=1,resizable=1,width=" + w + ",height=" + h
            );
        } else if (link) {
            // Only if link is set, default title: ''
            popUp = $window.open(
                link,
                "",
                "menubar=1,resizable=1,width=" + w + ",height=" + h
            );
        } else {
            console.log(
                'No link set, cannot initialize the popup window'
            );
        }
        // Once the popup is set, center window
        if (popUp) {
            popUp_w = parseInt(w, 10);
            popUp_h = parseInt(h, 10);

            popUp.moveTo(
                screen.width / 2 - popUp_w / 2,
                screen.height / 2 - popUp_h / 2
            );
        }
    };

    utility.calendarLink = function (type, event, location) {
        if (!type || !event) {
            return '';
        }
        var title = event.title,
            start_date = event.start.replace(/[\-:]/g, ''),
            end_date = event.end.replace(/[\-:]/g, ''),
            body = event.body,
            url = event._links.self.href,
            address = location.name + " - " +
                location.street_address + " " +
                location.locality + ", " + location.region +
                " " + location.postal_code,
            calendar_link = '';

        switch (type) {
        case 'google':
            calendar_link = "https://www.google.com/calendar" +
                "/render?action=template" +
                "&text=" + title +
                "&dates=" + start_date + "/" + end_date +
                "&details=" + body +
                "&location=" + address +
                "&pli=1&uid=&sf=true&output=xml";
            break;
        case 'yahoo':
            calendar_link = "https://calendar.yahoo.com/?v=60" +
                "&TITLE=" + title +
                "&ST=" + start_date +
                "&in_loc=" + address +
                "&in_st=" + address +
                "&DESC=" + body +
                "&URL=" + url;
            break;
        default:
            break;
        }

        return calendar_link;
    };

    utility.icalLink = function (event, address) {
        if (!event || !address) {
            return '';
        }
        var currentTime = new Date().toJSON().toString().replace(/[\-.:]/g, ''),
            url = "http://nypl.org/" + event._links.self.href,
            icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NYPL//" +
                "NONSGML v1.0//EN\n" +
                "METHOD:PUBLISH\n" +
                "BEGIN:VEVENT\n" +
                "UID:" + new Date().getTime() +
                "\nDTSTAMP:" + currentTime + "\nATTENDEE;CN=My Self ;" +
                "\nORGANIZER;CN=NYPL:" +
                "\nDTSTART:" + event.start.replace(/[\-:]/g, '') +
                "\nDTEND:" + event.end.replace(/[\-:]/g, '') +
                "\nLOCATION:" + address +
                "\nDESCRIPTION:" + event.body +
                "\nURL;VALUE=URI:" + url +
                "\nSUMMARY:" + event.title +
                "\nEND:VEVENT\nEND:VCALENDAR";

        $window.open('data:text/calendar;chartset=utf-8,' +
            encodeURI(icsMSG));
    };

    // Iterate through lon/lat and calculate distance
    utility.calcDistance = function (locations, coords) {
        if (!locations) {
            return [];
        }

        var searchCoordinates = {
            latitude: coords.latitude || coords.lat,
            longitude: coords.longitude || coords.long
        };

        _.each(locations, function (location) {
            var locCoords = [], locationLat, locationLong;

            if (location.geolocation && location.geolocation.coordinates) {
                locCoords = location.geolocation.coordinates;
            }

            locationLat = location.lat || locCoords[1];
            locationLong = location.long || locCoords[0];

            location.distance =
                nyplCoordinatesService.getDistance(
                    searchCoordinates.latitude,
                    searchCoordinates.longitude,
                    locationLat,
                    locationLong
                );
        });

        return locations;
    };

    /** @function nyplUtility.checkDistance
     * @param {array} locations An array with all the locations objects.
     * @returns {boolean} True if the minimum distance property from each
     *  location is more than 25 (miles). False otherwise.
     * @description An array of distance values is created from the distance
     *  property of each location. If the minimum distance is more than 25 miles
     *  we return true; used when we want to check if we want to continue
     *  searching or manipulating the locations.
     */
    utility.checkDistance = function (locations) {
        var distanceArray = _.pluck(locations, 'distance');

        if (_.min(distanceArray) > 25) {
            return true;
        }
        return false;
    };

    /** @function nyplUtility.returnHTML
     * @param {string} html A string containing HTML that should be rendered.
     * @returns {string} A trusted string with renderable HTML used in
     *  AngularJS' markup binding.
     * @description Using the ngSanitize module to allow markup in a string.
     *  The second step is to use ng-bind-html="..." to display the
     *  trusted HTMl.
     */
    utility.returnHTML = function (html) {
        return $sce.trustAsHtml(html);
    };

    /** @function nyplUtility.divisionHasAppointment
     * @param {string} id The id of a division.
     * @returns {boolean} True if the division is in the set that should have
     *  appointments, false otherwise.
     * @description Only a few divisions should have a link to make
     *  an appointment.
     */
    utility.divisionHasAppointment = function (id) {
        switch (id) {
        case "ARN":
        case "RBK":
        case "MSS":
        case "BRG":
        case "PRN":
        case "PHG":
        case "SPN":
        case "CPS":
            return true;
        default:
            return false;
        }
    };

    return utility;
}

/** @namespace nyplSearch */
function nyplSearch($filter) {
    'use strict';

    var search = {};

    /** @function nyplSearch.idLocationSearch
     * @param {array} locations Array containing a list of all the
     *  locations objects.
     * @param {string} searchTerm The id to search for in all the locations.
     * @returns {array} An array containing the location object with the
     *  searched id. An empty array if there is no match.
     * @description All the locations are being searched with a specific ID in
     *  mind. If there is a location object where the 'id' property matches the
     *  id that was being searched, then it is returned in an array.
     */
    search.idLocationSearch = function (locations, searchTerm) {
        var IDFilter = [];

        if (searchTerm.length >= 2 && searchTerm.length <= 4) {
            IDFilter = _.where(locations, { 'id' : searchTerm.toUpperCase() });
        }

        return IDFilter;
    };

    /** @function nyplSearch.locationSearch
     * @param {array} locations An array with all the location objects.
     * @param {string} searchTerm The search word or phrased to look for in the
     *  locations objects.
     * @returns {array} An array that returns filtered locations based on what
     *  was queried and what AngularJS' filter returns.
     * @description Using the native AngularJS filter, we do a lazy and strict
     *  filter through the locations array. The strict filter has a higher
     *  priority since it's a better match. The 'lazy' filter matches anything,
     *  even part of a word. For example, 'sibl' would match with 'accesSIBLe'
     *  which is undesirable.
     */
    search.locationSearch = function (locations, searchTerm) {
        // how to search the object?
        // name, address, zipcode, locality, synonyms (amenities and divisions?)

        var lazyFilter = $filter('filter')(locations, searchTerm),
            strictFilter = $filter('filter')(locations, searchTerm, true);

        if (strictFilter !== undefined && strictFilter.length !== 0) {
            // Rarely occurs but just in case there are results for
            // both filters, the strict match should appear first
            return _.union(strictFilter, lazyFilter);
        }

        return lazyFilter;
    };

    /** @function nyplSearch.searchWordFilter
     * @param {string} query The search word or phrase.
     * @returns {string} The same search phrase but with stop words removed.
     * @description Some words should be removed from a user's search query.
     *  Those words are removed before doing any filtering or searching using 
     *  Google's service.
     */
    search.searchWordFilter = function (query) {
        var words = ['branch'];

        _.each(words, function (word) {
            query = query.replace(word, '');
        });

        return query;
    };

    return search;
}

/** @namespace nyplAmenities */
function nyplAmenities() {
    'use strict';

    var amenities = {},
        sortAmenitiesList = function (list, sortBy) {
            return _.sortBy(list, function (item) {
                return item[sortBy];
            });
        };

    /** @function nyplAmenities.addIcon
     * @param {array} amenities Array with amenities objects.
     * @param {string} default_icon The default icon for an amenity.
     * @returns {array} 
     * @description Adds an icon class to an amenity category.
     */
    amenities.addIcon = function (amenities, default_icon) {
        var icon = default_icon || '';
        _.each(amenities, function (amenity) {
            switch (amenity.id) {
            case 6:
                amenity.icon = 'icon-connection';
                break;
            case 216:
                amenity.icon = 'icon-laptop';
                break;
            case 7:
                amenity.icon = 'icon-print';
                break;
            case 9:
                amenity.icon = 'icon-power-cord';
                break;
            case 65910:
            case 39:
                amenity.icon = 'icon-box-add';
                break;
            default:
                amenity.icon = icon;
                break;
            }
        });

        return amenities;
    };

    amenities.addCategoryIcon = function (amenities) {
        var self = this;
        _.each(amenities, function (amenityCategory) {
            var icon = '';
            switch (amenityCategory.name) {
            case 'Computer Services':
                icon = 'icon-screen2';
                break;
            case 'Circulation':
                icon = 'icon-book';
                break;
            case 'Office Services':
                icon = 'icon-copy';
                break;
            case 'Facilities':
                icon = 'icon-library';
                break;
            case 'Assistive Technologies':
                icon = 'icon-accessibility2';
                break;
            }

            amenityCategory.icon = icon;
            amenityCategory.amenities =
                self.addIcon(amenityCategory.amenities, icon);
        });

        return amenities;
    };

    amenities.allAmenitiesArray = function (amenitiesCategory) {
        if (!amenitiesCategory) {
            return;
        }

        return _.chain(amenitiesCategory)
                .pluck('amenities')
                .flatten(true)
                .value();
    };

    amenities.getLocationAmenities = function (amenitiesCategory) {
        var initial_list = this.allAmenitiesArray(amenitiesCategory),
            amenities_list;

        initial_list = sortAmenitiesList(initial_list, 'rank');

        amenities_list = initial_list.splice(0,3);

        initial_list = sortAmenitiesList(initial_list, 'location_rank');

        amenities_list = _.union(amenities_list, initial_list.splice(0,2));

        return amenities_list;
    };

    return amenities;
}

angular
    .module('nypl_locations')
    .factory('nyplUtility', nyplUtility)
    .factory('nyplSearch', nyplSearch)
    .factory('nyplAmenities', nyplAmenities)
    .factory('requestNotificationChannel', requestNotificationChannel);
