/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window */

var nypl_locations = angular.module('nypl_locations', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
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

        $translateProvider.translations('en', en);
        $translateProvider.translations('es', es);

        $translateProvider.preferredLanguage('en');


        $routeProvider
            .when('/404', {
                templateUrl: '/views/404.html',
            })
            .when('/', {
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl'
            })
            .when('/full-page-map', {
                templateUrl: '/views/large-map.html',
                controller: 'LargeMapCtrl'
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
    }
]);

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
