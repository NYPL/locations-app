/*jslint indent: 4, maxlen: 80 */
/*globals angular */

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name locationService.service:nyplLocationsService
     * @requires $http
     * @requires $q
     * @description
     * AngularJS service to call different API endpoints.
     */
    function nyplLocationsService($http, $q) {
        var api, config,
            apiError = "Could not reach API",
            locationsApi = {};

        /**
         * @ngdoc function
         * @name getConfig
         * @methodOf locationService.service:nyplLocationsService
         * @returns {object} Deferred promise.
         * @description
         * Used to get Sinatra generated config variables.
         */
        locationsApi.getConfig = function () {
            
            var defer = $q.defer();

            //if (config) {
            //    defer.resolve(config);
            //} else {
            //    $http.get('/locations/config', {cache: true})
            //        .success(function (data) {
            //            api = data.config.api_root;
            //            config = data.config;
            //            defer.resolve(config);
            //        })
            //        .error(function (data, status) {
            //            defer.reject(apiError + ': config');
            //        });
            //}

            api = window.locations_cfg.config.api_root
            defer.resolve(window.locations_cfg);
            return defer.promise;
        }

        /**
         * @ngdoc function
         * @name allLocations
         * @methodOf locationService.service:nyplLocationsService
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of all NYPL locations. If it is rejected, an
         *  error message is returned saying that it "Could not reach API".
         * @description Get all locations
         * @example
         * <pre>
         *  nyplLocationsService.allLocations()
         *    .then(function (data) {
         *      var locations = data.locations;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.allLocations = function () {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations' + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': locations');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name singleLocation
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} location The slug of the location to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of a specific NYPL locations. If it is rejected,
         *  an error message is returned saying that it "Could not reach API".
         * @description Get single location.
         * @example
         * <pre>
         *  nyplLocationsService.singleLocation('schwarzman')
         *    .then(function (data) {
         *      var location = data.location;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.singleLocation = function (location) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations/' + location + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': location');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name singleDivision
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} division The slug of the division to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of an NYPL Division. If it is rejected, an error
         *  message is returned saying that it "Could not reach API".
         * @description Get single division.
         * @example
         * <pre>
         *  nyplLocationsService.singleLocation('map-division')
         *    .then(function (data) {
         *      var division = data.division;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.singleDivision = function (division) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/divisions/' + division + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': division');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name amenities
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} [amenity] The id of the amenity to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API. If no param was passed, it will return all the
         *  amenities at NYPL. If the param was passed, it will return a list
         *  of all the NYPL locations where the amenity passed is available.
         *  If it is rejected, an error message is returned saying that it
         *  "Could not reach API".
         * @description Get all amenities.
         * @example
         * <pre>
         *  nyplLocationsService.amenities()
         *    .then(function (data) {
         *      var amenities = data;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         *
         *  nyplLocationsService.amenities('7950')
         *    .then(function (data) {
         *      var amenity = data;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.amenities = function (amenity) {
            var defer = $q.defer(),
                url = !amenity ? '/amenities' : '/amenities/' + amenity;

            $http.jsonp(api + url + '?callback=JSON_CALLBACK', {cache: true})
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': amenities');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name amenitiesAtLibrary
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} location The slug of the location to look up
         *  all amenities available at that location.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of all amenities available at the location. If it is
         *  rejected, an error message is returned saying that it
         *  "Could not reach API".
         * @description Get amenities at a library.
         * @example
         * <pre>
         *  nyplLocationsService.amenitiesAtLibrary('115th-street')
         *    .then(function (data) {
         *      var location = data.location;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.amenitiesAtLibrary = function (location) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations/' + location + '/amenities' + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': library-amenity');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name alerts
         * @methodOf locationService.service:nyplLocationsService
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of alerts that display site-wide.
         * @description Get all alerts.
         * @example
         * <pre>
         *  nyplLocationsService.alerts()
         *    .then(function (data) {
         *      var amenities = data.alerts;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.alerts = function () {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/alerts' + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': site-wide alerts');
                });
            return defer.promise;
        };

        return locationsApi;
    }

    /**
     * @ngdoc overview
     * @module locationService
     * @name locationService
     * @description
     * AngularJS module that provides a service to call the API endpoints.
     */
    angular
        .module('locationService', [])
        .factory('nyplLocationsService', nyplLocationsService);

})();
