/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window */

var nypl_locations = angular.module('nypl_locations', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'locationService',
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
        $translateProvider.translations('en');
        $translateProvider.translations('es');
        $translateProvider.preferredLanguage('en');

        function LoadLocation(nypl_locations_service, $route, $location) {
            return nypl_locations_service
                .single_location($route.current.params.symbol)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (err) {
                    $location.path('/404');
                    throw err;
                });
        }

        $routeProvider
            .when('/404', {
                templateUrl: '/views/404.html'
            })
            .when('/', {
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl',
                label: 'Locations',
                resolve: {
                    allLocations: function (
                        nypl_locations_service,
                        $route,
                        $location
                    ) {
                        return nypl_locations_service
                            .all_locations()
                            .then(function (data) {
                                return data.locations;
                                // $scope.locations = locations;

                                // _.each($scope.locations, function (location) {
                                //     location.hoursToday = nypl_utility.hoursToday;
                                //     location.locationDest
                                //         = nypl_utility.getAddressString(location);
                                // });

                                // checkGeolocation();
                                // allLocationsInit();

                                // return locations;
                            })
                            .catch(function (error) {
                                $location.path('/404');
                            });
                    }
                }
            })
            .when('/division/:division', {
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl',
                label: 'Division',
                resolve: {
                    division: function (
                        nypl_locations_service,
                        $route,
                        $location
                    ) {
                        return nypl_locations_service
                            .single_division($route.current.params.division)
                            .then(function (data) {
                                return data.division;
                            })
                            .catch(function (err) {
                                $location.path('/404');
                                console.log('BAD DIVISION');
                                throw err;
                            });
                    }
                }
            })
            .when('/services', {
                templateUrl: '/views/services.html',
                controller: 'ServicesCtrl',
                label: 'Services'
            })
            .when('/services/:service_id', {
                templateUrl: 'views/services.html',
                controller: 'OneServiceCtrl',
                label: 'Service'
            })
            .when('/services/location/:location_id', {
                templateUrl: 'views/services.html',
                controller: 'ServicesAtLibraryCtrl',
                label: 'Location'
            })
            .when('/:symbol', {
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl',
                controllerAs: 'ctrl',
                label: 'Location',
                resolve: {
                    location: LoadLocation
                }
            })
            .when('/:symbol/events', {
                templateUrl: '/views/events.html',
                controller: 'LocationCtrl',
                controllerAs: 'eventCtrl',
                label: 'Events',
                resolve: {
                    location: LoadLocation
                }
            })
            .otherwise({
                redirectTo: '/404'
            });
    }
]);

// Declare an http interceptor that will signal the start and end of each request
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
nypl_locations.config(['$httpProvider', function ($httpProvider) {
    'use strict';

    var $http,
        interceptor = ['$q', '$injector', '$location', function ($q, $injector, $location) {
            var notificationChannel;

            function success(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                return response;
            }

            function error(response) {
                var status = response.status;

                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                // Intercept 404 error code from server
                if (status == 404) {
                    console.log('Error code: ' + status);
                    $location.path('/404');
                    return $q.reject(response);
                }

                console.log(response);

                return $q.reject(response);
            }

            return function (promise) {
                // get requestNotificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                // send a notification requests are complete
                notificationChannel.requestStarted();
                return promise.then(success, error);
            }
        }];

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