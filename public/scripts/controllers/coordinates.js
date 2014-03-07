'use strict';

var nyplLocationApp = angular.module('nyplLocationControllers', []);

nyplLocationApp.controller('CoordsCtrl', function ($scope, nypl_coordinates_service, $window) {

  nypl_coordinates_service.getCoordinates().then(function (position) {
  	$scope.coordinates = position;
  	console.log($scope.coordinates);
  });

});

