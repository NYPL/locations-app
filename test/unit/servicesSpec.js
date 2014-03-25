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

  describe('Utility: geocoder called from controller', function () {
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

    it('should get coordinates from a zipcode', inject(function(nypl_geocoder_service) {
      expect(nypl_geocoder_mock.get_coords).toHaveBeenCalled();

    }));

  });

  describe('Utility: geocoder called directly', function () {
    var GeoCodingOK, GeoCodingError, GeoCoderMock, 
    GoogleAPILoaderMock, rootScope, q, $timeout, nypl_geocoder_mock;

    beforeEach(module('nypl_locations'));
    beforeEach(inject(function ($q, $rootScope) {
      q = $q;
      rootScope = $rootScope;
    }));
    beforeEach(inject(function (nypl_geocoder_service) {
      nypl_geocoder_mock = nypl_geocoder_service;

      window.google = jasmine.createSpy('google');
      window.google.maps = jasmine.createSpy('maps');
      window.google.maps.GeocoderStatus = jasmine.createSpy('GeocoderStatus');
      window.google.maps.GeocoderStatus.OK = 'OK';

      GeoCodingOK = function (params, callback) {
        callback([{geometry: {location:{k:40.75298660000001, A:-73.9821364}}}], 'OK');
      };

      GeoCodingError = function (params, callback) {
        callback({data: 'Fake'}, 'ERROR');
      };

      GeoCoderMock = window.google.maps.Geocoder = jasmine.createSpy('Geocoder');
      GeoCoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(GeoCodingOK);

    }));

    it('Should expose some functions', function(){
      expect(typeof nypl_geocoder_mock.get_coords).toBe('function');
    });

    describe('getLatLng function', function () {
      it('Should be called', function () {
        nypl_geocoder_mock.get_coords('Canada');
        expect(GeoCoderMock.prototype.geocode).toHaveBeenCalled();
      });

      it('Should return a promise', function () {
        var promise = nypl_geocoder_mock.get_coords('Canada');
        expect(typeof promise.then).toBe('function');
      });

      // it('Should call geocoder.geocode to retrieve results', function () {
      //   nypl_geocoder_mock.get_coords('Canada');
      //   //rootScope.$apply();
      //   expect(GeoCoderMock.prototype.geocode).toHaveBeenCalledWith({ address : 'Canada'}, function() {});
      // });
    });

  });

});

