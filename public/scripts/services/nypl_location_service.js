'use strict';

angular.module('locationService', ['ngResource']).factory('nypl_locations_service', function($http, $q) {

	return {
		all_locations: function() {

			var d = $q.defer();
			$http.get('http://evening-mesa-7447-160.herokuapp.com/locations', {cache: true}).success(function(data){
				d.resolve(data);
			}).error(function(){
				d.reject();
			});
			return d.promise;
		},
		single_location: function(symbol) {
			// return $resource('./json/jmr.json');
      return $resource('http://evening-mesa-7447-160.herokuapp.com/locations/' + symbol);
		}
	}
});