'use strict';

nyplLocationApp.controller('LocationsCtrl', function ($scope, nypl_locations_service, nypl_coordinates_service) {

	$scope.sort = "name";
	$scope.reverse = false;

	$scope.sortBy = function(value){
		if ($scope.sort == value){
			$scope.reverse = !$scope.reverse;
			return;
		}

		$scope.sort = value;
		$scope.reverse = false;
	}

	// Display all branches regardless of user's location
	nypl_locations_service.all_locations().get(function(data) {
		$scope.locations = data.branches;
	});

	// Extract user coordinates
  nypl_coordinates_service.getCoordinates().then(function (position) {
  	$scope.lat1 = position.latitude;
  	$scope.lon1 = position.longitude;
  	$scope.distanceSet = true;

		for(var i=0; i < $scope.locations.length; i++) {
			$scope.locations[i].distance = nypl_coordinates_service.getDistance($scope.lat1, $scope.lon1, $scope.locations[i].lat, $scope.locations[i].long);
		}

	}, function(error) {
		$scope.errors = error;
		console.log(error.message);
	});
});
