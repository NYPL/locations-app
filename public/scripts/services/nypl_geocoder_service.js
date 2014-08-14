/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals nypl_locations, google, document, _, angular */

function nyplGeocoderService($q) {
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
    geocoderService = {};

  geocoderService.getCoordinates = function (address) {
    var defer = $q.defer(),
      coords = {},
      geocoder = new google.maps.Geocoder(),
      sw_bound = new google.maps.LatLng(40.49, -74.26),
      ne_bound = new google.maps.LatLng(40.91, -73.77),
      bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

    if (address.length < 3) {
      defer.reject({msg: "query too short"});
    }

    geocoder.geocode({address: address, bounds: bounds, region: "US"},
      function (result, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          coords.lat  = result[0].geometry.location.k;
          coords.long = result[0].geometry.location.A;
          coords.name = result[0].formatted_address;

          defer.resolve(coords);
        } else {
          defer.reject(new Error(status));
        }
      });

    return defer.promise;
  };

  geocoderService.getAddress = function (coords) {
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

  geocoderService.drawMap = function (coords, zoom, id) {
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

  geocoderService.loadMarkers = function () {
    var _this = this;
    // if markers are available, draw them
    if (markers) {
      _.each(markers, function (marker) {
        _this.addMarkerToMap(marker.id);
      });
    }
  };

  geocoderService.drawLegend = function (id) {
    var mapLegend = document.getElementById(id);

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]
      .push(mapLegend);
    mapLegend.className = "show-legend";
  };

  geocoderService.panMap = function (marker) {
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

  geocoderService.createUserMarker = function (coords, text) {
    var _this = this;
    panCoords = new google.maps.LatLng(coords.latitude, coords.longitude);
    userMarker.setPosition(panCoords);
    google.maps.event.addListener(userMarker, 'click', function () {
      _this.showInfowindow(userMarker, text);
    });
    markers.push({id: 'user', marker: userMarker, text: text});
  };

  geocoderService.createSearchMarker = function (coords, text) {
    var searchTerm = text.replace(',', ' <br>').replace(',', ' <br>');
    panCoords = new google.maps.LatLng(coords.lat, coords.long);
    searchMarker.setPosition(panCoords);
    searchInfoWindow.setContent(searchTerm);
  };

  geocoderService.drawSearchMarker = function () {
    this.removeSearchMarker();

    searchMarker.setMap(map);
    this.panMap(searchMarker);

    searchInfoWindow.open(map, searchMarker);
    this.hideInfowindow();
    google.maps.event.addListener(searchMarker, 'click', function () {
      searchInfoWindow.open(map, searchMarker);
    });
  };

  geocoderService.removeSearchMarker = function () {
    searchMarker.setMap(null);
  };

  geocoderService.removeMarker = function (id) {
    var markerObj = _.where(markers, {id: id});
    markerObj[0].marker.setMap(null);
  };

  geocoderService.addMarkerToMap = function (id) {
    var markerObj = _.where(markers, {id: id});
    markerObj[0].marker.setMap(map);
  };

  geocoderService.checkSearchMarker = function () {
    return searchMarker.getPosition() !== undefined &&
      searchMarker.getMap() !== null;
  };

  geocoderService.checkMarker = function (id) {
    var markerObj = _.where(markers, {id: id});
    return (markerObj[0] !== undefined);
  };

  geocoderService.panExistingMarker = function (id) {
    var markerObj = _.where(markers, {id: id}),
      marker = markerObj[0].marker;

    if (marker.getMap() === undefined || marker.getMap() === null) {
      this.addMarkerToMap(id);
    }

    this.panMap(marker);
    this.showInfowindow(markerObj[0].marker, markerObj[0].text);
  };

  geocoderService.searchResultMarker = function (locations) {
    var location_id = locations[0].slug;
    filteredLocation = location_id;
    if (this.checkMarker(location_id)) {
      this.panExistingMarker(location_id);
    }
  };

  geocoderService.clearFilteredLocation = function () {
    filteredLocation = undefined;
  };

  geocoderService.getFilteredLocation = function () {
    return filteredLocation;
  };

  geocoderService.showResearchLibraries = function () {
    var _this = this,
      // Add the 'user' marker. If it's available,
      // we do not want to remove it at all. Use slug names
      list = ['schwarzman', 'lpa', 'sibl', 'schomburg', 'user'];

    _.each(markers, function (marker) {
      if (!_.contains(list, marker.id)) {
        _this.removeMarker(marker.id);
      }
    });
  };

  geocoderService.showAllLibraries = function () {
    var _this = this;

    _.each(markers, function (marker) {
      _this.addMarkerToMap(marker.id);
    });
  };

  geocoderService.drawMarker = function (id, location, text) {
    var _this = this,
      marker,
      position = new google.maps.LatLng(location.latitude, location.longitude),
      markerOptions = {
        position: position,
        map: map
      };

    markerOptions.icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    marker = new google.maps.Marker(markerOptions);
    markers.push({id: id, marker: marker, text: text});

    // This works but it seems to have to call an external file?
    // doesn't work when location.geolocation is passed
    // map.data.loadGeoJson();

    google.maps.event.addListener(marker, 'click', function () {
      _this.showInfowindow(marker, text);
    });
  };

  geocoderService.hideSearchInfowindow = function () {
    searchInfoWindow.close();
  };

  geocoderService.hideInfowindow = function () {
    infowindow.close();
  };

  geocoderService.showInfowindow = function (marker, text) {
    this.hideInfowindow();
    infowindow.setContent(text);
    infowindow.open(map, marker);
  };

  return geocoderService;
}

angular
  .module('nypl_locations')
  .factory('nyplGeocoderService', nyplGeocoderService);
