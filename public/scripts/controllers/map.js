nypl_locations.controller('mapCtrl', function ($scope, $routeParams, nypl_locations_service, nypl_geocoder_service, nypl_coordinates_service) {

  // Display all branches regardless of user's location
  nypl_locations_service.single_location($routeParams.symbol).get(function (data) {
    $scope.location = data.location;
    var locationCoords = _.pick(data.location, 'lat', 'long');

    var today = new Date();
    $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = $scope.days[today.getDay()];  
    
    $scope.hoursToday = {
      'open': data.location.hours[day].open,
      'close': data.location.hours[day].close
    }

    nypl_geocoder_service.draw_map(locationCoords);
    nypl_geocoder_service.draw_marker(locationCoords);
    
  });

});
