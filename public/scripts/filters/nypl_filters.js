'use strict';
// Filter formats military time to standard time
nypl_locations.filter('format_time', function() {

	return function(time) {
		// Checking if thruthy needed for async calls
		if (time) {
			var components = time.split(':'),
					hours = ((parseInt(components[0]) + 11) % 12 + 1),
					minutes = components[1],
					meridiem = components[0] >= 12 ? 'pm' : 'am';
			return hours + ":" + minutes + meridiem;
		}
		else {
			return console.log('String conversion loaded after http response');
		}
	}

});