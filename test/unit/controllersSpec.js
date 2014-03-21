'use strict';

/* jasmine specs for controllers go here */
describe('Locinator controllers', function() {

  describe('LocationsCtrlCtrl', function(){
    var scope, q, locationsService, deferred, locationsCtrl;

    beforeEach(module('nypl_locations'));

    beforeEach(function () {
      locationsService = {
        all_locations: function () {
          deferred = q.defer();
          return deferred.promise;
        },
        single_location: function () {
          return;
        }
      };
    });

    beforeEach(function () {
      inject(function($rootScope, $controller, $q, _$timeout_) {

        scope = $rootScope.$new();
        q = $q;
      
        locationsCtrl = $controller('LocationsCtrl', {
          $scope: scope,
          nypl_locations_service: locationsService
        });
        deferred.resolve("{'coords':{'test':'one'}}");
      });
    });

    it('should have name as the default sort', inject(function (nypl_locations_service) {

      spyOn(locationsService, 'all_locations').and.callThrough();
      
      scope.init();
      scope.$root.$digest();

      expect(locationsService.all_locations).toHaveBeenCalled();
      expect(scope.locations).toEqual("{'coords':{'test':'one'}}");
    }));


  });
});
