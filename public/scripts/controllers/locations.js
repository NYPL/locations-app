'use strict';
nypl_locations.controller('LocationsCtrl', function ($scope, $rootScope, nypl_locations_service, nypl_coordinates_service, nypl_geocoder_service) {
	var user_lat,
			user_long;

	$scope.sort = "name";
	$scope.reverse = false;

	$scope.sortBy = function(value) {
		if ($scope.sort == value){
			$scope.reverse = !$scope.reverse;
			return;
		}

		$scope.sort = value;
		$scope.reverse = false;
	}

	$scope.submitAddress = function (address) {
		nypl_geocoder_service.geocoder(address).then(function (coords) {

      _.each($scope.locations, function (location) {
	      location.distance =  nypl_coordinates_service.getDistance(coords.lat, coords.long, location.lat, location.long);
	    });

	    $scope.sort = "distance";

    }, function () {

    });
  }

	// Display all branches regardless of user's location
	nypl_locations_service.all_locations().get(function (data) {
		$scope.locations = data.branches;
	});

	// Extract user coordinates
  nypl_coordinates_service.getCoordinates().then(function (position) {
		user_lat = position.latitude;
		user_long = position.longitude;

		nypl_geocoder_service.geocoder({lat: user_lat, lng: user_long}).then(function (zipcode) {
			$scope.zipcode = zipcode;
		});

		$scope.distanceSet = true;

		_.each($scope.locations, function(location) {
			location.distance =  nypl_coordinates_service.getDistance(user_lat, user_long, location.lat, location.long);
		});

	}, function (error) {
		$scope.errors = error;
		console.log(error.message);
	});
});
