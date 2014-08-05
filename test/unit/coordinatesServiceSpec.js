/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL CoordinateService Module', function () {
  'use strict';

  /* 
  * nypl_coordinates_service
  * Service that retrieves a browser's current location 
  * and coordinate distance utility method.
  */
  describe('nypl_coordinates_service', function () {
    var nypl_coordinates_service;

    beforeEach(function () {
      // load the module.
      module('coordinateService');

      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_coordinates_service_) {
        nypl_coordinates_service = _nypl_coordinates_service_;
      });
    });

    /* 
    * nypl_coordinates_service.getDistance(lat1, lon1, lat2, lon2)
    *   lat1: Latitude of the first point
    *   lon1: Longitude of the first point
    *   lat2: Latitude of the second point
    *   lon2: Longitude of the second point
    *
    *   Returns the distance, in miles, between two geographical
    *   points based on their coordinates.
    */
    describe('nypl_coordinates_service.getDistance', function () {
      // check to see if it has the expected function
      it('should have a getDistance() function', function () {
        expect(angular.isFunction(nypl_coordinates_service.getDistance))
          .toBe(true);
      });

      // check to see if it has the expected function
      it('should calculate the distance from Schwarzman Bldg to ' +
        ' 58th Street Library',
        function () {
          var result =
            nypl_coordinates_service
            .getDistance(40.75298660000001, -73.9821364, 40.7619, -73.9691);
          expect(result).toBe(0.92);
          expect(result).not.toBe(null);
        });
    });

    /*
    * nypl_coordinates_service.checkGeolocation()
    *
    * Returns true if navigator and geolocation are available on the
    * browser, false otherwise.
    */
    describe('nypl_coordinates_service.checkGeolocation', function () {
      it('should have a checkGeolocation function', function () {
        // The checkGeolocation function checks to see
        // if geolocation is available on the user's browser
        expect(angular.isFunction(nypl_coordinates_service.checkGeolocation))
          .toBe(true);
      });

      it('should return false due to old browser', function () {
        // Old browsers don't have the navigator api
        window.navigator = false;
        window.navigator.geolocation = false;

        expect(nypl_coordinates_service.checkGeolocation()).toBe(false);
      });

      it('should return true for modern browsers', function () {
        // Modern browsers have the navigator api
        window.navigator = true;
        window.navigator.geolocation = true;

        expect(nypl_coordinates_service.checkGeolocation()).toBe(true);
      });
    });

    /*
    * nypl_coordinates_service.getCoordinates()
    *
    * Returns an object with the coordinates of the user's current location.
    */
    describe('nypl_coordinates_service.getCoordinates', function () {
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
        expect(angular.isFunction(nypl_coordinates_service.getCoordinates))
          .toBe(true);
        expect(typeof nypl_coordinates_service.getCoordinates).toBe('function');
      });

      describe('getCoordinates function successful', function () {
        beforeEach(function () {
          geolocationMock.getCurrentPosition =
              window.navigator.geolocation.getCurrentPosition =
                jasmine.createSpy('getCurrentPosition')
                .and.callFake(geolocationOk);
        });

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service',
          function () {
            nypl_coordinates_service.getCoordinates();
            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
          });

        it('Should return a promise', function () {
          var promise = nypl_coordinates_service.getCoordinates();
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

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service',
          function () {
            nypl_coordinates_service.getCoordinates();
            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
          });
      });

    });
  }); /* End nypl_coordinates_service */
});