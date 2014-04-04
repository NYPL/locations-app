nypl_locations.controller('mapCtrl', function ($scope, $routeParams, nypl_locations_service, nypl_geocoder_service, nypl_coordinates_service, nypl_utility) {

  // Display all branches regardless of user's location
  nypl_locations_service.single_location($routeParams.symbol).then(function (data) {
    var location = data.location;
    $scope.location = location;

    console.log(data.location);

    $scope.hoursToday = nypl_utility.hoursToday(location.hours);

    var locationCoords = {
      'lat': location.geolocation.coordinates[1],
      'long': location.geolocation.coordinates[0]
    };

    nypl_geocoder_service.draw_map(locationCoords, 15, 'individual-map');
    nypl_geocoder_service.draw_marker(location, 'drop', true);
    
    nypl_coordinates_service.getCoordinates().then(function (position) {
      var userCoords = _.pick(position, 'latitude', 'longitude');

      $scope.locationStart = userCoords.latitude + "," + userCoords.longitude;
    });
    
    $scope.locationDest = nypl_utility.getAddressString(location);
  });

});
