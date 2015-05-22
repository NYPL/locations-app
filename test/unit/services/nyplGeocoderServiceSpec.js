/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Geocoder Service Tests', function () {
  'use strict';

  /* 
   * nyplGeocoderService 
   * Queries Google Maps Javascript API to geocode addresses
   * and reverse geocode coordinates.
   */
  describe('Service: nyplGeocoderService', function () {
    var GeocoderMock, nyplGeocoderService, rootScope,
      map_controls_push_mock, httpBackend, mapPrototype,
      infowindow_open_mock, infowindow_close_mock, infowindow_setContent_mock;

    beforeEach(function () {
      module('nypl_locations');

      window.google = jasmine.createSpy('google');
      google.maps = jasmine.createSpy('maps');
      google.maps.InfoWindow = jasmine.createSpy('InfoWindow');
      infowindow_close_mock =
        google.maps.InfoWindow.prototype.close =
        jasmine.createSpy('InfoWindow.close');
      infowindow_setContent_mock =
        google.maps.InfoWindow.prototype.setContent =
        jasmine.createSpy('InfoWindow.setcontent');
      infowindow_open_mock =
        google.maps.InfoWindow.prototype.open =
        jasmine.createSpy('InfoWindow.open');
      google.maps.Map = jasmine.createSpy('Map');
      google.maps.Marker = jasmine.createSpy('Marker');
      google.maps.Animation = jasmine.createSpy('Animation');
      google.maps.Animation.DROP = jasmine.createSpy('Drop');
      google.maps.GeocoderStatus = jasmine.createSpy('GeocoderStatus');
      google.maps.GeocoderStatus.OK = 'OK';
      google.maps.ControlPosition = jasmine.createSpy('ControlPosition');
      google.maps.ControlPosition.RIGHT_BOTTOM =
        jasmine.createSpy('RIGHT_BOTTOM');
      google.maps.event = jasmine.createSpy('maps.events');
      google.maps.event.addListener =
        jasmine.createSpy('maps.event.addListener');
      mapPrototype = google.maps.Map.prototype;
      mapPrototype.controls = jasmine.createSpy('map.controls');
      mapPrototype.controls[google.maps.ControlPosition.RIGHT_BOTTOM] =
          jasmine.createSpy('map.controls.position');
      map_controls_push_mock =
        mapPrototype.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push =
          jasmine.createSpy('map.controls.push');
      google.maps.Map.prototype.panTo = jasmine.createSpy('map.panTo');
      google.maps.Map.prototype.setZoom = jasmine.createSpy('map.setZoom');
      google.maps.Marker.prototype.setMap = jasmine.createSpy('marker.setMap');
      google.maps.Marker.prototype.getMap = jasmine.createSpy('marker.getMap');
      google.maps.Marker.prototype.getPosition =
        jasmine.createSpy('marker.getPosition');
      google.maps.Marker.prototype.setPosition =
        jasmine.createSpy('marker.setPosition');

      GeocoderMock = window.google.maps.Geocoder =
        jasmine.createSpy('Geocoder');
      window.google.maps.LatLng = jasmine.createSpy('LatLng');
      window.google.maps.LatLngBounds = jasmine.createSpy('LatLngBounds');

      inject(function ($rootScope, _nyplGeocoderService_, _$httpBackend_) {
        nyplGeocoderService = _nyplGeocoderService_;
        rootScope = $rootScope;
        httpBackend = _$httpBackend_;

        // Not sure how or why this happens...
        httpBackend
          .whenJSONP('http://dev.refinery.aws.nypl.org/api/nypl/locations/v1.0/alerts' +
            '?callback=JSON_CALLBACK')
          .respond({});

        httpBackend
          .expectGET('views/locations.html')
          .respond('public/views/locations.html');

        httpBackend
          .expectGET('views/location-list-view.html')
          .respond('public/views/location-list-view.html');

        // httpBackend
        //   .expectGET('views/404.html')
        //   .respond('public/views/404.html');

        // httpBackend.flush();
      });
    });

    // afterEach(function() {
    //   httpBackend.verifyNoOutstandingExpectation();
    //   httpBackend.verifyNoOutstandingRequest();
    // });

    it('should expose some functions', function () {
      expect(nyplGeocoderService.geocodeAddress).toBeDefined();
      expect(nyplGeocoderService.reverseGeocoding).toBeDefined();
      expect(nyplGeocoderService.drawMap).toBeDefined();
      expect(nyplGeocoderService.drawLegend).toBeDefined();
      expect(nyplGeocoderService.panMap).toBeDefined();
      expect(nyplGeocoderService.showResearchLibraries).toBeDefined();
      expect(nyplGeocoderService.showAllLibraries).toBeDefined();
      expect(nyplGeocoderService.createMarker).toBeDefined();
      expect(nyplGeocoderService.hideInfowindow).toBeDefined();
      expect(nyplGeocoderService.doesMarkerExist).toBeDefined();
      expect(nyplGeocoderService.createSearchMarker).toBeDefined();
      expect(nyplGeocoderService.drawSearchMarker).toBeDefined();
      expect(nyplGeocoderService.hideSearchInfowindow).toBeDefined();
      expect(nyplGeocoderService.removeMarker).toBeDefined();
      expect(nyplGeocoderService.panExistingMarker).toBeDefined();
    });

    /* nyplGeocoderService.geocodeAddress */
    describe('nyplGeocoderService.geocodeAddress', function () {
      var GeoCodingOK, GeoCodingError;

      beforeEach(function () {
        GeoCodingOK = function (params, callback) {
          callback(
            // The result param
            [{geometry: {location: {
              lat: function () { return 40.75298660000001; },
              lng: function () { return -73.9821364; }
            }},
            formatted_address: "New York, NY 10018, USA"}
            ],
            // The error param
            'OK'
          );
        };

        GeoCodingError = function (params, callback) {
          callback(
            // The result param
            {result: 'Fake result'},
            // The status param
            'Google Maps is unavailable'
          );
        };
      });

      describe('geocodeAddress function successful', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(GeoCodingOK);
        });

        it('should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('should call the geocode api when calling the service', function () {
          nyplGeocoderService.geocodeAddress('10018');
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('should return a promise', function () {
          var promise = nyplGeocoderService.geocodeAddress('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();

          nyplGeocoderService.geocodeAddress('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        it('should resolve the promise when receiving data', function () {
          var lat, long, name;

          nyplGeocoderService
            .geocodeAddress('10013')
            .then(function (data) {
              lat = data.lat;
              long = data.long;
              name = data.name;
            });

          rootScope.$apply();

          expect(lat).toEqual(40.75298660000001);
          expect(long).toEqual(-73.9821364);
          expect(name).toEqual("New York, NY 10018, USA");
        });
      });

      describe('geocodeAddress function failed', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(GeoCodingError);
        });

        it('should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('should call the geocode api when calling the service', function () {
          nyplGeocoderService.geocodeAddress('10018');
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('should return a promise', function () {
          var promise = nyplGeocoderService.geocodeAddress('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();

          nyplGeocoderService
            .geocodeAddress('10018')
            .then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });

        it('should return an error', function () {
          var returnError,
            googleError = new Error('Google Maps is unavailable');

          nyplGeocoderService.geocodeAddress('10013')
            .then(function (data) {})
            .catch(function (err) {
              returnError = err;
            });

          rootScope.$apply();

          expect(returnError).toEqual(googleError);
        });

      });
    });
    /* end nyplGeocoderService.geocodeAddress */

    /* nyplGeocoderService.reverseGeocoding */
    describe('nyplGeocoderService.reverseGeocoding', function () {
      var reverseGeoCodingOK, reverseGeoCodingError;

      beforeEach(function () {
        reverseGeoCodingOK = function (params, callback) {
          callback(
            [{formatted_address: "New York, NY 10018, USA"}],
            'OK'
          );
        };

        reverseGeoCodingError = function (params, callback) {
          callback(
            {result: 'Fake result'},
            'Google Maps is unavailable'
          );
        };
      });

      describe('reverseGeocoding function successful', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(reverseGeoCodingOK);
        });

        it('should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('should be called', function () {
          nyplGeocoderService
            .reverseGeocoding({lat: 40.75298660000001, lng: -73.9821364});
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('should return a promise', function () {
          var promise = nyplGeocoderService.reverseGeocoding({
            lat: 40.75298660000001,
            lng: -73.9821364
          });
          expect(typeof promise.then).toBe('function');
        });

        it('should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();

          nyplGeocoderService.reverseGeocoding({
            lat: 40.75298660000001,
            lng: -73.9821364
          }).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        // Not sure why the following test is not working:
        it('should resolve the promise when receiving data', function () {
          var address;

          nyplGeocoderService
            .reverseGeocoding({ lat: 40.75298660000001, lng: -73.9821364 })
            .then(function (data) {
              address = data;
            });
          rootScope.$apply();

          expect(address).toEqual("New York, NY 10018, USA");
        });
      });

      describe('reverseGeocoding function failed', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(reverseGeoCodingError);
        });

        it('should be called', function () {
          nyplGeocoderService.reverseGeocoding({
            lat: 40.75298660000001,
            lng: -73.9821364
          });
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('should return a promise', function () {
          var promise = nyplGeocoderService.reverseGeocoding({
            lat: 40.75298660000001,
            lng: -73.9821364
          });
          expect(typeof promise.then).toBe('function');
        });

        it('should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();

          nyplGeocoderService
            .reverseGeocoding({
              lat: 40.75298660000001,
              lng: -73.9821364
            })
            .then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });

        it('should return an error', function () {
          var returnError,
            googleError = new Error('Google Maps is unavailable');

          nyplGeocoderService
            .reverseGeocoding({
              lat: 40.75298660000001,
              lng: -73.9821364
            })
            .then(function (data) {})
            .catch(function (error) {
              returnError = error;
            });
          rootScope.$apply();

          expect(returnError).toEqual(googleError);
        });
      });
    });
    /* end nyplGeocoderService.reverseGeocoding */

    describe('nyplGeocoderService.drawMap', function () {
      it('should call the Google Maps', function () {
        document.getElementById = function () {
          return '<div id="all-locations-map"></div>';
        };
        nyplGeocoderService
          .drawMap({ lat: 40.7532, long: -73.9822 }, 12, 'all-locations-map');

        expect(google.maps.LatLng)
          .toHaveBeenCalledWith(40.7532, -73.9822);
        expect(google.maps.Map).toHaveBeenCalled();
      });
    });

    // describe('nyplGeocoderService.drawLegend', function () {
    //   it('should call the controls function in the Maps API',
    //     function () {
    //       nyplGeocoderService
    //         .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map')
    //         .drawLegend('all-locations-map-legend');
    //       expect(map_controls_push_mock).toHaveBeenCalled();
    //     });
    // });

    describe('nyplGeocoderService.panMap', function () {
      beforeEach(function () {
        nyplGeocoderService
          .drawMap({lat: 40.7532, long: -73.9822}, 14, 'all-locations-map');
      });

      it('should call the google maps api functions to pan and zoom on the map',
        function () {
          // the panMap function pans to SASB by default
          nyplGeocoderService.panMap();
          // When we call the panMap function, we expect to call the
          // google maps panTo and setZoom functions avaible in the API
          // for the map

          expect(google.maps.LatLng).toHaveBeenCalledWith(40.7532, -73.9822);
          expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
          expect(google.maps.Map.prototype.setZoom).toHaveBeenCalledWith(12);
        });

      it('should pan to a specific marker', function () {
        var marker = new google.maps.Marker({});
        nyplGeocoderService
          .createMarker("schwarzman",
            { 'latitude': 40, 'longitude': -73}, "5th Avenue at 42nd St");

        nyplGeocoderService.panMap(marker);

        expect(google.maps.Marker.prototype.getPosition).toHaveBeenCalled();
        expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
        expect(google.maps.Map.prototype.setZoom).toHaveBeenCalledWith(14);
      });
    });

    describe('Functions for branch markers on map', function () {
      var i, len, locations, location;
      beforeEach(function () {
        locations = [
          {'slug': 'schwarzman',
            'location': {'latitude': 40, 'longitude': -73},
            'text': '5th Avenue at 42nd St'},
          {'slug': 'schomburg',
            'location': {'latitude': 41, 'longitude': -72},
            'text': 'address'},
          {'slug': 'lpa',
            'location': {'latitude': 42, 'longitude': -71},
            'text': 'address'},
          {'slug': 'sibl',
            'location': {'latitude': 43, 'longitude': -74},
            'text': 'address'},
          {'slug': 'baychester',
            'location': {'latitude': 44, 'longitude': -72},
            'text': 'address'},
          {'slug': 'parkchester',
            'location': {'latitude': 42, 'longitude': -72},
            'text': 'address'},
          {'slug': '115th-street',
            'location': {'latitude': 40, 'longitude': -71},
            'text': 'address'}
        ];
        len = locations.length;
        for (i = 0; i < len; i++) {
          location = locations[i];
          nyplGeocoderService
            .createMarker(location.slug, location.location, location.text);
        }
      });

      describe('nyplGeocoderService.showResearchLibraries', function () {
        it('should remove all markers from the map except research markers',
          function () {
            // Can't test that the markers were removed from the map, instead
            // I am checking to see that .setMap(null) was called three times
            // since it should exclude the four research libraries.
            nyplGeocoderService.showResearchLibraries();
            expect(google.maps.Marker.prototype.setMap.calls.count())
              .toEqual(3);
          });
      });

      describe('nyplGeocoderService.showAllLibraries', function () {
        it('should show all the libraries after the showResearchLibraries ' +
          'function is called',
          function () {
            nyplGeocoderService.showResearchLibraries();
            expect(google.maps.Marker.prototype.setMap.calls.count())
              .toEqual(3);

            // It was previously called three times and now it is expected to
            // be called seven more times.
            nyplGeocoderService.showAllLibraries();
            expect(google.maps.Marker.prototype.setMap.calls.count())
              .toEqual(10);
          });
      });

    });

    describe('nyplGeocoderService.createMarker', function () {
      it('should create a branch marker', function () {
        nyplGeocoderService.createMarker('schwarzman',
          { 'lat': 40.7532, 'long': -73.9822}, '5th Avenue at 42nd St');

        expect(google.maps.LatLng).toHaveBeenCalled();
        expect(google.maps.Marker).toHaveBeenCalled();
        expect(google.maps.event.addListener).toHaveBeenCalled();
      });

      it('should set the user marker on the map', function () {
        nyplGeocoderService.createMarker('user',
          { 'lat': 40.7532, 'long': -73.9822}, '5th Avenue at 42nd St');

        expect(google.maps.LatLng).toHaveBeenCalled();
        expect(google.maps.Marker).toHaveBeenCalled();
        expect(google.maps.event.addListener).toHaveBeenCalled();
      });
    });

    describe('nyplGeocoderService.hideInfowindow', function () {
      it('should close a Google Maps InfoWindow', function () {
        nyplGeocoderService.hideInfowindow();
        expect(infowindow_close_mock).toHaveBeenCalled();
      });
    });

    describe('nyplGeocoderService.doesMarkerExist', function () {
      var i, len, locations, location;
      beforeEach(function () {
        locations = [
          {'slug': 'schwarzman',
            'location': {'latitude': 40, 'longitude': -73},
            'text': '5th Avenue at 42nd St'},
          {'slug': 'lpa',
            'location': {'latitude': 42, 'longitude': -71},
            'text': 'address'}
        ];
        len = locations.length;
        for (i = 0; i < len; i++) {
          location = locations[i];
          nyplGeocoderService
            .createMarker(location.slug, location.location, location.text);
        }
      });

      it('should return true because the branch marker exists', function () {
        var exists = nyplGeocoderService.doesMarkerExist('schwarzman');
        expect(exists).toBe(true);
      });

      it('should return false because the marker does not exist', function () {
        var exists = nyplGeocoderService.doesMarkerExist('grand-central');
        expect(exists).toBe(false);
      });
    });

    describe('nyplGeocoderService.createSearchMarker', function () {
      it('should create a marker for the user\'s search query', function () {
        nyplGeocoderService.createSearchMarker(
          {'latitude': 40, 'longitude': -73},
          'Bryant Park'
        );

        expect(google.maps.LatLng).toHaveBeenCalled();
        expect(google.maps.Marker.prototype.setPosition).toHaveBeenCalled();
        expect(infowindow_setContent_mock).toHaveBeenCalledWith('Bryant Park');
      });
    });

    describe('nyplGeocoderService.drawSearchMarker', function () {
      it('should add the search marker to the map', function () {
        nyplGeocoderService.hideInfowindow =
          jasmine.createSpy('hideInfowindow');
        nyplGeocoderService.createSearchMarker(
          {'latitude': 40, 'longitude': -73},
          'Bryant Park'
        );
        nyplGeocoderService.drawSearchMarker();

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalled();
        expect(infowindow_open_mock).toHaveBeenCalled();
        expect(nyplGeocoderService.hideInfowindow).toHaveBeenCalled();
        expect(google.maps.event.addListener).toHaveBeenCalled();
      });
    });

    describe('nyplGeocoderService.hideSearchInfowindow', function () {
      it('should close a marker\'s InfoWindow', function () {
        nyplGeocoderService.hideSearchInfowindow();
        expect(infowindow_close_mock).toHaveBeenCalled();
      });
    });

    describe('nyplGeocoderService.removeMarker', function () {
      it('should not perform anything if no id was passed', function () {
        expect(nyplGeocoderService.removeMarker()).toEqual(nyplGeocoderService);
      });

      it('should set the search marker map to null to remove it', function () {
        nyplGeocoderService
          .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map')
          .drawSearchMarker(
            {lat: 40.8505949, long: -73.8769982},
            'chelsea piers'
          );

        nyplGeocoderService.removeMarker('search');

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(null);
      });

      it('should remove a branch marker that was on the map', function () {
        nyplGeocoderService
          .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map')
          .createMarker("schwarzman",
            { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

        nyplGeocoderService.removeMarker("schwarzman");

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(null);
      });
    });

    describe('panExistingMarker', function () {
      it('should pan to a marker that is already on the map and open ' +
        'the infowindow',
        function () {
          nyplGeocoderService
            .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map')
            .createMarker("schwarzman",
              { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

          nyplGeocoderService.panExistingMarker('schwarzman');

          // When we call it, we pan to that marker and
          // open the infowindow with text
          expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
          expect(google.maps.Map.prototype.setZoom).toHaveBeenCalled();
          expect(infowindow_close_mock).toHaveBeenCalled();
          expect(infowindow_setContent_mock)
            .toHaveBeenCalledWith("5th Avenue at 42nd St");
          expect(infowindow_open_mock).toHaveBeenCalled();
        });
    });

  });
  /* end nyplGeocoderService called directly */
});
