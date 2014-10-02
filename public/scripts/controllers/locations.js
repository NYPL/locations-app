/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $ */

(function () {
    'use strict';

    function LocationsCtrl(
        $rootScope,
        $scope,
        $timeout,
        $state,
        config,
        nyplCoordinatesService,
        nyplGeocoderService,
        nyplLocationsService,
        nyplUtility,
        nyplSearch,
        nyplAmenities
    ) {
        var locations,
            searchValues = nyplSearch.getSearchValues(),
            research_order =
                config.research_order ||['SASB', 'LPA', 'SC', 'SIBL'],
            user = { coords: {}, address: '' },
            sortListBy = function (type) {
                $scope.predicate = type;
            },

            resetProperty = function (arr, property) {
                _.each(arr, function (location) {
                    location[property] = '';
                });
            },

            resetPage = function () {
                $scope.searchMarker = false;
                $scope.researchBranches = false;
                $scope.userMarker = false;
                $scope.reverse = false;
                $scope.searchTerm = '';
                $scope.geolocationAddressOrSearchQuery = '';
                $scope.select_library_for_map = '';

                sortListBy('name');

                resetProperty($scope.locations, 'distance');
                resetProperty($scope.locations, 'highlight');
            },

            geolocationAvailable = function () {
                // After loading all locations, check if the browser supports
                // geolocation before the user tries to geolocate their
                // location. If available, the button to geolocate appears.
                if (nyplCoordinatesService.geolocationAvailable()) {
                    $scope.geolocationOn = true;
                }
            },

            isMapPage = function () {
                return $state.current.name === 'home.map';
            },

            loadUserCoordinates = function () {
                return nyplCoordinatesService
                    .getBrowserCoordinates()
                    .then(function (position) {
                        user.coords = _.pick(position, 'latitude', 'longitude');
                        return user;
                    });
            },

            checkUserDistance = function (user) {
                // add a distance property to every location
                // from that location to the user's coordinates
                $scope.locations =
                    nyplUtility.calcDistance($scope.locations, user.coords);

                // Must be within 25 miles
                if (nyplUtility.checkDistance($scope.locations)) {
                    // The user is too far away, reset everything
                    resetPage();
                    throw (new Error('You are not within 25 ' +
                        'miles of any NYPL library.'));
                }

                return user.coords;
            },

            loadUserVariables = function () {
                // Used for 'Get Address' link.
                $scope.locationStart =
                    user.coords.latitude + "," + user.coords.longitude;
                $scope.userMarker = true;

                $state.go('home.map');
                sortListBy('distance');
                nyplGeocoderService
                    .createMarker('user', user.coords, "Your Current Location");

                $scope.drawUserMarker();
            },

            // convert coordinate into address
            loadReverseGeocoding = function (coords) {
                nyplSearch.resetSearchValues();
                return nyplGeocoderService
                    .reverseGeocoding({
                        lat: coords.latitude,
                        lng: coords.longitude
                    })
                    .then(function (address) {
                        $scope.geolocationAddressOrSearchQuery = address;
                        nyplSearch
                            .setSearchValue('resultsNear', address)
                            .setSearchValue('locations', $scope.locations);

                        return address;
                    });
            },

            // convert address to geographic coordinate
            loadGeocoding = function (searchTerm) {
                nyplSearch.setSearchValue('searchTerm', searchTerm);
                return nyplGeocoderService.geocodeAddress(searchTerm)
                    .then(function (coords) {
                        return {
                            coords: coords,
                            searchTerm: coords.name
                        };
                    })
                    .catch(function (error) {
                        throw error;
                    });
            },

            searchByCoordinates = function (searchObj) {
                var locationsCopy = $scope.locations,
                    coords = searchObj.coords,
                    searchterm = searchObj.searchTerm;

                locationsCopy = nyplUtility.calcDistance(locationsCopy, coords);

                // Must be within 25 miles or throws the error:
                if (nyplUtility.checkDistance(locationsCopy)) {
                    // The search query is too far
                    $scope.searchError = searchterm;
                    nyplGeocoderService.panMap();
                    throw (new Error('The search query is too far'));
                }

                $scope.userMarker = false;
                nyplGeocoderService.removeMarker('user');

                nyplSearch.setSearchValue('resultsNear', searchObj.searchTerm);
                $scope.geolocationAddressOrSearchQuery = searchterm;
                $scope.searchError = '';
                return locationsCopy;
            },

            organizeLocations =
                function (locations, filteredLocations, sortByFilter) {
                    resetProperty(locations, 'highlight');

                    _.each(filteredLocations, function (location) {
                        // To differentiate between angular matched filter 
                        // results and reverse geocoding results.
                        location.highlight = 'active';
                        location.distance = '';
                    });

                    // Sort the locations array here instead of using angular
                    // orderBy filter. That way we can display the matched
                    // locations first and then display the results from
                    // the geocoder service.
                    locations = _.sortBy(locations, function (location) {
                        return location[sortByFilter];
                    });

                    // Remove the matched libraries from the filter search term.
                    locations = _.difference(locations, filteredLocations);

                    // Use union to add the matched locations in front
                    // of the rest of the locations.
                    $scope.locations = _.union(filteredLocations, locations);

                    nyplSearch.setSearchValue('locations', $scope.locations);
                    // Don't sort by distance or the matched results
                    // will not display first.
                    sortListBy('');
                },

            scrollListTop = function () {
                var scrollable_lists = [
                        angular.element('.locations-list-view tbody'),
                        angular.element('.locations-data-wrapper')
                    ];

                _.each(scrollable_lists, function (list) {
                    $(list).animate({scrollTop: '0px'}, 1000);
                });
            },

            showLibrariesTypeOf = function (type) {
                // undefined value for type is actually okay, 
                // as it will show all locations if that's the case
                $scope.location_type = type;
            },

            // Deprecated
            createFilterMarker = function (slug) {
                // store the filtered location marker if in the list view,
                // so it can be displayed when going to the map view.
                $scope.select_library_for_map = '';
                nyplGeocoderService.setFilterMarker(slug);
                if (isMapPage()) {
                    nyplGeocoderService.drawFilterMarker(slug);
                }
            },

            // Deprecated
            performIDsearch = function (IDfilteredLocations) {
                resetProperty($scope.locations, 'distance');
                organizeLocations($scope.locations, IDfilteredLocations,
                    'name');

                // map related work
                createFilterMarker(IDfilteredLocations[0].slug);
                $scope.scrollPage();
            },

            loadPreviousStateOrNewState = function () {
                if (searchValues.locations) {
                    // Assigning the saved values to scope variables that
                    // should get loaded.
                    $scope.locations = searchValues.locations;
                    $scope.searchTerm = searchValues.searchTerm;
                    $scope.geolocationAddressOrSearchQuery =
                        searchValues.resultsNear;
                    $scope.searchMarker = searchValues.searchMarker;
                    if ($scope.searchMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    // If the user searched by zip code, name or address,
                    // then sort by relevancy or distance. If not, they used
                    // geolocation so sort by distance. Default is by name.
                    if ($scope.geolocationAddressOrSearchQuery) {
                        sortListBy('distance');
                    } else {
                        sortListBy('name');
                    }
                } else {
                    $scope.loadLocations();
                }
            };

        $scope.loadLocations = function () {
            return nyplLocationsService
                .allLocations()
                .then(function (data) {
                    locations = data.locations;
                    $scope.locations = locations;
                    var amenitiesCount = nyplAmenities.getAmenityConfig(config);

                    _.each($scope.locations, function (location) {
                        var locationAddress =
                                nyplUtility.getAddressString(location, true),
                            markerCoordinates = {
                                'latitude': location.geolocation.coordinates[1],
                                'longitude': location.geolocation.coordinates[0]
                            };

                        location.hoursToday = nyplUtility.hoursToday;
                        location.locationDest =
                            nyplUtility.getAddressString(location);

                        location.amenities_list =
                            nyplAmenities.
                                getHighlightedAmenities(
                                    location._embedded.amenities,
                                    amenitiesCount.global,
                                    amenitiesCount.local
                                );

                        // Individual location exception data
                        location.branchException =
                            nyplUtility.branchException(location.hours);

                        location.research_order =
                            nyplUtility.researchLibraryOrder(research_order, location.id);

                        // Initially, when the map is drawn and 
                        // markers are available, they will be drawn too. 
                        // No need to draw them again if they exist.
                        if (!nyplGeocoderService
                                .doesMarkerExist(location.slug)) {
                            nyplGeocoderService
                                .createMarker(location.slug,
                                    markerCoordinates,
                                    locationAddress);
                        }
                    });

                    resetPage();
                    nyplSearch.setSearchValue('locations', $scope.locations);

                    return locations;
                })
                .catch(function (error) {
                    $state.go('404');
                    throw error;
                });
        };

        $scope.scrollPage = function () {
            var content = angular.element('.container__all-locations'),
                containerWidth = parseInt(content.css('width'), 10),
                top;

            // only scroll the page on mobile
            if (containerWidth < 601) {
                top = angular.element('.map-search__results').offset() ||
                    angular.element('.search__results').offset();
                $timeout(function () {
                    angular.element('body').animate({scrollTop: top.top}, 1000);
                }, 1000);
            }
        };

        $scope.viewMapLibrary = function (library_id) {
            var location = _.where($scope.locations, { 'slug' : library_id });
            $scope.select_library_for_map = library_id;

            $scope.searchMarker = false;
            $state.go('home.map');

            organizeLocations($scope.locations, location, 'name');
            $scope.scrollPage();
        };

        $scope.useGeolocation = function () {
            // Remove any existing search markers on the map.
            nyplGeocoderService.removeMarker('search');
            resetPage();

            $scope.scrollPage();
            scrollListTop();

            loadUserCoordinates()
                .then(checkUserDistance)
                .then(loadReverseGeocoding)
                .then(loadUserVariables)
                .catch(function (error) {
                    $scope.distanceError = error.message;
                    $scope.geolocationOn = false;
                });
        };

        $scope.clearSearch = function () {
            nyplSearch.resetSearchValues();

            showLibrariesTypeOf();
            nyplGeocoderService
                .showAllLibraries()
                .removeMarker('user')
                .clearFilteredLocation();

            if (isMapPage()) {
                nyplGeocoderService.removeMarker('search')
                    .hideInfowindow()
                    .panMap();
            }

            resetPage();
            scrollListTop();
        };

        $scope.drawUserMarker = function () {
            if (nyplGeocoderService.doesMarkerExist('user')) {
                nyplGeocoderService.panExistingMarker('user');
            }
        };

        $scope.geocodeAddress = function (searchTerm) {
            // What should be the minimum length of the search?
            if (!searchTerm || searchTerm.length < 3) {
                return;
            }

            $scope.geolocationAddressOrSearchQuery = '';
            $scope.searchError = '';
            showLibrariesTypeOf();
            nyplGeocoderService.showAllLibraries()
            $scope.searchTerm =  searchTerm;

            searchTerm = nyplSearch.searchWordFilter(searchTerm);
            scrollListTop();

            $state.go('home.map');
            loadGeocoding(searchTerm)
                .then(function (searchObj) {
                    nyplGeocoderService.createSearchMarker(
                        searchObj.coords,
                        searchObj.searchTerm
                    );

                    return searchByCoordinates(searchObj);
                })
                .then(function (locations) {
                    $scope.scrollPage();
                    // Variable to draw a green marker on the map legend.
                    $scope.searchMarker = true;
                    nyplSearch.setSearchValue('searchMarker', true);
                    if (isMapPage()) {
                        nyplGeocoderService.drawSearchMarker();
                    }
                    
                    organizeLocations(locations, [], 'distance');
                })
                // Catch any errors at any point
                .catch(function (error) {
                    nyplGeocoderService.removeMarker('search');
                    $scope.searchMarker = false;
                    nyplSearch.resetSearchValues();

                    resetPage();
                });
        };

        $scope.showResearch = function () {
            nyplGeocoderService.hideInfowindow();
            scrollListTop();

            $scope.researchBranches = !$scope.researchBranches;

            if ($scope.researchBranches) {
                nyplGeocoderService.showResearchLibraries().panMap();
                showLibrariesTypeOf('research');
                sortListBy('research_order');
            } else {
                nyplGeocoderService.showAllLibraries().panMap();
                showLibrariesTypeOf();
                sortListBy('name');
            }
        };

        $rootScope.title = "Locations";
        $scope.$state = $state;

        loadPreviousStateOrNewState();
        geolocationAvailable();
    }
    // End LocationsCtrl

    function MapCtrl($scope, $timeout, config, nyplGeocoderService) {

        var loadMapMarkers = function () {
                $timeout(function () {
                    if ($scope.locations) {
                        nyplGeocoderService.showAllLibraries();
                        if ($scope.researchBranches) {
                            nyplGeocoderService.showResearchLibraries();
                        }
                    }
                }, 1200);
            },

            drawMap = function () {
                $timeout(function () {
                    var filteredLocation =
                        nyplGeocoderService.getFilteredLocation();

                    nyplGeocoderService
                        .drawMap({
                            lat: 40.7532,
                            long: -73.9822
                        }, 12, 'all-locations-map')
                        .drawLegend('all-locations-map-legend');

                    if ($scope.locations) {
                        nyplGeocoderService.showAllLibraries();
                    }
                    loadMapMarkers();

                    $scope.drawUserMarker();

                    if ($scope.searchMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    if ($scope.researchBranches) {
                        nyplGeocoderService.showResearchLibraries();
                    }

                    if ($scope.select_library_for_map) {
                        nyplGeocoderService
                            .panExistingMarker($scope.select_library_for_map);
                    } else {
                        nyplGeocoderService.drawFilterMarker(filteredLocation);
                    }

                    $scope.scrollPage();
                }, 1200);
            };

        drawMap();

        $scope.panToLibrary = function (slug) {
            nyplGeocoderService
                .hideSearchInfowindow()
                .panExistingMarker(slug);

            $scope.scrollPage();
        };
    }

    function LocationCtrl(
        $rootScope,
        $scope,
        $timeout,
        config,
        location,
        nyplCoordinatesService,
        nyplUtility,
        nyplAmenities
    ) {
        var amenities = location._embedded.amenities,
            amenitiesCount = nyplAmenities.getAmenityConfig(config),
            loadUserCoordinates = function () {
                return nyplCoordinatesService
                    .getBrowserCoordinates()
                    .then(function (position) {
                        var userCoords =
                            _.pick(position, 'latitude', 'longitude');

                        // Needed to update async var on geolocation success
                        $timeout(function () {
                            $scope.locationStart = userCoords.latitude +
                                "," + userCoords.longitude;
                        });
                    });
            };

        // Load the user's geolocation coordinates
        loadUserCoordinates();

        $scope.location = location;
        $rootScope.title = location.name;

        if (location.hours.exceptions) {
            location.hours.exceptions.description =
                nyplUtility.returnHTML(location.hours.exceptions.description);
        }

        // Add icons to the amenities.
        _.each(location._embedded.amenities, function (amenity) {
            amenity.amenity = nyplAmenities.addAmenitiesIcon(amenity.amenity);
        });

        // Get three institution ranked and two location ranked amenities.
        location.amenities_list =
            nyplAmenities.getHighlightedAmenities(
                amenities,
                amenitiesCount.global,
                amenitiesCount.local
            );

        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        $scope.location.social_media =
            nyplUtility.socialMediaColor($scope.location.social_media);

        if (location.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(location.hours);
        }

        // Build exhibition pretty date
        if (location._embedded.exhibitions) {
            _.each(location._embedded.exhibitions, function (exh) {
                if (exh.start && exh.end) {
                    exh.prettyDate = nyplUtility.formatDate(exh.start, exh.end);
                }
            });
        }

        _.each(location._embedded.divisions, function (division) {
            division.hoursToday = nyplUtility.hoursToday(division.hours);
        });

        _.each(location._embedded.features, function (feature) {
            feature.body = nyplUtility.returnHTML(feature.body);
        });

        // Used for the Get Directions link to Google Maps
        $scope.locationDest = nyplUtility.getAddressString(location);
    }

    angular
        .module('nypl_locations')
        .controller('LocationsCtrl', LocationsCtrl)
        .controller('MapCtrl', MapCtrl)
        .controller('LocationCtrl', LocationCtrl);
})();
