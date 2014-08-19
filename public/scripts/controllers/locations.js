/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $location, $ */

(function () {
    'use strict';

    function LocationsCtrl(
        $rootScope,
        $scope,
        $timeout,
        $location,
        $state,
        nyplCoordinatesService,
        nyplGeocoderService,
        nyplLocationsService,
        nyplUtility
    ) {
        var locations,
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

            loadUserCoordinates = function () {
                return nyplCoordinatesService
                    .getBrowserCoordinates()
                    .then(function (position) {
                        user.coords = _.pick(position, 'latitude', 'longitude');

                        // Used for 'Get Address' link.
                        $scope.locationStart = user.coords.latitude + "," +
                                user.coords.longitude;
                        $scope.userMarker = true;

                        // add a distance property to every location
                        // from that location to the user's coordinates
                        $scope.locations = nyplUtility
                                .calcDistance($scope.locations, user.coords);

                        // Must be within 25 miles
                        if (nyplUtility.checkDistance($scope.locations)) {
                            // The user is too far away, reset everything
                            resetPage();
                            throw (new Error('You are not within 25 ' +
                                    'miles of any NYPL library.'));
                        }

                        sortListBy('distance');
                        nyplGeocoderService.createMarker('user', user.coords,
                            "Your Current Location");

                        if ($state.current.name === 'home.map') {
                            $scope.drawUserMarker();
                        }

                        return user.coords;
                    });
            },

            // convert coordinate into address
            loadReverseGeocoding = function () {
                return nyplGeocoderService
                    .reverseGeocoding({
                        lat: user.coords.latitude,
                        lng: user.coords.longitude
                    })
                    .then(function (address) {
                        $scope.geolocationAddressOrSearchQuery = address;

                        return address;
                    });
            },

            // convert address to geographic coordinate
            loadGeocoding = function (searchTerm) {
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

                locationsCopy =
                    nyplUtility.calcDistance(locationsCopy, coords);

                // Must be within 25 miles or throws the error:
                if (nyplUtility.checkDistance(locationsCopy)) {
                    // The search query is too far
                    $scope.searchError = searchterm;
                    nyplGeocoderService.panMap();
                    throw (new Error('The search query is too far'));
                }

                if ($state.current.name === 'home.map') {
                    nyplGeocoderService
                        .removeMarker('search')
                        .drawSearchMarker();
                }

                // Variable to draw a green marker on the map legend.
                $scope.searchMarker = true;
                $scope.userMarker = false;
                nyplGeocoderService.removeMarker('user');

                $scope.geolocationAddressOrSearchQuery = searchterm;
                $scope.searchError = '';
                return locationsCopy;
            },

            organizeLocations =
                function (locations, filteredLocations, sortByFilter) {
                    resetProperty(locations, 'highlight');

                    _.each(filteredLocations, function (location) {
                        // just to differentiate between angular matched filter 
                        // results and reverse geocoding results
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

            searchByUserGeolocation = function () {
                scrollListTop();

                if ($state.current.name === 'home.map') {
                    $scope.drawUserMarker();
                }

                sortListBy('distance');
            },

            showLibrariesTypeOf = function (type) {
                // undefined value for type is actually okay, 
                // as it will show all locations if that's the case
                $scope.location_type = type;
            };

        $scope.loadLocations = function () {
            return nyplLocationsService
                .allLocations()
                .then(function (data) {
                    locations = data.locations;
                    $scope.locations = locations;

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

                        // var amenities_list = [];
                        // _.each(location._embedded.amenities, function (amenities) {
                        //     _.each(amenities.amenities, function (amenity) {
                        //         amenities_list.push(amenity);
                        //     });
                        // });
                        // location.amenities_list = amenities_list;

                        // Individual location exception data
                        location.branchException =
                            nyplUtility.branchException(location.hours);

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

                    geolocationAvailable();
                    resetPage();

                    return locations;
                })
                .catch(function (error) {
                    $location.path('/404');
                    throw error;
                });
        };

        $scope.scrollPage = function () {
            var content = angular.element('.container__all-locations'),
                containerWidth = parseInt(content.css('width'), 10),
                top;

            if (containerWidth < 601) {
                top = angular.element('.map-search__results').offset() ||
                    angular.element('.search__results').offset();
            } else {
                top = content.offset();
            }

            $timeout(function () {
                angular.element('body').animate({scrollTop: top.top}, 1000);
            }, 1000);
        };

        $scope.viewMapLibrary = function (library_id) {
            $scope.select_library_for_map = library_id;

            $state.go('home.map');

            var location = _.where($scope.locations, { 'slug' : library_id });
            organizeLocations($scope.locations, location, 'name');
            $scope.scrollPage();
        };

        $scope.useGeolocation = function () {
            $scope.searchTerm = '';
            $scope.geolocationAddressOrSearchQuery = '';

            // Remove any existing search markers on the map.
            nyplGeocoderService.removeMarker('search');
            $scope.searchMarker = false;
            $scope.scrollPage();

            loadUserCoordinates()
                .then(loadReverseGeocoding)
                .then(searchByUserGeolocation)
                .catch(function (error) {
                    $scope.distanceError = error.message;
                    $scope.geolocationOn = false;
                });
        };

        $scope.clearSearch = function () {
            showLibrariesTypeOf();
            nyplGeocoderService
                .showAllLibraries()
                .removeMarker('user')
                .clearFilteredLocation();

            if ($state.current.name === 'home.map') {
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

        $scope.submitAddress = function (searchTerm) {
            if (!searchTerm) {
                return;
            }

            searchTerm = nyplUtility.searchWordFilter(searchTerm);
            scrollListTop();

            $scope.geolocationAddressOrSearchQuery = '';
            // Remove previous search marker from the map
            nyplGeocoderService.removeMarker('search');
            $scope.searchMarker = false;
            showLibrariesTypeOf();
            nyplGeocoderService.showAllLibraries();
            $scope.researchBranches = false;

            var IDfilteredLocations =
                    nyplUtility.idLocationSearch($scope.locations, searchTerm),
                // Filter the locations by the search term using Angularjs
                filteredLocations =
                    nyplUtility.locationSearch($scope.locations, searchTerm);

            if (IDfilteredLocations && IDfilteredLocations.length !== 0) {
                resetProperty($scope.locations, 'distance');
                organizeLocations($scope.locations, IDfilteredLocations,
                    'name');

                // map related work
                if ($state.current.name === 'home.map') {
                    nyplGeocoderService
                        .searchFilterMarker(IDfilteredLocations[0].slug);
                }
                $scope.scrollPage();

                // We're done here, go home.
                return;
            }

            loadGeocoding(searchTerm)
                .then(function (searchObj) {
                    // Map related work
                    if (filteredLocations.length &&
                            $state.current.name === 'home.map') {
                        nyplGeocoderService
                            .searchFilterMarker(filteredLocations[0].slug);
                    } else {
                        nyplGeocoderService.clearFilteredLocation();
                        nyplGeocoderService.createSearchMarker(
                            searchObj.coords,
                            searchObj.searchTerm
                        );
                    }

                    return searchByCoordinates(searchObj);
                })
                .then(function (locations) {
                    $scope.scrollPage();
                    if (filteredLocations) {
                        $scope.searchMarker = false;
                    }
                    organizeLocations(locations, filteredLocations, 'distance');
                })
                // Catch any errors at any point
                .catch(function (error) {
                    // google maps api is down or geocoding did not return
                    // any significant results,
                    // first see if there are any angularjs filtered results.
                    // if there are, show results based on the angularjs filter.
                    // else, reset back to the start
                    nyplGeocoderService.removeMarker('search');
                    $scope.searchMarker = false;
                    if (filteredLocations.length &&
                            error.msg !== 'query too short') {
                        resetProperty($scope.locations, 'distance');
                        $scope.searchError = '';
                        // Map related work
                        nyplGeocoderService
                            .searchFilterMarker(filteredLocations[0].slug);
                        organizeLocations(locations, filteredLocations, 'name');
                    } else {
                        resetPage();
                    }
                });
        };

        $scope.showResearch = function () {
            nyplGeocoderService.hideInfowindow();
            scrollListTop();

            $scope.researchBranches = !$scope.researchBranches;

            if ($scope.researchBranches) {
                nyplGeocoderService.showResearchLibraries();
                showLibrariesTypeOf('research');
                nyplGeocoderService.panMap();
            } else {
                nyplGeocoderService.showAllLibraries();
                showLibrariesTypeOf();
            }
        };

        $rootScope.title = "Locations";
        $scope.$state = $state;
        $scope.loadLocations();
    }
    // End LocationsCtrl

    function MapCtrl($scope, $timeout, nyplGeocoderService) {

        var loadMapMarkers = function () {
                $timeout(function () {
                    if ($scope.locations) {
                        nyplGeocoderService.showAllLibraries();
                    }
                }, 1200);
            },

            mapInit = function () {
                nyplGeocoderService
                    .removeMarker('search')
                    .hideInfowindow()
                    .panMap();
            },

            drawMap = function () {
                $timeout(function () {
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

                    if ($scope.userMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    // TODO
                    if ($scope.searchMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    if ($scope.researchBranches) {
                        nyplGeocoderService.showResearchLibraries();
                    }

                    if ($scope.select_library_for_map) {
                        nyplGeocoderService
                            .panExistingMarker($scope.select_library_for_map);
                    }

                    var filteredLocation =
                        nyplGeocoderService.getFilteredLocation();
                    if (filteredLocation) {
                        nyplGeocoderService.panExistingMarker(filteredLocation);
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
        location,
        nyplCoordinatesService,
        nyplUtility
    ) {
        var loadUserCoordinates = function () {
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

        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        $scope.location.social_media =
            nyplUtility.socialMediaColor($scope.location.social_media);

        if (location.hours.exceptions) {
            $scope.libraryAlert = nyplUtility.branchException(location.hours);
        }

        if (location.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(location.hours);
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
