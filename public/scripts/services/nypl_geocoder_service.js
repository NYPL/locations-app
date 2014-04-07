/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations, google */
nypl_locations.factory('nypl_geocoder_service', ['$q', function ($q) {
    'use strict';

    var map,
        bound,
        panCoords,
        searchMarker = new google.maps.Marker({}),
        infowindow = new google.maps.InfoWindow();

    return {
        get_coords: function (address) {
            var defer = $q.defer(),
                coords = {},
                _this = this,
                geocoder = new google.maps.Geocoder(),
                sw_bound = new google.maps.LatLng(40.49, -74.26),
                ne_bound = new google.maps.LatLng(40.91, -73.77),
                bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

            geocoder.geocode(
                {address: address, bounds: bounds, region: "US"},
                function (result, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        coords.lat = result[0].geometry.location.k;
                        coords.long = result[0].geometry.location.A;

                        defer.resolve(coords);

                    } else {
                        defer.reject(new Error(status));
                    }
                }
            );

            return defer.promise;
        },
        searchTermMarker: function (coords) {
            panCoords = new google.maps.LatLng(coords.lat, coords.long);

            searchMarker.setPosition(panCoords);
            searchMarker.setMap(map);
            map.panTo(panCoords);
            map.setZoom(14);
        },
        get_zipcode: function (coords) {
            var defer = $q.defer(),
                geocoder = new google.maps.Geocoder(),
                zipcode,
                latlng = new google.maps.LatLng(coords.lat, coords.lng);

            geocoder.geocode({latLng: latlng}, function (result, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var address_component = result[0].address_components;
                    zipcode = address_component[address_component.length - 1]
                        .long_name;

                    defer.resolve(zipcode);
                } else {
                    defer.reject(new Error(status));
                }
            });

            return defer.promise;
        },

        draw_map: function (coords, zoom, id) {
            var locationCoords = new google.maps
                .LatLng(coords.lat, coords.long),
                mapOptions = {
                    zoom: zoom,
                    center: locationCoords
                };

            map = new google.maps.Map(document.getElementById(id), mapOptions);
            bound = new google.maps.LatLngBounds();
        },

        // animation is temporary and is used as a visual cue
        // to make your current location stand out
        draw_marker: function (location, animation, geojson) {
            // locations are in geojson format but geolocation is not.
            // Need a better solution.
            var coords,
                _this = this,
                map_animation,
                marker;

            if (geojson) {
                coords = {
                    lat: location.geolocation.coordinates[1],
                    long: location.geolocation.coordinates[0]
                };
            } else {
                coords = {
                    lat: location.lat,
                    long: location.long
                };
            }

            if (animation === 'bounce') {
                map_animation = google.maps.Animation.BOUNCE;
            } else {
                map_animation = google.maps.Animation.DROP;
            }

            marker = new google.maps.Marker({
                position: new google.maps
                    .LatLng(coords.lat, coords.long),
                map: map,
                animation: map_animation
            });

            // This works but it seems to have to call an external file?
            // doesn't work when location.geolocation is passed
            // map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');

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
            if (location.hasOwnProperty('name')) {
                content = location.name + '<br />' + location.street_address +
                    '<br />' + location.locality + ', ' + location.region +
                    ' ' + location.postal_code + '<br />' +
                    location.contacts.phone;
            } else {
                content = "empty contacts";
            }

            infowindow.close();
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }
    };
}]);
