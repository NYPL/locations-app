/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals nypl_locations */

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

nypl_locations.factory('nypl_utility', function () {
    'use strict';
    return {
        hoursToday: function (hours) {
            var date = new Date(),
                today = date.getDay(),
                hoursToday = {
                    'today': hours.regular[today].day,
                    'open': hours.regular[today].open,
                    'close': hours.regular[today].close
                };
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
                var alert_start = new Date(alert.start);
                var alert_end = new Date(alert.end);

                if (today >= alert_start && today <= alert_end) {
                    todaysAlert = alert;
                }
            });


            if (!angular.isUndefined(todaysAlert)) {
                return todaysAlert.body;
            }
            return null;
        }

    };
});
