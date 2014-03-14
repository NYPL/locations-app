'use strict';
var nypl_locations = angular.module('nypl_locations', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'locationService'
]);

nypl_locations.constant('_', window._);

nypl_locations.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/locations.html',
    })
    .when('/coordinates', {
      templateUrl: 'views/coordinates.html',
      controller: 'CoordsCtrl'
    })
    .when('/location/:symbol', {
      templateUrl: 'views/location.html'
    })
    .when('/location/:symbol/events', {
      templateUrl: '/views/events.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
