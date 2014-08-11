/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window, headerScripts */

var nypl_locations = angular.module('nypl_locations', [
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'locationService',
    'coordinateService',
    'nyplSearch',
    'nyplSSO',
    'nyplNavigation',
    'angulartics',
    'angulartics.google.analytics',
    'pascalprecht.translate',
    'ng-breadcrumbs'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
    '$locationProvider',
    '$translateProvider',
    '$stateProvider',
    function ($locationProvider, $translateProvider, $stateProvider) {
        'use strict';

        // uses the HTML5 History API, remove hash (need to test)
        //$locationProvider.html5Mode(true);

        // Lazy loads static files with English being
        // the first language that gets loaded.
        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');

        function LoadLocation(nyplLocationsService, $route, $location) {
            return nyplLocationsService
                .singleLocation($route.current.params.location)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (err) {
                    $location.path('/404');
                    throw err;
                });
        }

        function LoadDivision(nyplLocationsService, $route, $location) {
            return nyplLocationsService
                .singleDivision($route.current.params.division)
                .then(function (data) {
                    return data.division;
                })
                .catch(function (err) {
                    $location.path('/404');
                    throw err;
                });
        }

        function AmenitiesAtLibrary(nyplLocationsService, $route, $location) {
            return nyplLocationsService
                .amenitiesAtLibrary($route.current.params.location)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (error) {
                    $location.path('/404');
                    throw error;
                });
        }

        function Amenities(nyplLocationsService, $route, $location) {
            return nyplLocationsService
                .amenities($route.current.params.amenity)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    $location.path('/404');
                    throw error;
                });
        }

        $stateProvider
            .state('/404', {
                templateUrl: '/views/404.html'
            })
            .state('/', {
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl',
                label: 'Locations'
            })
            .state('/division/:division', {
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl',
                label: 'Division',
                resolve: {
                    division: LoadDivision
                }
            })
            .state('/amenities', {
                templateUrl: '/views/amenities.html',
                controller: 'AmenitiesCtrl',
                label: 'Amenities',
                resolve: {
                    amenities: Amenities
                }
            })
            .state('/amenities/:amenity', {
                templateUrl: 'views/amenities.html',
                controller: 'AmenityCtrl',
                label: 'Amenities',
                resolve: {
                    amenity: Amenities
                }
            })
            .state('/amenities/location/:location', {
                templateUrl: 'views/amenitiesAtLibrary.html',
                controller: 'AmenitiesAtLibraryCtrl',
                label: 'Location',
                resolve: {
                    location: AmenitiesAtLibrary
                }
            })
            .state('/:location', {
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl',
                controllerAs: 'ctrl',
                label: 'Location',
                resolve: {
                    location: LoadLocation
                }
            })
            .state('/:location/events', {
                templateUrl: '/views/events.html',
                controller: 'LocationCtrl',
                controllerAs: 'eventCtrl',
                label: 'Events',
                resolve: {
                    location: LoadLocation
                }
            })
            // .otherwise({
            //     redirectTo: '/404'
            // });
    }
]);

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
