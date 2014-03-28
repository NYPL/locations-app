'use strict';

/* jasmine specs for controllers go here */
describe('Locinator controllers', function() {

 /* 
  * nypl_locations_service 
  * Service that makes the http request to the API.
  */
  describe('Utility: nypl_locations_service', function(){
    var scope, locationsCtrl, service, httpBackend;

    beforeEach(module('nypl_locations'));

    beforeEach(inject(function(nypl_locations_service, _$httpBackend_, _$rootScope_, $controller) {
      service = nypl_locations_service;
      httpBackend = _$httpBackend_;
      scope = _$rootScope_.$new();

      locationsCtrl = $controller('LocationsCtrl', {
        $scope: scope,
        nypl_locations_service: service
      });
    }));

    it('Should expose nypl_locations_service functions', function () {
      expect(typeof service.all_locations).toBe('function');
      expect(typeof service.single_location).toBe('function');
    });

    it('Should call the branches API and successfully get data back', function () {
      httpBackend.expectGET("http://evening-mesa-7447-160.herokuapp.com/locations").respond(200, {
        'locations': '[{"name":"jmr"},{"name":"sasb"}]'
      });

      expect(scope.locations).not.toBeDefined();

      httpBackend.flush();

      expect(scope.locations).toBeDefined();
      expect(scope.locations).toBe('[{"name":"jmr"},{"name":"sasb"}]');
      
    });

    it('should call the branches api and fail', function () {
      httpBackend.expectGET("http://evening-mesa-7447-160.herokuapp.com/locations").respond(404);

      httpBackend.flush();

      expect(scope.locations).not.toBeDefined();
    });

  });
  
  /* 
  * nypl_geocoder_service 
  * Queries Google Maps Javascript API to geocode addresses and reverse geocode coordinates.
  */
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
});
