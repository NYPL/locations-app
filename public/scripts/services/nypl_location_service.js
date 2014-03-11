'use strict';

angular.module('locationService', ['ngResource']).factory('nypl_locations_service', function($resource) {

	return {
		all_locations: function() {
			return $resource('./json/all-branches.json');
		},
		single_location: function(symbol) {
			//return $resource('./json/:id.json');
      return $resource('http://afternoon-citadel-1782.herokuapp.com/' + symbol);
		}
	}
});