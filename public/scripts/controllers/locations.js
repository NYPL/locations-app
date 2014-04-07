'use strict';

nypl_locations.controller('LocationsCtrl', function ($scope, $filter, $rootScope, nypl_locations_service, nypl_coordinates_service, nypl_geocoder_service, nypl_utility) {
	var userCoords, locations;
	$scope.predicate = 'name'; // Default sort upon DOM Load

	nypl_geocoder_service.draw_map({lat:40.7532, long:-73.9822}, 12, 'all-locations-map');

  var loadLocations = function () {
        return nypl_locations_service
                .all_locations()
                .then(function (data) {
                  locations = data.locations;

                  _.each(locations, function (location) {
                    location.locationDest = nypl_utility.getAddressString(location);
                    nypl_geocoder_service.draw_marker(location, 'drop', true);
                  });

                  $scope.locations = locations;

                  return locations;
                });
      },
      loadCoords = function () {
        return nypl_coordinates_service
                .getCoordinates()
                .then(function (position) {
                  userCoords = _.pick(position, 'latitude', 'longitude');
                  $scope.locationStart = userCoords.latitude + "," + userCoords.longitude;

                  nypl_geocoder_service.draw_marker({'lat': userCoords.latitude, 'long': userCoords.longitude}, 'bounce');
                  return userCoords;
                });
      },
      loadGeocoder = function (userCoords) {
        return nypl_geocoder_service
                .get_zipcode({lat: userCoords.latitude, lng: userCoords.longitude})
                .then(function (zipcode) {
                  $scope.searchTerm = zipcode;

                  // Iterate through lon/lat and calculate distance
                  _.each(locations, function(location) {
                    location.distance =  nypl_coordinates_service.getDistance(userCoords.latitude, userCoords.longitude, location.lat, location.long);
                  });

                  // Scope assignment
                  $scope.locations = locations;
                  $scope.distanceSet = true;
                  $scope.predicate = 'distance';

                  return searchTerm;
                });
      };

  // Initialize chaining
  loadLocations().then(loadCoords).then(loadGeocoder);

	$scope.submitAddress = function (searchTerm) {
		// Filter the locations by the searchterm
		var filteredLocations = $filter('filter')($scope.locations, searchTerm);
		var locations = $scope.locations;

		// Still call the geocoder service
		nypl_geocoder_service.get_coords(searchTerm).then(function (coords) {

			_.each(locations, function (location) {
	      location.distance =  nypl_coordinates_service.getDistance(coords.lat, coords.long, location.lat, location.long);
	      location.break = false;
	    });

			// Remove the distance from the libraries that match the search term
	    _.each(filteredLocations, function (location) {
	    	location.distance = '';
	    });

	    organizeLocations(locations, filteredLocations);


    }, function (error) {
    	console.log("geoCoder Service Error: " + error);

    	// If geocoding fails, it should still filter
    	organizeLocations(locations, filteredLocations);
    });
	}

  var organizeLocations = function (locations, filteredLocations) {
  	// just to show a line break after the matched results
  	var filterlength = filteredLocations.length;
  	filteredLocations[filterlength-1].break = true;

  	// Sort the locations array here instead of using the angular orderBy filter.
    // That way we can display the matched locations first and then display the 
    // results from the geocoder service
    locations = _.sortBy(locations, function (location) {
			return location.distance;
		});

  	// Remove the matched libraries from the filter search term
  	locations = _.difference(locations, filteredLocations);

  	// Use union to add the matched locations in front of the rest of the locations
		$scope.locations = _.union(filteredLocations, locations);
		// Don't sort by distance or the matched results will not display first
    $scope.predicate = '';
  }

});

nypl_locations.controller('LocationCtrl', function ($scope, $routeParams, nypl_locations_service, nypl_coordinates_service, nypl_utility) {

	nypl_locations_service.single_location($routeParams.symbol).then(function (data) {
    var location = data.location;
		$scope.location = location;
    
    $scope.hoursToday = nypl_utility.hoursToday(location.hours);
 	
    // Used for the Get Directions link to Google Maps
    $scope.locationDest = nypl_utility.getAddressString(location);
	});

  nypl_coordinates_service.getCoordinates().then(function (position) {
    var userCoords = _.pick(position, 'latitude', 'longitude');

    // Used for the Get Directions link to Google Maps
    // If the user rejected geolocation and $scope.locationStart is blank,
    // the link will still work
    $scope.locationStart = userCoords.latitude + "," + userCoords.longitude;
  });


});
