/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */
nypl_locations.controller('LocationsCtrl', function (
    $scope,
    $filter,
    $rootScope,
    nypl_locations_service,
    nypl_coordinates_service,
    nypl_geocoder_service,
    nypl_utility
) {
    'use strict';
    var userCoords,
        userAddress,
        locations,
        loadLocations = function () {
            return nypl_locations_service
                .all_locations()
                .then(function (data) {
                    locations = data.locations;
                    $scope.locations = locations;

                    _.each($scope.locations, function (location) {
                        var locationAddress = nypl_utility
                                .getAddressString(location, true),
                            markerCoordinates = {
                                'lat': location.geolocation.coordinates[1],
                                'long': location.geolocation.coordinates[0],
                            };

                        nypl_geocoder_service
                            .draw_marker(location.id, markerCoordinates, locationAddress);

                        location.library_type 
                            = nypl_utility.locationType(location.id);
                        location.locationDest 
                            = nypl_utility.getAddressString(location);
                    });

                    nypl_geocoder_service
                        .draw_legend('all-locations-map-legend');

                    allLocationsInit();

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
                    $scope.locationStart = 
                            userCoords.latitude + "," + userCoords.longitude;

                    // Iterate through lon/lat and calculate distance
                    _.each(locations, function (location) {
                        location.distance = 
                            nypl_coordinates_service.getDistance(
                                userCoords.latitude,
                                userCoords.longitude,
                                location.lat,
                                location.long
                            );
                        distanceArray.push(location.distance);
                    });

                    if (_.min(distanceArray) > 25) {
                        // The user is too far away, reset everything
                        allLocationsInit();
                        throw (new Error('User is too far'));
                    } else {
                        // Scope assignment:
                        // - Clear the input search field
                        // - Use the user's coordinates to create the link to
                        // get directions on Google Maps.
                        // - Draw the user's location marker
                        // - Set the locations to the locations with distance
                        // - Sort libraries by distance
                        $scope.searchTerm = '';
                        markerCoordinates = {
                            'lat': userCoords.latitude, 
                            'long': userCoords.longitude
                        };

                        nypl_geocoder_service
                            .draw_marker(
                                'user',
                                markerCoordinates,
                                "Your Current Location",
                                true,
                                true
                            );

                        $scope.locations = locations;
                        $scope.predicate = 'distance';
                        return userCoords;
                    }
                });
        },
        // convert coordinate into address
        loadReverseGeocoding = function (userCoords) {
            return nypl_geocoder_service
                .get_address(
                    {lat: userCoords.latitude, lng: userCoords.longitude}
                )
                .then(function (address) {
                    userAddress = address;
                    $scope.geolocationAddressOrSearchQuery = userAddress;

                    return address;
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
                    throw error;
                });
        },
        searchByCoordinates = function (searchObj, filteredLocations) {
            var locations = $scope.locations,
                distanceArray = [],
                coords = searchObj.coords,
                searchterm = searchObj.searchTerm;

            _.each(locations, function (location) {
                location.distance = 
                    nypl_coordinates_service.getDistance(
                        coords.lat,
                        coords.long,
                        location.lat,
                        location.long
                    );
                distanceArray.push(location.distance);
            });

            if (filteredLocations.length) {
                if (nypl_geocoder_service.check_marker(filteredLocations[0].id)) {
                    nypl_geocoder_service.pan_existing_marker(filteredLocations[0].id);
                }
            } else {
                if (_.min(distanceArray) > 25) {
                    console.log("The search query is too far");
                    resetDistance();
                    $scope.searchError = searchterm;
                    $scope.predicate = 'name';
                    throw (new Error('The search query is too far'));
                    //return $scope.locations;
                } 
                nypl_geocoder_service.draw_searchMarker(coords, searchterm);
            }
            
            $scope.searchError = '';
            return locations;
        },
        organizeLocations = function (locations, filteredLocations) {
            _.each(locations, function (location) {
                location.highlight = '';
            });

            _.each(filteredLocations, function (location) {
                // just to differentiate between angular matched filter 
                // results and reverse geocoding results
                location.highlight = 'callout';
                location.distance = '';
            });

            // Sort the locations array here instead of using the angular
            // orderBy filter. That way we can display the matched locations 
            // first and then display the results from the geocoder service
            locations = _.sortBy(locations, function (location) {
                return location.distance;
            });

            // Remove the matched libraries from the filter search term
            locations = _.difference(locations, filteredLocations);

            // Use union to add the matched locations in front of the rest 
            // of the locations
            $scope.locations = _.union(filteredLocations, locations);

            // Don't sort by distance or the matched results will not display 
            // first
            $scope.predicate = '';
        },
        searchByUserGeolocation = function() {
            $scope.searchTerm = '';
            $scope.geolocationAddressOrSearchQuery = userAddress;
            $scope.predicate = 'distance';

            if (nypl_geocoder_service.check_marker('user')) {
                nypl_geocoder_service.pan_existing_marker('user');
                nypl_geocoder_service.add_marker_to_map('user');
            }
            // Iterate through lon/lat and calculate distance
            _.each($scope.locations, function (location) {
                location.distance = 
                    nypl_coordinates_service.getDistance(
                        userCoords.latitude,
                        userCoords.longitude,
                        location.lat,
                        location.long
                    );
            });
        },
        allLocationsInit = function () {
            $scope.searchTerm = '';
            $rootScope.title = "Locations";
            $scope.geolocationAddressOrSearchQuery = '';

            ngRepeatInit('name');

            nypl_geocoder_service.remove_searchMarker();
            nypl_geocoder_service.hide_infowindow();
            if (nypl_geocoder_service.check_marker('user')) {
                nypl_geocoder_service.remove_marker('user');
            }
            nypl_geocoder_service.panMap();


            _.each(locations, function (location) {
                location.distance = '';
                location.highlight = '';
            });
        },

        resetDistance = function () {
            _.each($scope.locations, function (location) {
                location.distance = '';
            });
        },

        ngRepeatInit = function (sortBy) {
            $scope.predicate = sortBy; // Default sort upon DOM Load
            
            var locationsLen = $scope.locations.length;

            // By default, show only 10 libraries
            $scope.libraryLimit = 10;

            // Increase the limit by 10, wording says 'Show 10 more'
            // Once we show 80 libraries, we all the 12 remaining libraries
            // and reword to say "Show All"
            // Once all libraries are shown, we hide the "showMore" element
            $scope.addLibraries = 10;
            $scope.locationsListed = 10;
            $scope.increaseBy = '10 more';
            $scope.totalLocations = locationsLen;
            $scope.showMore = true;
        };

    nypl_geocoder_service
        .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');

    loadLocations();

    $scope.useGeolocation = function () {
        if (!userCoords) {
            loadCoords()
                .then(loadReverseGeocoding)
                .catch(function (error) {
                    console.log(error.message);
                    $scope.distanceError = true;
                });
            return;
        }

        // Need to update or remove from page when user is too far.
        //searchByUserGeolocation();
    };

  	$scope.submitAddress = function (searchTerm) {
		// Filter the locations by the search term
		var filteredLocations = 
                $filter('filter')($scope.locations, searchTerm),
            locations = $scope.locations;

        $scope.geolocationAddressOrSearchQuery = searchTerm;

        loadGeocoding(searchTerm)
            .then(function (searchObj) {
                return searchByCoordinates(searchObj, filteredLocations);
            })
            .then(function (locations) {
                organizeLocations(locations, filteredLocations);
            })
            // Catch any errors at any point
            .catch(function (error) {
                // google maps api is down and geocoding does not work,
                // first see if there are any angularjs filtered results.
                // if there are any, show results based on the angularjs filter.
                // else, reset back to the start
                if (filteredLocations.length) {
                    organizeLocations(locations, filteredLocations)
                } else {
                    allLocationsInit();
                }
            });
  	};

    $scope.viewMore = function () {
        $scope.locationsListed += $scope.addLibraries;
        $scope.libraryLimit += $scope.addLibraries;

        if ($scope.libraryLimit === 80) {
            $scope.addLibraries = 12;
            $scope.increaseBy = "All";
        }

        if ($scope.libraryLimit === 92) {
            $scope.showMore = false;
        }
    };

    $scope.geolocationSearch = function () {
        //searchByUserGeolocation();
    };

    $scope.researchBranches = function () {
        $scope.location_type = 'research';
        $scope.showMore = false;
        $scope.locationsListed = 4;
        $scope.totalLocations = 4;
    };

    $scope.allBranchesInit = function () {
        $scope.location_type = '';
        allLocationsInit();
    };

});
// End LocationsCtrl

nypl_locations.controller('LocationCtrl', function (
    $scope,
    $routeParams,
    $rootScope,
    nypl_locations_service,
    nypl_coordinates_service,
    nypl_utility
) {
    'use strict';
    var location,
        userCoords,
        loadLocation = function () {
            return nypl_locations_service
                .single_location($routeParams.symbol)
                .then(function (data) {
                    location = data.location;
                    $rootScope.title = location.name;
                    $scope.location = location;
                    $scope.hoursToday =
                        nypl_utility.hoursToday(location.hours);
                    // Used for the Get Directions link to Google Maps
                    $scope.locationDest =
                        nypl_utility.getAddressString(location);
                });
        },
        loadCoords = function () {
            return nypl_coordinates_service
                .getCoordinates()
                .then(function (position) {
                    userCoords = _.pick(position, 'latitude', 'longitude');

                    // Used for the Get Directions link to Google Maps
                    // If the user rejected geolocation and
                    // $scope.locationStart is blank, the link will still work
                    $scope.locationStart =
                        userCoords.latitude + "," + userCoords.longitude;
                });
        };

    loadLocation();
    loadCoords();
});
