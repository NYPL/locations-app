/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window, headerScripts */

var nypl_locations = angular.module('nypl_locations', [
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'locationService',
    'coordinateService',
    'angulartics',
    'angulartics.google.analytics',
    'pascalprecht.translate',
    'ng-breadcrumbs'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
    '$routeProvider',
    '$locationProvider',
    '$translateProvider',
    function ($routeProvider, $locationProvider, $translateProvider) {
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


        function AmenitiesAtLibrary(nypl_locations_service, $route, $location) {
            return nypl_locations_service
                .amenities_at_library($route.current.params.location_id)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (error) {
                    $location.path('/404');
                    throw error;
                });
        }

        function Amenities(nypl_locations_service, $route, $location) {
            return nypl_locations_service
                .amenities($route.current.params.amenity_id)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    $location.path('/404');
                    throw error;
                });
        }

        $routeProvider
            .when('/404', {
                templateUrl: '/views/404.html'
            })
            .when('/', {
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl',
                label: 'Locations'
            })
            .when('/division/:division', {
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl',
                label: 'Division'
            })
            .when('/amenities', {
                templateUrl: '/views/amenities.html',
                controller: 'AmenitiesCtrl',
                label: 'Amenities',
                resolve: {
                    amenities: Amenities
                }
            })
            .when('/amenities/:amenity_id', {
                templateUrl: 'views/amenities.html',
                controller: 'AmenityCtrl',
                label: 'Amenities',
                resolve: {
                    amenity: Amenities
                }
            })
            .when('/amenities/location/:location_id', {
                templateUrl: 'views/amenitiesAtLibrary.html',
                controller: 'AmenitiesAtLibraryCtrl',
                label: 'Location',
                resolve: {
                    location: AmenitiesAtLibrary
                }
            })
            .when('/:symbol', {
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl',
                label: 'Location'
            })
            .when('/:symbol/events', {
                templateUrl: '/views/events.html',
                controller: 'LocationCtrl',
                label: 'Events'
            })
            .otherwise({
                redirectTo: '/404'
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

// Run jQuery Scripts
nypl_locations.run(['$rootScope', function ($rootScope) {
    'use strict';

    // fired once the view is loaded, 
    // after the DOM is rendered. The '$scope' of the view emits the event.
    $rootScope.$on('$viewContentLoaded', headerScripts);

    // Broadcasted before a route change.
    $rootScope.$on('$routeChangeStart', headerScripts);
}]);
