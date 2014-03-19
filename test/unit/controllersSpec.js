'use strict';

/* jasmine specs for controllers go here */
describe('Locinator controllers', function() {

  describe('LocationsCtrlCtrl', function(){
    var $scope, ctrl, $timeout, locServiceMock;

    beforeEach(module('nypl_locations'));

    beforeEach(function () {
      locServiceMock = jasmine.createSpyObj('nypl_locations_service', ['all_locations']);
      inject(function($rootScope, $controller, $q, _$timeout_) {

        $scope = $rootScope.$new();
  
        locServiceMock.all_locations.and.returnValue({
          get: function () {return ['a', 'b', 'c', 'd']}
        });
      
        $timeout = _$timeout_;
      
        ctrl = $controller('LocationsCtrl', {
          $scope: $scope,
          nypl_locations_service: locServiceMock
        });
      });
    });

    it('should have name as the default sort', function () {
      expect($scope.sort).toEqual('name');
    });

    it('should load the locations during init', function () {
      expect($scope.locations).toEqual(['a', 'b', 'c', 'd']);
    });
  });
});
