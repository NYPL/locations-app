/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window, headerScripts */


/**
 * @ngdoc overview
 * @module nypl_locations
 * @name nypl_locations
 * @requires ngSanitize
 * @requires ui.router
 * @requires ngAnimate
 * @requires locationService
 * @requires coordinateService
 * @requires nyplFeedback
 * @requires nyplSearch
 * @requires nyplSSO
 * @requires nyplNavigation
 * @requires nyplBreadcrumbs
 * @requires angulartics
 * @requires angulartics.google.analytics
 * @requires newrelic-timing
 * @description
 * AngularJS app for NYPL's new Locations section.
 */
var nypl_locations = angular.module('nypl_locations', [
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'locationService',
    'coordinateService',
    'nyplFeedback',
    'nyplSearch',
    'nyplSSO',
    'nyplNavigation',
    'nyplBreadcrumbs',
    'angulartics',
    'angulartics.google.analytics',
    'newrelic-timing'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
    '$analyticsProvider',
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$crumbProvider',
    function (
        $analyticsProvider,
        $locationProvider,
        $stateProvider,
        $urlRouterProvider,
        $crumbProvider
    ) {
        'use strict';

        // Turn off automatic virtual pageviews for GA.
        // In $stateChangeSuccess, /locations/ is added to each page hit.
        $analyticsProvider.virtualPageviews(false);

        // uses the HTML5 History API, remove hash (need to test)
        $locationProvider.html5Mode(true);

        function LoadLocation($stateParams, config, nyplLocationsService) {
            return nyplLocationsService
                .singleLocation($stateParams.location)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (err) {
                    throw err;
                });
        }

        function LoadSubDivision($q, $stateParams, config, nyplLocationsService) {
            var division    = nyplLocationsService
                                .singleDivision($stateParams.division),
                subdivision = nyplLocationsService
                                .singleDivision($stateParams.subdivision);

            return $q.all([division, subdivision]).then(function (data) {
                var div = data[0].division,
                    subdiv = data[1].division;

                return subdiv;
            });
        }

        function LoadDivision($stateParams, config, nyplLocationsService) {
            return nyplLocationsService
                .singleDivision($stateParams.division)
                .then(function (data) {
                    return data.division;
                })
                .catch(function (err) {
                    throw err;
                });
        }

        function Amenities($stateParams, config, nyplLocationsService) {
            return nyplLocationsService
                .amenities($stateParams.amenity)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    throw error;
                });
        }

        function getConfig(nyplLocationsService) {
            return nyplLocationsService.getConfig();
        }

        $crumbProvider.setOptions({
            primaryState: {name:'Home', customUrl: 'http://nypl.org' },
            secondaryState: {name:'Locations', customUrl: 'home.index' }
        });

        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.url();

            // Remove trailing slash if found
            if (path[path.length - 1] === '/') {
                return path.slice(0, -1);
            }
        })

        // This next line breaks unit tests which doesn't make sense since
        // unit tests should not test the whole app. BUT since we are testing
        // directives and using $rootScope.$digest or $rootScope.$apply,
        // it will run the app. It may not be necessary for the app though
        // since, in the run phase, if there is an error when changing state,
        // the app will go to the 404 state.
        $urlRouterProvider.otherwise('/404');
        $stateProvider
            .state('home', {
                url: '/',
                abstract: true,
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl',
                label: 'Locations',
                resolve: {
                    config: getConfig
                }
            })
            .state('home.index', {
                templateUrl: 'views/location-list-view.html',
                url: '',
                label: 'Locations'
            })
            .state('home.list', {
                templateUrl: 'views/location-list-view.html',
                url: 'list',
                label: 'Locations'
            })
            .state('home.map', {
                templateUrl: 'views/location-map-view.html',
                url: 'map',
                controller: 'MapCtrl',
                label: 'Locations'
            })
            .state('subdivision', {
                url: '/divisions/:division/:subdivision',
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl',
                label: 'Division',
                resolve: {
                    config: getConfig,
                    division: LoadSubDivision
                },
                data: {
                    parentState: 'location',
                    crumbName: '{{division.name}}'
                }
            })
            .state('division', {
                url: '/divisions/:division',
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl',
                label: 'Division',
                resolve: {
                    config: getConfig,
                    division: LoadDivision
                },
                data: {
                    parentState: 'location',
                    crumbName: '{{division.name}}'
                }
            })
            .state('amenities', {
                url: '/amenities',
                templateUrl: 'views/amenities.html',
                controller: 'AmenitiesCtrl',
                label: 'Amenities',
                resolve: {
                    config: getConfig,
                    amenities: Amenities
                },
                data: {
                    crumbName: 'Amenities'
                }
            })
            .state('amenity', {
                url: '/amenities/id/:amenity',
                templateUrl: 'views/amenities.html',
                controller: 'AmenityCtrl',
                label: 'Amenities',
                resolve: {
                    config: getConfig,
                    amenity: Amenities
                },
                data: {
                    parentState: 'amenities',
                    crumbName: '{{amenity.amenity.name}}'
                }

            })
            .state('amenities-at-location', {
                url: '/amenities/loc/:location',
                templateUrl: 'views/amenitiesAtLibrary.html',
                controller: 'AmenitiesAtLibraryCtrl',
                resolve: {
                    config: getConfig,
                    location: LoadLocation
                },
                data: {
                    parentState: 'amenities',
                    crumbName: '{{location.name}}'
                }
            })
            .state('404', {
                url: '/404',
                templateUrl: 'views/404.html'
            })
            .state('location', {
                url: '/:location',
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl',
                resolve: {
                    config: getConfig,
                    location: LoadLocation
                },
                data: {
                    crumbName: '{{location.name}}'
                }
            });
    }
]);

