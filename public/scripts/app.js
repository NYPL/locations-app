'use strict';
var nyplLocationApp = angular.module('nyplLocationApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'nyplLocationControllers',
  'nyplLocations'
]);

nyplLocationApp.constant('_', window._);

nyplLocationApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/locations.html',
    })
    .when('/coordinates', {
      templateUrl: 'views/coordinates.html',
      controller: 'CoordsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
