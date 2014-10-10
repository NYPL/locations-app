(function () {
  'use strict';

  function WidgetCtrl(
    $rootScope,
    $scope,
    $timeout,
    data,
    nyplUtility,
    $location,
    nyplCoordinatesService
  ) {
    var url = 'http://locations-beta.nypl.org',
      loadUserCoordinates = function () {
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

    $rootScope.title = data.name;
    $scope.data = data;
    $scope.locinator_url = url + $location.path().substr(7);

    if (data._embedded.location) {
      $scope.division = true;
      $scope.data.images.exterior = data.images.interior;
    }

    // Do we want this in the widget??
    // loadUserCoordinates();

    if (data.hours) {
        $scope.hoursToday = nyplUtility.hoursToday(data.hours);
    }

    $scope.data.social_media =
      nyplUtility.socialMediaColor($scope.data.social_media);

    // Used for the Get Directions link to Google Maps
    $scope.locationDest = nyplUtility.getAddressString(data);
  }

  angular
    .module('nypl_widget')
    .controller('WidgetCtrl', WidgetCtrl);
})();