nypl_locations.run(function ($analytics, $state, $rootScope, $location) {
    $rootScope.$on('$stateChangeStart', function () {
        $rootScope.close_feedback = true;
    });
    $rootScope.$on('$viewContentLoaded', function () {
        $analytics.pageTrack('/locations' + $location.path());
        $rootScope.current_url = $location.absUrl();
    });
    $rootScope.$on('$stateChangeError', function () {
        $state.go('404');
    });
});

// Declare an http interceptor that will signal
// the start and end of each request
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
nypl_locations.config(['$httpProvider', function ($httpProvider) {
    'use strict';

    var $http,
        interceptor = [
            '$q',
            '$injector',
            '$location',
            function ($q, $injector, $location) {
                var notificationChannel;

                function success(response) {
                    // get $http via $injector because
                    // of circular dependency problem
                    $http = $http || $injector.get('$http');
                    // don't send notification until all requests are complete
                    if ($http.pendingRequests.length < 1) {
                        // get requestNotificationChannel via $injector
                        // because of circular dependency problem
                        notificationChannel = notificationChannel ||
                            $injector.get('requestNotificationChannel');
                        // send a notification requests are complete
                        notificationChannel.requestEnded();
                    }
                    return response;
                }

                function error(response) {
                    var status = response.status;

                    // get $http via $injector because
                    // of circular dependency problem
                    $http = $http || $injector.get('$http');
                    // don't send notification until all requests are complete
                    if ($http.pendingRequests.length < 1) {
                        // get requestNotificationChannel via $injector
                        // because of circular dependency problem
                        notificationChannel = notificationChannel ||
                            $injector.get('requestNotificationChannel');
                        // send a notification requests are complete
                        notificationChannel.requestEnded();
                    }
                    // Intercept 404 error code from server
                    if (status === 404) {
                        $location.path('/404');
                        return $q.reject(response);
                    }

                    return $q.reject(response);
                }

                return function (promise) {
                    // get requestNotificationChannel via $injector
                    // because of circular dependency problem
                    notificationChannel = notificationChannel ||
                        $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestStarted();
                    return promise.then(success, error);
                };
            }
        ];

    $httpProvider.responseInterceptors.push(interceptor);
}]);

