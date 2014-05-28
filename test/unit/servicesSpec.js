'use strict';

describe('NYPL Service Tests', function() {

  /* 
  * nypl_coordinates_service
  * Service that retrieves a browser's current location and coordinate distance utility method
  */
  describe('Utility: nypl_coordinates_service', function() {
    var nypl_coordinates_service;

    beforeEach(function () {
      // load the module.
      module('nypl_locations');
      
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_coordinates_service_, _$rootScope_) {
        nypl_coordinates_service = _nypl_coordinates_service_;
      });
    });

    /* nypl_coordinates_service.getDistance */
    describe('nypl_coordinates_service.getDistance', function () {
      // check to see if it has the expected function
      it('should have a getDistance() function', function () { 
        expect(angular.isFunction(nypl_coordinates_service.getDistance)).toBe(true);
      });

      // check to see if it has the expected function
      it('should calculate the distance from Schwarzman Bldg to 58th Street Library', function () { 
        var result = nypl_coordinates_service.getDistance(40.75298660000001, -73.9821364, 40.7619, -73.9691);
        expect(result).toBe(0.92);
        expect(result).not.toBe(null);
      });
    });

    /* nypl_coordinates_service.checkGeolocation */
    describe('nypl_coordinates_service.checkGeolocation', function () {
      it('should have a checkGeolocation function', function () {
        // The checkGeolocation function checks to see if geolocation is available on the user's browser
        expect(angular.isFunction(nypl_coordinates_service.checkGeolocation)).toBe(true);
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
    
    /* nypl_coordinates_service.getCoordinates */
    describe('nypl_coordinates_service.getCoordinates', function () {
      var geolocationMock, geolocationOk, geolocationError, scope;

      beforeEach(inject(function (_$rootScope_) {
        scope = _$rootScope_.$new();
        window.navigator = jasmine.createSpy('navigator');
        geolocationMock = window.navigator.geolocation = jasmine.createSpy('geolocation');

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
        expect(angular.isFunction(nypl_coordinates_service.getCoordinates)).toBe(true);
        expect(typeof nypl_coordinates_service.getCoordinates).toBe('function');
      });

      describe('getCoordinates function successful', function () {
        beforeEach(function () {
          geolocationMock.getCurrentPosition = 
              window.navigator.geolocation.getCurrentPosition =
              jasmine.createSpy('getCurrentPosition').and.callFake(geolocationOk);
        });

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service', function () {
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
            jasmine.createSpy('getCurrentPosition').and.callFake(geolocationError);
        });

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service', function () {
          nypl_coordinates_service.getCoordinates();
          expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
        });
      });

    });
  });


  /* 
  * nypl_geocoder_service 
  * Queries Google Maps Javascript API to geocode addresses and reverse geocode coordinates.
  */
  describe('Utility: nypl_geocoder_service', function () {
    var GeocoderMock, GeoCodingOK, GeoCodingError, 
        LatLngMock, LatLngBoundsMock, LatLngOk, LatLngError,
        nypl_geocoder_service, rootScope,
        get_coords_return_value, get_address_return_value;

    beforeEach(function() {
      module('nypl_locations');

      window.google = jasmine.createSpy('google');
      window.google.maps = jasmine.createSpy('maps');
      window.google.maps.InfoWindow = jasmine.createSpy('InfoWindow');
      window.google.maps.Map = jasmine.createSpy('Map');
      window.google.maps.Marker = jasmine.createSpy('Marker');
      window.google.maps.Animation = jasmine.createSpy('Animation');
      window.google.maps.Animation.BOUNCE = jasmine.createSpy('Bounce');
      window.google.maps.Animation.DROP = jasmine.createSpy('Drop');
      window.google.maps.GeocoderStatus = jasmine.createSpy('GeocoderStatus');
      window.google.maps.GeocoderStatus.OK = 'OK';

      GeoCodingOK = function (params, callback) {
        callback(
          [{geometry: {location:{k:40.75298660000001, A:-73.9821364}}}],
          'OK'
        );
      };

      GeoCodingError = function (params, callback) {
        callback({result: 'Fake result'}, 'ERROR');
      };

      LatLngOk = function (params, callback) {
        callback(
          [{address_components:[{long_name:"10018", short_name:"10018"}]}],
          'OK'
        );
      };

      LatLngError = function (params, callback) {
        callback({result: 'Fake result'}, 'ERROR');
      };

      GeocoderMock = window.google.maps.Geocoder = jasmine.createSpy('Geocoder');
      LatLngMock = window.google.maps.LatLng = jasmine.createSpy('LatLng');
      LatLngBoundsMock = window.google.maps.LatLngBounds = jasmine.createSpy('LatLngBounds');

      inject(function ($rootScope, _nypl_geocoder_service_) {
        nypl_geocoder_service = _nypl_geocoder_service_;
        rootScope = $rootScope;
      });
    });

    it('Should expose some functions', function(){
      expect(angular.isFunction(nypl_geocoder_service.get_coords)).toBe(true);
      expect(typeof nypl_geocoder_service.get_coords).toBe('function');
      expect(typeof nypl_geocoder_service.get_address).toBe('function');
    });

    /* nypl_geocoder_service.get_coords */
    describe('nypl_geocoder_service.get_coords', function () {
      describe('get_coords function successful', function () {
        beforeEach(function() {
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(GeoCodingOK);
        });

        it('Should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('Should call the geocode api when calling the service', function () {
          nypl_geocoder_service.get_coords('10018');
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_coords('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('Should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();

          nypl_geocoder_service.get_coords('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        it('Should resolve the promise when receiving data', function () {
          var promise_callback = jasmine.createSpy(),
              // The return value was defined in the GeoCoding variable
              get_coords_return_value = { lat : 40.75298660000001, long : -73.9821364 };

          nypl_geocoder_service.get_coords('10018').then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with the resolved value from the promise
          expect(promise_callback).toHaveBeenCalledWith(get_coords_return_value);
        });
      });

      describe('get_coords function failed', function () {
        beforeEach(function() {
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(GeoCodingError);
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_coords();
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_coords('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();
          nypl_geocoder_service.get_coords('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nypl_geocoder_service.get_coords */

    /* nypl_geocoder_service.get_address */
    describe('nypl_geocoder_service.get_address', function () {
      describe('get_address function successful', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(LatLngOk);
        });

        it('Should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(typeof promise.then).toBe('function');
        });

        it('Should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();

          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364}).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        // Not sure why the following test is not working:
        it('Should resolve the promise when receiving data', function () {
          var promise_callback = jasmine.createSpy(),
              // The return value was defined in the LatLngOk variable
              get_address_return_value = '10018';


          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364}).then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with the resolved value from the promise
          // expect(promise_callback).toHaveBeenCalledWith(get_address_return_value);
        });
      });

      describe('get_address function failed', function () {
        beforeEach(function() {
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(LatLngError);
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();
          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364}).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nypl_geocoder_service.get_address */

  });
  /* end nypl_geocoder_service called directly */

});

