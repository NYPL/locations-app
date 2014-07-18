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
                        element.addClass('show');
                    },
                    endRequestHandler = function (event) {
                        // got the request start notification, show the element
                        element.removeClass('show');
                    };

                // hide the element initially
                if (element.hasClass('show')) {
                    element.removeClass('show');
                }

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
            templateUrl: 'scripts/directives/templates/translatebuttons.html',
            replace: true,
            controller: function ($scope, $translate) {
                $scope.translate = function (language) {
                    $translate.use(language);
                };
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


nypl_locations.directive('nyplbreadcrumbs', [
    function () {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'scripts/directives/templates/breadcrumbs.html',
            replace: true,
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
    'nypl_locations_service',
    'nypl_utility',
    function (nypl_locations_service, nypl_utility) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'scripts/directives/templates/alerts.html',
            replace: true,
            link: function (scope, element, attrs) {
                var alerts;
                nypl_locations_service.alerts().then(function (data) {
                    alerts = data.alerts;

                    scope.sitewidealert = nypl_utility.alerts(alerts);
                });
            }
        };
    }]);

/* 
** Show/Hide collapsible animated directive
** Usage: <div collapse="name of var toggled" duration="time in ms"
**          class-name="open"></div>
** Duration & class-name are optional
*/
nypl_locations.directive("collapse",
    function () {
        'use strict';
        function link($scope, element, attributes) {
            var exp = attributes.collapse,
                class_name = (attributes.className || "open"),
                duration = (attributes.duration || "fast");

            if (!$scope.$eval(exp)) {
                element.hide();
            }

            // Watch the expression in $scope context to
            // see when it changes and adjust the visibility
            $scope.$watch(
                exp,
                function (newVal, oldVal) {
                    // If values are equal -- just return
                    if (newVal === oldVal) {
                        return;
                    }
                    // Show element.
                    if (newVal) {
                        element.stop(true, true).
                            slideDown(duration).
                            addClass(class_name);
                    } else {
                        element.stop(true, true).
                            slideUp(duration).
                            removeClass(class_name);
                    }
                }
            );
        }
        return ({
            link: link,
            restrict: "A" // Attribute only
        });
    });