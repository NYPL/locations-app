/*jslint indent: 4, maxlen: 80 */
/*globals angular */
angular.module(
    'locationService',
    ['ngResource']
).factory('nypl_locations_service', function ($http, $q) {
    'use strict';
    var api = 'http://evening-mesa-7447-160.herokuapp.com/locations';

    return {
        all_locations: function () {
            var d = $q.defer();

            $http.get(
                api, 
                {cache: true}
            ).success(function (data) {
                d.resolve(data);
            }).error(function () {
                d.reject();
            });
            return d.promise;
        },

        single_location: function (symbol) {
            var defer = $q.defer();

            $http.get(
                api + '/' + symbol,
                {cache: true}
            ).success(function (data) {
                defer.resolve(data);
            }).error(function () {
                defer.reject();
            });
            return defer.promise;
        }
    };
});
