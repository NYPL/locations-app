'use strict';

angular.module('locationService', ['ngResource']).factory('nypl_locations_service', function($resource) {

	return {
		all_locations: function() {
			return $resource('http://evening-mesa-7447-160.herokuapp.com/locations');
		},
		single_location: function(symbol) {
			// return $resource('./json/jmr.json');
      return $resource('http://evening-mesa-7447-160.herokuapp.com/locations/' + symbol);
		}
	}
});