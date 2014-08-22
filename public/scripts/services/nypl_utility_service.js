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

function nyplUtility($filter, nyplCoordinatesService, $window, $sce) {
    'use strict';

    var utility = {};

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
    utility.branchException = function(hours) {
        var exception = {};

        if (hours) {
            // If truthy, data exist for existing location
            if (!hours.exceptions) {
                return null;
            }
            else if (hours.exceptions.description.trim() !== '') {
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

    // Line breaks are needed when displaying the address on the marker
    // for the map. The name is also a link to the location's page.
    // Line breaks are not needed when we use the address 
    // to get directions on Google Maps.
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

    utility.locationType = function (id) {
        switch (id) {
        case 'SASB':
        case 'LPA':
        case 'SC':
        case 'SIBL':
            return 'research';
        default:
            return 'circulating';
        }
    };

    utility.socialMediaColor = function (social_media) {
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
        var currentTime = new Date().toJSON()
                .toString().replace(/[\-.:]/g, ''),
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

        var search = {
            latitude: coords.latitude || coords.lat,
            longitude: coords.longitude || coords.long
        };

        _.each(locations, function (location) {
            location.distance =
                nyplCoordinatesService.getDistance(
                    search.latitude,
                    search.longitude,
                    location.lat,
                    location.long
                );
        });

        return locations;
    };

    utility.checkDistance = function (locations) {
        var distanceArray = _.pluck(locations, 'distance');

        if (_.min(distanceArray) > 25) {
            return true;
        }
        return false;
    };

    // Use ngSanitize to allow markup.
    // Must use ng-bind-html as attribute in the element.
    utility.returnHTML = function (html) {
        return $sce.trustAsHtml(html);
    };

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

function nyplSearch($filter) {
    'use strict';

    var search = {};

    search.idLocationSearch = function (locations, searchTerm) {
        var IDFilter = [];

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

        return IDFilter;
    };

    search.locationSearch = function (locations, searchTerm) {
        var lazyFilter =
                $filter('filter')(locations, searchTerm),
            strictFilter =
                $filter('filter')(locations, searchTerm, true);

        // Check the strict and 'lazy' filter.
        // The strict filter has a higher priority since it's
        // a better match. The 'lazy' filter matches anything,
        // even part of a word so 'sibl' would match with
        // 'accesSIBLe'.
        if (strictFilter !== undefined && strictFilter.length !== 0) {
            // Rarely occurs but just in case there are results for
            // both filters, the strict match should appear first
            return _.union(strictFilter, lazyFilter);
        }

        return lazyFilter;
    };

    search.searchWordFilter = function (query) {
        var words = ['branch'];

        _.each(words, function (word) {
            query = query.replace(word, '');
        });

        return query;
    };

    return search;
}

function nyplAmenities() {
    'use strict';

    var amenities = {};

    amenities.addIcon = function (amenities, default_icon) {
        var icon = default_icon || '';
        _.each(amenities, function (amenity) {
            // console.log(amenity);
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

    return amenities;
}

angular
    .module('nypl_locations')
    .factory('nyplUtility', nyplUtility)
    .factory('nyplSearch', nyplSearch)
    .factory('nyplAmenities', nyplAmenities)
    .factory('requestNotificationChannel', requestNotificationChannel);
