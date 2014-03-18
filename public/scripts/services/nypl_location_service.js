'use strict';

angular.module('locationService', ['ngResource']).factory('nypl_locations_service', function($resource) {

	return {
		all_locations: function() {
			return $resource('http://evening-mesa-7447-160.herokuapp.com/locations');
		},
		single_location: function(symbol) {
			return $resource('./json/jmr.json');
      //return $resource('http://evening-mesa-7447-160.herokuapp.com/locations/' + symbol);
		},
		location_type: function(id) {
			switch(id) {
				case 'SASB':
				case 'LPA':
				case 'SCHOMBURG':
				case 'SIBL':
					return 'research';
				default:
					return 'circulating';
			}
		},
		convert_time: function(unix_time) {
			var new_date = new Date(unix_time).getTime();
			return new_date;
		}
	}
});