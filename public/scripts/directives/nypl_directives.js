/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
// declare the directive that will show and hide the loading widget
nypl_locations.directive('loadingWidget', [
    'requestNotificationChannel',
    function (requestNotificationChannel) {
        'use strict';
        return {
            restrict: "A",
            link: function (scope, element) {
                var
                    startRequestHandler = function () {
                        // got the request start notification, show the element
                        element.show();
                    },
                    endRequestHandler = function () {
                        // got the request start notification, show the element
                        element.hide();
                    };

                // hide the element initially
                element.hide();

                // register for the request start notification
                requestNotificationChannel.
                    onRequestStarted(scope, startRequestHandler);
                // register for the request end notification
                requestNotificationChannel.
                     onRequestEnded(scope, endRequestHandler);
            }
        };
    }]);

nypl_locations.directive('todayshours', [
    function () {
        return {
            restrict: 'E',
            templateUrl: '/scripts/directives/templates/todaysHours.html',
            replace: true,
            scope: {
                hours: '@'
            }
        };
    }]);

nypl_locations.directive('askdonatefooter', [
    function () {
        return {
            restrict: 'E',
            templateUrl: '/scripts/directives/templates/ask-donate-footer.html',
            replace: true,
            scope: {
                chatHref: '@',
                emailHref: '@',
                donateHref: '@'
            }

        };
    }]);
