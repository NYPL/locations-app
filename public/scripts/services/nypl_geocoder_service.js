/*jslint indent: 2, maxlen: 80, nomen: true, todo: true */
/*globals nypl_locations, google, document, _, angular */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplGeocoderService
   * @requires $q
   * @description
   * AngularJS service that deals with all Google Maps related functions.
   * Can add a map to a page and add markers to the map.
   */
  function nyplGeocoderService($q) {
    var map,
      markers = [],
      filteredLocation,
      searchMarker = new google.maps.Marker({
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }),
      searchInfoWindow = new google.maps.InfoWindow(),
      infowindow = new google.maps.InfoWindow(),
      geocoderService = {},

      /*
       * @ngdoc function
       * @name getMarkerFromList
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {string} id The location's slug used for the marker id.
       * @returns {object} The marker object that has the id that was passed,
       *  else an empty object.
       * @private
       */
      getMarkerFromList = function (id) {
        return _.findWhere(markers, {id: id});
      },

      /*
       * @ngdoc function
       * @name showInfowindow
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {object} marker Google Maps Marker object.
       * @param {string} text Text that will appear in the Google Maps marker's
       *  infowindow.
       * @private
       * @description Hides any previous infowindow displaying on the map and
       *  will display the infowindow for the marker passed with the text.
       * @example
       * <pre>
       *  var marker = new google.maps.Marker({...}),
       *    text = "Address of marker";
       *  showInfowindow(marker, text);
       * </pre>
       */
      showInfowindow =  function (marker, text) {
        geocoderService.hideInfowindow();
        infowindow.setContent(text);
        infowindow.open(map, marker);
      },

      /*
       * @ngdoc function
       * @name removeMarkerFromMap
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {string} id The id for the marker that should be removed.
       * @private
       * @description Removes the specified marker from the map.
       * @example
       * <pre>
       *  removeMarkerFromMap('baychester');
       * </pre>
       */
      removeMarkerFromMap = function (id) {
        var markerObj = getMarkerFromList(id);
        if (geocoderService.doesMarkerExist(id)) {
          markerObj.marker.setMap(null);
        }
      },

      /*
       * @ngdoc function
       * @name addMarkerToMap
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {string} id The id for the marker to add to the map.
       * @private
       * @description Add the specified marker to the map.
       * @example
       * <pre>
       *  addMarkerToMap('parkester');
       * </pre>
       */
      addMarkerToMap = function (id) {
        var markerObj = getMarkerFromList(id);
        if (markerObj) {
          markerObj.marker.setMap(map);
        }
      };

    /**
     * @ngdoc function
     * @name geocodeAddress
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} address Address or location to search for.
     * @returns {object} Deferred promise. If it resolves, an object is returned
     *  with coordinates and formatted address, or an error if rejected.
     * @example
     * <pre>
     *  nyplGeocoderService.geocodeAddress('Bryant Park')
     *    .then(function (coords) {
     *      // coords.lat, coords.long, coords.name
     *    });
     *    .catch(function (error) {
     *      // "Query too short" or Google error status
     *    });
     * </pre>
     */
    geocoderService.geocodeAddress = function (address) {
      var defer = $q.defer(),
        coords = {},
        geocoder = new google.maps.Geocoder(),
        sw_bound = new google.maps.LatLng(40.49, -74.26),
        ne_bound = new google.maps.LatLng(40.91, -73.77),
        bounds = new google.maps.LatLngBounds(sw_bound, ne_bound),
        geocodeOptions = {
          address: address,
          bounds: bounds,
          region: "US",
          componentRestrictions: {
            'country': 'US',
            'locality': 'New York'
          }
        };

      geocoder.geocode(geocodeOptions, function (result, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            coords.lat  = result[0].geometry.location.lat();
            coords.long = result[0].geometry.location.lng();
            coords.name = result[0].formatted_address;

            defer.resolve(coords);
          } else {
            defer.reject(new Error(status));
          }
        });

      return defer.promise;
    };

    /**
     * @ngdoc function
     * @name reverseGeocoding
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} coords Object with lat and long properties.
     * @returns {object} Deferred promise. If it resolves, a string of Google's
     *  best attempt to reverse geocode coordinates into a formatted address. 
     * @example
     * <pre>
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
     * </pre>
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

    /*
     * @ngdoc function 
     * @name drawMap
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} coords Object with lat and long properties.
     * @param {number} zoom The Google Map zoom distance.
     * @param {string} id The id of the element to draw the map on.
     * @description Draw a Google Maps map on a specific element on the page.
     * @example
     * <pre>
     *  nyplGeocoderService.drawMap({
     *    lat: 40.7532,
     *    long: -73.9822
     *  }, 12, 'all-locations-map');
     * </pre>
     */
    geocoderService.drawMap = function (coords, zoom, id) {
      var locationCoords = new google.maps.LatLng(coords.lat, coords.long),
        mapOptions = {
          zoom: zoom,
          center: locationCoords,
          mapTypeControl: false,
          panControl: true,
          zoomControl: true,
          scaleControl: true,
          streetViewControl: false
        };

      map = new google.maps.Map(document.getElementById(id), mapOptions);
      return this;
    };

    /**
     * @ngdoc function
     * @name drawLegend
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id The id of the element to draw the map legend on.
     * @description Draw an element on the page designated to be the legend on
     *  the Google Maps map. It will be drawn on the bottom right corner.
     * @example
     * <pre>
     *  nyplGeocoderService.drawLegend('all-locations-map-legend');
     * </pre>
     */
    geocoderService.drawLegend = function (id) {
      var mapLegend = document.getElementById(id);

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapLegend);
      mapLegend.className = "show-legend";

      return this;
    };

    /**
     * @ngdoc function
     * @name panMap
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} [marker] A Google Maps marker object.
     * @description If a marker object is passed, it will pan to that marker on
     *  the page. Otherwise it will pan to SASB.
     * @todo Find the default location and zoom level for the map.
     * @example
     * <pre>
     *  nyplGeocoderService.drawLegend('all-locations-map-legend');
     * </pre>
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

    /**
     * @ngdoc function
     * @name showResearchLibraries
     * @methodOf nypl_locations.service:nyplGeocoderService
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

    /**
     * @ngdoc function
     * @name showAllLibraries
     * @methodOf nypl_locations.service:nyplGeocoderService
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

    /**
     * @ngdoc function
     * @name createMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id The location's slug.
     * @param {object} location The location's coordinates as an object with
     *  latitude and longitude properties.
     * @param {string} text The location's address for the marker's infowindow,
     *  with markup since the infowindow allows markup.
     * @description This will create a Google Maps Marker and add it to the
     *  global markers array. If the marker is the user's marker, it will have
     *  a different icon, zIndex, and animation.
     * @example
     * <pre>
     *  nyplGeocoderService.createMarker('sibl', {
     *    latitude: 40.24,
     *    longitude: -73.24
     *  }, 'Science, Industry and Business Library (SIBL) 188 Madison Avenue ' +
     *   '@ 34th Street New York, NY, 10016');
     * </pre>
     */
    geocoderService.createMarker = function (id, location, text) {
      var marker,
        position =
          new google.maps.LatLng(location.latitude, location.longitude),
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

    /**
     * @ngdoc function
     * @name hideInfowindow
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description Hides the infowindow if the current infowindow is opened.
     * @example
     * <pre>
     *  // ... Do some map related interaction
     *  nyplGeocoderService.hideInfowindow();
     * </pre>
     */
    geocoderService.hideInfowindow = function () {
      infowindow.close();
      return this;
    };

    /**
     * @ngdoc function
     * @name doesMarkerExist
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id A marker's id.
     * @returns {boolean} True if the marker exists, false otherwise.
     * @description Checks the markers array for the marker with the id passed.
     * @example
     * <pre>
     *  if (nyplGeocoderService.doesMarkerExist('schwarzman')) {
     *    // Do something with the marker.
     *    nyplGeocoderService.panExistingMarker('schwarzman');
     *  }
     * </pre>
     */
    geocoderService.doesMarkerExist = function (id) {
      return !!getMarkerFromList(id);
    };

    /**
     * @ngdoc function
     * @name createSearchMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} coords Object with lat and long properties.
     * @param {string} text The text that should appear in the marker's
     *  infowindow.
     * @example
     * <pre>
     *  nyplGeocoderService.createSearchMarker({
     *    lat: 40.49, long: -74.26
     *  }, 'Infowindow description of the marker');
     * </pre>
     */
    geocoderService.createSearchMarker = function (coords, text) {
      var searchTerm = text.replace(',', ' <br>').replace(',', ' <br>'),
        panCoords = new google.maps.LatLng(coords.lat, coords.long);

      searchMarker.setPosition(panCoords);
      searchInfoWindow.setContent(searchTerm);
    };

    /**
     * @ngdoc function
     * @name drawSearchMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description If there are no filtered location to add to the map, and if
     *  the search marker is not already on the map, then add it to the map and
     *  pan to the marker. Also display the infowindow for that marker.
     */
    geocoderService.drawSearchMarker = function () {
      if (!filteredLocation) {
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

    /**
     * @ngdoc function
     * @name hideSearchInfowindow
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description Public wrapper to close the search marker's infowindow.
     */
    geocoderService.hideSearchInfowindow = function () {
      searchInfoWindow.close();
      return this;
    };

    /**
     * @ngdoc function
     * @name removeMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id A Google Maps marker's id.
     * @description Public function to remove a specific marker from the
     *  initialized map.
     */
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

    /**
     * @ngdoc function
     * @name panExistingMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id A location's slug.
     * @description Using the location's slug, pan to that marker on the map.
     *  Also display the infowindow.
     */
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

    return geocoderService;
  }
  nyplGeocoderService.$inject = ["$q"];

  angular
    .module('nypl_locations')
    .factory('nyplGeocoderService', nyplGeocoderService);

})();
