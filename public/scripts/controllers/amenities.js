/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations, angular */

(function () {
    'use strict';

    function AmenitiesCtrl($rootScope, $scope, amenities, nyplAmenities) {
        $rootScope.title = "Amenities";
        $scope.amenitiesCategories =
            nyplAmenities.addCategoryIcon(amenities.amenities);
    }

    // Load an amenity and list all the locations
    // where the amenity can be found.
    function AmenityCtrl($rootScope, $scope, amenity) {
        var name = amenity.amenity.name;

        $rootScope.title = name;
        $scope.amenity = amenity.amenity;
        $scope.locations = amenity.locations;
        $scope.amenity_name = name;
    }

    // Load one location and list all the amenities found in that location.
    function AmenitiesAtLibraryCtrl($http, $rootScope, $scope, location, nyplAmenities) {
        // Temporary until all the locations have proper data
        if (!location._embedded.amenities.length) {
            $http
                .get('json/amenitiesAtLibrary.json')
                .success(function (data) {
                    $scope.amenitiesCategories =
                        nyplAmenities.addCategoryIcon(data.amenities);
                });
        } else {
            $scope.amenitiesCategories =
                nyplAmenities.addCategoryIcon(location._embedded.amenities);
        }

        $rootScope.title = location.name;
        $scope.location = location;
    }

    angular
        .module('nypl_locations')
        .controller('AmenityCtrl', AmenityCtrl)
        .controller('AmenitiesCtrl', AmenitiesCtrl)
        .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
})();
