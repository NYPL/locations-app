'use strict';
var nypl_locations = angular.module('nypl_locations', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'locationService',
]);

nypl_locations.constant('_', window._);

nypl_locations.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/locations.html',
    })
    .when('/menu', {
      templateUrl: 'views/menu.html',
    })
    .when('/:symbol', {
      templateUrl: 'views/location.html'
    })
    .when('/:symbol/events', {
      templateUrl: '/views/events.html'
    })
    .when('/:symbol/map', {
      templateUrl: '/views/map.html'
    })
    .otherwise({
      redirectTo: '/'
    });

    // usese the HTML5 History API, remove hash (need to test)
    // $locationProvider.html5Mode(true);
});
