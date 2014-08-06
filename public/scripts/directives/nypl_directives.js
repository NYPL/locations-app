/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations, $window, angular */

// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
// declare the directive that will show and hide the loading widget
function loadingWidget(requestNotificationChannel) {
    'use strict';
    return {
        restrict: "A",
        link: function (scope, element) {
            var startRequestHandler = function (event) {
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
}

function translatebuttons() {
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
}

function todayshours() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/todaysHours.html',
        replace: true,
        scope: {
            hours: '@'
        }
    };
}

function nyplbreadcrumbs() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/breadcrumbs.html',
        replace: true
    };
}

function emailusbutton() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/emailus.html',
        replace: true,
        scope: {
            link: '@'
        }
    };
}

function librarianchatbutton(nypl_utility) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/librarianchat.html',
        replace: true,
        link: function (scope, element, attrs, $window) {
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
}

function scrolltop($window) {
    'use strict';

    return function (scope) {
        scope.$on('$routeChangeStart', function () {
            $window.scrollTo(0, 0);
        });
    };
}

function eventRegistration() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/registration.html',
        replace: true,
        scope: {
            how: '@',
            link: '@',
            registrationopen: '@'
        },
        link: function (scope, element, attrs) {
            var today,
                registrationopen = attrs.registrationopen;

            scope.online = false;
            scope.opens = 'opens';

            if (attrs.how === 'Online') {
                scope.online = true;
            }

            if (registrationopen) {
                today = new Date().toISOString();
                if (today > registrationopen) {
                    scope.opens = 'opened';
                }
            }
        }
    };
}

function nyplSiteAlerts(nypl_locations_service, nypl_utility) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/alerts.html',
        replace: true,
        // Must be global for unit test to pass. Must find better way to test.
        // scope: {},
        link: function (scope, element, attrs) {
            var alerts;
            nypl_locations_service.alerts().then(function (data) {
                alerts = data.alerts;
                scope.sitewidealert = nypl_utility.alerts(alerts);
            });
        }
    };
}

function nyplLibraryAlert() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/library-alert.html',
        replace: true,
        scope: true
    };
}


/* 
** Show/Hide collapsible animated directive
** Usage: <div collapse="name of var toggled" duration="time in ms"
**          class-name="open"></div>
** Duration & class-name are optional
*/
function collapse() {
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
}

angular
    .module('nypl_locations')
    .directive('loadingWidget', loadingWidget)
    .directive('translatebuttons', translatebuttons)
    .directive('todayshours', todayshours)
    .directive('nyplbreadcrumbs', nyplbreadcrumbs)
    .directive('emailusbutton', emailusbutton)
    .directive('librarianchatbutton', librarianchatbutton)
    .directive('scrolltop', scrolltop)
    .directive('eventRegistration', eventRegistration)
    .directive('nyplSiteAlerts', nyplSiteAlerts)
    .directive('nyplLibraryAlert', nyplLibraryAlert)
    .directive('collapse', collapse);
