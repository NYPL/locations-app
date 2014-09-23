/*jslint unparam: true, indent: 4, maxlen: 80 */
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

function nyplTranslate() {
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

function librarianchatbutton(nyplUtility) {
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
                nyplUtility.popupWindow(
                    'http://www.nypl.org/ask-librarian',
                    'NYPL Chat',
                    210,
                    450
                );
                if (!element.hasClass('active')) {
                    element.addClass('active');
                }
            };
        }
    };
}

function scrolltop($window) {
    'use strict';

    return function (scope) {
        scope.$on('$stateChangeStart', function () {
            $window.scrollTo(0, 0);
        });
    };
}

function eventRegistration($filter) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/registration.html',
        replace: true,
        scope: {
            registration: '@',
            type: '@',
            open: '@',
            start: '@',
            link: '@'
        },
        link: function (scope, element, attrs) {
            scope.online = false;

            if (scope.type === 'Online') {
                scope.online = true;

                if (scope.open === 'true') {
                    scope.registration_available = "Registration opens on " +
                        $filter('date')(scope.start, 'MMMM d, y - h:mma');
                } else {
                    scope.registration_available =
                        "Registration for this event is closed.";
                }
            }
        }
    };
}

function nyplSiteAlerts(nyplLocationsService, nyplUtility) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/alerts.html',
        replace: true,
        // Must be global for unit test to pass. Must find better way to test.
        // scope: {},
        link: function (scope, element, attrs) {
            var alerts;
            nyplLocationsService.alerts().then(function (data) {
                alerts = data.alerts;
                scope.sitewidealert = nyplUtility.alerts(alerts);
            });
        }
    };
}

function nyplLibraryAlert(nyplUtility) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/library-alert.html',
        replace: true,
        scope: {
            exception: '='
        },
        link: function (scope, element, attrs) {
            if (scope.exception) {
                if (scope.exception.description !== '') {
                    scope.libraryAlert = scope.exception.description;
                }
            }
        }
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
                    element.stop(true, true)
                        .slideDown(duration)
                        .addClass(class_name);
                } else {
                    element.stop(true, true)
                        .slideUp(duration)
                        .removeClass(class_name);
                }
            }
        );
    }

    return ({
        link: link,
        restrict: "A" // Attribute only
    });
}

function nyplFundraising() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/fundraising.html',
        replace: true,
        scope: {
            fundraising: '=fundraising'
        }
    };
}

/* 
** Directive: <nypl-sidebar donate-button="" nypl-ask="" donateurl="">
** Usage: Inserts optional Donate button/nyplAsk widget when 'true' is
**        passed to donate-button="" or nypl-ask="". A custom donate url
**        can be passed for the donate-button, otherwise a default is set
*/
function nyplSidebar() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/sidebar-widgets.html',
        replace: true,
        scope: {
            donateButton: '@',
            nyplAsk: '@'
        },
        link: function (scope, elem, attrs) {
            var url = "https://secure3.convio.net/nypl/site/SPageServer?pagename=donation_form&JServSessionIdr003=dwcz55yj27.app304a&s_src=FRQ14ZZ_SWBN";      
            scope.donateUrl = (attrs.donateurl || url);      
        }
    };
}

function nyplAutofill($timeout) {
    'use strict';

    return {
        restrict: 'AEC',
        templateUrl: 'scripts/directives/templates/autofill.html',
        scope: {
            data: '=',
            model: '=ngModel',
            mapView: '&',
            geoSearch: '&'
        },
        link: function ($scope, elem, attrs, controller) {
            $scope.focused = false;
            var input  = angular.element(document.getElementById('searchTerm')),
                submit = angular.element(document.getElementById('find-location')),
                html   = angular.element(document.getElementsByTagName('html'));


            input.bind('focus', function() {
                $scope.$apply( function() { 
                    $scope.focused = true;
                });
            });

            input.bind('click', function(e) {
                e.stopPropagation();
            });

            input.bind('keyup', function(e) {
                // Tab & Enter keys
                if (e.keyCode === 9 || e.keyCode === 13) {
                    $scope.$apply( function() {
                        if (controller.setSearchText($scope.model)) {
                            $timeout(function() {
                                submit.triggerHandler('click');
                            }, 100);
                        }
                        else {

                        }
                    });
                }

                // Right Arrow
                if (e.keyCode === 39) {
                    $scope.$apply( function() { 
                        controller.setSearchText($scope.model); 
                    });
                }

                // Backspace
                if (e.keyCode === 8) {
                    $scope.$apply( function() { $scope.lookahead = ''; });
                }

                // Escape key
                if (e.keyCode === 27) {
                    $scope.$apply( function() { $scope.focused = false; });
                }
            });

            // Tab, Enter and Escape keys
            input.bind('keydown', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                    e.preventDefault();
                };
            });

            html.bind('click', function(e) {
                $scope.$apply( function() {
                    $scope.focused = false;
                });
            });     

            $scope.locationName = function(elem) {
                if(!$scope.model) return true;
                return elem.name.toLowerCase().indexOf($scope.model.toLowerCase()) >= 0;
                //return element.name.substring(0, $scope.model.length).toLowerCase() 
                               // === $scope.model.toLowerCase();
            };

            /* *
             * Watch the model and look for an appropriate suggestion in the specified source
             */
            $scope.$watch('model', function(value) {
                controller.updateSearchText($scope.data, value);
            });

            $scope.$on('$stateChangeSuccess', function () {
                controller.resetSearchTerms();
                $scope.focused = false;
            });

        },
        controller: function($scope) {
            $scope.lookahead = '',
            $scope.currentWord = '',
            $scope.completeWord = '';
            var elements, filteredStrict;

            this.setSearchText = function(model) {
                if ( $scope.completeWord === $scope.model || 
                    $scope.completeWord === '' || 
                    $scope.model === '') return;
                return $scope.model = $scope.completeWord;
            };

            // Todo
            this.matchSearchText = function() {

            };

            this.resetSearchTerms = function() {
                $scope.lookahead = '';
                $scope.currentWord = '';
            }

            this.updateSearchText = function(data, searchTerm) {
                if (searchTerm === '' || !searchTerm || !data) return;

                if (searchTerm.length > 0) {
                    elements = _.chain(data).pluck('name').flatten(true).value();
                    filteredStrict = _.filter(elements, function(elem) {
                        return elem.substring(0, searchTerm.length).toLowerCase() 
                                === searchTerm.toLowerCase();
                    });

                    if (filteredStrict[0]) {
                        $scope.lookahead   = filteredStrict[0].substring(searchTerm.length);
                        $scope.currentWord = searchTerm;       
                    }
                    else {
                        this.resetSearchTerms();
                    }
                    return $scope.completeWord = $scope.currentWord + $scope.lookahead;
                }
            }

        }
    };

}

angular
    .module('nypl_locations')
    .directive('loadingWidget', loadingWidget)
    .directive('nyplTranslate', nyplTranslate)
    .directive('todayshours', todayshours)
    .directive('emailusbutton', emailusbutton)
    .directive('librarianchatbutton', librarianchatbutton)
    .directive('scrolltop', scrolltop)
    .directive('eventRegistration', eventRegistration)
    .directive('nyplSiteAlerts', nyplSiteAlerts)
    .directive('nyplLibraryAlert', nyplLibraryAlert)
    .directive('nyplFundraising', nyplFundraising)
    .directive('nyplSidebar', nyplSidebar)
    .directive('nyplAutofill', nyplAutofill)
    .directive('collapse', collapse);
