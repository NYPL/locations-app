'use strict';
nyplLocationApp.factory('nypl_coordinates_service', ['$q', '$window', '$rootScope', function($q, $window, $rootScope) {

  return {
    // Geolocation extraction of coordinates
    getCoordinates: function() {
      var defer = $q.defer(); // Object containing success/failure conditions
        
        // Verify the browser supports Geolocation
       if(!$window.navigator) {
          $rootScope.$apply( function() { 
            defer.reject(new Error ("Your browser does not support Geolocation"));
          });
       }
       else {
        $window.navigator.geolocation.getCurrentPosition(function (position) {
          $rootScope.$apply( function() {
            defer.resolve(position.coords); // Extract coordinates for geoPosition obj
          });
        }, function (error) {
          $rootScope.$apply( function() {
            defer.reject(error);
          });
        });
       }
      return defer.promise; // Enables 'then' callback
    },
    // Calculate distance using 
    getDistance: function(lat1, lon1, lat2, lon2) {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var radlon1 = Math.PI * lon1/180;
      var radlon2 = Math.PI * lon2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var distance = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      distance = Math.acos(distance);
      distance = distance * 180/Math.PI;
      distance = distance * 60 * 1.1515;
      return Math.ceil(distance * 100)/100;
    }
  }
}]);