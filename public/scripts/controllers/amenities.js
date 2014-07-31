/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations, angular */

// Load all the services available.
nypl_locations.controller('ServicesCtrl', [
    '$scope',
    '$rootScope',
    'nypl_locations_service',
    'breadcrumbs',
    function (
        $scope,
        $rootScope,
        nypl_locations_service,
        breadcrumbs
    ) {
        'use strict';
        var services,
            homeUrl,
            loadServices = function () {
                return nypl_locations_service
                    .services()
                    .then(function (data) {
                        services = data.services;
                        $scope.services = services;
                    });
            };

        $rootScope.title = "Services";

        // Inserts into beginning of breadcrumbs
        homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
        breadcrumbs.breadcrumbs.unshift(homeUrl);
        $scope.breadcrumbs = breadcrumbs;

        loadServices();
    }
]);

// Load one service and list all the locations
// where the service can be found.
nypl_locations.controller('OneServiceCtrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    'nypl_locations_service',
    'breadcrumbs',
    function (
        $scope,
        $routeParams,
        $rootScope,
        nypl_locations_service,
        breadcrumbs
    ) {
        'use strict';
        var service,
            locations,
            homeUrl,
            loadOneService = function () {
                return nypl_locations_service
                    .one_service($routeParams.amenities_id)
                    .then(function (data) {
                        service = data.service;
                        locations = data.locations;

                        $rootScope.title = service.name;
                        $scope.service = service;
                        $scope.locations = locations;
                        $scope.service_name = service.name;

                        // Inserts into beginning of breadcrumbs
                        homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
                        breadcrumbs.options = { 'Service': service.name };
                        breadcrumbs.breadcrumbs[1].path = "#/amenities";
                        breadcrumbs.breadcrumbs.unshift(homeUrl);
                        $scope.breadcrumbs = breadcrumbs;
                    });
            };

        loadOneService();
    }
]);

// Load one location and list all the amenities found in that location.
function AmenitiesAtLibraryCtrl($scope, $rootScope, breadcrumbs, location, $http) {
    'use strict';

    var homeUrl;

    $http
        .get('json/amenitiesAtLibrary.json')
        .success(function (data) {
            $scope.amenitiesCategories = data.amenitiesCategories;
            // console.log($scope.amenitiesCategories);
        });

    $rootScope.title = location.name;
    $scope.location = location;

    // Inserts into beginning of breadcrumbs
    homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
    breadcrumbs.options = { 'Location': location.name };
    breadcrumbs.breadcrumbs[1].path = "#/amenities";
    breadcrumbs.breadcrumbs.unshift(homeUrl);
    $scope.breadcrumbs = breadcrumbs;
}

angular
    .module('nypl_locations')
    .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
