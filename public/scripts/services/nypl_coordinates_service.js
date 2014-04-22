/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations */
nypl_locations.factory(
    'nypl_coordinates_service',
    ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
        'use strict';

        return {
            // Geolocation extraction of coordinates
            getCoordinates: function () {
                // Object containing success/failure conditions
                var defer = $q.defer();

                // Verify the browser supports Geolocation
                if (!$window.navigator && !$window.navigator.geolocation) {
                    $rootScope.$apply(function () {
                        defer.reject(
                            new Error(
                                "Your browser does not support Geolocation"
                            )
                        );
                    });
                } else {
                    $window.navigator.geolocation
                        .getCurrentPosition(function (position) {
                            // Extract coordinates for geoPosition obj
                            // defer.resolve(position.coords);
                            // Testing a user's location that is more than 
                            // 25miles of any NYPL location
                            var coords = {
                                'latitude': 42.3581,
                                'longitude': -71.0636
                            }
                            defer.resolve(coords);
                        }, function (error) {
                            switch (error.code) {
                            case error.PERMISSION_DENIED:
                                $rootScope.$apply(function () {
                                    defer.reject(
                                        new Error("User denied permission")
                                    );
                                });
                                break;

                            case error.POSITION_UNAVAILABLE:
                                $rootScope.$apply(function () {
                                    defer.reject(
                                        new Error("The position is currently unavailable")
                                    );
                                });
                                break;

                            case error.TIMEOUT:
                                $rootScope.$apply(function () {
                                    defer.reject(
                                        new Error("The request timed out")
                                    );
                                });
                                break;

                            default:
                                $rootScope.$apply(function () {
                                    defer.reject(
                                        new Error("Unkown error")
                                    );
                                });
                            }
                        });
                }

                return defer.promise; // Enables 'then' callback
            },

            // Calculate distance using coordinates
            getDistance: function (lat1, lon1, lat2, lon2) {
                var radlat1 = Math.PI * lat1 / 180,
                    radlat2 = Math.PI * lat2 / 180,
                    theta = lon1 - lon2,
                    radtheta = Math.PI * theta / 180,
                    distance;

                distance = Math.sin(radlat1) * Math.sin(radlat2) +
                    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                distance = Math.acos(distance);
                distance = distance * 180 / Math.PI;
                distance = distance * 60 * 1.1515;
                return Math.ceil(distance * 100) / 100;
            }
        };
    }]
);
