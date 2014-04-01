'use strict';
nypl_locations.controller('LocationsCtrl', function ($scope, $rootScope, nypl_locations_service, nypl_coordinates_service, nypl_geocoder_service) {
	var userCoords;
	$scope.predicate = 'name'; // Default sort upon DOM Load

	nypl_geocoder_service.draw_map({lat:40.7532, long:-73.9822}, 12);

	// Display all branches regardless of user's location
	nypl_locations_service.all_locations().get(function (data) {
		$scope.locations = data.locations;

		_.each($scope.locations, function (location) {
			nypl_geocoder_service.draw_marker(location, 'drop');
		});

		// Extract user coordinates after locations data has been assigned to scope
		if($scope.locations) {
		  nypl_coordinates_service.getCoordinates().then(function (position) {
				userCoords = _.pick(position, 'latitude', 'longitude');

				nypl_geocoder_service.draw_marker({'lat': position.latitude, 'long':position.longitude}, 'bounce');
				
				// Fill in zipcode based on geo-location
				nypl_geocoder_service.get_zipcode({lat: userCoords.latitude, lng: userCoords.longitude}).then(function (zipcode) {
					$scope.zipcode = zipcode;

					// Iterate through lon/lat and calculate distance
					_.each($scope.locations, function (location) {
						location.distance =  nypl_coordinates_service.getDistance(userCoords.latitude, userCoords.longitude, location.lat, location.long);
					});

					$scope.distanceSet = true;
					$scope.predicate = 'distance';

				});
			}, function (error) {
				$scope.errors = error;
				console.log('Get Coordinates Error: ' + $scope.errors);
			});
		} // End If
 	}, function (error, status) {
 		console.log('All Locations Error: ' + error.status);
 	});


	$scope.submitAddress = function (address) {
		nypl_geocoder_service.get_coords(address).then(function (coords) {

      _.each($scope.locations, function (location) {
	      location.distance =  nypl_coordinates_service.getDistance(coords.lat, coords.long, location.lat, location.long);
	    });

	    $scope.predicate = 'distance';

    }, function (error) {
    	console.log("geoCoder Service Error: " + error);
    });
  }

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
 	
	});

});
