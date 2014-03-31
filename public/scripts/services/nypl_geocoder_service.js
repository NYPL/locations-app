'use strict';

nypl_locations.factory('nypl_geocoder_service', ['$q', function ($q) {
  var map;

  return {
    get_coords: function (address) {
      var defer = $q.defer();
      var coords = {};
      var geocoder = new google.maps.Geocoder();
      var sw_bound = new google.maps.LatLng(40.49, -74.26);
      var ne_bound = new google.maps.LatLng(40.91, -73.77);
      var bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

      geocoder.geocode({address: address, bounds: bounds}, function (result, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          coords.lat = result[0].geometry.location.k;
          coords.long = result[0].geometry.location.A;

          defer.resolve(coords);

        } else {
          defer.reject(new Error (status));
        }
      });

      return defer.promise;
    },
    get_zipcode: function (coords) {
      var defer = $q.defer();
      var geocoder = new google.maps.Geocoder();
      var zipcode;
      var latlng = new google.maps.LatLng(coords.lat, coords.lng);

      geocoder.geocode({latLng: latlng}, function (result, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var address_component = result[0].address_components;
          zipcode =  address_component[address_component.length-1].long_name;

          defer.resolve(zipcode);
        } else {
          defer.reject(new Error (status));
        }
      });

      return defer.promise;
    },
    draw_map: function (coords, zoom) {
      var locationCoords = new google.maps.LatLng(coords.lat, coords.long);
      var mapOptions = {
        zoom: zoom,
        center: locationCoords
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    },
    draw_marker: function (coords) {
      var locationCoords = new google.maps.LatLng(coords.lat, coords.long);
      var marker = new google.maps.Marker({
        position: locationCoords,
        map: map,
        animation: google.maps.Animation.DROP
      });
    }
  }
}]);
