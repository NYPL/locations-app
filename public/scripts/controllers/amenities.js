/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations, angular */

(function () {
    'use strict';

    // Load all the amenities available.
    function AmenitiesCtrl($http, $rootScope, $scope, amenities, nyplAmenities) {
        // Mocked data for now until the amenities are sorted
        // by categories in the API.
        $http
            .get('json/amenitiesAtLibrary.json')
            .success(function (data) {
                $scope.amenitiesCategories =
                    nyplAmenities.addCategoryIcon(data.amenities);
            });

        $rootScope.title = "Amenities";
        $scope.amenities = amenities.amenities;
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
        $http
            .get('json/amenitiesAtLibrary.json')
            .success(function (data) {
                $scope.amenitiesCategories =
                    nyplAmenities.addCategoryIcon(data.amenities);
            });

        $rootScope.title = location.name;
        $scope.location = location;
    }

    angular
        .module('nypl_locations')
        .controller('AmenityCtrl', AmenityCtrl)
        .controller('AmenitiesCtrl', AmenitiesCtrl)
        .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
})();
