/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

/* 
 * coordinateService is an NYPL AngularJS Module that checks if a user's
 * browser can use geolocation, computes the user's geolocation, and computes
 * the distance between two coordinate points.
 */

describe('NYPL CoordinateService Module', function () {
  'use strict';

  /* 
   * nyplCoordinatesService
   * AngularJS Service that retrieves a browser's current location 
   * and coordinate distance utility method.
   */
  describe('nyplCoordinatesService', function () {
    var nyplCoordinatesService;

    beforeEach(function () {
      // load the module.
      module('coordinateService');

      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nyplCoordinatesService_) {
        nyplCoordinatesService = _nyplCoordinatesService_;
      });
    });

    /*
     * nyplCoordinatesService.checkGeolocation()
     *
     * Returns true if navigator and geolocation are available on the
     * browser, false otherwise.
     */
    describe('nyplCoordinatesService.checkGeolocation', function () {
      it('should have a checkGeolocation function', function () {
        expect(angular.isFunction(nyplCoordinatesService.checkGeolocation))
          .toBe(true);
      });

      it('should return false due to old browser', function () {
        // Old browsers don't have the navigator api
        window.navigator = false;
        window.navigator.geolocation = false;

        expect(nyplCoordinatesService.checkGeolocation()).toBe(false);
      });

      it('should return true for modern browsers', function () {
        // Modern browsers have the navigator api
        window.navigator = true;
        window.navigator.geolocation = true;

        expect(nyplCoordinatesService.checkGeolocation()).toBe(true);
      });
    });

    /*
     * nyplCoordinatesService.getCoordinates()
     *
     * Returns an object with the coordinates of the user's current location.
     */
    describe('nyplCoordinatesService.getCoordinates', function () {
      var geolocationMock, geolocationOk, geolocationError, scope;

      beforeEach(inject(function (_$rootScope_) {
        scope = _$rootScope_.$new();
        window.navigator = jasmine.createSpy('navigator');
        geolocationMock =
          window.navigator.geolocation = jasmine.createSpy('geolocation');

        geolocationOk = function (params, callback) {
          callback({
            position: {
              coords: {
                latitude: 40.75298660000001,
                longitude: -73.9821364
              }
            }
          });
        };

        geolocationError = function (params, callback) {
          callback({
            error: "Your browser does not support Geolocation"
          });
        };
      }));

      // check to see if it has the expected function
      it('should have an getCoordinates function', function () {
        expect(angular.isFunction(nyplCoordinatesService.getCoordinates))
          .toBe(true);
        expect(typeof nyplCoordinatesService.getCoordinates).toBe('function');
      });

      describe('getCoordinates function successful', function () {
        beforeEach(function () {
          geolocationMock.getCurrentPosition =
              window.navigator.geolocation.getCurrentPosition =
                jasmine.createSpy('getCurrentPosition')
                .and.callFake(geolocationOk);
        });

        it('should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('should call the browser\'s geolocation function when ' +
          'calling the service',
          function () {
            nyplCoordinatesService.getCoordinates();
            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
          });

        it('should return a promise', function () {
          var promise = nyplCoordinatesService.getCoordinates();
          expect(typeof promise.then).toBe('function');
        });

      });

      describe('getCoordinates function fails', function () {
        beforeEach(function () {
          geolocationMock.getCurrentPosition =
            window.navigator.geolocation.getCurrentPosition =
              jasmine.createSpy('getCurrentPosition')
              .and.callFake(geolocationError);
        });

        it('should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('should call the geolocation function when calling the service',
          function () {
            nyplCoordinatesService.getCoordinates();
            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
          });
      });
    });

    /* 
     * nyplCoordinatesService.getDistance(lat1, lon1, lat2, lon2)
     *   lat1: Latitude of the first point
     *   lon1: Longitude of the first point
     *   lat2: Latitude of the second point
     *   lon2: Longitude of the second point
     *
     *   Returns the distance, in miles, between two geographical
     *   points based on their coordinates.
     */
    describe('nyplCoordinatesService.getDistance', function () {
      // check to see if it has the expected function
      it('should have a getDistance() function', function () {
        expect(angular.isFunction(nyplCoordinatesService.getDistance))
          .toBe(true);
      });

      // check to see if it has the expected function
      it('should calculate the distance from Schwarzman Bldg to ' +
        '58th Street Library',
        function () {
          var location1 = {lat: 40.75298660000001, lon: -73.9821364},
            location2 = {lat: 40.7619, lon: -73.9691},
            result =
              nyplCoordinatesService.getDistance(40.75298660000001, -73.9821364, 40.7619, -73.9691);

          expect(result).toBe(0.92);
          expect(result).not.toBe(null);
        });
    });

  }); /* End nyplCoordinatesService */
});