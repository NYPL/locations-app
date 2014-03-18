'use strict';

nypl_locations.controller('LocationsCtrl', function ($scope, nypl_locations_service, nypl_coordinates_service) {

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

	// Display all branches regardless of user's location
	nypl_locations_service.all_locations().get(function (data) {
		$scope.locations = data.branches;
		console.log(data);
 	}, function (err, status) {
 		console.log(err);
 		console.log(status);
 	});

	// Extract user coordinates
  nypl_coordinates_service.getCoordinates().then(function (position) {
		$scope.lat1 = position.latitude;
		$scope.lon1 = position.longitude;
		$scope.distanceSet = true;

		_.each($scope.locations, function(location) {
			location.distance =  nypl_coordinates_service.getDistance($scope.lat1, $scope.lon1, location.lat, location.long);
		});

	}, function (error) {
		$scope.errors = error;
		console.log(error.message);
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

		$scope.location.type = nypl_locations_service.location_type($scope.location.id);

		console.log($scope.location);

	});

});
