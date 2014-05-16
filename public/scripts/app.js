/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window */

var nypl_locations = angular.module('nypl_locations', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'locationService',
    'angulartics',
    'angulartics.google.analytics'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {
        'use strict';

<<<<<<< HEAD
    // uses the HTML5 History API, remove hash (need to test)
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/404', {
            templateUrl: '/views/404.html',
        })
        .when('/', {
            templateUrl: 'views/locations.html',
            controller: 'LocationsCtrl'
        })
        .when('/division/:division', {
            templateUrl: 'views/division.html',
            controller: 'DivisionCtrl'
        })
        .when('/services', {
            templateUrl: '/views/services.html',
            controller: 'ServicesCtrl'
        })
        .when('/services/:service_id', {
            templateUrl: 'views/services.html',
            controller: 'OneServiceCtrl'
        })
        .when('/services/location/:location_id', {
            templateUrl: 'views/services.html',
            controller: 'ServicesAtLibraryCtrl'
        })
        .when('/:symbol', {
            templateUrl: 'views/location.html',
            controller: 'LocationCtrl'
        })
        .when('/:symbol/events', {
            templateUrl: '/views/events.html',
            controller: 'LocationCtrl'
        })
        .when('/:symbol/map', {
            templateUrl: '/views/map.html',
            controller: 'mapCtrl'
        })
        .otherwise({
            redirectTo: '/404'
        });

});
=======
        $routeProvider
            .when('/', {
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl'
            })
            .when('/division', {
                redirectTo: '/'
            })
            .when('/division/:division', {
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl'
            })
            .when('/services', {
                templateUrl: '/views/services.html',
                controller: 'ServicesCtrl'
            })
            .when('/services/:service_id', {
                templateUrl: 'views/services.html',
                controller: 'OneServiceCtrl'
            })
            .when('/services/location/:location_id', {
                templateUrl: 'views/services.html',
                controller: 'ServicesAtLibraryCtrl'
            })
            .when('/:symbol', {
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl'
            })
            .when('/:symbol/events', {
                templateUrl: '/views/events.html',
                controller: 'LocationCtrl'
            })
            .when('/:symbol/map', {
                templateUrl: '/views/map.html',
                controller: 'mapCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // uses the HTML5 History API, remove hash (need to test)
        // $locationProvider.html5Mode(true);
    }]);
>>>>>>> ffe92d1d737716d6ce73ffc3bd5145c234174dd4

// Declare an http interceptor that will signal the start and end of each request
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
nypl_locations.config(['$httpProvider', function ($httpProvider) {
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
