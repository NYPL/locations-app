'use strict';

describe('NYPL Service Tests', function() {

  describe('Utility: getDistance function', function(){

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
    it('should have an getDistance() function', function () { 
      expect(angular.isFunction(nypl_coordinates_service.getDistance)).toBe(true);
    });

    // check to see if it has the expected function
    it('should calculate the distance from Schwarzman Bldg to 58th Street Library', function () { 
      var result = nypl_coordinates_service.getDistance(40.75298660000001, -73.9821364, 40.7619, -73.9691);
      expect(result).toBe(0.92);
      expect(result).not.toBe(null);
    });

  });
});
