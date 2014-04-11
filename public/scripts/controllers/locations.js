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
                  $scope.locations = locations;

                  _.each($scope.locations, function (location) {
                    var markerCoordinates = {
                          'lat': location.geolocation.coordinates[1],
                          'long': location.geolocation.coordinates[0],
                        },
                        locationAddress = nypl_utility.getAddressString(location, true);

                    nypl_geocoder_service.draw_marker(markerCoordinates, locationAddress);

                    location.library_type = nypl_utility.locationType(location.id);
                    location.locationDest = nypl_utility.getAddressString(location);
                  });

                  nypl_geocoder_service.draw_legend('all-locations-map-legend');

                  return locations;
                });
      },
      loadCoords = function () {
        return nypl_coordinates_service
                .getCoordinates()
                .then(function (position) {
                  var distanceArray = [],
                      markerCoordinates;

                  userCoords = _.pick(position, 'latitude', 'longitude');
                  $scope.locationStart = userCoords.latitude + "," + userCoords.longitude;

                  markerCoordinates = {
                    'lat': userCoords.latitude, 
                    'long': userCoords.longitude
                  };

                  // Iterate through lon/lat and calculate distance
                  _.each(locations, function (location) {
                    location.distance = nypl_coordinates_service.getDistance(userCoords.latitude, userCoords.longitude, location.lat, location.long);
                    distanceArray.push(location.distance);
                  });

                  nypl_geocoder_service.draw_marker(markerCoordinates, "Your Current Location", true, true);

                  if (_.min(distanceArray) > 25) {
                    // The user is too far away, don't change the display
                    // of the locations and don't add the distance to each library.
                    console.log('You are too far');
                  } else {
                    // Scope assignment
                    $scope.locations = locations;
                    $scope.distanceSet = true;
                    $scope.predicate = 'distance';
                  }

                  return userCoords;
                });
      },
      // convert coordinate into address
      loadReverseGeocoding = function (userCoords) {
        return nypl_geocoder_service
                .get_zipcode({lat: userCoords.latitude, lng: userCoords.longitude})
                .then(function (zipcode) {
                  $scope.searchTerm = zipcode;

                  return searchTerm;
                });
      },
      // convert address to geographic coordinate
      loadGeocoding = function (searchTerm) {
        return nypl_geocoder_service.get_coords(searchTerm)
                .then(function (coords) {
                  return {
                    coords: coords,
                    searchTerm: searchTerm
                  };
                })
                .catch(function (error) {
                  throw(error);
                });
      },
      searchByCoordinates = function (searchObj) {
        var locations = $scope.locations;
        var distanceArray = [];
        var coords = searchObj.coords;
        var searchterm = searchObj.searchTerm;

        _.each(locations, function (location) {
          location.distance = nypl_coordinates_service.getDistance(coords.lat, coords.long, location.lat, location.long);
          distanceArray.push(location.distance);
        });

        if (_.min(distanceArray) > 25) {
          console.log("The search query is too far");
          _.each(locations, function (location) {
            location.distance = '';
          });

          return $scope.locations;
        } else {
          nypl_geocoder_service.draw_searchMarker(coords, searchterm);

          return locations;
        }

      };

  // Initialize chaining
  loadLocations().then(loadCoords).then(loadReverseGeocoding);

	$scope.submitAddress = function (searchTerm) {
		// Filter the locations by the search term
		var filteredLocations = $filter('filter')($scope.locations, searchTerm);
		var locations = $scope.locations;

    loadGeocoding(searchTerm)
      .then(searchByCoordinates)
      .then(function(locations) {
        organizeLocations(locations, filteredLocations);
      })
      // if reverse geocoding is not available, we still want to filter using angular
      .catch(organizeLocations(locations, filteredLocations));

	}

  var organizeLocations = function (locations, filteredLocations) {
    _.each(locations, function (location) {
      location.highlight = '';
    });

  	_.each(filteredLocations, function (location) {
      // just to differentiate between angular matched filter results and reverse geocoding results
      location.highlight = 'callout';
      location.distance = '';
    });

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
// End LocationsCtrl


nypl_locations.controller('LocationCtrl', function ($scope, $routeParams, nypl_locations_service, nypl_coordinates_service, nypl_utility) {

  var location,
      userCoords,
      loadLocation = function () {
        return nypl_locations_service
                .single_location($routeParams.symbol)
                .then(function (data) {
                  location = data.location;

                  $scope.location = location;
                  $scope.hoursToday = nypl_utility.hoursToday(location.hours);
                  // Used for the Get Directions link to Google Maps
                  $scope.locationDest = nypl_utility.getAddressString(location);

                });
      },
      loadCoords = function () {
        return nypl_coordinates_service
                .getCoordinates()
                .then(function (position) {
                  userCoords = _.pick(position, 'latitude', 'longitude');

                  // Used for the Get Directions link to Google Maps
                  // If the user rejected geolocation and $scope.locationStart is blank,
                  // the link will still work
                  $scope.locationStart = userCoords.latitude + "," + userCoords.longitude;
                });
      };

  loadLocation();
  loadCoords();

});
