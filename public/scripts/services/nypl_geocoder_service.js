/*jslint indent: 4, maxlen: 80 */
/*globals nypl_locations, google, document */
nypl_locations.factory('nypl_geocoder_service', ['$q', function ($q) {
    'use strict';

    var map,
        bound,
        panCoords,
        markers = [],
        sasbLocation = new google.maps.LatLng(40.7532, -73.9822),
        searchMarker = new google.maps.Marker({}),
        searchInfoWindow = new google.maps.InfoWindow(),
        infowindow = new google.maps.InfoWindow();

    return {
        get_coords: function (address) {
            var defer = $q.defer(),
                coords = {},
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
            var address,
                defer = $q.defer(),
                geocoder = new google.maps.Geocoder(),
                latlng = new google.maps.LatLng(coords.lat, coords.lng);

            geocoder.geocode({latLng: latlng}, function (result, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    address = result[0].formatted_address;
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

        load_markers: function () {
            var _this = this;
            // if markers are available, draw them
            if (markers) {
                _.each(markers, function (marker) {
                    _this.add_marker_to_map(marker.id);
                });
            }
        },

        draw_legend: function (id) {
            var mapLegend = document.getElementById(id);

            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]
                .push(mapLegend);
            mapLegend.className = "show-legend";
        },

        panMap: function (marker) {
            var position, zoom;

            // is no marker, go to default - SASB
            if (!marker) {
                position = sasbLocation;
                zoom = 12;
            } else {
                position = marker.getPosition();
                zoom = 14;
            }
            map.panTo(position);
            map.setZoom(zoom);
        },

        draw_searchMarker: function (coords, text) {
            this.remove_searchMarker();
            panCoords = new google.maps.LatLng(coords.lat, coords.long);

            searchMarker.setPosition(panCoords);
            searchMarker.setMap(map);
            this.panMap(searchMarker);

            searchInfoWindow.setContent(text);
            searchInfoWindow.open(map, searchMarker);
            google.maps.event.addListener(searchMarker, 'click', function () {
                searchInfoWindow.open(map, searchMarker);
            });
        },

        remove_searchMarker: function () {
            searchMarker.setMap(null);
        },

        remove_marker: function (id) {
            var markerObj = _.where(markers, {id: id});
            markerObj[0].marker.setMap(null);
        },

        add_marker_to_map: function (id) {
            var markerObj = _.where(markers, {id: id});
            markerObj[0].marker.setMap(map);
        },

        check_marker: function (id) {
            var markerObj = _.where(markers, {id: id});
            return (markerObj[0] !== undefined);
        },

        pan_existing_marker: function (id) {
            var markerObj = _.where(markers, {id: id}),
                marker = markerObj[0].marker;

            if (marker.getMap() === null) {
                this.add_marker_to_map(id);
            }

            this.panMap(marker);
            this.show_infowindow(markerObj[0].marker, markerObj[0].text);
        },

        show_research_libraries: function () {
            var _this = this,
                // Add the 'user' marker. If it's available,
                // we do not want to remove it at all. Use slug names
                list = ['schwarzman', 'lpa', 'sibl', 'schomburg', 'user'];

            _.each(markers, function (marker) {
                if (!_.contains(list, marker.id)) {
                    _this.remove_marker(marker.id);
                }
            });
        },

        show_all_libraries: function () {
            var _this = this;

            _.each(markers, function (marker) {
                _this.add_marker_to_map(marker.id);
            });
        },

        draw_marker: function (id, location, text, user, pan) {
            var _this = this,
                marker,
                position = new google.maps
                    .LatLng(location.latitude, location.longitude),
                markerOptions = {
                    position: position,
                    map: map
                };

            // show the user with a blue marker above the rest of the markers
            if (user) {
                markerOptions.icon =
                    "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
                markerOptions.zIndex = 1000;
                markerOptions.animation = google.maps.Animation.DROP;
            } else {
                markerOptions.icon =
                    "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
            }

            marker = new google.maps.Marker(markerOptions);

            markers.push({id: id, marker: marker, text: text});

            if (pan) {
                this.panMap(marker);
                this.show_infowindow(marker, text);
            }

            // This works but it seems to have to call an external file?
            // doesn't work when location.geolocation is passed
            // map.data.loadGeoJson();

            google.maps.event.addListener(marker, 'click', function () {
                _this.show_infowindow(marker, text);
            });

            // Bounds the map to display all the markers
            // bound.extend(marker.getPosition());
            // map.fitBounds(bound);

        },

        hide_infowindow: function () {
            infowindow.close();
        },

        show_infowindow: function (marker, text) {
            this.hide_infowindow();
            infowindow.setContent(text);
            infowindow.open(map, marker);
        }
    };
}]);
