/*jslint indent: 2, maxlen: 80 */
/*global nypl_locations, angular */

(function () {
  'use strict';

  function AmenitiesCtrl($rootScope, $scope, amenities, config, nyplAmenities) {
    $rootScope.title = "Amenities";

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(amenities.amenities);
  }

  // Load an amenity and list all the locations
  // where the amenity can be found.
  function AmenityCtrl($rootScope, $scope, amenity, config) {
    var amenityProper = amenity.amenity;
    var name = amenityProper.name;

    $rootScope.title = name;
    $scope.amenity = amenityProper;
    $scope.locations = amenityProper._embedded.locations;
    $scope.amenity_name = name;
  }

  // Load one location and list all the amenities found in that location.
  function AmenitiesAtLibraryCtrl($http, $rootScope, $scope, config, location, nyplAmenities) {
    var updatedAmenities;

    // Temporary until all the locations have proper data
    if (!location._embedded.amenities.length) {
      $http
        .get('json/amenitiesAtLibrary.json')
        .success(function (data) {
          $scope.amenitiesCategories =
            nyplAmenities.createAmenitiesCategories(data.amenities);
        });
    } else {
      updatedAmenities = nyplAmenities.allAmenitiesArray(location._embedded.amenities);

      $scope.amenitiesCategories =
        nyplAmenities.createAmenitiesCategories(updatedAmenities);
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
