nypl_locations.controller('mapCtrl', function ($scope, $routeParams, nypl_locations_service, nypl_geocoder_service, nypl_coordinates_service) {

  // Display all branches regardless of user's location
  nypl_locations_service.single_location($routeParams.symbol).get(function (data) {
    $scope.location = data.location;

    var date = new Date();
    var today = date.getDay();  
    
    $scope.hoursToday = {
      'today': data.location.hours.regular[today].day,
      'open': data.location.hours.regular[today].open,
      'close': data.location.hours.regular[today].close
    };

    var locationCoords = {
      'lat': data.location.geolocation.coordinates[1],
      'long': data.location.geolocation.coordinates[0]
    };

    nypl_geocoder_service.draw_map(locationCoords, 15, 'individual-map');
    nypl_geocoder_service.draw_marker(data.location, 'drop', true);
    
  });

});
