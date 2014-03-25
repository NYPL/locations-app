'use strict';

describe('NYPL Service Tests', function() {

  describe('Utility: getDistance function', function() {

    var nypl_coordinates_service;

    // excuted before each "it" is run.
    beforeEach(function (){
      
      // load the module.
      module('nypl_locations');
      
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function(_nypl_coordinates_service_) {
        nypl_coordinates_service = _nypl_coordinates_service_;
      });
    });

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

  describe('Utility: getCoordinates function', function() {
    var nypl_coordinates_service;

    // excuted before each "it" is run.
    beforeEach(function (){
      
      // load the module.
      module('nypl_locations');
      
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function(_nypl_coordinates_service_) {
        nypl_coordinates_service = _nypl_coordinates_service_;
      });
    });

    // check to see if it has the expected function
    it('should have an getCoordinates function', function () { 
      expect(angular.isFunction(nypl_coordinates_service.getCoordinates)).toBe(true);
    });

  });

  describe('Utility: nypl_geocoder_service called from controller', function () {
    var nypl_geocoder_mock, q, rootScope, scope, defer, geoSpy;

    beforeEach(module('nypl_locations'));
    beforeEach(inject(function ($q, $rootScope, nypl_geocoder_service) {
      q = $q;
      rootScope = $rootScope;
    }));
    beforeEach(inject(function ($controller) {
      scope = rootScope.$new();
      nypl_geocoder_mock = {
        get_coords: function (address) {
          defer = q.defer();
          return defer.promise;
        }
      };

      geoSpy = spyOn(nypl_geocoder_mock,'get_coords').and.callThrough();

      $controller('LocationsCtrl', {
        '$scope': scope,
        'nypl_geocoder_service': nypl_geocoder_mock
      });
      scope.submitAddress('test');

    }));

    // Although this test works, I cannot seem to find a way to test for the 
    // promise and returned value.  Working on that.
    it('should get coordinates from a zipcode', inject(function (nypl_geocoder_service) {
      expect(nypl_geocoder_mock.get_coords).toHaveBeenCalled();
    }));

  });

  
  describe('Utility: nypl_geocoder_service called directly', function () {
    var GeoCoderMock, GeoCodingOK, GeoCodingError, 
        LatLngMock, LatLngOk, LatLngError,
        nypl_geocoder_mock, rootScope,
        get_coords_return_value, get_zipcode_return_value;

    beforeEach(module('nypl_locations'));

    beforeEach(inject(function ($rootScope, nypl_geocoder_service) {
      nypl_geocoder_mock = nypl_geocoder_service;
      rootScope = $rootScope;

      window.google = jasmine.createSpy('google');
      window.google.maps = jasmine.createSpy('maps');
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

      GeoCoderMock = window.google.maps.Geocoder = jasmine.createSpy('Geocoder');
      LatLngMock = window.google.maps.LatLng = jasmine.createSpy('LatLng');

    }));

    it('Should expose some functions', function(){
      expect(typeof nypl_geocoder_mock.get_coords).toBe('function');
      expect(typeof nypl_geocoder_mock.get_zipcode).toBe('function');
    });

    /* nypl_geocoder_service.get_coords */
    describe('nypl_geocoder_service.get_coords', function () {
      describe('get_coords function successful', function () {
        beforeEach(function() {
          GeoCoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(GeoCodingOK);
        });

        it('Should not be called', function () {
          expect(GeoCoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('Should call the geocode api when calling the service', function () {
          nypl_geocoder_mock.get_coords('10018');
          expect(GeoCoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_mock.get_coords('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('Should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();

          nypl_geocoder_mock.get_coords('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        it('Should resolve the promise when receiving data', function () {
          var promise_callback = jasmine.createSpy(),
              // The return value was defined in the GeoCoding variable
              get_coords_return_value = { lat : 40.75298660000001, long : -73.9821364 };

          nypl_geocoder_mock.get_coords('10018').then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with the resolved value from the promise
          expect(promise_callback).toHaveBeenCalledWith(get_coords_return_value);
        });
      });

      describe('get_coords function failed', function () {
        beforeEach(function() {
          GeoCoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(GeoCodingError);
        });

        it('Should be called', function () {
          nypl_geocoder_mock.get_coords();
          expect(GeoCoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_mock.get_coords('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();
          nypl_geocoder_mock.get_coords('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nypl_geocoder_service.get_coords */

    /* nypl_geocoder_service.get_zipcode */
    describe('nypl_geocoder_service.get_zipcode', function () {
      describe('get_zipcode function successful', function () {
        beforeEach(function () {
          GeoCoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(LatLngOk);
        });

        it('Should not be called', function () {
          expect(GeoCoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('Should be called', function () {
          nypl_geocoder_mock.get_zipcode({lat: 40.75298660000001, lng:-73.9821364});
          expect(GeoCoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_mock.get_zipcode({lat: 40.75298660000001, lng:-73.9821364});
          expect(typeof promise.then).toBe('function');
        });

        it('Should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();

          nypl_geocoder_mock.get_zipcode({lat: 40.75298660000001, lng:-73.9821364}).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        it('Should resolve the promise when receiving data', function () {
          var promise_callback = jasmine.createSpy(),
              // The return value was defined in the LatLngOk variable
              get_zipcode_return_value = '10018';


          nypl_geocoder_mock.get_zipcode({lat: 40.75298660000001, lng:-73.9821364}).then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with the resolved value from the promise
          expect(promise_callback).toHaveBeenCalledWith(get_zipcode_return_value);
        });
      });

      describe('get_zipcode function failed', function () {
        beforeEach(function() {
          GeoCoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(LatLngError);
        });

        it('Should be called', function () {
          nypl_geocoder_mock.get_zipcode({lat: 40.75298660000001, lng:-73.9821364});
          expect(GeoCoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_mock.get_zipcode({lat: 40.75298660000001, lng:-73.9821364});
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();
          nypl_geocoder_mock.get_zipcode({lat: 40.75298660000001, lng:-73.9821364}).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nypl_geocoder_service.get_zipcode */

  });
  /* end nypl_geocoder_service called directly */

});

