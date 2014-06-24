/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */
nypl_locations.controller('mapCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    'nypl_locations_service',
    'nypl_geocoder_service',
    'nypl_coordinates_service',
    'nypl_utility',
    'breadcrumbs',
    function (
        $scope,
        $routeParams,
        $rootScope,
        nypl_locations_service,
        nypl_geocoder_service,
        nypl_coordinates_service,
        nypl_utility,
        breadcrumbs
    ) {
        'use strict';
        var location_id = $routeParams.symbol,
            loadLocation = function () {
                return nypl_locations_service
                    .single_location(location_id)
                    .then(function (data) {
                        $rootScope.title = data.location.name;

                        breadcrumbs.options = { 'Location': data.location.name };
                        $scope.breadcrumbs = breadcrumbs;
                        return data.location;
                    });
            },
            loadMapPage = function (location) {
                // locationAddress is for the marker's infowindow text
                var locationAddress =
                        nypl_utility.getAddressString(location, true),
                    locationCoords = {
                        'latitude': location.geolocation.coordinates[1],
                        'longitude': location.geolocation.coordinates[0]
                    };

                $scope.location = location;
                $scope.siteWideAlert =
                            nypl_utility.alerts(location._embedded.alerts);
                $scope.hoursToday = nypl_utility.hoursToday;
                $scope.locationDest = nypl_utility.getAddressString(location);

                nypl_geocoder_service
                    .draw_map(locationCoords, 15, 'individual-map');

                // The location's marker might already be in the markers array 
                // found in nypl_geocoder_service. It will be populated
                // if they come from the homepage.
                // If it does not exist, then draw the marker.
                if (nypl_geocoder_service.check_marker(location_id)) {
                    nypl_geocoder_service.add_marker_to_map(location_id);
                } else {
                    nypl_geocoder_service
                        .draw_marker(
                            location_id,
                            locationCoords,
                            locationAddress
                        );
                }
            },
            getUserCoords = function () {
                return nypl_coordinates_service
                    .getCoordinates()
                    .then(function (position) {
                        var userCoords =
                            _.pick(position, 'latitude', 'longitude');

                        $scope.locationStart =
                            userCoords.latitude + "," + userCoords.longitude;
                    })
                    .catch(function (error) {
                        throw (error.message);
                    });
            };

        // Load the map and get the user's geolocation coordinates 
        // as separate events.
        loadLocation()
            .then(loadMapPage);
        getUserCoords()
            .catch(function (error) {
                // Display to the user if geolocation error occurred
                $scope.geolocation_error = error;
            });
    }
]);
nypl_locations.controller('LargeMapCtrl', [
    '$scope',
    '$rootScope',
    'nypl_locations_service',
    'nypl_geocoder_service',
    'nypl_utility',
    function (
        $scope,
        $rootScope,
        nypl_locations_service,
        nypl_geocoder_service,
        nypl_utility
    ) {
        'use strict';
        var locations,
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
                                    'latitude': location.geolocation.coordinates[1],
                                    'longitude': location.geolocation.coordinates[0]
                                };

                            if (!nypl_geocoder_service
                                    .check_marker(location.slug)) {
                                nypl_geocoder_service
                                    .draw_marker(location.slug,
                                        markerCoordinates,
                                        locationAddress);
                            }
                        });

                        return locations;
                    });
            };

        $rootScope.title = "Locations";
        nypl_geocoder_service
            .draw_map({lat: 40.7532, long: -73.9822}, 12, 'full-page-map');
        loadLocations();
    }
]);




