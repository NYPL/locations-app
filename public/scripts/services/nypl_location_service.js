/*jslint indent: 4, maxlen: 80 */
/*globals angular */
angular.module(
    'locationService',
    ['ngResource']
).factory('nypl_locations_service', function ($http, $q) {
    'use strict';
    var api = 'http://evening-mesa-7447-160.herokuapp.com';
    var apiError = "Could not reach API";

    return {
        all_locations: function () {
            var d = $q.defer();

            $http.get(
                api + '/locations',
                {cache: true}
            ).success(function (data) {
                d.resolve(data);
            }).error(function () {
                d.reject(apiError);
            });
            return d.promise;
        },

        single_location: function (symbol) {
            var defer = $q.defer();

            $http.get(
                api + '/locations/' + symbol,
                {cache: true}
            ).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                defer.reject(apiError);
            });
            return defer.promise;
        },

        single_division: function (division) {
            var defer = $q.defer();

            $http.get(
                api + '/divisions/' + division,
                {cache: true}
            ).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                defer.reject(apiError);
            });
            return defer.promise;
        },

        services: function () {
            var defer = $q.defer();

            $http.get(
                api + '/services',
                {cache: true}
            ).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                defer.reject(apiError);
            });
            return defer.promise;
        },

        one_service: function (symbol) {
            var defer = $q.defer();

            $http.get(
                api + '/services/' + symbol,
                {cache: true}
            ).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                defer.reject(apiError);
            });
            return defer.promise;
        },

        services_at_library: function (symbol) {
            var defer = $q.defer();

            $http.get(
                api + '/locations/' + symbol + '/services',
                {cache: true}
            ).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                defer.reject(apiError);
            });
            return defer.promise;
        }

    };
});
