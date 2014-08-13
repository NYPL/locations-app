/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, google, document, _, angular */

function nypl_geocoder_service($q) {
    'use strict';

    var map,
        panCoords,
        markers = [],
        filteredLocation,
        sasbLocation = new google.maps.LatLng(40.7632, -73.9822),
        searchMarker = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }),
        userMarker = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            zIndex: 1000,
            animation: google.maps.Animation.DROP
        }),
        searchInfoWindow = new google.maps.InfoWindow(),
        infowindow = new google.maps.InfoWindow(),
        geocoder_service = {};

    geocoder_service.get_coords = function (address) {
        var defer = $q.defer(),
            coords = {},
            geocoder = new google.maps.Geocoder(),
            sw_bound = new google.maps.LatLng(40.49, -74.26),
            ne_bound = new google.maps.LatLng(40.91, -73.77),
            bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

        if (address.length < 3) {
            defer.reject({msg: "query too short"});
        }

        geocoder.geocode(
            {address: address, bounds: bounds, region: "US"},
            function (result, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    coords.lat  = result[0].geometry.location.k;
                    coords.long = result[0].geometry.location.A;
                    coords.name = result[0].formatted_address;

                    defer.resolve(coords);
                } else {
                    defer.reject(new Error(status));
                }
            }
        );

        return defer.promise;
    };

    geocoder_service.get_address = function (coords) {
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
    };

    geocoder_service.draw_map = function (coords, zoom, id) {
        var locationCoords = new google.maps.LatLng(coords.lat, coords.long),
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
    };

    geocoder_service.load_markers = function () {
        var _this = this;
        // if markers are available, draw them
        if (markers) {
            _.each(markers, function (marker) {
                _this.add_marker_to_map(marker.id);
            });
        }
    };

    geocoder_service.draw_legend = function (id) {
        var mapLegend = document.getElementById(id);

        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]
            .push(mapLegend);
        mapLegend.className = "show-legend";
    };

    geocoder_service.panMap = function (marker) {
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
    };

    geocoder_service.create_userMarker = function (coords, text) {
        var _this = this;
        panCoords = new google.maps.LatLng(coords.latitude, coords.longitude);
        userMarker.setPosition(panCoords);
        // this.show_infowindow(userMarker, text);
        google.maps.event.addListener(userMarker, 'click', function () {
            _this.show_infowindow(userMarker, text);
        });
        markers.push({id: 'user', marker: userMarker, text: text});
    };

    geocoder_service.create_searchMarker = function (coords, text) {
        var searchTerm = text.replace(',', ' <br>').replace(',', ' <br>');
        panCoords = new google.maps.LatLng(coords.lat, coords.long);
        searchMarker.setPosition(panCoords);
        searchInfoWindow.setContent(searchTerm);
    };

    geocoder_service.draw_searchMarker = function () {
        this.remove_searchMarker();

        searchMarker.setMap(map);
        this.panMap(searchMarker);

        searchInfoWindow.open(map, searchMarker);
        this.hide_infowindow();
        google.maps.event.addListener(searchMarker, 'click', function () {
            searchInfoWindow.open(map, searchMarker);
        });
    };

    geocoder_service.remove_searchMarker = function () {
        searchMarker.setMap(null);
    };

    geocoder_service.remove_marker = function (id) {
        var markerObj = _.where(markers, {id: id});
        markerObj[0].marker.setMap(null);
    };

    geocoder_service.add_marker_to_map = function (id) {
        var markerObj = _.where(markers, {id: id});
        markerObj[0].marker.setMap(map);
    };

    geocoder_service.check_searchMarker = function () {
        return searchMarker.getPosition() !== undefined &&
            searchMarker.getMap() !== null;
    };

    geocoder_service.check_marker = function (id) {
        var markerObj = _.where(markers, {id: id});
        return (markerObj[0] !== undefined);
    };

    geocoder_service.pan_existing_marker = function (id) {
        var markerObj = _.where(markers, {id: id}),
            marker = markerObj[0].marker;

        if (marker.getMap() === undefined || marker.getMap() === null) {
            this.add_marker_to_map(id);
        }

        this.panMap(marker);
        this.show_infowindow(markerObj[0].marker, markerObj[0].text);
    };

    geocoder_service.search_result_marker = function (locations) {
        var location_id = locations[0].slug;
        filteredLocation = location_id;
        if (this.check_marker(location_id)) {
            this.pan_existing_marker(location_id);
        }
    };

    geocoder_service.clear_filtered_location = function () {
        filteredLocation = undefined;
    };

    geocoder_service.get_filtered_location = function () {
        return filteredLocation;
    };

    geocoder_service.show_research_libraries = function () {
        var _this = this,
            // Add the 'user' marker. If it's available,
            // we do not want to remove it at all. Use slug names
            list = ['schwarzman', 'lpa', 'sibl', 'schomburg', 'user'];

        _.each(markers, function (marker) {
            if (!_.contains(list, marker.id)) {
                _this.remove_marker(marker.id);
            }
        });
    };

    geocoder_service.show_all_libraries = function () {
        var _this = this;

        _.each(markers, function (marker) {
            _this.add_marker_to_map(marker.id);
        });
    };

    geocoder_service.draw_marker = function (id, location, text) {
        var _this = this,
            marker,
            position = new google.maps
                .LatLng(location.latitude, location.longitude),
            markerOptions = {
                position: position,
                map: map
            };

        markerOptions.icon =
            "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        marker = new google.maps.Marker(markerOptions);
        markers.push({id: id, marker: marker, text: text});

        // This works but it seems to have to call an external file?
        // doesn't work when location.geolocation is passed
        // map.data.loadGeoJson();

        google.maps.event.addListener(marker, 'click', function () {
            _this.show_infowindow(marker, text);
        });
    };

    geocoder_service.hide_search_infowindow = function () {
        searchInfoWindow.close();
    };

    geocoder_service.hide_infowindow = function () {
        infowindow.close();
    };

    geocoder_service.show_infowindow = function (marker, text) {
        this.hide_infowindow();
        infowindow.setContent(text);
        infowindow.open(map, marker);
    };

    return geocoder_service;
}

angular
    .module('nypl_locations')
    .factory('nypl_geocoder_service', nypl_geocoder_service);
