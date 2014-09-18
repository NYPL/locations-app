/*jslint indent: 2, maxlen: 80 */
/*globals nypl_locations, angular */

(function () {
  'use strict';

  /** @namespace nyplCoordinatesService */
  function nyplCoordinatesService($q, $window) {
    var geoCoords = null,
      coordinatesService = {};

    /** @function nyplCoordinatesServce.geolocationAvailable
     * @returns {boolean} True if navigator and navigator.geolocation are
     *  available in the browser, false otherwise.
     */
    coordinatesService.geolocationAvailable = function () {
      return (!$window.navigator && !$window.navigator.geolocation) ?
          false :
          true;
    };

    /** @function nyplCoordinatesServce.getBrowserCoordinates
     * @returns {object} Deferred promise. If it resolves, it will return an
     *  object with the user's current position as latitude and longitude
     *  properties. If it is rejected, it will return an error message based
     *  on what kind of error occurred.
     * @example
     *  nyplCoordinatesService.getBrowserCoordinates()
     *    .then(function (position) {
     *      var userCoords = _.pick(position, 'latitude', 'longitude');
     *    })
     *    .catch(function (error) {
     *      throw error;
     *    });
     */
    coordinatesService.getBrowserCoordinates = function () {
      // Object containing success/failure conditions
      var defer = $q.defer();

      // Verify the browser supports Geolocation
      if (!this.geolocationAvailable()) {
        defer.reject(new Error("Your browser does not support Geolocation."));
      } else {
        // Use stored coords, FF bug fix
        // if (geoCoords) {
        //   defer.resolve(geoCoords);
        // } else {
        $window.navigator.geolocation.getCurrentPosition(
          function (position) {
            // Extract coordinates for geoPosition obj
            geoCoords = position.coords;
            defer.resolve(geoCoords);

            // Testing a user's location that is more than 
            // 25miles of any NYPL location
            // var coords = {
            //     'latitude': 42.3581,
            //     'longitude': -71.0636
            // }
            // defer.resolve(coords);
          },
          function (error) {
            switch (error.code) {
            case error.PERMISSION_DENIED:
              defer.reject(new Error("Permission denied."));
              break;

            case error.POSITION_UNAVAILABLE:
              defer.reject(new Error("The position is currently unavailable."));
              break;

            case error.TIMEOUT:
              defer.reject(new Error("The request timed out."));
              break;

            default:
              defer.reject(new Error("Unknown error."));
              break;
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 600000
          }
        );
        // }
      }

      return defer.promise; // Enables 'then' callback
    };

    /** @function nyplCoordinatesServce.getDistance
     * @param {number} lat1 Latitude of first location.
     * @param {number} lon1 Longitude of first location.
     * @param {number} lat2 Latitude of second location.
     * @param {number} lon2 Longitude of second location.
     * @returns {number} Distance in miles between two different locations.
     * @example
     *  var distance =
     *    nyplCoordinatesService.getDistance(40.1, -73.1, 41.1, -73.2);
     */
    coordinatesService.getDistance = function (lat1, lon1, lat2, lon2) {
      if (!lat1 || !lon2 || !lat2 || !lon2) {
        return undefined;
      }

      var radlat1 = Math.PI * lat1 / 180,
        radlat2 = Math.PI * lat2 / 180,
        theta = lon1 - lon2,
        radtheta = Math.PI * theta / 180,
        distance;

      distance = Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      distance = Math.acos(distance);
      distance = distance * 180 / Math.PI;
      distance = distance * 60 * 1.1515;
      return Math.ceil(distance * 100) / 100;
    };

    return coordinatesService;
  }

  angular
    .module('coordinateService', [])
    .factory('nyplCoordinatesService', nyplCoordinatesService);

})();

