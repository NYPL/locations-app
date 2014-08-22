/*jslint indent: 2, maxlen: 80, nomen: true, todo: true */
/*globals nypl_locations, google, document, _, angular */

/** @namespace nyplGeocoderService */
function nyplGeocoderService($q) {
  'use strict';

  var map,
    markers = [],
    filteredLocation,
    searchMarker = new google.maps.Marker({
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    }),
    searchInfoWindow = new google.maps.InfoWindow(),
    infowindow = new google.maps.InfoWindow(),
    geocoderService = {},

    getMarkerFromList = function (id) {
      return _.findWhere(markers, {id: id});
    },

    /** @function showInfowindow
     * @param {object} marker Google Maps Marker object.
     * @param {string} text Text that will appear in the Google Maps marker's
     *  infowindow.
     * @private
     * @memberof nyplGeocoderService
     * @description Hides any previous infowindow displaying on the map and will
     *  display the infowindow for the marker passed with the text.
     * @example
     *  var marker = new google.maps.Marker({...}),
     *    text = "Address of marker";
     *  showInfowindow(marker, text);
     */
    showInfowindow =  function (marker, text) {
      geocoderService.hideInfowindow();
      infowindow.setContent(text);
      infowindow.open(map, marker);
    },

    /** @function removeMarkerFromMap
     * @param {string} id The id for the marker that should be removed.
     * @private
     * @memberof nyplGeocoderService
     * @description Removes the specified marker from the map.
     * @example
     *  removeMarkerFromMap('baychester');
     */
    removeMarkerFromMap = function (id) {
      var markerObj = getMarkerFromList(id);
      if (geocoderService.doesMarkerExist(id)) {
        markerObj.marker.setMap(null);
      }
    },

    /** @function addMarkerToMap
     * @param {string} id The id for the marker to add to the map.
     * @private
     * @memberof nyplGeocoderService
     * @description Add the specified marker to the map.
     * @example
     *  addMarkerToMap('parkester');
     */
    addMarkerToMap = function (id) {
      var markerObj = getMarkerFromList(id);
      if (markerObj) {
        markerObj.marker.setMap(map);
      }
    };

  /** @function nyplGeocoderService.geocodeAddress
   * @param {string} address Address or location to search for.
   * @returns {object} Deferred promise. If it resolves, an object is returned
   *  with coordinates and formatted address, or an error if rejected.
   * @example
   *  nyplGeocoderService.geocodeAddress('Bryant Park')
   *    .then(function (coords) {
   *      // coords.lat, coords.long, coords.name
   *    });
   *    .catch(function (error) {
   *      // "Query too short" or Google error status
   *    });
   */
  geocoderService.geocodeAddress = function (address) {
    var defer = $q.defer(),
      coords = {},
      geocoder = new google.maps.Geocoder(),
      sw_bound = new google.maps.LatLng(40.49, -74.26),
      ne_bound = new google.maps.LatLng(40.91, -73.77),
      bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

    if (address.length < 3) {
      defer.reject({msg: "Query too short"});
    } else {
      geocoder.geocode({address: address, bounds: bounds, region: "US"},
        function (result, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            coords.lat  = result[0].geometry.location.k;
            coords.long = result[0].geometry.location.B ||
               result[0].geometry.location.A;
            coords.name = result[0].formatted_address;

            defer.resolve(coords);
          } else {
            defer.reject(new Error(status));
          }
        });
    }

    return defer.promise;
  };

  /** @function nyplGeocoderService.reverseGeocoding 
   * @param {object} coords Object with lat and long properties.
   * @returns {object} Deferred promise. If it resolves, a string of Google's
   *  best attempt to reverse geocode coordinates into a formatted address. 
   * @example
   *  nyplGeocoderService.reverseGeocoding({
   *    lat: 40.7532,
   *    long: -73.9822
   *  })
   *  .then(function (address) {
   *    $scope.address = address;
   *  });
   *  .catch(function (error) {
   *    // Google error status
   *  });
   */
  geocoderService.reverseGeocoding = function (coords) {
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

  /** @function nyplGeocoderService.drawMap
   * @param {object} coords Object with lat and long properties.
   * @param {number} zoom The Google Map zoom distance.
   * @param {string} id The id of the element to draw the map on.
   * @description Draw a Google Maps map on a specific element on the page.
   * @example
   *  nyplGeocoderService.drawMap({
   *    lat: 40.7532,
   *    long: -73.9822
   *  }, 12, 'all-locations-map');
   */
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
    return this;
  };

  /** @function nyplGeocoderService.drawLegend
   * @param {string} id The id of the element to draw the map legend on.
   * @description Draw an element on the page designated to be the legend on
   *  the Google Maps map. It will be drawn on the bottom right corner.
   * @example
   *  nyplGeocoderService.drawLegend('all-locations-map-legend');
   */
  geocoderService.drawLegend = function (id) {
    var mapLegend = document.getElementById(id);

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapLegend);
    mapLegend.className = "show-legend";

    return this;
  };

  /** @function nyplGeocoderService.panMap
   * @param {object} [marker] A Google Maps marker object.
   * @description If a marker object is passed, it will pan to that marker on
   *  the page. Otherwise it will pan to SASB.
   * @todo Find the default location and zoom level for the map.
   * @example
   *  nyplGeocoderService.drawLegend('all-locations-map-legend');
   */
  geocoderService.panMap = function (marker) {
    var sasbLocation = new google.maps.LatLng(40.7632, -73.9822),
      position,
      zoom;

    if (!map) {
      return;
    }

    if (!marker) {
      position = sasbLocation;
      zoom = 12;
    } else {
      position = marker.getPosition();
      zoom = 14;
    }
    map.panTo(position);
    map.setZoom(zoom);

    return this;
  };

  /** @function nyplGeocoderService.showResearchLibraries
   * @description Calling this function will remove all the markers from
   *  the map except for research branches markers and the user marker.
   */
  geocoderService.showResearchLibraries = function () {
    // Add the 'user' marker. If it's available,
    // we do not want to remove it at all. Use slug names.
    var list = ['schwarzman', 'lpa', 'sibl', 'schomburg', 'user'];

    _.each(markers, function (marker) {
      if (!_.contains(list, marker.id)) {
        removeMarkerFromMap(marker.id);
      }
    });

    return this;
  };

  /** @function nyplGeocoderService.showAllLibraries
   * @description This will add all the markers available on the map.
   */
  geocoderService.showAllLibraries = function () {
    if (markers) {
      _.each(markers, function (marker) {
        addMarkerToMap(marker.id);
      });
    }

    return this;
  };

  /** @function nyplGeocoderService.createMarker
   * @param {string} id The location's slug.
   * @param {object} location The location's coordinates as an object with
   *  latitude and longitude properties.
   * @param {string} text The location's address for the marker's infowindow,
   *  with markup since the infowindow allows markup.
   * @description This will create a Google Maps Marker and add it to the
   *  global markers array. If the marker is the user's marker, it will have
   *  a different icon, zIndex, and animation.
   * @example
   *  nyplGeocoderService.createMarker('sibl', {
   *    latitude: 40.24,
   *    longitude: -73.24
   *  }, 'Science, Industry and Business Library (SIBL) 188 Madison Avenue ' +
   *   '@ 34th Street New York, NY, 10016');
   */
  geocoderService.createMarker = function (id, location, text) {
    var marker,
      position = new google.maps.LatLng(location.latitude, location.longitude),
      markerOptions = {
        position: position,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      };

    if (id === 'user') {
      markerOptions.icon =
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      markerOptions.zIndex = 1000;
      markerOptions.animation = google.maps.Animation.DROP;
    }

    marker = new google.maps.Marker(markerOptions);
    markers.push({id: id, marker: marker, text: text});

    google.maps.event.addListener(marker, 'click', function () {
      showInfowindow(marker, text);
    });
  };

  /** @function nyplGeocoderService.hideInfowindow
   * @description Hides the infowindow if the current infowindow is opened.
   */
  geocoderService.hideInfowindow = function () {
    infowindow.close();
    return this;
  };

  /** @function nyplGeocoderService.doesMarkerExist
   * @param {string} id A marker's id.
   * @returns {boolean} True if the marker exists, false otherwise.
   * @description Checks the markers array for the marker with the id passed.
   */
  geocoderService.doesMarkerExist = function (id) {
    return !!getMarkerFromList(id);
  };

  /** @function nyplGeocoderService.createSearchMarker
   * @param {object} coords Object with lat and long properties.
   * @param {string} text The text that should appear in the marker's
   *  infowindow.
   */
  geocoderService.createSearchMarker = function (coords, text) {
    var searchTerm = text.replace(',', ' <br>').replace(',', ' <br>'),
      panCoords = new google.maps.LatLng(coords.lat, coords.long);

    searchMarker.setPosition(panCoords);
    searchInfoWindow.setContent(searchTerm);
  };

  geocoderService.drawSearchMarker = function () {
    if (!filteredLocation && searchMarker.getMap() === null) {
      searchMarker.setMap(map);
      this.panMap(searchMarker);

      searchInfoWindow.open(map, searchMarker);
      this.hideInfowindow();
      google.maps.event.addListener(searchMarker, 'click', function () {
        searchInfoWindow.open(map, searchMarker);
      });
    }

    return this;
  };

  geocoderService.hideSearchInfowindow = function () {
    searchInfoWindow.close();
    return this;
  };

  geocoderService.checkSearchMarker = function () {
    return searchMarker.getPosition() !== undefined &&
      searchMarker.getMap() !== null;
  };

  geocoderService.removeMarker = function (id) {
    if (!id) {
      return this;
    }

    if (id === 'search') {
      searchMarker.setMap(null);
    } else {
      removeMarkerFromMap(id);
    }
    return this;
  };

  geocoderService.panExistingMarker = function (id) {
    var markerObj = getMarkerFromList(id),
      marker = markerObj.marker;

    if (marker.getMap() === undefined || marker.getMap() === null) {
      addMarkerToMap(id);
    }

    this.panMap(marker);
    showInfowindow(markerObj.marker, markerObj.text);

    return this;
  };

  geocoderService.searchFilterMarker = function (location_slug) {
    filteredLocation = location_slug;
    if (this.doesMarkerExist(location_slug)) {
      this.panExistingMarker(location_slug);
    }
  };

  geocoderService.clearFilteredLocation = function () {
    filteredLocation = undefined;
    return this;
  };

  geocoderService.getFilteredLocation = function () {
    return filteredLocation;
  };

  return geocoderService;
}

angular
  .module('nypl_locations')
  .factory('nyplGeocoderService', nyplGeocoderService);
