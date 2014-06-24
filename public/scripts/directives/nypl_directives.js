/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations, window */
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
                    startRequestHandler = function (event) {
                        // got the request start notification, show the element
                        element.show();
                    },
                    endRequestHandler = function (event) {
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

nypl_locations.directive('translatebuttons', [
    function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: '/scripts/directives/templates/translatebuttons.html',
            replace: true,
            controller: function ($scope, $translate) {
                $scope.translate = function (language) {
                    $translate.use(language);
                }
            }
        };
    }]);

nypl_locations.directive('todayshours', [
    function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'scripts/directives/templates/todaysHours.html',
            replace: true,
            scope: {
                hours: '@'
            }
        };
    }]);

nypl_locations.directive('askdonatefooter', [
    'nypl_utility',
    function (nypl_utility) {
        'use strict';

        return {
            restrict: 'EA',
            templateUrl: 'scripts/directives/templates/ask-donate-footer.html',
            replace: true,
            scope: {
                emailHref: '@',
                donateHref: '@'
            },
            link: function (scope, element, attrs, window) {
                scope.openChat = function () {
                    // Utilize service in directive to fire off the new window.
                    // Arguments: 
                    // link (req),
                    // title (optional), width (optional), height (optional)
                    nypl_utility.popup_window(
                        'http://www.nypl.org/ask-librarian',
                        'NYPL Chat',
                        210,
                        450
                    );
                };
            }

        };
    }]);

nypl_locations.directive('scrolltop', [
    function () {
        'use strict';

        return function (scope) {
            scope.$on('$routeChangeStart', function () {
                window.scrollTo(0, 0);
            });
        };
    }]);

nypl_locations.directive('nyplalerts', [
    function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'scripts/directives/templates/alerts.html',
            replace: true,
            scope: {
                sitewidealert: '@',
                libraryalert: '@'
            }
        };
    }]);
