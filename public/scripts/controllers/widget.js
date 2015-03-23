(function () {
  'use strict';

  function WidgetCtrl(
    $location,
    $rootScope,
    $scope,
    $timeout,
    $window,
    config,
    data,
    nyplCoordinatesService,
    nyplUtility
  ) {
    // var loadUserCoordinates = function () {
    //   return nyplCoordinatesService
    //     .getBrowserCoordinates()
    //     .then(function (position) {
    //       var userCoords =
    //         _.pick(position, 'latitude', 'longitude');

    //       // Needed to update async var on geolocation success
    //       $timeout(function () {
    //         $scope.locationStart = userCoords.latitude +
    //           "," + userCoords.longitude;
    //       });
    //     });
    // };

    $rootScope.title = data.name;
    $scope.data = data;
    $scope.locinator_url = "http://www.nypl.org/locations" +
      $location.path().substr(7);
    $scope.widget_name = data.name;

    if (data._embedded.location) {
      $scope.division = true;
      $scope.data.images.exterior = data.images.interior;
    }

    if (config.closed_img) { 
      $scope.data.images.closed = config.closed_img;
    }

    // loadUserCoordinates();

    if (data.hours) {
        $scope.hoursToday = nyplUtility.hoursToday(data.hours);
    }

    $scope.data.social_media =
      nyplUtility.socialMediaColor($scope.data.social_media);

    // Used for the Get Directions link to Google Maps
    $scope.locationDest = nyplUtility.getAddressString(data);
  }
  WidgetCtrl.$inject = ["$location", "$rootScope", "$scope", "$timeout", "$window", "config", "data", "nyplCoordinatesService", "nyplUtility"];

  angular
    .module('nypl_widget')
    .controller('WidgetCtrl', WidgetCtrl);
})();
