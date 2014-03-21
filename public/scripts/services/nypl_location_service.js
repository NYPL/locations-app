'use strict';
angular.module('locationService', ['ngResource']).factory('nypl_locations_service', function($q, $resource) {

	return {
		all_locations: function() {
      var defer = $q.defer();
			$resource('./json/all-branches.json').get(function (data) {
        defer.resolve(data.branches);
      });

      return defer.promise;
		},
		single_location: function(id) {
			return $resource('./json/:id.json');
		}
	}
});