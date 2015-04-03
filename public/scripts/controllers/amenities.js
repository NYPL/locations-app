/*jslint indent: 2, maxlen: 80 */
/*global nypl_locations, angular */

(function () {
  'use strict';

  function AmenitiesCtrl($rootScope, $scope, amenities, config, nyplAmenities) {
    $rootScope.title = "Amenities";

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(amenities.amenities);
  }
  AmenitiesCtrl.$inject = ["$rootScope", "$scope", "amenities",
    "config", "nyplAmenities"];

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
  AmenityCtrl.$inject = ["$rootScope", "$scope", "amenity", "config"];

  // Load one location and list all the amenities found in that location.
  function AmenitiesAtLibraryCtrl($rootScope, $scope, config, location, nyplAmenities) {
    var updatedAmenities =
      nyplAmenities.allAmenitiesArray(location._embedded.amenities);

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(updatedAmenities);

    $rootScope.title = location.name;
    $scope.location = location;
  }
  AmenitiesAtLibraryCtrl.$inject = ["$rootScope", "$scope", "config",
    "location", "nyplAmenities"];

  angular
    .module('nypl_locations')
    .controller('AmenityCtrl', AmenityCtrl)
    .controller('AmenitiesCtrl', AmenitiesCtrl)
    .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
})();
