'use strict';

/* jasmine specs for controllers go here */
describe('Locinator controllers', function() {

  describe('LocationsCtrlCtrl', function(){
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

    it('should have name as the default sort', function () {
      expect(scope.sort).toEqual("name");
    });

    it('should call the branches api and successfully got data back', function () {
      httpBackend.expectGET("./json/all-branches.json").respond(200, {
        'branches': '[{"name":"jmr"},{"name":"sasb"}]'
      });

      //expect(service.all_locations()).toBeDefined();
      expect(scope.locations).not.toBeDefined();

      httpBackend.flush();

      console.log(scope.locations);
      expect(scope.locations).toBeDefined();
      expect(scope.locations).toBe('[{"name":"jmr"},{"name":"sasb"}]');
      
    });

    it('should call the branches api and failed', function () {
      httpBackend.expectGET("./json/all-branches.json").respond(404, {
        'branches': '[{"name":"jmr"},{"name":"sasb"}]'
      });

      httpBackend.flush();

      expect(scope.locations).not.toBeDefined();
    });

  });
});
