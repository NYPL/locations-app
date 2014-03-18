'use strict';
var nypl_locations = angular.module('nypl_locations', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'locationService',
]);

nypl_locations.constant('_', window._);

nypl_locations.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/locations.html',
    })
    .when('/menu', {
      templateUrl: 'views/menu.html',
    })
    .when('/coordinates', {
      templateUrl: 'views/coordinates.html',
      controller: 'CoordsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
