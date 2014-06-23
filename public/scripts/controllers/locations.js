/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */
nypl_locations.controller('LocationsCtrl', [
    '$scope',
    '$rootScope',
    'nypl_locations_service',
    'nypl_coordinates_service',
    'nypl_geocoder_service',
    'nypl_utility',
    function (
        $scope,
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
            ngRepeatInit = function (sortBy) {
                if (sortBy !== undefined) {
                    $scope.predicate = sortBy; // Default sort upon DOM Load
                }

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
            },
            allLocationsInit = function () {
                $scope.reverse = false;
                $scope.searchTerm = '';
                $scope.filteredResults = '';
                $scope.geolocationAddressOrSearchQuery = '';

                ngRepeatInit('name');

                nypl_geocoder_service.remove_searchMarker();
                nypl_geocoder_service.hide_infowindow();
                // if (nypl_geocoder_service.check_marker('user')) {
                //     nypl_geocoder_service.remove_marker('user');
                // }
                nypl_geocoder_service.panMap();


                _.each(locations, function (location) {
                    location.distance = '';
                    location.highlight = '';
                });
            },
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
                                    'long': location.geolocation.coordinates[0]
                                };

                            // Initially, when the map is drawn and 
                            // markers are availble, they will be drawn too. 
                            // No need to draw them again if they exist.
                            if (!nypl_geocoder_service
                                    .check_marker(location.slug)) {
                                nypl_geocoder_service
                                    .draw_marker(location.slug,
                                        markerCoordinates,
                                        locationAddress);
                            }

                            location.library_type
                                = nypl_utility.locationType(location.id);
                            location.locationDest
                                = nypl_utility.getAddressString(location);
                            location.hoursToday = nypl_utility.hoursToday;
                        });

                        nypl_geocoder_service
                            .draw_legend('all-locations-map-legend');

                        checkGeolocation();
                        allLocationsInit();

                        return locations;
                    });
            },

            checkGeolocation = function () {
                // After loading all locations, check if the browser
                // supports geolocation before the user actually tries to
                // geolocate their location. If available, the button to
                // geolocate appears.
                if (nypl_coordinates_service.checkGeolocation()) {
                    $scope.geolocationOn = true;
                }
            },

            loadCoords = function () {
                return nypl_coordinates_service
                    .getCoordinates()
                    .then(function (position) {
                        var markerCoordinates;

                        userCoords = _.pick(position, 'latitude', 'longitude');
                        $scope.locationStart =
                                userCoords.latitude + "," +
                                userCoords.longitude;

                        // Iterate through lon/lat and calculate distance
                        _.each(locations, function (location) {
                            location.distance =
                                nypl_coordinates_service.getDistance(
                                    userCoords.latitude,
                                    userCoords.longitude,
                                    location.lat,
                                    location.long
                                );
                        });

                        if (nypl_utility.check_distance(locations)) {
                            // The user is too far away, reset everything
                            allLocationsInit();
                            throw (new Error(
                                'You are not within 25 miles of any NYPL library.'
                            ));
                        }

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

                        if (nypl_geocoder_service.check_marker('user')) {
                            nypl_geocoder_service.pan_existing_marker('user');
                            nypl_geocoder_service.add_marker_to_map('user');
                        } else {
                            nypl_geocoder_service
                                .draw_marker(
                                    'user',
                                    markerCoordinates,
                                    "Your Current Location",
                                    true,
                                    true
                                );
                        }

                        $scope.locations = locations;
                        $scope.predicate = 'distance';
                        return userCoords;
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

            resetDistance = function () {
                _.each($scope.locations, function (location) {
                    location.distance = '';
                });
            },

            searchByCoordinates = function (searchObj, filteredLocations) {
                var locationsCopy = $scope.locations,
                    coords = searchObj.coords,
                    searchterm = searchObj.searchTerm;
                    // filteredResults = "1 match for ";

                _.each(locationsCopy, function (location) {
                    location.distance =
                        nypl_coordinates_service.getDistance(
                            coords.lat,
                            coords.long,
                            location.lat,
                            location.long
                        );
                });

                if (filteredLocations !== null && filteredLocations.length) {
                    if (nypl_geocoder_service
                            .check_marker(filteredLocations[0].slug)) {

                        nypl_geocoder_service
                            .pan_existing_marker(filteredLocations[0].slug);
                    }
                    $scope.geolocationAddressOrSearchQuery = searchterm;
                    ngRepeatShowAllBranches();
                    $scope.researchBranches = false;
                    // if (filteredLocations.length > 1) {
                    //     filteredResults = filteredLocations.length +  
                    //         " matches for ";
                    // }

                    // $scope.filteredResults = filteredResults + searchterm;
                } else {
                    if (nypl_utility.check_distance(locations)) {
                        // The search query is too far
                        resetDistance();
                        $scope.searchError = searchterm;
                        $scope.predicate = 'name';
                        $scope.reverse = false;
                        throw (new Error('The search query is too far'));
                    }
                    $scope.geolocationAddressOrSearchQuery = searchterm;
                    nypl_geocoder_service.draw_searchMarker(coords, searchterm);
                }

                $scope.searchError = '';
                return locationsCopy;
            },
            organizeLocations = function (locations, filteredLocations) {
                var distanceArray = [], sortByFilter = 'distance';

                _.each(locations, function (location) {
                    location.highlight = '';
                    distanceArray.push(location.distance);
                });

                _.each(filteredLocations, function (location) {
                    // just to differentiate between angular matched filter 
                    // results and reverse geocoding results
                    location.highlight = 'callout';
                    location.distance = '';
                });

                if (_.min(distanceArray) > 25) {
                    sortByFilter = 'name';
                }

                // Sort the locations array here instead of using the angular
                // orderBy filter. That way we can display the matched
                // locations first and then display the results from
                // the geocoder service
                locations = _.sortBy(locations, function (location) {
                    return location[sortByFilter];
                });

                // Remove the matched libraries from the filter search term
                locations = _.difference(locations, filteredLocations);

                // Use union to add the matched locations in front of the rest 
                // of the locations
                $scope.locations = _.union(filteredLocations, locations);

                // If there is an angularjs filter match,
                // then sort by the matches first and 
                // then by the rest of the locations
                if (_.min(distanceArray) > 25) {
                    resetDistance();
                }

                // Don't sort by distance or
                // the matched results will not display first
                $scope.predicate = '';
            },
            searchByUserGeolocation = function () {
                $scope.searchTerm = '';
                $scope.geolocationAddressOrSearchQuery = userAddress;
                $scope.predicate = 'distance';

                if (nypl_geocoder_service.check_marker('user')) {
                    nypl_geocoder_service.pan_existing_marker('user');
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

            ngRepeatShowAllBranches = function () {
                $scope.location_type = '';
                $scope.showMore = true;
                $scope.locationsListed = 10;
                $scope.totalLocations = $scope.locations.length;
                ngRepeatInit();
            },

            ngRepeatShowResearchBranches = function () {
                $scope.location_type = 'research';
                $scope.showMore = false;
                $scope.locationsListed = 4;
                $scope.totalLocations = 4;
            };

        $rootScope.title = "Locations";
        nypl_geocoder_service
            .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service.load_markers();

        loadLocations();

        $scope.distanceSort = function () {
            if ($scope.locations[0].distance) {
                $scope.predicate = 'distance';
                $scope.reverse = !$scope.reverse;
            }
        };

        $scope.useGeolocation = function () {
            $scope.filteredResults = '';
            $scope.geolocationAddressOrSearchQuery = '';

            // Remove any existing search markers on the map.
            nypl_geocoder_service.remove_searchMarker();

            if (!userCoords) {
                loadCoords()
                    .then(loadReverseGeocoding)
                    .catch(function (error) {
                        $scope.distanceError = error.message;
                        $scope.geolocationOn = false;
                    });
                return;
            }

            if (!$scope.distanceError) {
                // Need to update or remove from page when user is too far.
                searchByUserGeolocation();
            }
        };

        $scope.clearSearch = function () {
            allLocationsInit();
            $scope.researchBranches = false;
            ngRepeatShowAllBranches();
            nypl_geocoder_service.show_all_libraries();
        };

        $scope.submitAddress = function (searchTerm) {
            if (!searchTerm) {
                return;
            }

            $scope.filteredResults = '';
            $scope.geolocationAddressOrSearchQuery = '';
            nypl_geocoder_service.remove_searchMarker();

            // Filter the locations by the search term
            // using Angularjs
            var filteredLocations =
                nypl_utility.location_search($scope.locations, searchTerm);

            // $scope.geolocationAddressOrSearchQuery = searchTerm;
            // $scope.researchBranches = false;
            // ngRepeatShowAllBranches();

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
                    // if there are, show results based on the angularjs filter.
                    // else, reset back to the start
                    if (filteredLocations.length) {
                        organizeLocations(locations, filteredLocations);
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

        $scope.showResearch = function () {
            nypl_geocoder_service.hide_infowindow();
            $scope.researchBranches = !$scope.researchBranches;

            if ($scope.researchBranches) {
                nypl_geocoder_service.show_research_libraries();
                ngRepeatShowResearchBranches();
            } else {
                nypl_geocoder_service.show_all_libraries();
                ngRepeatShowAllBranches();
            }
        };

    }
]);
// End LocationsCtrl


// Load one individual location for locations and events pages
nypl_locations.controller('LocationCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    'nypl_locations_service',
    'nypl_coordinates_service',
    'nypl_utility',
    'breadcrumbs',
    function (
        $scope,
        $routeParams,
        $rootScope,
        $location,
        nypl_locations_service,
        nypl_coordinates_service,
        nypl_utility,
        breadcrumbs
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

                        breadcrumbs.options = { 'Location': location.name };
                        $scope.breadcrumbs = breadcrumbs;

                        $scope.calendar_link =
                            nypl_utility.google_calendar_link;

                        $scope.siteWideAlert =
                            nypl_utility.alerts(location._embedded.alerts);

                        if (location.hours.exceptions) {
                            $scope.libraryAlert =
                                nypl_utility.alerts(location.hours.exceptions);
                        }

                        $scope.location = location;
                        $scope.hoursToday = nypl_utility.hoursToday;

                        // Used for the Get Directions link to Google Maps
                        $scope.locationDest =
                            nypl_utility.getAddressString(location);

                        $scope.location.social_media =
                            nypl_utility
                                .socialMediaColor($scope.location.social_media);
			$scope.location.catalog =
			    nypl_utility.catalog_items_link($scope.location.name);


                        //console.log($scope.location); //Debugging
                    })
                    .catch(function (err) {
                        throw err;
                    });
            },
            loadCoords = function () {
                return nypl_coordinates_service
                    .getCoordinates()
                    .then(function (position) {
                        userCoords = _.pick(position, 'latitude', 'longitude');

                        // Used for the Get Directions link to Google Maps
                        // If the user rejected geolocation and
                        // $scope.locationStart is blank,
                        // the link will still work
                        $scope.locationStart =
                            userCoords.latitude + "," + userCoords.longitude;
                    });
            };

        // Load the location and user's geolocation coordinates
        // as chained events
        loadLocation().then(loadCoords);
    }
]);
