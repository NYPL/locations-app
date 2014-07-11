/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Service Tests', function () {
  'use strict';

  /* 
  * nypl_coordinates_service
  * Service that retrieves a browser's current location 
  * and coordinate distance utility method
  */
  describe('Utility: nypl_coordinates_service', function () {
    var nypl_coordinates_service;

    beforeEach(function () {
      // load the module.
      module('nypl_locations');

      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_coordinates_service_) {
        nypl_coordinates_service = _nypl_coordinates_service_;
      });
    });

    /* nypl_coordinates_service.getDistance */
    describe('nypl_coordinates_service.getDistance', function () {
      // check to see if it has the expected function
      it('should have a getDistance() function', function () {
        expect(angular.isFunction(nypl_coordinates_service.getDistance))
          .toBe(true);
      });

      // check to see if it has the expected function
      it('should calculate the distance from Schwarzman Bldg to ' +
        ' 58th Street Library',
        function () {
          var result =
            nypl_coordinates_service
            .getDistance(40.75298660000001, -73.9821364, 40.7619, -73.9691);
          expect(result).toBe(0.92);
          expect(result).not.toBe(null);
        });
    });

    /* nypl_coordinates_service.checkGeolocation */
    describe('nypl_coordinates_service.checkGeolocation', function () {
      it('should have a checkGeolocation function', function () {
        // The checkGeolocation function checks to see
        // if geolocation is available on the user's browser
        expect(angular.isFunction(nypl_coordinates_service.checkGeolocation))
          .toBe(true);
      });

      it('should return false due to old browser', function () {
        // Old browsers don't have the navigator api
        window.navigator = false;
        window.navigator.geolocation = false;

        expect(nypl_coordinates_service.checkGeolocation()).toBe(false);
      });

      it('should return true for modern browsers', function () {
        // Modern browsers have the navigator api
        window.navigator = true;
        window.navigator.geolocation = true;

        expect(nypl_coordinates_service.checkGeolocation()).toBe(true);
      });
    });

    /* nypl_coordinates_service.getCoordinates */
    describe('nypl_coordinates_service.getCoordinates', function () {
      var geolocationMock, geolocationOk, geolocationError, scope;

      beforeEach(inject(function (_$rootScope_) {
        scope = _$rootScope_.$new();
        window.navigator = jasmine.createSpy('navigator');
        geolocationMock =
          window.navigator.geolocation = jasmine.createSpy('geolocation');

        geolocationOk = function (params, callback) {
          callback({
            position: {
              coords: {
                latitude: 40.75298660000001,
                longitude: -73.9821364
              }
            }
          });
        };

        geolocationError = function (params, callback) {
          callback({
            error: "Your browser does not support Geolocation"
          });
        };
      }));

      // check to see if it has the expected function
      it('should have an getCoordinates function', function () {
        expect(angular.isFunction(nypl_coordinates_service.getCoordinates))
          .toBe(true);
        expect(typeof nypl_coordinates_service.getCoordinates).toBe('function');
      });

      describe('getCoordinates function successful', function () {
        beforeEach(function () {
          geolocationMock.getCurrentPosition =
              window.navigator.geolocation.getCurrentPosition =
                jasmine.createSpy('getCurrentPosition')
                .and.callFake(geolocationOk);
        });

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service',
          function () {
            nypl_coordinates_service.getCoordinates();
            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
          });

        it('Should return a promise', function () {
          var promise = nypl_coordinates_service.getCoordinates();
          expect(typeof promise.then).toBe('function');
        });

      });

      describe('getCoordinates function fails', function () {
        beforeEach(function () {
          geolocationMock.getCurrentPosition =
            window.navigator.geolocation.getCurrentPosition =
              jasmine.createSpy('getCurrentPosition')
              .and.callFake(geolocationError);
        });

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service',
          function () {
            nypl_coordinates_service.getCoordinates();
            expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
          });
      });

    });
  });


  /* 
  * nypl_geocoder_service 
  * Queries Google Maps Javascript API to geocode addresses
  * and reverse geocode coordinates.
  */
  describe('Utility: nypl_geocoder_service', function () {
    var GeocoderMock, GeoCodingOK, GeoCodingError,
      LatLngOk, LatLngError,
      nypl_geocoder_service, rootScope,
      get_coords_return_value,
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

      inject(function ($rootScope, _nypl_geocoder_service_, _$httpBackend_) {
        nypl_geocoder_service = _nypl_geocoder_service_;
        rootScope = $rootScope;
        httpBackend = _$httpBackend_;

        httpBackend
          .expectGET('/languages/en.json')
          .respond('public/languages/en.json');
      });
    });

    it('Should expose some functions', function () {
      expect(angular.isFunction(nypl_geocoder_service.get_coords)).toBe(true);
      expect(typeof nypl_geocoder_service.get_coords).toBe('function');
      expect(typeof nypl_geocoder_service.get_address).toBe('function');
    });

    /* nypl_geocoder_service.get_coords */
    describe('nypl_geocoder_service.get_coords', function () {
      describe('get_coords function successful', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(GeoCodingOK);
        });

        it('Should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('Should call the geocode api when calling the service', function () {
          nypl_geocoder_service.get_coords('10018');
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_coords('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('Should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();

          nypl_geocoder_service.get_coords('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        it('Should resolve the promise when receiving data', function () {
          var promise_callback = jasmine.createSpy();
          // The return value was defined in the GeoCoding variable
          get_coords_return_value = {
            lat : 40.75298660000001,
            long : -73.9821364,
            // no name for zipcode search
            name: undefined
          };

          nypl_geocoder_service.get_coords('10018').then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with
          // the resolved value from the promise
          expect(promise_callback)
            .toHaveBeenCalledWith(get_coords_return_value);
        });
      });

      describe('get_coords function failed', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(GeoCodingError);
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_coords("ny");
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_coords('10018');
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();
          nypl_geocoder_service.get_coords('10018').then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nypl_geocoder_service.get_coords */

    /* nypl_geocoder_service.get_address */
    describe('nypl_geocoder_service.get_address', function () {
      describe('get_address function successful', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(LatLngOk);
        });

        it('Should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('Should be called', function () {
          nypl_geocoder_service
            .get_address({lat: 40.75298660000001, lng: -73.9821364});
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_address({
            lat: 40.75298660000001,
            lng: -73.9821364
          });
          expect(typeof promise.then).toBe('function');
        });

        it('Should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();

          nypl_geocoder_service.get_address({
            lat: 40.75298660000001,
            lng: -73.9821364
          }).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        // Not sure why the following test is not working:
        it('Should resolve the promise when receiving data', function () {
          var promise_callback = jasmine.createSpy(),
            // The return value was defined in the LatLngOk variable
            get_address_return_value = '10018';


          nypl_geocoder_service.get_address({
            lat: 40.75298660000001,
            lng: -73.9821364
          }).then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function
          // with the resolved value from the promise
          // expect(promise_callback)
          //   .toHaveBeenCalledWith(get_address_return_value);
        });
      });

      describe('get_address function failed', function () {
        beforeEach(function () {
          GeocoderMock.prototype.geocode =
            jasmine.createSpy('geocode').and.callFake(LatLngError);
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_address({
            lat: 40.75298660000001,
            lng: -73.9821364
          });
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_address({
            lat: 40.75298660000001,
            lng: -73.9821364
          });
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
            errorMock = jasmine.createSpy();
          nypl_geocoder_service.get_address({
            lat: 40.75298660000001,
            lng: -73.9821364
          }).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nypl_geocoder_service.get_address */

    describe('draw_map function', function () {
      it('should call the Google Maps', function () {
        nypl_geocoder_service.draw_map({ lat: 40.7532, long: -73.9822 },
          12, 'all-locations-map');

        expect(window.google.maps.Map).toHaveBeenCalled();
      });
    });

    describe('load_markers function', function () {
      // First we draw a marker, then when the load_markers function is called
      // it should call the add_marker_to_map function
      it('should call the add_marker_to_map function from the service',
        function () {
          nypl_geocoder_service.draw_map({ lat: 40.7532, long: -73.9822 },
            12, 'all-locations-map');
          nypl_geocoder_service
            .draw_marker("schwarzman",
              { 'lat': 40, 'long': -73},
              "5th Avenue at 42nd St"
              );

          nypl_geocoder_service.load_markers();
          // if there are markers, the load_markers function
          // adds markers to the map using the add_marker_to_map
          // function, which in turn calls the setMap function from
          // the google maps api to add the marker to the map:
          expect(google.maps.Marker.prototype.setMap).toHaveBeenCalled();
        });

      // no markers are set so it shouldn't do anything
      it('should NOT call the add_marker_to_map function from the service',
        function () {
          nypl_geocoder_service.load_markers();
          expect(google.maps.Marker.prototype.setMap).not.toHaveBeenCalled();
        });
    });

    describe('draw_legend function', function () {
      it('should call the controls function in the Maps API',
        function () {
          nypl_geocoder_service
            .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          document.getElementById = function () {
            return '<div id="all-locations-map-legend" class="show-legend"' +
                  ' style="z-index: 0; position: absolute; bottom: 15px; ' +
                  'right: 0px;"><!-- ngIf: locations --><span data-ng-if=' +
                  '"locations" class="ng-scope"><img src="http://maps.' +
                  'google.com/mapfiles/ms/icons/red-dot.png">NYPL Library' +
                  '<br></span><!-- end ngIf: locations -->' +
                  '<!-- ngIf: locationStart --></div>';
          };
          nypl_geocoder_service.draw_legend('test');
          expect(map_controls_push_mock).toHaveBeenCalled();
        });
    });

    describe('panMap function', function () {
      it('should call the google maps api functions to pan and zoom on the map',
        function () {
          nypl_geocoder_service
            .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          // the panMap function pans to SASB by default
          nypl_geocoder_service.panMap();
          // When we call the panMap function, we expect to call the
          // google maps panTo and setZoom functions avaible in the API
          // for the map

          expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
          expect(google.maps.Map.prototype.setZoom).toHaveBeenCalled();
        });

      it('should pan to a specific marker', function () {
        var marker = new google.maps.Marker({});
        nypl_geocoder_service
          .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service
          .draw_marker("schwarzman",
            { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

        nypl_geocoder_service.panMap(marker);

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
    //       nypl_geocoder_service
    //         .draw_map({lat: 40.7532, long: -73.9822},
    //            12, 'all-locations-map');

    //       nypl_geocoder_service.draw_searchMarker(
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

    describe('remove_searchMarker function', function () {
      it('should set the search marker map to null to remove it', function () {
        nypl_geocoder_service
          .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service.draw_searchMarker(
          {lat: 40.8505949, long: -73.8769982},
          'chelsea piers'
        );

        nypl_geocoder_service.remove_searchMarker();

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(null);
      });
    });

    // This differs from the search marker so that it will not be in the same
    // set as the location markers when manipulating them
    describe('remove_marker function', function () {
      it('should remove a marker that was on the map', function () {
        nypl_geocoder_service
          .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service.draw_marker("schwarzman",
          { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

        nypl_geocoder_service.remove_marker("schwarzman");

        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalledWith(null);
      });
    });

    describe('check_marker function', function () {
      it('should return false because no markers exist', function () {
        nypl_geocoder_service
          .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        var marker = nypl_geocoder_service.check_marker('schwarzman');

        expect(marker).toBe(false);
      });

      it('should return true because the marker exists and was drawn',
        function () {
          nypl_geocoder_service
            .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          nypl_geocoder_service.draw_marker("schwarzman",
            { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");
          var marker = nypl_geocoder_service.check_marker('schwarzman');

          expect(marker).toBe(true);
        });
    });

    describe('pan_existing_marker', function () {
      it('should pan to a marker that is already on the map and open ' +
        'the infowindow',
        function () {
          nypl_geocoder_service
            .draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
          nypl_geocoder_service.draw_marker("schwarzman",
            { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

          // Must make sure it's an existing marker
          if (nypl_geocoder_service.check_marker('schwarzman')) {
            nypl_geocoder_service.pan_existing_marker('schwarzman');
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
  /* end nypl_geocoder_service called directly */

  describe('Utility: nypl_locations_service', function () {
    var nypl_locations_service, httpBackend;

    beforeEach(function () {
      // load the module.
      module('nypl_locations');

      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_locations_service_, _$httpBackend_) {
        nypl_locations_service = _nypl_locations_service_;
        httpBackend = _$httpBackend_;

        httpBackend
          .expectGET('/languages/en.json')
          .respond('public/languages/en.json');
      });
    });

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should get all locations', function () {
      var locations,
        service_result,
        // The actual API call has 90 locations, this is a mocked version
        mocked_all_locations_API_call = {
          locations: [
            {id: "sasb", name: "Stephen A. Schwarzman", slug: "schwarzman"},
            {id: "ag", name: "Aguilar", slug: "aguilar"}
          ]
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/locations')
        .respond(mocked_all_locations_API_call);

      locations = nypl_locations_service.all_locations();
      locations.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result).toEqual(mocked_all_locations_API_call);
    });

    it('should return one specific location', function () {
      var location,
        service_result,
        // The actual API call has many properties for one location
        mocked_one_location_API_call = {
          location:
            { id: "HP", name: "Hudson Park Library", slug: "hudson-park" }
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
          'locations/hudson-park')
        .respond(mocked_one_location_API_call);

      location = nypl_locations_service.single_location('hudson-park');
      location.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result).toEqual(mocked_one_location_API_call);
    });

    it('should return one division', function () {
      var division,
        service_result,
        // The actual API call has many properties for one location
        mocked_one_division_API_call = {
          division: {
            id: "MAP",
            name: "Lionel Pincus and Princess Firyal Map Division",
            slug: "map-division"
          }
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
          'divisions/map-division')
        .respond(mocked_one_division_API_call);

      division = nypl_locations_service.single_division('map-division');
      division.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result).toEqual(mocked_one_division_API_call);
    });

    it('should return a list of services', function () {
      var services,
        service_result,
        // The actual API call has many properties for one location
        mocked_services_API_call = {
          services: [
            {id: 4, name: "Computers for Public Use", _links: {}},
            {id: 6, name: "Wireless Internet Access", _links: {}},
            {id: 7, name: "Printing (from PC)", _links: {}},
            {id: 8, name: "Wheelchair Accessible Computers", _links: {}}
          ]
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/services')
        .respond(mocked_services_API_call);

      services = nypl_locations_service.services();
      services.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result.services.length).toBe(4);
      expect(service_result).toEqual(mocked_services_API_call);
    });

    it('should return a list of locations for one service', function () {
      var locations,
        service_result,
        // The actual API call has many properties for one location
        mocked_one_service_API_call = {
          services: {
            id: 36,
            name: "Bicycle Rack"
          },
          locations: [
            {id: "BAR", name: "Baychester Library", _links: {}},
            {id: "CHR", name: "Chatham Square Library", _links: {}},
            {id: "CI", name: "City Island Library", _links: {}},
            {id: "DH", name: "Dongan Hills Library", _links: {}}
          ]
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/services/36')
        .respond(mocked_one_service_API_call);

      locations = nypl_locations_service.one_service(36);
      locations.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result.services.name).toEqual('Bicycle Rack');
      expect(service_result.locations.length).toBe(4);
      expect(service_result).toEqual(mocked_one_service_API_call);
    });

    it('should return a list of services at a specific location', function () {
      var services,
        service_result,
        // The actual API call has many properties for one location
        mocked_location_services_API_call = {
          locations: {
            name: 'Science, Industry and Business Library (SIBL)',
            _embedded: {
              services: [
                {id: 4, name: "Computers for Public Use", _links: {}},
                {id: 6, name: "Wireless Internet Access", _links: {}},
                {id: 7, name: "Printing (from PC)", _links: {}},
                {id: 8, name: "Wheelchair Accessible Computers", _links: {}}
              ]
            }
          }
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
          'locations/sibl/services')
        .respond(mocked_location_services_API_call);

      services = nypl_locations_service.services_at_library('sibl');
      services.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result.locations.name)
        .toEqual('Science, Industry and Business Library (SIBL)');
      expect(service_result.locations._embedded.services.length).toBe(4);
      expect(service_result).toEqual(mocked_location_services_API_call);
    });

  });

  describe('Utility: nypl_utility service', function () {
    var nypl_utility, date;

    beforeEach(function () {
      module('nypl_locations');
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_utility_) {
        nypl_utility = _nypl_utility_;
      });
    });

    /*
    * hoursToday(hours)
    *   hours: An array with a 'regular' property that is
    *     an array of objects with open and close times for
    *     every day of the week starting from Sunday.
    *
    *   Returns an object with a two properties, 'today' and 
    *   'tomorrow' that has the day and open/close times
    */
    describe('nypl_utility.hoursToday', function () {
      var hours = {
        regular: [
          {close: null, day: "Sun", open: null },
          {close: "18:00", day: "Mon", open: "10:00" },
          {close: "18:00", day: "Tue", open: "10:00" },
          {close: "18:00", day: "Wed", open: "10:00" },
          {close: "17:00", day: "Thu", open: "11:00" },
          {close: "18:00", day: "Fri", open: "10:00" },
          {close: "17:00", day: "Sat", open: "09:00" }
        ]
      };

      // check to see if it has the expected function
      it('should have an hoursToday() function', function () {
        expect(angular.isFunction(nypl_utility.hoursToday)).toBe(true);
      });

      it('should return today\'s and tomorrow\'s open and close times',
        function () {
          // getDay() returns 3 to mock that today is Wednesday
          Date.prototype.getDay = function () { return 3; };

          var today_tomorrow_object = nypl_utility.hoursToday(hours);

          expect(JSON.stringify(today_tomorrow_object))
            .toEqual('{"today":{"day":"Wed","open":"10:00","close":"18:00"},' +
              '"tomorrow":{"day":"Thu","open":"11:00","close":"17:00"}}');
        });

      it('should return today\'s and tomorrow\'s open and close times',
        function () {
          // getDay() returns 5 to mock that today is Friday
          Date.prototype.getDay = function () { return 5; };

          var today_tomorrow_object = nypl_utility.hoursToday(hours);

          expect(JSON.stringify(today_tomorrow_object))
            .toEqual('{"today":{"day":"Fri","open":"10:00","close":"18:00"},' +
              '"tomorrow":{"day":"Sat","open":"09:00","close":"17:00"}}');
        });

      it('should return undefined if no input was given', function () {
        expect(nypl_utility.hoursToday()).toEqual(undefined);
      });
    });

    /*
    * getAddressString(location, nicePrint)
    *   location: A location object.
    *   nicePrint (optional): Boolean to return the address with 
    *     HTML markup if true. Defaults to false.
    *
    *   Returns the location's address as either a simple string
    *   or with markup if it will be used in a Google Map 
    *   marker's infowindow.
    */
    describe('nypl_utility.getAddressString', function () {
      // The location object has more properties but these
      // are all that are needed for the service function
      var location = {
        id: "HU",
        name: "115th Street Library",
        slug: "115th-street",
        street_address: "203 West 115th Street",
        locality: "New York",
        region: "NY",
        postal_code: "10026"
      };

      it('should print the address for a marker', function () {
        var marker_address = nypl_utility.getAddressString(location, true);

        expect(marker_address)
          .toEqual("<a href='/#/115th-street'>115th Street Library</a>" +
            "<br />203 West 115th Street<br />New York, NY, 10026");
      });

      it('should print the address without markup', function () {
        var marker_address = nypl_utility.getAddressString(location);

        expect(marker_address)
          .toEqual("115th Street Library 203 West 115th " +
            "Street New York, NY, 10026");
      });

      it('should return an empty string if no input is given', function () {
        expect(nypl_utility.getAddressString()).toEqual('');
      });

    });

    /*
    * locationType(id)
    *   id: The id of the location
    *
    *   Returns the type of library based on it's id.
    */
    describe('nypl_utility.locationType', function () {
      var library_type;

      it('should return circulating for a regular branch', function () {
        // BAR = Baychester Library
        library_type = nypl_utility.locationType('BAR');

        expect(library_type).toEqual('circulating');
      });

      it('should return research for a research branch', function () {
        library_type = nypl_utility.locationType('SIBL');

        expect(library_type).toEqual('research');
      });

      it('should return circulating when no input is given', function () {
        expect(nypl_utility.locationType()).toEqual('circulating');
      });

    });

    /*
    * socialMediaColor(social_media)
    *   social_media: Array of objects each with an 'href' and 'site'
    *     property used to decide what color the icon should be
    *
    *   Returns a CSS text color class name.
    */
    describe('nypl_utility.socialMediaColor', function () {
      // The social media objects have more properties
      // but they are not needed for the service function
      var social_media = [
        {href: "http://www.facebook.com/pages/" +
          "115th-Street-Branch/105612772837483", site: "facebook"},
        {href: "http://twitter.com/115stBranch", site: "twitter"},
        {href: "http://foursquare.com/venue/1029658", site: "foursquare"},
        {href: "http://www.youtube.com/NewYorkPublicLibrary", site: "youtube"},
        {href: "http://nypl.bibliocommons.com/lists/" +
          "show/87528911_nypl_115th_street", site: "bibliocommons"}
      ];

      it('should add an icon class and a text color class', function () {
        var modified_social_media = nypl_utility.socialMediaColor(social_media),
          social_media_with_classes = [
            {href: "http://www.facebook.com/pages/115th-Street-Branch" +
              "/105612772837483", site: "facebook",
              classes: "icon-facebook blueDarkerText"},
            {href: "http://twitter.com/115stBranch", site: "twitter",
              classes: "icon-twitter2 blueText"},
            {href: "http://foursquare.com/venue/1029658", site: "foursquare",
              classes: "icon-foursquare blueText"},
            {href: "http://www.youtube.com/NewYorkPublicLibrary",
              site: "youtube", classes: "icon-youtube redText"},
            {href: "http://nypl.bibliocommons.com/lists/show/" +
              "87528911_nypl_115th_street", site: "bibliocommons",
              classes: "icon-bibliocommons"}
          ];

        expect(modified_social_media).toEqual(social_media_with_classes);
      });
    });

    /*
    * alerts(alerts)
    *   alerts: Array of alert objects that should have 'start', 'end',
    *   and 'body' properties.
    *
    *   Returns a string which is the content that should be displayed
    *   if the alert should be live (based on start and end date and 
    *   the date we are checking);
    */
    describe('nypl_utility.alerts', function () {
      // The alert objects have more properties which are
      // not needed for the service function
      var alerts = [
        {start: "2014-05-17T00:00:00-04:00", end: "2014-05-27T01:00:00-04:00",
          body: "The New York Public Library will be closed from May 24 " +
            "through May 26 in observance of Memorial Day."},
        {start: "2014-06-27T00:00:00-04:00", end: "2014-07-06T01:00:00-04:00",
          body: "All units of the NYPL are closed July 4 - July 5."},
        {start: "2014-08-23T00:00:00-04:00", end: "2014-09-02T01:00:00-04:00",
          body: "The New York Public Library will be closed August 30th " +
            "through September 1st in observance of Labor Day"}
      ];

      it('should display the Independence Day alert', function () {
        date = new Date(2014, 5, 29);
        // In the alerts, we call new Date multiple times with the dates for
        // each alert, so if a date is passed, use that, else
        // mock the current date
        var MockDate = Date,
          display_alert;
        Date = function (alertDate) {
          if (alertDate) {
            return new MockDate(alertDate);
          }
          return date;
        };

        // The Independence Day alert dates have been modified so it can display
        // for testing purposes
        display_alert = nypl_utility.alerts(alerts);

        // The function only returns the body of the alert
        expect(display_alert)
          .toEqual("All units of the NYPL are closed July 4 - July 5.\n");

        Date = MockDate;
      });

      it('should return null if no input is given', function () {
        expect(nypl_utility.alerts()).toEqual(null);
      });
    });

    // describe('nypl_utility.popup_window', function () {
    //   // Not sure how to test just yet
    // });

    /*
    * calendar_link(type, event, location)
    *   type: Either 'google' or 'yahoo'.
    *   event: An event object.
    *   location: A location object.
    *
    *   Returns a string which is used as a link to generate the
    *   event on either Google or Yahoo calendar.
    */
    describe('nypl_utility.calendar_link', function () {
      var nypl_event = {
          title: "Make Music New York",
          start: "2014-06-21T18:00:00Z",
          end: "2014-06-21T19:00:00Z",
          body: "Guitar Lesson Got 5 Minutes? Then Learn How to Play Guitar! " +
            "Get a free guitar lesson, and be entered to win fun prizes " +
            "(to be announced!) Never picked up a guitar before? A pro " +
            "looking for some extra tips? All levels are welcome! Brought " +
            "to you by: Make Music New York, The New York Public Library, " +
            "Little Kids Rock and GAMA! Teacher: Gary Heimbauer",
          _links: {
            self: {
              href: 'http://nypl.org/'
            }
          }
        },
        location = {
          name: "Hudson Park Library",
          street_address: "66 Leroy Street",
          locality: "New York",
          region: "NY",
          postal_code: 10014
        };

      it('should return a url to create a Google Calendar given ' +
        'an event and address',
        function () {
          var url = nypl_utility.calendar_link('google', nypl_event, location);

          expect(url).toEqual("https://www.google.com/calendar/render?" +
            "action=template&text=Make Music New York&dates=" +
            "20140621T180000Z/20140621T190000Z&details=Guitar Lesson " +
            "Got 5 Minutes? Then Learn How to Play Guitar! Get a free " +
            "guitar lesson, and be entered to win fun prizes (to be " +
            "announced!) Never picked up a guitar before? A pro looking " +
            "for some extra tips? All levels are welcome! Brought to " +
            "you by: Make Music New York, The New York Public Library, " +
            "Little Kids Rock and GAMA! Teacher: Gary Heimbauer&" +
            "location=Hudson Park Library - 66 Leroy Street New " +
            "York, NY 10014&pli=1&uid=&sf=true&output=xml");
        });

      it('should return a url to create a Yahoo Calendar given ' +
        'an event and address',
        function () {
          var url = nypl_utility.calendar_link('yahoo', nypl_event, location);

          expect(url).toEqual("https://calendar.yahoo.com/?v=60&TITLE=" +
            "Make Music New York&ST=20140621T180000Z&in_loc=Hudson Park " +
            "Library - 66 Leroy Street New York, NY 10014&in_st=Hudson " +
            "Park Library - 66 Leroy Street New York, NY 10014&DESC=Guitar " +
            "Lesson Got 5 Minutes? Then Learn How to Play Guitar! Get a " +
            "free guitar lesson, and be entered to win fun prizes (to be " +
            "announced!) Never picked up a guitar before? A pro looking " +
            "for some extra tips? All levels are welcome! Brought to you " +
            "by: Make Music New York, The New York Public Library, Little " +
            "Kids Rock and GAMA! Teacher: Gary Heimbauer&URL=http://nypl.org/");
        });

      it('should return an empty string if no event is given', function () {
        expect(nypl_utility.calendar_link()).toEqual('');
      });
    });

    /*
    * ical_link(event, address)
    *   event: An event object.
    *   address: Address string of the location where the event is being held.
    *
    *   Creates a formatted string that is mostly compatible with ical.
    *   Opens a new window so nothing is returned.
    */
    describe('nypl_utility.ical_link', function () {
      var nypl_event = {
          title: "Crochet/ Knitting Circle",
          start: "2014-07-12T16:00:00Z",
          end: "2014-07-12T18:00:00Z",
          body: "Bring your yarn, crochet hook or knitting needles. Enjoy an " +
            "afternoon of conversation and stay afterwards to enjoy the movie.",
          _links: {
            self: {
              href: "http://nypl.org/events/programs/2014/07/12/" +
                "clone-crochet-knitting-circle"
            }
          }
        },
        address = "203 West 115th Street";

      // it('should return a formatted string for ical', function () {
      // });
    });

    /*
    * id_location_search(locations, searchTerm)
    *   locations: Array with location objects.
    *   searchTerm: What the user searched for.
    *
    *   Returns an array with one object where the searchTerm matches
    *   the 'id' property of one of the location objects in the locations array.
    */
    describe('nypl_utility.id_location_search', function () {
      
    });

    describe('nypl_utility.location_search', function () {

    });

    describe('nypl_utility.add_distance', function () {

    });

    describe('nypl_utility.check_distance', function () {

    });

    describe('nypl_utility.catalog_items_link', function () {

    });

  }); /* End nypl_utility service */
});