/**
 * @ngdoc overview
 * @module nypl_widget
 * @name nypl_widget
 * @requires ngSanitize
 * @requires ui.router
 * @requires locationService
 * @requires coordinateService
 * @requires angulartics
 * @requires angulartics.google.analytics
 * @description
 * AngularJS widget app for About pages on nypl.org.
 */
var nypl_widget = angular.module('nypl_widget', [
    'ngSanitize',
    'ui.router',
    'locationService',
    'coordinateService',
    'angulartics',
    'angulartics.google.analytics'
])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider) {
        'use strict';

        function LoadLocation($stateParams, config, nyplLocationsService) {
            return nyplLocationsService
                .singleLocation($stateParams.location)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (err) {
                    throw err;
                });
        }

        function LoadSubDivision($q, $stateParams, config, nyplLocationsService) {
            var division    = nyplLocationsService
                                .singleDivision($stateParams.division),
                subdivision = nyplLocationsService
                                .singleDivision($stateParams.subdivision);

            return $q.all([division, subdivision]).then(function (data) {
                var div = data[0],division,
                    subdiv = data[1].division;

                return subdiv;
            });
        }

        function LoadDivision($stateParams, config, nyplLocationsService) {
            return nyplLocationsService
                .singleDivision($stateParams.division)
                .then(function (data) {
                    return data.division;
                })
                .catch(function (err) {
                    throw err;
                });
        }

        function getConfig(nyplLocationsService) {
            return nyplLocationsService.getConfig();
        }

        // uses the HTML5 History API, remove hash (need to test)
        $locationProvider.html5Mode(true);
        // $urlRouterProvider.otherwise('/widget/sasb');

        $stateProvider
            .state('subdivision', {
                url: '/widget/divisions/:division/:subdivision',
                templateUrl: 'views/widget.html',
                controller: 'WidgetCtrl',
                resolve: {
                    config: getConfig,
                    data: LoadSubDivision
                }
            })
            .state('division', {
                url: '/widget/divisions/:division',
                templateUrl: 'views/widget.html',
                controller: 'WidgetCtrl',
                label: 'Division',
                resolve: {
                    config: getConfig,
                    data: LoadDivision
                }
            })
            .state('widget', {
                url: '/widget/:location',
                templateUrl: 'views/widget.html',
                controller: 'WidgetCtrl',
                resolve: {
                    config: getConfig,
                    data: LoadLocation
                },
            });
    }
]);

// Add Holiday Closings
nypl_widget.run(function ($rootScope, nyplUtility) {
    $rootScope.holiday = nyplUtility.holidayClosings();
});

/**
 * @ngdoc overview
 * @module nypl_research_collections
 * @name nypl_research_collections
 * @requires ngSanitize
 * @requires ui.router
 * @requires locationService
 * @requires coordinateService
 * @requires angulartics
 * @requires angulartics.google.analytics
 * @description
 * Research collections.
 */
angular.module('nypl_research_collections', [
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'locationService',
    'coordinateService',
    'angulartics',
    'angulartics.google.analytics',
    'nyplNavigation',
    'nyplSSO',
    'nyplSearch'
])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider) {
        'use strict';

        function LoadDivisions(config, nyplLocationsService) {
            return nyplLocationsService
                .allDivisions()
                .then(function (data) {
                    return data.divisions;
                })
                .catch(function (err) {
                    throw err;
                });
        }

        function getConfig(nyplLocationsService) {
            return nyplLocationsService.getConfig();
        }

        // uses the HTML5 History API
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/research-collections');

        $stateProvider
            .state('division', {
                url: '/',
                templateUrl: 'views/research-collections.html',
                controller: 'CollectionsCtrl',
                label: 'Research Collections',
                resolve: {
                    config: getConfig,
                    divisions: LoadDivisions
                }
            });
    }
]);

