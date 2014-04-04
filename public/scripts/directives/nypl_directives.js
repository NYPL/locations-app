'use strict';
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
// declare the directive that will show and hide the loading widget
nypl_locations.directive('loadingWidget', ['requestNotificationChannel', function (requestNotificationChannel) {
  return {
    restrict: "A",
    link: function (scope, element) {
      // hide the element initially
      element.hide();

      var startRequestHandler = function() {
        // got the request start notification, show the element
        element.show();
      };

      var endRequestHandler = function() {
        // got the request start notification, show the element
        element.hide();
      };
      // register for the request start notification
      requestNotificationChannel.onRequestStarted(scope, startRequestHandler);
      // register for the request end notification
      requestNotificationChannel.onRequestEnded(scope, endRequestHandler);
    }
  };
}]);
