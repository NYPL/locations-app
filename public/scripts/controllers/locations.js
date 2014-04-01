'use strict';
nypl_locations.controller('LocationsCtrl', function ($scope, $rootScope, nypl_locations_service, nypl_coordinates_service, nypl_geocoder_service) {
	var userCoords, locations;
	$scope.predicate = 'name'; // Default sort upon DOM Load

	var loadLocations = function () 
			{
				return nypl_locations_service
								.all_locations()
								.then(function (data)
								{
									locations = data.locations;
									$scope.locations = locations;
									console.log($scope.locations);
									return locations;
								});
			},
			loadCoords = function () 
			{
				return nypl_coordinates_service
								.getCoordinates()
								.then(function (position) 
								{
									userCoords = _.pick(position, 'latitude', 'longitude');
									console.log(userCoords);
									return userCoords;
								});
			},
			loadGeocoder = function (userCoords)
			{
				return nypl_geocoder_service
								.get_zipcode({lat: userCoords.latitude, lng: userCoords.longitude})
								.then(function (zipcode) 
								{
									$scope.zipcode = zipcode;
									console.log(zipcode);

									// Iterate through lon/lat and calculate distance
									_.each(locations, function(location) {
										location.distance =  nypl_coordinates_service.getDistance(userCoords.latitude, userCoords.longitude, location.lat, location.long);
									});
									// Scope assignment
									$scope.locations = locations;
									$scope.distanceSet = true;
									$scope.predicate = 'distance';

									return zipcode;
								});
			};

	// Initialize chaining
	loadLocations().then(loadCoords).then(loadGeocoder);

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
 	
		console.log($scope.location);
	});

});
