/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window, headerScripts */

var nypl_locations = angular.module('nypl_locations', [
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'locationService',
    'coordinateService',
    'nyplSearch',
    'nyplSSO',
    'nyplNavigation',
    'nyplBreadcrumbs',
    'angulartics',
    'angulartics.google.analytics',
    'pascalprecht.translate'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
    '$locationProvider',
    '$translateProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$crumbProvider',
    function (
        $locationProvider,
        $translateProvider,
        $stateProvider,
        $urlRouterProvider,
        $crumbProvider
    ) {
        'use strict';

        // uses the HTML5 History API, remove hash (need to test)
        // $locationProvider.html5Mode(true);

        // Lazy loads static files with English being
        // the first language that gets loaded.
        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');

        function LoadLocation(nyplLocationsService, $stateParams, $location) {
            return nyplLocationsService
                .singleLocation($stateParams.location)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (err) {
                    $location.path('/404');
                    throw err;
                });
        }

        function LoadDivision(nyplLocationsService, $stateParams, $location) {
            return nyplLocationsService
                .singleDivision($stateParams.division)
                .then(function (data) {
                    return data.division;
                })
                .catch(function (err) {
                    $location.path('/404');
                    throw err;
                });
        }

        function AmenitiesAtLibrary(nyplLocationsService, $stateParams, $location) {
            return nyplLocationsService
                .amenitiesAtLibrary($stateParams.location)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (error) {
                    $location.path('/404');
                    throw error;
                });
        }

        function Amenities(nyplLocationsService, $stateParams, $location) {
            return nyplLocationsService
                .amenities($stateParams.amenity)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    $location.path('/404');
                    throw error;
                });
        }

        $crumbProvider.setOptions({
            primaryState: {name:'Home', customUrl: 'http://nypl.org' },
            secondaryState: {name:'Locations', customUrl: 'home.index' }
        });

        // $urlRouterProvider.when('/list', '/');
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                abstract: true,
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl',
                label: 'Locations'
            })
            .state('home.index', {
                templateUrl: 'views/location-list-view.html',
                url: '',
                // controller: 'LocationsCtrl',
                label: 'Locations'
            })
            .state('home.list', {
                templateUrl: 'views/location-list-view.html',
                url: 'list',
                // controller: 'LocationsCtrl',
                label: 'Locations'
            })
            .state('home.map', {
                templateUrl: 'views/location-map-view.html',
                url: 'map',
                controller: 'MapCtrl',
                label: 'Locations'
            })
            .state('division', {
                url: '/division/:division',
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl',
                label: 'Division',
                resolve: {
                    division: LoadDivision
                },
                data: {
                    parentState: 'location',
                    crumbName: '{{division.name}}'
                }
            })
            .state('amenities', {
                url: '/amenities',
                templateUrl: '/views/amenities.html',
                controller: 'AmenitiesCtrl',
                label: 'Amenities',
                resolve: {
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
                    location: AmenitiesAtLibrary
                },
                data: {
                    parentState: 'location',
                    crumbName: 'Amenities'
                }
            })
            .state('location', {
                url: '/:location',
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl',
                resolve: {
                    location: LoadLocation
                },
                data: {
                    crumbName: '{{location.name}}'
                }
            });
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

