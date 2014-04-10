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

        getAddressString: function (location, nicePrint) {
            var addressBreak = (nicePrint) ? "<br />" : " ";

            return location.name + addressBreak + 
                location.street_address + addressBreak + 
                location.locality + ", " + 
                location.region + ", " + 
                location.postal_code;
        },

        locationType: function(id) {
            switch(id) {
                case 'SASB':
                case 'LPA':
                case 'SCHOMBURG':
                case 'SIBL':
                    return 'research';
                default:
                    return 'circulating';
            }
        }
    };
});
