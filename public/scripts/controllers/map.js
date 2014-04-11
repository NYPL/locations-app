/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */
nypl_locations.controller(
    'mapCtrl',
    function (
        $scope,
        $routeParams,
        nypl_locations_service,
        nypl_geocoder_service,
        nypl_coordinates_service,
        nypl_utility
    ) {
        'use strict';
        var loadLocation = function () {
                return nypl_locations_service
                    .single_location($routeParams.symbol)
                    .then(function (data) {
                        return data.location;
                    });
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
            },
            loadMapPage = function (location) {
                $scope.location = location;
                console.log(location);

                $scope.hoursToday = nypl_utility.hoursToday(location.hours);
                $scope.locationDest = nypl_utility.getAddressString(location);
                var locationAddress =
                        nypl_utility.getAddressString(location, true),
                    locationCoords = {
                        'lat': location.geolocation.coordinates[1],
                        'long': location.geolocation.coordinates[0]
                    };

                nypl_geocoder_service
                    .draw_map(locationCoords, 15, 'individual-map');
                nypl_geocoder_service
                    .draw_marker(locationCoords, locationAddress);
            };
        loadLocation()
            .then(loadMapPage)
            .then(getUserCoords)
            .catch(function (error) {
                console.log(error);
            });
    }
);
