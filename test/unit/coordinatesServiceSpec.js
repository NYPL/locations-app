/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

/* 
 * coordinateService is an NYPL AngularJS Module that checks if geolocation is
 * available on the user's browser, computes the user's geolocation,
 * and computes the distance between two coordinate points.
 */

describe('NYPL CoordinateService Module', function () {
  'use strict';

  /* 
   * nyplCoordinatesService
   * AngularJS Service that checks for geolocation availability, retrieves a
   * browser's current location, and computes coordinate distance.
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
    describe('nyplCoordinatesService.checkGeolocation()', function () {
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
    }); /* End nyplCoordinatesService.checkGeolocation() */

    /*
     * nyplCoordinatesService.getCoordinates()
     *
     * Returns an object with the coordinates of the user's current location.
     * { latitude: 40.35, longitude: -73.98 }
     *
     * Returns an error on failure.
     */
    describe('nyplCoordinatesService.getCoordinates()', function () {
      var geolocationMock, $rootScope;

      beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
        window.navigator = jasmine.createSpy('navigator');
        geolocationMock =
          window.navigator.geolocation = jasmine.createSpy('geolocation');
      }));

      // check to see if it has the expected function
      it('should have an getCoordinates function', function () {
        expect(angular.isFunction(nyplCoordinatesService.getCoordinates))
          .toBe(true);
        expect(typeof nyplCoordinatesService.getCoordinates).toBe('function');
      });

      describe('getCoordinates function successful', function () {
        var geolocationOk;

        beforeEach(function () {
          geolocationOk = function () {
            var position = {
              // SASB's location
              coords: {
                latitude: 40.7528047,
                longitude: -73.98216959
              }
            };
            arguments[0](position);
          };
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

        it('should return an object with latitude and longitude properties',
          function () {
            var SASBLocation = {
                latitude: 40.7528047,
                longitude: -73.98216959
              },
              returned_coordinates;

            nyplCoordinatesService.getCoordinates().then(function (data) {
              returned_coordinates = data;
            });
            $rootScope.$digest();

            expect(returned_coordinates).toEqual(SASBLocation);
          });
      }); /* end getCoordinates function successful */

      describe('getCoordinates function fails', function () {
        describe('Permission denied', function () {
          it('should return an error message', function () {
            var permissionDenied = function () {
                var error = {
                  code : 1,
                  PERMISSION_DENIED: 1
                };
                arguments[1](error);
              },
              error_message = new Error('Permission denied.'),
              returned_error_message;

            geolocationMock.getCurrentPosition =
              window.navigator.geolocation.getCurrentPosition =
                jasmine.createSpy('getCurrentPosition')
                .and.callFake(permissionDenied);

            nyplCoordinatesService.getCoordinates()
              .catch(function (error) {
                returned_error_message = error;
              });
            $rootScope.$digest();

            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
            expect(returned_error_message).toEqual(error_message);
          });
        });

        describe('Position Unavailable', function () {
          it('should return an error message', function () {
            var positionUnavailable = function () {
                var error = {
                  code : 2,
                  POSITION_UNAVAILABLE: 2
                };
                arguments[1](error);
              },
              error_message =
                new Error('The position is currently unavailable.'),
              returned_error_message;

            geolocationMock.getCurrentPosition =
              window.navigator.geolocation.getCurrentPosition =
                jasmine.createSpy('getCurrentPosition')
                .and.callFake(positionUnavailable);

            nyplCoordinatesService.getCoordinates()
              .catch(function (error) {
                returned_error_message = error;
              });
            $rootScope.$digest();

            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
            expect(returned_error_message).toEqual(error_message);
          });
        });

        describe('Request timed out', function () {
          it('should return an error message', function () {
            var requestTimeOut = function () {
                var error = {
                  code : 3,
                  TIMEOUT: 3
                };
                arguments[1](error);
              },
              error_message = new Error('The request timed out.'),
              returned_error_message;
            geolocationMock.getCurrentPosition =
              window.navigator.geolocation.getCurrentPosition =
                jasmine.createSpy('getCurrentPosition')
                .and.callFake(requestTimeOut);

            nyplCoordinatesService.getCoordinates()
              .catch(function (error) {
                returned_error_message = error;
              });
            $rootScope.$digest();

            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
            expect(returned_error_message).toEqual(error_message);
          });
        });

        describe('Unknown error', function () {
          it('should return an error message', function () {
            var unknownError = function () {
                var error = { code : 4 };
                arguments[1](error);
              },
              error_message = new Error('Unknown error.'),
              returned_error_message;

            geolocationMock.getCurrentPosition =
              window.navigator.geolocation.getCurrentPosition =
                jasmine.createSpy('getCurrentPosition')
                .and.callFake(unknownError);

            nyplCoordinatesService.getCoordinates()
              .catch(function (error) {
                returned_error_message = error;
              });
            $rootScope.$digest();

            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
            expect(returned_error_message).toEqual(error_message);
          });
        });
      }); /* end getCoordinates function fails */

    }); /* end nyplCoordinatesService.getCoordinates() */

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
    describe('nyplCoordinatesService.getDistance()', function () {
      // check to see if it has the expected function
      it('should have a getDistance() function', function () {
        expect(angular.isFunction(nyplCoordinatesService.getDistance))
          .toBe(true);
      });

      // check to see if it has the expected function
      it('should calculate the distance from Schwarzman Bldg to ' +
        ' 58th Street Library',
        function () {
          var result =
            nyplCoordinatesService
            .getDistance(40.75298660000001, -73.9821364, 40.7619, -73.9691);

          expect(result).toBe(0.92);
          expect(result).not.toBe(null);
        });
    }); /* End nyplCoordinatesService.getDistance() */

  }); /* End nyplCoordinatesService */
});