'use strict';

/* jasmine specs for controllers go here */
describe('Locinator controllers', function() {

  describe('LocationsCtrlCtrl', function(){

    beforeEach(module('nypl_locations'));

    it('should create "phones" model with 3 phones', inject(function($controller) {
      var scope = {},
          ctrl = $controller('LocationsCtrl', {$scope:scope});

      expect(scope.sort).toBe('name');
    }));

  });
});