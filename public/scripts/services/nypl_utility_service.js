'use strict';

// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
nypl_locations.factory('requestNotificationChannel', ['$rootScope', function($rootScope){
  // private notification messages
  var _START_REQUEST_ = '_START_REQUEST_';
  var _END_REQUEST_ = '_END_REQUEST_';

  // publish start request notification
  var requestStarted = function() {
    $rootScope.$broadcast(_START_REQUEST_);
  };
  // publish end request notification
  var requestEnded = function() {
    $rootScope.$broadcast(_END_REQUEST_);
  };
  // subscribe to start request notification
  var onRequestStarted = function($scope, handler){
    $scope.$on(_START_REQUEST_, function(event){
      handler();
    });
  };
  // subscribe to end request notification
  var onRequestEnded = function($scope, handler){
    $scope.$on(_END_REQUEST_, function(event){
      handler();
    });
  };

  return {
    requestStarted:  requestStarted,
    requestEnded: requestEnded,
    onRequestStarted: onRequestStarted,
    onRequestEnded: onRequestEnded
  };
}]);

nypl_locations.factory('nypl_utility', function () {
  
  return {
    hoursToday: function (hours) {
      var date = new Date(),
          today = date.getDay(),
          hoursToday = {
            'today': hours.regular[today].day,
            'open': hours.regular[today].open,
            'close': hours.regular[today].close
          };

      return hoursToday;
    },

    getAddressString: function (location) {
      var locationAddress = location.street_address + " " + 
                            location.locality + ", " + 
                            location.region + ", " + 
                            location.postal_code;

      return locationAddress;
    }

  }

});
