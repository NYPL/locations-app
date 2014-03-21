'use strict';
nypl_locations.controller('LocationsCtrl', function ($scope, $rootScope, nypl_locations_service, nypl_coordinates_service, nypl_geocoder_service) {
	var userCoords;

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

    }, function (error) {
    	console.log("Failed: " + error);
    });
  }

	// Display all branches regardless of user's location
	nypl_locations_service.all_locations().get(function (data) {
		$scope.locations = data.locations;
 	}, function (err, status) {
 		console.log(err);
 		console.log(status);
 	});

	// Extract user coordinates
  nypl_coordinates_service.getCoordinates().then(function (position) {
		userCoords = _.pick(position, 'latitude', 'longitude');

		nypl_geocoder_service.geocoder({lat: userCoords.latitude, lng: userCoords.longitude}).then(function (zipcode) {
			$scope.zipcode = zipcode;
		});

		$scope.distanceSet = true;

		_.each($scope.locations, function(location) {
			location.distance =  nypl_coordinates_service.getDistance(userCoords.latitude, userCoords.longitude, location.lat, location.long);
		});

		$scope.sort = "distance";
	}, function (error) {
		$scope.errors = error;
	});
});

nypl_locations.controller('LocationCtrl', function ($scope, $routeParams, nypl_locations_service) {

	// Display all branches regardless of user's location
	nypl_locations_service.single_location($routeParams.symbol).get(function (data) {
		$scope.location = data.location;

		var today = new Date();
		$scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var day = $scope.days[today.getDay()];  

		$scope.hoursToday = {
			'open': data.location.hours[day].open,
			'close': data.location.hours[day].close
		}
 	
 		// Temporary until Greg adds type field in json object
		$scope.location.type = nypl_locations_service.location_type($scope.location.id.toUpperCase());

	});

});
