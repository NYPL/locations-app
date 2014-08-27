/*jslint indent: 4, maxlen: 80 */
/*globals angular */

/** @namespace nyplLocationsService */
function nyplLocationsService($http, $q) {
    'use strict';

    var api = 'http://evening-mesa-7447-160.herokuapp.com',
        apiError = "Could not reach API",
        locationsApi = {};

    /** @function nyplLocationsService.allLocations 
     * @returns {object} Deferred promise. If it resolves, JSON response from
     *  the API of all NYPL locations. If it is rejected, an error message
     *  is returned saying that it "Could not reach API".
     * @example
     *  nyplLocationsService.allLocations()
     *    .then(function (data) {
     *      var locations = data.locations;
     *    });
     *    .catch(function (error) {
     *      // error = "Could not reach API"
     *    });
     */
    locationsApi.allLocations = function () {
        var defer = $q.defer();

        $http.get(api + '/locations', {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    /** @function nyplLocationsService.singleLocation
     * @param {string} location The slug of the location to look up.
     * @returns {object} Deferred promise. If it resolves, JSON response from
     *  the API of a specific NYPL locations. If it is rejected, an error
     *  message is returned saying that it "Could not reach API".
     * @example
     *  nyplLocationsService.singleLocation('schwarzman')
     *    .then(function (data) {
     *      var location = data.location;
     *    });
     *    .catch(function (error) {
     *      // error = "Could not reach API"
     *    });
     */
    locationsApi.singleLocation = function (location) {
        var defer = $q.defer();

        $http.get(api + '/locations/' + location, {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    locationsApi.allDivisions = function () {
        var defer = $q.defer();

        $http.get(api + '/divisions', {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    /** @function nyplLocationsService.singleDivision
     * @param {string} division The slug of the division to look up.
     * @returns {object} Deferred promise. If it resolves, JSON response from
     *  the API of an NYPL Division. If it is rejected, an error
     *  message is returned saying that it "Could not reach API".
     * @example
     *  nyplLocationsService.singleLocation('map-division')
     *    .then(function (data) {
     *      var division = data.division;
     *    });
     *    .catch(function (error) {
     *      // error = "Could not reach API"
     *    });
     */
    locationsApi.singleDivision = function (division) {
        var defer = $q.defer();

        $http.get(api + '/divisions/' + division, {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    /** @function nyplLocationsService.amenities
     * @param {string} [amenity] The id of the amenity to look up.
     * @returns {object} Deferred promise. If it resolves, JSON response from
     *  the API. If no param was passed, it will return all the amenities at 
     *  NYPL. If the param was passed, it will return a list of all the NYPL
     *  locations where the amenity passed is available. If it is rejected,
     *  an error message is returned saying that it "Could not reach API".
     * @example
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
     */
    locationsApi.amenities = function (amenity) {
        var defer = $q.defer(),
            url = !amenity ? '/amenities' : '/amenities/' + amenity;

        $http.get(api + url, {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    /** @function nyplLocationsService.amenitiesAtLibrary
     * @param {string} location The slug of the location to look up
     *  all amenities available at that location.
     * @returns {object} Deferred promise. If it resolves, JSON response from
     *  the API of all amenities available at the location. If it is rejected,
     *  an error message is returned saying that it "Could not reach API".
     * @example
     *  nyplLocationsService.amenitiesAtLibrary('115th-street')
     *    .then(function (data) {
     *      var location = data.location;
     *    });
     *    .catch(function (error) {
     *      // error = "Could not reach API"
     *    });
     */
    locationsApi.amenitiesAtLibrary = function (location) {
        var defer = $q.defer();

        // Not currently using /locations/:location/amenities
        $http.get(api + '/locations/' + location, {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    /** @function nyplLocationsService.alerts
     * @returns {object} Deferred promise. If it resolves, JSON response from
     *  the API of alerts that display site-wide.
     * @example
     *  nyplLocationsService.alerts()
     *    .then(function (data) {
     *      var amenities = data.alerts;
     *    });
     *    .catch(function (error) {
     *      // error = "Could not reach API"
     *    });
     */
    locationsApi.alerts = function () {
        var defer = $q.defer();

        $http.get(api + '/alerts', {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    return locationsApi;
}


angular
    .module('locationService', [])
    .factory('nyplLocationsService', nyplLocationsService);
