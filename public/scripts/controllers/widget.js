(function () {
  'use strict';

  function WidgetCtrl(
    $rootScope,
    $scope,
    $timeout,
    location,
    nyplUtility,
    nyplCoordinatesService
  ) {
    var loadUserCoordinates = function () {
      return nyplCoordinatesService
        .getBrowserCoordinates()
        .then(function (position) {
          var userCoords =
            _.pick(position, 'latitude', 'longitude');

          // Needed to update async var on geolocation success
          $timeout(function () {
            $scope.locationStart = userCoords.latitude +
              "," + userCoords.longitude;
          });
        });
    };

    $rootScope.title = location.name;
    $scope.location = location;

    // Do we want this in the widget??
    // loadUserCoordinates();

    if (location.hours) {
        $scope.hoursToday = nyplUtility.hoursToday(location.hours);
    }

    $scope.location.social_media =
      nyplUtility.socialMediaColor($scope.location.social_media);

    // Used for the Get Directions link to Google Maps
    $scope.locationDest = nyplUtility.getAddressString(location);
  }

  angular
    .module('nypl_widget')
    .controller('WidgetCtrl', WidgetCtrl);
})();
