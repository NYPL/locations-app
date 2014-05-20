/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals nypl_locations, angular */

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
                    handler();
                });
            },

            // subscribe to end request notification
            onRequestEnded = function ($scope, handler) {
                $scope.$on(_END_REQUEST_, function (event) {
                    handler();
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
    function () {
        'use strict';
        return {
            hoursToday: function (hours) {
                var date = new Date(),
                today = date.getDay(),
                hoursToday;

                if (hours) {
                    hoursToday = {
                        'today': hours.regular[today].day,
                        'open': hours.regular[today].open,
                        'close': hours.regular[today].close
                    };
                }
                else {
                    hoursToday = undefined;
                }
                return hoursToday;
            },

            // Line breaks are needed when displaying the address on the marker
            // for the map. Line breaks are not needed when we use the address 
            // to get directions on Google Maps.
            getAddressString: function (location, nicePrint) {
                var addressBreak = nicePrint ? "<br />" : " ";

                return location.name + addressBreak +
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
                        sc.classes += sc.site + '';
                        break;
                    }
                });

                return social_media;
            },

            alerts: function (alerts) {
                var today = new Date(),
                    todaysAlert;

                _.each(alerts, function (alert) {
                    var alert_start = new Date(alert.start),
                        alert_end = new Date(alert.end);

                    if (today >= alert_start && today <= alert_end) {
                        todaysAlert = alert;
                    }
                });


                if (!angular.isUndefined(todaysAlert)) {
                    return todaysAlert.body;
                }
                return null;
            },
            /*
            * Desc: Utility service function that opens a new window given a URL
            * Arguments: link (URL), title (String), width (Int or String), height (Int or String)
            */
            popup_window: function(link, title, width, height) {
                var w, h, t, popUp;
                // Set width from args, defaults 300px
                if (width === undefined) {
                    w = '300';
                }
                else if (typeof width == 'string' || width instanceof String) {
                    w = width;
                }
                else {
                    w = width.toString(); // convert to string
                }

                // Set height from args, default 500px;
                if (height === undefined) {
                    h = '500';
                }
                else if (typeof width == 'string' || width instanceof String) {
                    h = height;
                }
                else {
                    h = height.toString(); // convert to string
                }

                // Check if link and title are set and assign attributes
                if (link && title) {
                    popUp = window.open(link, title, "menubar=1,resizable=1,width="+w+",height="+h+"");
                }
                // Only if link is set, default title: ''
                else if (link) {
                    popUp = window.open(link,"","menubar=1,resizable=1,width="+w+",height="+h+"");
                    
                }
                else {
                    console.log('No link set, cannot initialize the popup window');
                }
                // Once the popup is set, center window
                if (popUp) {
                    var popUp_w = parseInt(w);
                    var popUp_h = parseInt(h);
                    popUp.moveTo(screen.width/2-popUp_w/2, screen.height/2-popUp_h/2);
                }
            },

            google_calendar_link: function (event, address) {
                var base = "https://www.google.com/calendar/render?action=template",
                    text = "&text=" + event.title,
                    date = "&dates=",
                    start_date = event.start.replace(/[-:]/g, ''),
                    end_date = event.end.replace(/[-:]/g, ''),
                    details = "&details=" + event.body,
                    location = "&location=" + address,
                    other_params = "&pli=1&uid=&sf=true&output=xml";

                return base + text + date + start_date + "/" +
                    end_date + details + location + other_params;
            }
        };
    }
]);
