'use strict';

angular.module('locationService', ['ngResource']).factory('nypl_locations_service', function($resource) {

	return {
		all_locations: function() {
			return $resource('http://evening-mesa-7447-160.herokuapp.com/locations');
		},
		single_location: function(symbol) {
			// return $resource('./json/jmr.json');
      return $resource('http://evening-mesa-7447-160.herokuapp.com/locations/' + symbol);
		},
		// Need to add as a filter
		format_time: function(time) {
			var components = time.split(':'),
					hours = ((components[0] + 11) % 12) + 1;
					minutes = components[1],
					meridiem = components[0] > 11 ? 'pm' : 'am';
			return hours + ":" + minutes + meridiem;
		}
	}
});