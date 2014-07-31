/*jslint indent: 4, maxlen: 80 */
/*globals angular */

function nypl_locations_api($http, $q) {
    'use strict';

    var api = 'http://evening-mesa-7447-160.herokuapp.com',
        apiError = "Could not reach API",
        locations_api = {};

    locations_api.all_locations = function () {
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

    locations_api.single_location = function (symbol) {
        var defer = $q.defer();

        $http.get(api + '/locations/' + symbol, {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    locations_api.single_division = function (division) {
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

    locations_api.services = function () {
        var defer = $q.defer();

        $http.get(api + '/services', {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    locations_api.one_service = function (symbol) {
        var defer = $q.defer();

        $http.get(api + '/services/' + symbol, {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    locations_api.amenities_at_library = function (symbol) {
        var defer = $q.defer();

        $http.get(api + '/locations/' + symbol + '/services', {cache: true})
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function () {
                defer.reject(apiError);
            });
        return defer.promise;
    };

    locations_api.alerts = function () {
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

    return locations_api;
}


angular
    .module('locationService', [])
    .factory('nypl_locations_service', nypl_locations_api);
