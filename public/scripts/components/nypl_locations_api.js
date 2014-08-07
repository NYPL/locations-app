/*jslint indent: 4, maxlen: 80 */
/*globals angular */

function nypLocationsApi($http, $q) {
    'use strict';

    var api = 'http://evening-mesa-7447-160.herokuapp.com',
        apiError = "Could not reach API",
        locationsApi = {};

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

    // All amenities at NYPL
    locationsApi.amenities = function (amenity) {
        var defer = $q.defer(),
            url = !amenity ? '/services' : '/services/' + amenity; 

        $http.get(api + url, {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    // All amenities at one location
    locationsApi.amenitiesAtLibrary = function (location) {
        var defer = $q.defer();

        $http.get(api + '/locations/' + location + '/services', {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

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
    .factory('nyplLocationsService', nypLocationsApi);
