/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window */

var nypl_locations = angular.module('nypl_locations', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'locationService'
]);

nypl_locations.constant('_', window._);

nypl_locations.config(function ($routeProvider, $locationProvider) {
    'use strict';

    $routeProvider
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
        .when('/services/:symbol', {
            templateUrl: 'views/services.html',
            controller: 'ServiceLibraryCtrl'
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
});

// Declare an http interceptor that will signal the start and end of each request
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
nypl_locations.config(['$httpProvider', function ($httpProvider) {
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
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
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get requestNotificationChannel via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
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
