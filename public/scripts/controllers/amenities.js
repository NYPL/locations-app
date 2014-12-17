/*jslint indent: 2, maxlen: 80 */
/*global nypl_locations, angular */

(function () {
  'use strict';

  function AmenitiesCtrl($analytics, $rootScope, $scope, amenities, config, nyplAmenities) {
    $scope.$on('$viewContentLoaded', function (event) {
      $analytics.pageTrack('/locations' + $location.path());
    });

    $rootScope.title = "Amenities";

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(amenities.amenities);
  }

  // Load an amenity and list all the locations
  // where the amenity can be found.
  function AmenityCtrl($analytics, $rootScope, $scope, amenity, config) {
    $scope.$on('$viewContentLoaded', function (event) {
      $analytics.pageTrack('/locations' + $location.path());
    });
    var amenityProper = amenity.amenity;
    var name = amenityProper.name;

    $rootScope.title = name;
    $scope.amenity = amenityProper;
    $scope.locations = amenityProper._embedded.locations;
    $scope.amenity_name = name;
  }

  // Load one location and list all the amenities found in that location.
  function AmenitiesAtLibraryCtrl($analytics, $rootScope, $scope, config, location, nyplAmenities) {
    $scope.$on('$viewContentLoaded', function (event) {
      $analytics.pageTrack('/locations' + $location.path());
    });
    var updatedAmenities =
      nyplAmenities.allAmenitiesArray(location._embedded.amenities);

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(updatedAmenities);

    $rootScope.title = location.name;
    $scope.location = location;
  }

  angular
    .module('nypl_locations')
    .controller('AmenityCtrl', AmenityCtrl)
    .controller('AmenitiesCtrl', AmenitiesCtrl)
    .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
})();
