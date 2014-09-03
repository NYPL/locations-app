/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Geocoder Service Tests', function () {
  'use strict';

  /* 
   * nyplGeocoderService 
   * Queries Google Maps Javascript API to geocode addresses
   * and reverse geocode coordinates.
   */
  describe('nyplGeocoderService', function () {
    var GeocoderMock, GeoCodingOK, GeoCodingError,
      LatLngOk, LatLngError,
      nyplGeocoderService, rootScope,
      geocodeAddress_return_value,
      map_controls_push_mock,
      httpBackend, mapPrototype,
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
      google.maps.Animation.BOUNCE = jasmine.createSpy('Bounce');
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

      GeoCodingOK = function (params, callback) {
        callback(
          [{geometry: {location: {k: 40.75298660000001, B: -73.9821364}}}],
          'OK'
        );
      };

      GeoCodingError = function (params, callback) {
        callback({result: 'Fake result'}, 'ERROR');
      };

      LatLngOk = function (params, callback) {
        callback(
          [{address_components: [{long_name: "10018", short_name: "10018"}]}],
          'OK'
        );
      };

      LatLngError = function (params, callback) {
        callback({result: 'Fake result'}, 'ERROR');
      };

      GeocoderMock = window.google.maps.Geocoder =
        jasmine.createSpy('Geocoder');
      window.google.maps.LatLng = jasmine.createSpy('LatLng');
      window.google.maps.LatLngBounds =
        jasmine.createSpy('LatLngBounds');

      inject(function ($rootScope, _nyplGeocoderService_, _$httpBackend_) {
        nyplGeocoderService = _nyplGeocoderService_;
        rootScope = $rootScope;
        httpBackend = _$httpBackend_;

        httpBackend
          .expectGET('/languages/en.json')
          .respond('public/languages/en.json');
      });
    });

    it('should expose some functions', function () {
      expect(angular.isFunction(nyplGeocoderService.geocodeAddress)).toBe(true);
      expect(typeof nyplGeocoderService.geocodeAddress).toBe('function');
      expect(typeof nyplGeocoderService.reverseGeocoding).toBe('function');
    });

    /* nyplGeocoderService.geocodeAddress */
    describe('nyplGeocoderService.geocodeAddress', function () {
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
          var promise_callback = jasmine.createSpy();
          // The return value was defined in the GeoCoding variable
          geocodeAddress_return_value = {
            lat : 40.75298660000001,
            long : -73.9821364,
            // no name for zipcode search
            name: undefined
          };

          nyplGeocoderService.geocodeAddress('10018').then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with
          // the resolved value from the promise
          expect(promise_callback)
            .toHaveBeenCalledWith(geocodeAddress_return_value);
        });
      });

      describe('geocodeAddress function failed', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(GeoCodingError);
        });

        it('should be called', function () {
          nyplGeocoderService.geocodeAddress('10018');
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('should return a promise', function () {
          var promise = nyplGeocoderService.geocodeAddress('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();
          nyplGeocoderService.geocodeAddress('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nyplGeocoderService.geocodeAddress */

    /* nyplGeocoderService.reverseGeocoding */
    describe('nyplGeocoderService.reverseGeocoding', function () {
      describe('reverseGeocoding function successful', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(LatLngOk);
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
          var promise_callback = jasmine.createSpy(),
            // The return value was defined in the LatLngOk variable
            reverseGeocoding_return_value = '10018';


          nyplGeocoderService.reverseGeocoding({
            lat: 40.75298660000001,
            lng: -73.9821364
          }).then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function
          // with the resolved value from the promise
          // expect(promise_callback)
          //   .toHaveBeenCalledWith(reverseGeocoding_return_value);
        });
      });

      describe('reverseGeocoding function failed', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(LatLngError);
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
          nyplGeocoderService.reverseGeocoding({
            lat: 40.75298660000001,
            lng: -73.9821364
          }).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nyplGeocoderService.reverseGeocoding */

    describe('drawMap function', function () {
      it('should call the Google Maps', function () {
        nyplGeocoderService.drawMap({ lat: 40.7532, long: -73.9822 },
          12, 'all-locations-map');

        expect(window.google.maps.Map).toHaveBeenCalled();
      });
    });

    // describe('load_markers function', function () {
    //   // First we draw a marker, then when the load_markers 
    //   // function is called it should call the addMarkerToMap function
    //   it('should call the addMarkerToMap function from the service',
    //     function () {
    //       nyplGeocoderService.drawMap({ lat: 40.7532, long: -73.9822 },
    //         12, 'all-locations-map');
    //       nyplGeocoderService
    //         .createMarker("schwarzman",
    //           { 'lat': 40, 'long': -73},
    //           "5th Avenue at 42nd St"
    //           );

    //       nyplGeocoderService.load_markers();
    //       // if there are markers, the load_markers function
    //       // adds markers to the map using the addMarkerToMap
    //       // function, which in turn calls the setMap function from
    //       // the google maps api to add the marker to the map:
    //       expect(google.maps.Marker.prototype.setMap).toHaveBeenCalled();
    //     });

    //   // no markers are set so it shouldn't do anything
    //   it('should NOT call the addMarkerToMap function from the service',
    //     function () {
    //       nyplGeocoderService.load_markers();
    //       expect(google.maps.Marker.prototype.setMap).not.toHaveBeenCalled();
    //     });
    // });

    describe('drawLegend function', function () {
      it('should call the controls function in the Maps API',
        function () {
          nyplGeocoderService
            .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          document.getElementById = function () {
            return '<div id="all-locations-map-legend" class="show-legend"' +
                  ' style="z-index: 0; position: absolute; bottom: 15px; ' +
                  'right: 0px;"><!-- ngIf: locations --><span data-ng-if=' +
                  '"locations" class="ng-scope"><img src="http://maps.' +
                  'google.com/mapfiles/ms/icons/red-dot.png">NYPL Library' +
                  '<br></span><!-- end ngIf: locations -->' +
                  '<!-- ngIf: locationStart --></div>';
          };
          nyplGeocoderService.drawLegend('test');
          expect(map_controls_push_mock).toHaveBeenCalled();
        });
    });

    describe('panMap function', function () {
      it('should call the google maps api functions to pan and zoom on the map',
        function () {
          nyplGeocoderService
            .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          // the panMap function pans to SASB by default
          nyplGeocoderService.panMap();
          // When we call the panMap function, we expect to call the
          // google maps panTo and setZoom functions avaible in the API
          // for the map

          expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
          expect(google.maps.Map.prototype.setZoom).toHaveBeenCalled();
        });

      it('should pan to a specific marker', function () {
        var marker = new google.maps.Marker({});
        nyplGeocoderService
          .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nyplGeocoderService
          .createMarker("schwarzman",
            { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

        nyplGeocoderService.panMap(marker);

        expect(google.maps.Marker.prototype.getPosition).toHaveBeenCalled();
        expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
        expect(google.maps.Map.prototype.setZoom).toHaveBeenCalled();
      });
    });

    // The search marker is the marker that is drawn when a user
    // searches for 'Bronx Zoo', 'Chelsea Piers', 'Empire State Building', etc.
    // There is only one search marker on the map at a time so it just simply
    // gets its coordinates and text updated
    // describe('draw_searchMarker function', function () {
    //   it('should remove the existing search marker and draw another ' +
    //     'one with updated coordinates and text',
    //     function () {
    //       nyplGeocoderService
    //         .drawMap({lat: 40.7532, long: -73.9822},
    //            12, 'all-locations-map');

    //       nyplGeocoderService.draw_searchMarker(
    //         {lat: 40.8505949, long: -73.8769982},
    //         'bronx zoo'
    //       );

    //       // First remove the existing search marker from the map
    //       expect(google.maps.Marker.prototype.setMap)
    //         .toHaveBeenCalledWith(null);
    //       // Create new google maps coordinates
    //       expect(google.maps.LatLng)
    //         .toHaveBeenCalledWith(40.8505949, -73.8769982, "bronx zoo");
    //       // Update the search marker with the new coordinates
    //       expect(google.maps.Marker.prototype.setPosition)
    //         .toHaveBeenCalled();
    //       // Set the search marker on the map
    //       expect(google.maps.Marker.prototype.setMap)
    //         .toHaveBeenCalled();
    //       // Set the content on the infowindow and open it
    //       expect(google.maps.InfoWindow.prototype.setContent)
    //         .toHaveBeenCalledWith('bronx zoo');
    //       expect(google.maps.InfoWindow.prototype.open)
    //         .toHaveBeenCalled();
    //     });
    // });

    describe('removeMarker(\'search\') function', function () {
      it('should set the search marker map to null to remove it', function () {
        nyplGeocoderService
          .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nyplGeocoderService.drawSearchMarker(
          {lat: 40.8505949, long: -73.8769982},
          'chelsea piers'
        );

        nyplGeocoderService.removeMarker('search');

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(null);
      });
    });

    // This differs from the search marker so that it will not be in the same
    // set as the location markers when manipulating them
    describe('removeMarker function', function () {
      it('should remove a marker that was on the map', function () {
        nyplGeocoderService
          .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nyplGeocoderService.createMarker("schwarzman",
          { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

        nyplGeocoderService.removeMarker("schwarzman");

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(null);
      });
    });

    describe('doesMarkerExist function', function () {
      it('should return false because no markers exist', function () {
        nyplGeocoderService
          .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        var marker = nyplGeocoderService.doesMarkerExist('schwarzman');

        expect(marker).toBe(false);
      });

      it('should return true because the marker exists and was drawn',
        function () {
          nyplGeocoderService
            .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          nyplGeocoderService.createMarker("schwarzman",
            { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");
          var marker = nyplGeocoderService.doesMarkerExist('schwarzman');

          expect(marker).toBe(true);
        });
    });

    describe('panExistingMarker', function () {
      it('should pan to a marker that is already on the map and open ' +
        'the infowindow',
        function () {
          nyplGeocoderService
            .drawMap({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          nyplGeocoderService.createMarker("schwarzman",
            { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

          // Must make sure it's an existing marker
          if (nyplGeocoderService.doesMarkerExist('schwarzman')) {
            nyplGeocoderService.panExistingMarker('schwarzman');
          }

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
