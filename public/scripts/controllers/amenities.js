/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations, angular */

// Load all the amenities available.
function AmenitiesCtrl($scope, $rootScope, breadcrumbs, amenities) {
    'use strict';
    var homeUrl;

    $rootScope.title = "Amenities";
    $scope.amenities = amenities;

    // Inserts into beginning of breadcrumbs
    homeUrl = { label: 'Home', path: 'http://www.nypl.org' };
    breadcrumbs.breadcrumbs.unshift(homeUrl);
    $scope.breadcrumbs = breadcrumbs;
}

// Load an amenity and list all the locations
// where the amenity can be found.
function AmenityCtrl($scope, $rootScope, breadcrumbs, amenity) {
    'use strict';
    var homeUrl;

    console.log(amenity);

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
    .controller('AmenitiesCtrl', AmenitiesCtrl)
    .controller('AmenityCtrl', AmenityCtrl)
    .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
