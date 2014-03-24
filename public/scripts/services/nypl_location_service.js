'use strict';
angular.module('locationService', ['ngResource']).factory('nypl_locations_service', function($q, $resource) {

	return {
		all_locations: function() {
			return $resource('./json/all-branches.json');
		},
		single_location: function(id) {
			return $resource('./json/:id.json');
		}
	}
});