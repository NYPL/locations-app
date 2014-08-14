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
        var userCoords,
            userAddress,
            locations,
            sortListBy = function (type) {
                $scope.predicate = type;
            },

            allLocationsInit = function () {
                $scope.reverse = false;
                $scope.searchTerm = '';
                $scope.geolocationAddressOrSearchQuery = '';

                sortListBy('name');

                _.each($scope.locations, function (location) {
                    location.distance = '';
                    location.highlight = '';
                });
            },

            checkGeolocation = function () {
                // After loading all locations, check if the browser
                // supports geolocation before the user actually tries to
                // geolocate their location. If available, the button to
                // geolocate appears.
                if (nyplCoordinatesService.checkGeolocation()) {
                    $scope.geolocationOn = true;
                }
            },

            loadCoords = function () {
                return nyplCoordinatesService
                    .getCoordinates()
                    .then(function (position) {
                        userCoords = _.pick(position, 'latitude', 'longitude');
                        $scope.locationStart =
                                userCoords.latitude + "," +
                                userCoords.longitude;

                        // add a distance property to every location
                        // from that location to the user's coordinates
                        locations =
                            nyplUtility.addDistance(locations, userCoords);

                        // Must be within 25 miles
                        if (nyplUtility.checkDistance(locations)) {
                            // The user is too far away, reset everything
                            allLocationsInit();
                            throw (new Error(
                                'You are not within 25 ' +
                                    'miles of any NYPL library.'
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

                        $scope.locations = locations;
                        sortListBy('distance');
                        nyplGeocoderService
                            .createUserMarker(userCoords,
                                "Your Current Location");

                        if ($state.current.name === 'home.map') {
                            $scope.drawUserMarker();
                        }

                        return userCoords;
                    });
            },

            // convert coordinate into address
            loadReverseGeocoding = function (userCoords) {
                return nyplGeocoderService
                    .getAddress({
                        lat: userCoords.latitude,
                        lng: userCoords.longitude
                    })
                    .then(function (address) {
                        userAddress = address;
                        $scope.geolocationAddressOrSearchQuery = userAddress;

                        return address;
                    });
            },

            // convert address to geographic coordinate
            loadGeocoding = function (searchTerm) {
                return nyplGeocoderService.getCoords(searchTerm)
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

            resetDistance = function () {
                _.each($scope.locations, function (location) {
                    location.distance = '';
                });
            },

            searchByCoordinates = function (searchObj) {
                var locationsCopy = $scope.locations,
                    coords = searchObj.coords,
                    searchterm = searchObj.searchTerm;

                locationsCopy = nyplUtility.addDistance(locationsCopy, coords);

                // Must be within 25 miles or throws the error:
                if (nyplUtility.checkDistance(locationsCopy)) {
                    // The search query is too far
                    $scope.searchError = searchterm;
                    nyplGeocoderService.removeSearchMarker();
                    throw (new Error('The search query is too far'));
                }

                if ($state.current.name === 'home.map') {
                    nyplGeocoderService.drawSearchMarker();
                }
                $scope.searchMarker = true;

                $scope.geolocationAddressOrSearchQuery = searchterm;
                $scope.searchError = '';
                return locationsCopy;
            },

            organizeLocations =
                function (locations, filteredLocations, sortByFilter) {
                    _.each(locations, function (location) {
                        location.highlight = '';
                    });

                    _.each(filteredLocations, function (location) {
                        // just to differentiate between angular matched filter 
                        // results and reverse geocoding results
                        location.highlight = 'callout';
                        location.distance = '';
                    });

                    // Sort the locations array here instead of using angular
                    // orderBy filter. That way we can display the matched
                    // locations first and then display the results from
                    // the geocoder service
                    locations = _.sortBy(locations, function (location) {
                        return location[sortByFilter];
                    });

                    // Remove the matched libraries from the filter search term
                    locations = _.difference(locations, filteredLocations);

                    // Use union to add the matched locations in front
                    // of the rest of the locations
                    $scope.locations = _.union(filteredLocations, locations);

                    // Don't sort by distance or
                    // the matched results will not display first
                    sortListBy('');
                },

            scrollListTop = function () {
                var scrollable_lists = [
                        angular.element('.locations-list-view tbody'),
                        angular.element('.locations-data-wrapper')
                    ];

                _.each(scrollable_lists, function (list) {
                    $(list).animate({
                        scrollTop: '0px'
                    }, 1000);
                });
            },

            searchByUserGeolocation = function () {
                scrollListTop();

                if ($state.current.name === 'home.map') {
                    $scope.drawUserMarker();
                }

                // Display the user address, add distance to every library
                // relative to the user's location and sort by distance
                $scope.geolocationAddressOrSearchQuery = userAddress;
                $scope.locations =
                    nyplUtility.addDistance($scope.locations, userCoords);
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
                        location.hoursToday = nyplUtility.hoursToday;
                        location.locationDest
                            = nyplUtility.getAddressString(location);
                    });

                    checkGeolocation();
                    allLocationsInit();

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
                angular.element('body').animate({scrollTop: top.top}, 1000);
            } else {
                top = content.offset();
                angular.element('body').animate({scrollTop: top.top}, 1000);
            }
        };

        $scope.viewMapLibrary = function (library_id) {
            $scope.select_library_for_map = library_id;

            $state.go('home.map');

            var location = _.where($scope.locations, { 'slug' : library_id });
            organizeLocations($scope.locations, location, 'name');
            $timeout(function () {
                $scope.scrollPage();
            }, 1000);
        };

        $scope.useGeolocation = function () {
            $scope.searchTerm = '';
            $scope.geolocationAddressOrSearchQuery = '';

            // Remove any existing search markers on the map.
            nyplGeocoderService.removeSearchMarker();
            $scope.searchMarker = false;

            $timeout(function () {
                $scope.scrollPage();
            }, 1000);

            // Use cached user coordinates if available
            loadCoords()
                .then(loadReverseGeocoding)
                .then(searchByUserGeolocation)
                .catch(function (error) {
                    $scope.distanceError = error.message;
                    $scope.geolocationOn = false;
                });
        };

        $scope.clearSearch = function () {
            $scope.searchMarker = false;
            $scope.researchBranches = false;
            $scope.searchTerm = '';
            $scope.select_library_for_map = '';

            showLibrariesTypeOf();
            nyplGeocoderService.showAllLibraries();
            nyplGeocoderService.clearFilteredLocation();
            nyplGeocoderService.removeSearchMarker();
            nyplGeocoderService.hideInfowindow();
            allLocationsInit();

            scrollListTop();
        };

        $scope.drawUserMarker = function () {
            if (nyplGeocoderService.checkMarker('user')) {
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
            nyplGeocoderService.removeSearchMarker();
            showLibrariesTypeOf();
            nyplGeocoderService.showAllLibraries();
            $scope.searchMarker = false;
            $scope.researchBranches = false;

            var IDfilteredLocations =
                    nyplUtility.idLocationSearch($scope.locations, searchTerm),
                // Filter the locations by the search term using Angularjs
                filteredLocations =
                    nyplUtility.locationSearch($scope.locations, searchTerm);

            if (IDfilteredLocations && IDfilteredLocations.length !== 0) {
                resetDistance();
                organizeLocations($scope.locations, IDfilteredLocations,
                    'name');

                // map related work
                nyplGeocoderService.searchResultMarker(IDfilteredLocations);

                $timeout(function () {
                    $scope.scrollPage();
                }, 1000);

                // We're done here, go home.
                return;
            }

            loadGeocoding(searchTerm)
                .then(function (searchObj) {
                    // Map related work
                    if (filteredLocations.length) {
                        nyplGeocoderService.
                            searchResultMarker(filteredLocations);
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
                    $timeout(function () {
                        $scope.scrollPage();
                    }, 1000);
                    organizeLocations(locations, filteredLocations, 'distance');
                })
                // Catch any errors at any point
                .catch(function (error) {
                    // google maps api is down or geocoding did not return
                    // any significant results,
                    // first see if there are any angularjs filtered results.
                    // if there are, show results based on the angularjs filter.
                    // else, reset back to the start
                    nyplGeocoderService.removeSearchMarker();
                    $scope.searchMarker = false;
                    if (filteredLocations.length &&
                            error.msg !== 'query too short') {
                        resetDistance();
                        $scope.searchError = '';
                        // Map related work
                        nyplGeocoderService
                            .searchResultMarker(filteredLocations);
                        organizeLocations(locations, filteredLocations, 'name');
                    } else {
                        allLocationsInit();
                    }
                });
        };

        $scope.showResearch = function () {
            nyplGeocoderService.hideInfowindow();
            $scope.researchBranches = !$scope.researchBranches;

            if ($scope.researchBranches) {
                nyplGeocoderService.showResearchLibraries();
                showLibrariesTypeOf('research');
                if ($state.current.name === 'home.map') {
                    nyplGeocoderService.panMap();
                }
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

    function MapCtrl($scope, $timeout, nyplGeocoderService, nyplUtility) {

        var loadMapMarkers = function () {
                _.each($scope.locations, function (location) {
                    var locationAddress = nyplUtility
                            .getAddressString(location, true),
                        markerCoordinates = {
                            'latitude': location.geolocation.coordinates[1],
                            'longitude': location.geolocation.coordinates[0]
                        };

                    // Initially, when the map is drawn and 
                    // markers are availble, they will be drawn too. 
                    // No need to draw them again if they exist.
                    if (!nyplGeocoderService.checkMarker(location.slug)) {
                        nyplGeocoderService
                            .drawMarker(location.slug,
                                markerCoordinates,
                                locationAddress);
                    }
                });
            },

            mapInit = function () {
                nyplGeocoderService.removeSearchMarker();
                nyplGeocoderService.hideInfowindow();
                nyplGeocoderService.panMap();
            },

            drawMap = function () {
                $timeout(function () {
                    nyplGeocoderService.drawMap({
                        lat: 40.7532,
                        long: -73.9822
                    }, 12, 'all-locations-map');

                    nyplGeocoderService
                        .drawLegend('all-locations-map-legend');

                    nyplGeocoderService.loadMarkers();
                    loadMapMarkers();

                    if (!$scope.locations) {
                        $scope.loadLocations().then(function () {
                            nyplGeocoderService.loadMarkers();
                            loadMapMarkers();
                        });
                    }

                    $scope.drawUserMarker();

                    if (nyplGeocoderService.checkMarker('user')) {
                        nyplGeocoderService.addMarkerToMap('user');
                    }

                    if (nyplGeocoderService.checkSearchMarker()) {
                        nyplGeocoderService.drawSearchMarker();
                        $scope.searchMarker = true;
                    } else {
                        mapInit();
                    }

                    if ($scope.researchBranches) {
                        nyplGeocoderService.showResearchLibraries();
                    }

                    if ($scope.select_library_for_map) {
                        nyplGeocoderService
                            .panExistingMarker($scope.select_library_for_map);
                        nyplGeocoderService.hideSearchInfowindow();
                    }

                    var filteredLocation =
                        nyplGeocoderService.getFilteredLocation();
                    if (filteredLocation) {
                        nyplGeocoderService
                            .panExistingMarker(filteredLocation);
                    }

                    $timeout(function () {
                        $scope.scrollPage();
                    }, 1200);
                }, 1000);
            };

        drawMap();

        $scope.panToLibrary = function (slug) {
            nyplGeocoderService.panExistingMarker(slug);
            nyplGeocoderService.hideSearchInfowindow();
            $timeout(function () {
                $scope.scrollPage();
            }, 800);
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
        var userCoords,
            loadCoords = function () {
                return nyplCoordinatesService
                    .getCoordinates()
                    .then(function (position) {
                        userCoords = _.pick(position, 'latitude', 'longitude');

                        // Needed to update async var on geolocation success
                        $timeout(function () {
                            $scope.locationStart = userCoords.latitude +
                                "," + userCoords.longitude;
                        });
                    });
            };

        // Load the user's geolocation coordinates
        loadCoords();

        $scope.location = location;
        $rootScope.title = location.name;

        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        // breadcrumbs.options = { 'Location': location.name };
        // homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
        // breadcrumbs.breadcrumbs[1].path = "#/" + location.slug;
        // breadcrumbs.breadcrumbs.unshift(homeUrl);
        // $scope.breadcrumbs = breadcrumbs;

        $scope.location.social_media =
            nyplUtility.socialMediaColor($scope.location.social_media);

        if (location.hours.exceptions) {
            $scope.libraryAlert = nyplUtility.alerts(location.hours.exceptions);
        }

        if (location.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(location.hours);
        }

        _.each(location._embedded.divisions, function (division) {
            division.divisionHoursToday =
                nyplUtility.hoursToday(division.hours);
        });

        _.each(location._embedded.features, function (feature) {
            feature.description = nyplUtility.returnHTML(feature.description);
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
