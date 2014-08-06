/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations, angular */

// Load all the amenities available.
function AmenitiesCtrl($rootScope, $scope, amenities, breadcrumbs) {
    'use strict';
    var homeUrl;

    $rootScope.title = "Amenities";
    $scope.amenities = amenities.services;

    // Inserts into beginning of breadcrumbs
    homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
    breadcrumbs.breadcrumbs.unshift(homeUrl);
    $scope.breadcrumbs = breadcrumbs;
}

// Load an amenity and list all the locations
// where the amenity can be found.
function AmenityCtrl($rootScope, $scope, amenity, breadcrumbs) {
    'use strict';
    var homeUrl;

    $rootScope.title = amenity.service.name;
    $scope.amenity = amenity.service;
    $scope.locations = amenity.locations;
    $scope.amenity_name = amenity.service.name;

    // Inserts into beginning of breadcrumbs
    homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
    breadcrumbs.options = { 'Service': amenity.service.name };
    breadcrumbs.breadcrumbs[1].path = "#/amenities";
    breadcrumbs.breadcrumbs.unshift(homeUrl);
    $scope.breadcrumbs = breadcrumbs;
}

// Load one location and list all the amenities found in that location.
function AmenitiesAtLibraryCtrl($http, $rootScope, $scope, breadcrumbs, location, nypl_amenities) {
    'use strict';

    var homeUrl, amenities;

    // Mocked data for now until the amenities are sorted by categories in the API.
    $http
        .get('json/amenitiesAtLibrary.json')
        .success(function (data) {
            amenities =
                nypl_amenities.add_category_icon(data.amenitiesCategories);
            $scope.amenitiesCategories = amenities;
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
    .controller('AmenityCtrl', AmenityCtrl)
    .controller('AmenitiesCtrl', AmenitiesCtrl)
    .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
