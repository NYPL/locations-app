'use strict';

nypl_locations.factory('nypl_geocoder_service', ['$q', function ($q) {
  var map,
      bound, 
      infowindow = new google.maps.InfoWindow();

  return {
    get_coords: function (address) {
      var defer = $q.defer(),
          coords = {},
          geocoder = new google.maps.Geocoder(),
          sw_bound = new google.maps.LatLng(40.49, -74.26),
          ne_bound = new google.maps.LatLng(40.91, -73.77),
          bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

      geocoder.geocode({address: address, bounds: bounds}, function (result, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          coords.lat = result[0].geometry.location.k;
          coords.long = result[0].geometry.location.A;

          defer.resolve(coords);

          // var panCoords = new google.maps.LatLng(coords.lat, coords.long);
          // map.panTo(panCoords);
          // map.setZoom(13);

        } else {
          defer.reject(new Error (status));
        }
      });

      return defer.promise;
    },
    get_zipcode: function (coords) {
      var defer = $q.defer(),
          geocoder = new google.maps.Geocoder(),
          zipcode,
          latlng = new google.maps.LatLng(coords.lat, coords.lng);

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
      var locationCoords = new google.maps.LatLng(coords.lat, coords.long),
          mapOptions = {
            zoom: zoom,
            center: locationCoords
          };

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      bound = new google.maps.LatLngBounds();
    },

    // animation is temporary and is used as a visual cue
    // to make your current location stand out
    draw_marker: function (location, animation) {
      var coords = _.pick(location, 'lat', 'long'),
          _this = this,
          animation = (animation == 'bounce') ? google.maps.Animation.BOUNCE : google.maps.Animation.DROP,
          locationCoords = new google.maps.LatLng(coords.lat, coords.long),
          marker = new google.maps.Marker({
            position: locationCoords,
            map: map,
            animation: animation,
          });

      google.maps.event.addListener(marker, 'click', function () {
        _this.show_infowindow(location, marker);
      });

      // Bounds the map to display all the markers
      // bound.extend(marker.getPosition());
      // map.fitBounds(bound);

    },
    show_infowindow: function (location, marker) {
      var content;

      // Temporary because not all locations have contacts and so contacts[0] throws an error
      if (location.hasOwnProperty('contacts') && location.contacts !== null) {
        content = location.name + '<br />' + location.street_address + '<br />' + 
          location.locality + ', ' + location.region + ' ' + location.postal_code + '<br />' +location.contacts[0].phone;
      } else {
        content = "empty contacts";
      } 

      infowindow.close();
      infowindow.setContent(content);
      infowindow.open(map, marker);
    }

  }
}]);
