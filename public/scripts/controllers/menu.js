'use strict';

nypl_locations.controller('MenuCtrl', function ($scope, $rootScope, nypl_geocoder_service, nypl_locations_service, nypl_coordinates_service, $window) {

  var userCoords = {},
      locations;

  nypl_locations_service.all_locations().get(function (data) {
    locations = data.locations;
    $scope.locations = _.first(locations, 3);
  });

  $scope.submitAddress = function (address) {
    nypl_geocoder_service.geocoder(address).then(function (coords) {
      orderLocations(coords);

    }, function (error) { // error callback
      console.log("Failed: " + error);
    });
  };

  // Extract user coordinates
  nypl_coordinates_service.getCoordinates().then(function (position) {
    userCoords.lat = position.latitude;
    userCoords.long = position.longitude;

    nypl_geocoder_service.geocoder({lat: userCoords.lat, lng: userCoords.long}).then(function (zipcode) {
      $scope.zipcode = zipcode;
    });

    orderLocations(userCoords);
  }, function (error) {
    $scope.errors = error;
  });

  function orderLocations(coords) {
    _.each(locations, function (location) {
      location.distance =  nypl_coordinates_service.getDistance(coords.lat, coords.long, location.lat, location.long);
    });

    locations = _.sortBy(locations, function (location) {
      return location.distance;
    });

    $scope.locations = _.first(locations, 3);
  }

});

