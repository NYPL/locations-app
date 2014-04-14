/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations, google */
nypl_locations.factory('nypl_geocoder_service', ['$q', function ($q) {
    'use strict';

    var map,
        bound,
        panCoords,
        searchMarker = new google.maps.Marker({}),
        searchInfoWindow = new google.maps.InfoWindow(),
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
        get_address: function (coords) {
            var defer = $q.defer(),
                geocoder = new google.maps.Geocoder(),
                zipcode,
                latlng = new google.maps.LatLng(coords.lat, coords.lng);

            geocoder.geocode({latLng: latlng}, function (result, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    // var address_component = result[0].address_components;
                    // zipcode = address_component[address_component.length - 1]
                    //     .long_name;

                    var address = result[0].formatted_address;

                    defer.resolve(address);
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
                    center: locationCoords,
                    mapTypeControl: false,
                    panControl: false,
                    zoomControl: false,
                    scaleControl: false,
                    streetViewControl: false
                };

            map = new google.maps.Map(document.getElementById(id), mapOptions);

            bound = new google.maps.LatLngBounds();
        },

        draw_legend: function (id) {
            var mapLegend = document.getElementById(id);

            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapLegend);
            mapLegend.className = "show-legend";
        },

        panMap: function (marker) {
            map.panTo(marker.getPosition());
            map.setZoom(14);
        },

        draw_searchMarker: function (coords, text) {
            searchMarker.setMap(null);
            panCoords = new google.maps.LatLng(coords.lat, coords.long);

            searchMarker.setPosition(panCoords);
            searchMarker.setMap(map);
            this.panMap(searchMarker);
            searchInfoWindow.setContent(text);
            searchInfoWindow.open(map, searchMarker);
        },

        draw_marker: function (location, text, user, pan) {
            var _this = this,
                map_animation,
                icon_url,
                marker,
                position = new google.maps
                    .LatLng(location.lat, location.long),
                markerOptions = {
                    position: position,
                    map: map
                };

            // show the user with a blue marker and it should show above the rest of the markers
            if (user) {
                markerOptions.icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
                markerOptions.zIndex = 1000;
                markerOptions.animation = google.maps.Animation.DROP;
            } else {
                markerOptions.icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
            }

            marker = new google.maps.Marker(markerOptions);

            if (pan) {
               this.panMap(marker);
            }

            // This works but it seems to have to call an external file?
            // doesn't work when location.geolocation is passed
            // map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');

            google.maps.event.addListener(marker, 'click', function () {
                _this.show_infowindow(marker, text);
            });

            // Bounds the map to display all the markers
            // bound.extend(marker.getPosition());
            // map.fitBounds(bound);

        },
        show_infowindow: function (marker, text) {
            infowindow.close();
            infowindow.setContent(text);
            infowindow.open(map, marker);
        }
    };
}]);
