/*jslint nomen: true, indent: 4, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, window, _ */

// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
nypl_locations.factory('requestNotificationChannel', [
    '$rootScope',
    function ($rootScope) {
        'use strict';

        // private notification messages
        var _START_REQUEST_ = '_START_REQUEST_',
            _END_REQUEST_ = '_END_REQUEST_',

            // publish start request notification
            requestStarted = function () {
                $rootScope.$broadcast(_START_REQUEST_);
            },

            // publish end request notification
            requestEnded = function () {
                $rootScope.$broadcast(_END_REQUEST_);
            },

            // subscribe to start request notification
            onRequestStarted = function ($scope, handler) {
                $scope.$on(_START_REQUEST_, function (event) {
                    handler(event);
                });
            },

            // subscribe to end request notification
            onRequestEnded = function ($scope, handler) {
                $scope.$on(_END_REQUEST_, function (event) {
                    handler(event);
                });
            };

        return {
            requestStarted:  requestStarted,
            requestEnded: requestEnded,
            onRequestStarted: onRequestStarted,
            onRequestEnded: onRequestEnded
        };
    }
]);

nypl_locations.factory('nypl_utility', [
    '$filter',
    'nypl_coordinates_service',
    function ($filter, nypl_coordinates_service) {
        'use strict';
        return {
            hoursToday: function (hours) {
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
            },

            // Line breaks are needed when displaying the address on the marker
            // for the map. The name is also a link to the location's page.
            // Line breaks are not needed when we use the address 
            // to get directions on Google Maps.
            getAddressString: function (location, nicePrint) {
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
            },

            locationType: function (id) {
                switch (id) {
                case 'SASB':
                case 'LPA':
                case 'SC':
                case 'SIBL':
                    return 'research';
                default:
                    return 'circulating';
                }
            },

            socialMediaColor: function (social_media) {
                _.each(social_media, function (sc) {
                    sc.classes = 'icon-';
                    switch (sc.site) {
                    case 'facebook':
                        sc.classes += sc.site + ' blueDarkerText';
                        break;
                    case 'youtube':
                    case 'pinterest':
                        sc.classes += sc.site + ' redText';
                        break;
                    // Twitter and Tumblr have a 2 in their icon class
                    // name: icon-twitter2, icon-tumblr2
                    case 'twitter':
                        sc.classes += sc.site + '2 blueText';
                        break;
                    case 'tumblr':
                        sc.classes += sc.site + '2 indigoText';
                        break;
                    case 'foursquare':
                        sc.classes += sc.site + ' blueText';
                        break;
                    default:
                        sc.classes += sc.site;
                        break;
                    }
                });

                return social_media;
            },

            alerts: function (alerts) {
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
                } else {
                    alert_start = new Date(alerts.start);
                    alert_end = new Date(alerts.end);

                    console.log("End date for library date: " + alert_end);
                    if (today >= alert_start && today <= alert_end) {
                        todaysAlert += alerts.description;
                    }
                }
                if (!angular.isUndefined(todaysAlert)) {
                    return todaysAlert;
                }
            },
            /*
            * Desc: Utility service function that opens a new window given a URL
            * Arguments:
            * link (URL), title (String), 
            * width (Int or String), height (Int or String)
            */
            popup_window: function (link, title, width, height) {
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
                    popUp = window.open(
                        link,
                        title,
                        "menubar=1,resizable=1,width=" + w + ",height=" + h
                    );
                } else if (link) {
                    // Only if link is set, default title: ''
                    popUp = window.open(
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
            },

            google_calendar_link: function (event, address) {
                if (!event) {
                    return '';
                }

                var base = "https://www.google.com/calendar" +
                        "/render?action=template",
                    text = "&text=" + event.title,
                    date = "&dates=",
                    start_date = event.start.replace(/[\-:]/g, ''),
                    end_date = event.end.replace(/[\-:]/g, ''),
                    details = "&details=" + event.body,
                    location = "&location=" + address,
                    other_params = "&pli=1&uid=&sf=true&output=xml";

                return base + text + date + start_date + "/" +
                    end_date + details + location + other_params;
            },

            location_search: function (locations, searchTerm) {
                var IDFilter = [],
                    lazyFilter =
                        $filter('filter')(locations, searchTerm),
                    strictFilter =
                        $filter('filter')(locations, searchTerm, true),
                    result;

                // search for ID
                // This is a priority.
                // If 'sibl' is searched, then it should display it
                // first before anything else.
                if (searchTerm.length >= 2 && searchTerm.length <= 4) {
                    IDFilter = _.where(
                        locations,
                        { 'id' : searchTerm.toUpperCase() }
                    );
                }

                // If there's no ID search, then check the strict and
                // 'lazy' filter.
                // The strict filter has a higher priority since it's
                // a better match. The 'lazy' filter matches anything,
                // even part of a word so 'sibl' would match with
                // 'accesSIBLe'.
                if (IDFilter.length !== 0) {
                    result = IDFilter;
                } else {
                    if (strictFilter !== undefined
                            && strictFilter.length !== 0) {
                        // Rarely occurs but just in case there are results for
                        // both filters, the strict match should appear first
                        result = _.union(strictFilter, lazyFilter);
                    }
                    result = lazyFilter;
                }

                return result;
            },

            // Iterate through lon/lat and calculate distance
            add_distance: function (locations, coords) {
                var search = {
                    latitude: coords.latitude || coords.lat,
                    longitude: coords.longitude || coords.long
                };

                _.each(locations, function (location) {
                    location.distance =
                        nypl_coordinates_service.getDistance(
                            search.latitude,
                            search.longitude,
                            location.lat,
                            location.long
                        );
                });

                return locations;
            },

            check_distance: function (locations) {
                var distanceArray = _.pluck(locations, 'distance');

                if (_.min(distanceArray) > 25) {
                    return true;
                }
                return false;
            },

            // Generate link to the books available at a particular branch
            // in Bibliocommons
            catalog_items_link: function (branch) {
                var base = "http://nypl.bibliocommons.com/search?" +
                    "custom_query=available%3A\"",
                    bc_branch;

                // TODO: Instead of handling these exceptions here, the 
                // API should just return a catalog link
                if (branch.indexOf("Andrew Heiskel") === 0) {
                    bc_branch =
                        "Andrew%20Heiskell%20Braille%20%26%20Talking" +
                        "%20Book%20Library";
                } else if (branch.indexOf("Belmont Library") === 0) {
                    bc_branch = "Belmont";
                } else if (branch === "Bronx Library Center") {
                    bc_branch = branch;
                } else if (branch.indexOf(" Library Center") !== -1) {
                    bc_branch = branch.replace(" Library Center", "");
                } else {
                    bc_branch = branch
                        .replace(" Library", "")
                        .replace(/ /g, "%20");
                }
                return base + bc_branch + "\"";
            }
        };
    }
]);
