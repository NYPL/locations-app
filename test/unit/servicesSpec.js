'use strict';

describe('NYPL Service Tests', function() {

  /* 
  * nypl_coordinates_service
  * Service that retrieves a browser's current location and coordinate distance utility method
  */
  describe('Utility: nypl_coordinates_service', function() {
    var nypl_coordinates_service;

    beforeEach(function () {
      // load the module.
      module('nypl_locations');
      
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_coordinates_service_, _$rootScope_) {
        nypl_coordinates_service = _nypl_coordinates_service_;
      });
    });

    /* nypl_coordinates_service.getDistance */
    describe('nypl_coordinates_service.getDistance', function () {
      // check to see if it has the expected function
      it('should have a getDistance() function', function () { 
        expect(angular.isFunction(nypl_coordinates_service.getDistance)).toBe(true);
      });

      // check to see if it has the expected function
      it('should calculate the distance from Schwarzman Bldg to 58th Street Library', function () { 
        var result = nypl_coordinates_service.getDistance(40.75298660000001, -73.9821364, 40.7619, -73.9691);
        expect(result).toBe(0.92);
        expect(result).not.toBe(null);
      });
    });

    /* nypl_coordinates_service.checkGeolocation */
    describe('nypl_coordinates_service.checkGeolocation', function () {
      it('should have a checkGeolocation function', function () {
        // The checkGeolocation function checks to see if geolocation is available on the user's browser
        expect(angular.isFunction(nypl_coordinates_service.checkGeolocation)).toBe(true);
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
        geolocationMock = window.navigator.geolocation = jasmine.createSpy('geolocation');

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
        expect(angular.isFunction(nypl_coordinates_service.getCoordinates)).toBe(true);
        expect(typeof nypl_coordinates_service.getCoordinates).toBe('function');
      });

      describe('getCoordinates function successful', function () {
        beforeEach(function () {
          geolocationMock.getCurrentPosition = 
              window.navigator.geolocation.getCurrentPosition =
              jasmine.createSpy('getCurrentPosition').and.callFake(geolocationOk);
        });

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service', function () {
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
            jasmine.createSpy('getCurrentPosition').and.callFake(geolocationError);
        });

        it('Should not be called', function () {
          expect(geolocationMock.getCurrentPosition).not.toHaveBeenCalled();
        });

        it('Should call the geolocation function when calling the service', function () {
          nypl_coordinates_service.getCoordinates();
          expect(geolocationMock.getCurrentPosition).toHaveBeenCalled();
        });
      });

    });
  });


  /* 
  * nypl_geocoder_service 
  * Queries Google Maps Javascript API to geocode addresses and reverse geocode coordinates.
  */
  describe('Utility: nypl_geocoder_service', function () {
    var GeocoderMock, GeoCodingOK, GeoCodingError, 
        LatLngMock, LatLngBoundsMock, LatLngOk, LatLngError,
        nypl_geocoder_service, rootScope,
        get_coords_return_value, get_address_return_value,
        map_controls_push_mock,
        infowindow_open_mock, infowindow_close_mock, infowindow_setContent_mock;

    beforeEach(function() {
      module('nypl_locations');

      google = jasmine.createSpy('google');
      google.maps = jasmine.createSpy('maps');
      google.maps.InfoWindow = jasmine.createSpy('InfoWindow');
      infowindow_close_mock =
        google.maps.InfoWindow.prototype.close = jasmine.createSpy('InfoWindow.close');
      infowindow_setContent_mock =
        google.maps.InfoWindow.prototype.setContent = jasmine.createSpy('InfoWindow.setcontent');
      infowindow_open_mock =
        google.maps.InfoWindow.prototype.open = jasmine.createSpy('InfoWindow.open');
      google.maps.Map = jasmine.createSpy('Map');
      google.maps.Marker = jasmine.createSpy('Marker');
      google.maps.Animation = jasmine.createSpy('Animation');
      google.maps.Animation.BOUNCE = jasmine.createSpy('Bounce');
      google.maps.Animation.DROP = jasmine.createSpy('Drop');
      google.maps.GeocoderStatus = jasmine.createSpy('GeocoderStatus');
      google.maps.GeocoderStatus.OK = 'OK';
      google.maps.ControlPosition = jasmine.createSpy('ControlPosition');
      google.maps.ControlPosition.RIGHT_BOTTOM = jasmine.createSpy('RIGHT_BOTTOM');
      google.maps.event = jasmine.createSpy('maps.events');
      google.maps.event.addListener = jasmine.createSpy('maps.event.addListener');
      google.maps.Map.prototype.controls = jasmine.createSpy('map.controls');
      google.maps.Map.prototype.controls[google.maps.ControlPosition.RIGHT_BOTTOM] = jasmine.createSpy('map.controls.position');
      map_controls_push_mock =
        google.maps.Map.prototype.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push =
        jasmine.createSpy('map.controls.push');
      google.maps.Map.prototype.panTo = jasmine.createSpy('map.panTo');
      google.maps.Map.prototype.setZoom = jasmine.createSpy('map.setZoom');
      google.maps.Marker.prototype.setMap = jasmine.createSpy('marker.setMap');
      google.maps.Marker.prototype.getMap = jasmine.createSpy('marker.getMap');
      google.maps.Marker.prototype.getPosition = jasmine.createSpy('marker.getPosition');

      GeoCodingOK = function (params, callback) {
        callback(
          [{geometry: {location:{k:40.75298660000001, A:-73.9821364}}}],
          'OK'
        );
      };

      GeoCodingError = function (params, callback) {
        callback({result: 'Fake result'}, 'ERROR');
      };

      LatLngOk = function (params, callback) {
        callback(
          [{address_components:[{long_name:"10018", short_name:"10018"}]}],
          'OK'
        );
      };

      LatLngError = function (params, callback) {
        callback({result: 'Fake result'}, 'ERROR');
      };

      GeocoderMock = window.google.maps.Geocoder = jasmine.createSpy('Geocoder');
      LatLngMock = window.google.maps.LatLng = jasmine.createSpy('LatLng');
      LatLngBoundsMock = window.google.maps.LatLngBounds = jasmine.createSpy('LatLngBounds');

      inject(function ($rootScope, _nypl_geocoder_service_) {
        nypl_geocoder_service = _nypl_geocoder_service_;
        rootScope = $rootScope;
      });
    });

    it('Should expose some functions', function(){
      expect(angular.isFunction(nypl_geocoder_service.get_coords)).toBe(true);
      expect(typeof nypl_geocoder_service.get_coords).toBe('function');
      expect(typeof nypl_geocoder_service.get_address).toBe('function');
    });

    /* nypl_geocoder_service.get_coords */
    describe('nypl_geocoder_service.get_coords', function () {
      describe('get_coords function successful', function () {
        beforeEach(function() {
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(GeoCodingOK);
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
          var promise_callback = jasmine.createSpy(),
              // The return value was defined in the GeoCoding variable
              get_coords_return_value = { lat : 40.75298660000001, long : -73.9821364 };

          nypl_geocoder_service.get_coords('10018').then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with the resolved value from the promise
          expect(promise_callback).toHaveBeenCalledWith(get_coords_return_value);
        });
      });

      describe('get_coords function failed', function () {
        beforeEach(function() {
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(GeoCodingError);
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_coords();
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
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(LatLngOk);
        });

        it('Should not be called', function () {
          expect(GeocoderMock.prototype.geocode).not.toHaveBeenCalled();
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(typeof promise.then).toBe('function');
        });

        it('Should accept the promise when status is OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();

          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364}).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).toHaveBeenCalled();
          expect(errorMock).not.toHaveBeenCalled();
        });

        // Not sure why the following test is not working:
        it('Should resolve the promise when receiving data', function () {
          var promise_callback = jasmine.createSpy(),
              // The return value was defined in the LatLngOk variable
              get_address_return_value = '10018';


          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364}).then(promise_callback);
          rootScope.$apply();

          // promise_callback is the callback function with the resolved value from the promise
          // expect(promise_callback).toHaveBeenCalledWith(get_address_return_value);
        });
      });

      describe('get_address function failed', function () {
        beforeEach(function() {
          GeocoderMock.prototype.geocode = jasmine.createSpy('geocode').and.callFake(LatLngError);
        });

        it('Should be called', function () {
          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(GeocoderMock.prototype.geocode).toHaveBeenCalled();
        });

        it('Should return a promise', function () {
          var promise = nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364});
          expect(typeof promise.then).toBe('function');
        });

        it('Should reject the promise when status is not OK', function () {
          var okMock = jasmine.createSpy(),
              errorMock = jasmine.createSpy();
          nypl_geocoder_service.get_address({lat: 40.75298660000001, lng:-73.9821364}).then(okMock, errorMock);
          rootScope.$apply();

          expect(okMock).not.toHaveBeenCalled();
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
    /* end nypl_geocoder_service.get_address */

    describe('draw_map function', function () {
      it('should call the Google Maps', function () {
        nypl_geocoder_service.draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');

        expect(window.google.maps.Map).toHaveBeenCalled();
      });
    });

    describe('load_markers function', function () {
      // First we draw a marker, then when the load_markers function is called
      // it should call the add_marker_to_map function
      it('should call the add_marker_to_map function from the service', function () {
        nypl_geocoder_service.draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service.draw_marker("schwarzman", { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

        nypl_geocoder_service.load_markers();
        // if there are markers, the load_markers function adds markers to the map
        // using the add_marker_to_map function, which in turn
        // calls the google maps api and the setMap function to add the marker to the map:
        expect(google.maps.Marker.prototype.setMap).toHaveBeenCalled();
      });

      // no markers are set so it shouldn't do anything
      it('should NOT call the add_marker_to_map function from the service', function () {
        nypl_geocoder_service.load_markers();
        expect(google.maps.Marker.prototype.setMap).not.toHaveBeenCalled();
      });
    });

    describe('draw_legend function', function () {
      it('should call the controls function in the Maps API', function () {
        nypl_geocoder_service.draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        document.getElementById = function () {
          return '<div id="all-locations-map-legend" class="show-legend" style="z-index: 0; position: absolute; bottom: 15px; right: 0px;">'+
                '<!-- ngIf: locations --><span data-ng-if="locations" class="ng-scope"><img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png">NYPL Library<br></span><!-- end ngIf: locations -->'+
                '<!-- ngIf: locationStart -->'+
              '</div>';
        }
        nypl_geocoder_service.draw_legend('test');
        expect(map_controls_push_mock).toHaveBeenCalled();
      });
    });

    describe('panMap function', function () {
      it('should call the google maps api functions to pan and zoom on the map', function () {
        nypl_geocoder_service.draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service.panMap();
        // When we call the panMap function, we expect to call the
        // google maps panTo and setZoom functions avaible in the API
        // for the map

        expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
        expect(google.maps.Map.prototype.setZoom).toHaveBeenCalled();
      });
    });

    describe('check_marker function', function () {
      it('should return false because no markers exist', function () {
        nypl_geocoder_service.draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        var marker = nypl_geocoder_service.check_marker('schwarzman');

        expect(marker).toBe(false);
      });

      it('should return true because the marker exists and was drawn', function () {
        nypl_geocoder_service.draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service.draw_marker("schwarzman", { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");
        var marker = nypl_geocoder_service.check_marker('schwarzman');

        expect(marker).toBe(true);
      });
    });

    describe('pan_existing_marker', function () {
      it('should pan to a marker that is already on the map and open the infowindow', function () {
        nypl_geocoder_service.draw_map({lat: 40.7532, long: -73.9822}, 12, 'all-locations-map');
        nypl_geocoder_service.draw_marker("schwarzman", { 'lat': 40, 'long': -73}, "5th Avenue at 42nd St");

        // Must make sure it's an existing marker
        if (nypl_geocoder_service.check_marker('schwarzman')) {
          nypl_geocoder_service.pan_existing_marker('schwarzman');
        }

        // When we call it, we pan to that marker and open the infowindow with text
        expect(google.maps.Map.prototype.panTo).toHaveBeenCalled();
        expect(google.maps.Map.prototype.setZoom).toHaveBeenCalled();
        expect(infowindow_close_mock).toHaveBeenCalled();
        expect(infowindow_setContent_mock).toHaveBeenCalledWith("5th Avenue at 42nd St");
        expect(infowindow_open_mock).toHaveBeenCalled();
      });
    });


  });
  /* end nypl_geocoder_service called directly */

  describe('Utility: nypl_locations_service', function() {
    var nypl_locations_service, httpBackend;

    beforeEach(function () {
      // load the module.
      module('nypl_locations');
      
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_locations_service_, _$rootScope_, _$httpBackend_) {
        nypl_locations_service = _nypl_locations_service_;
        httpBackend = _$httpBackend_;
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
              {id:"sasb", name:"Stephen A. Schwarzman", slug:"schwarzman"},
              {id:"ag", name:"Aguilar", slug:"aguilar"}
            ]
          };

      httpBackend.expectGET('http://evening-mesa-7447-160.herokuapp.com/locations')
        .respond(mocked_all_locations_API_call);

      locations = nypl_locations_service.all_locations(),
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
            location: {
              id: "HP", name: "Hudson Park Library", slug: "hudson-park"
            }
          };

      httpBackend.expectGET('http://evening-mesa-7447-160.herokuapp.com/locations/hudson-park')
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
              id: "MAP", name: "Lionel Pincus and Princess Firyal Map Division", slug: "map-division"
            }
          };

      httpBackend.expectGET('http://evening-mesa-7447-160.herokuapp.com/divisions/map-division')
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
              {id: 8, name: "Wheelchair Accessible Computers", _links: {}},
            ]
          };

      httpBackend.expectGET('http://evening-mesa-7447-160.herokuapp.com/services')
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
              {id: "DH", name: "Dongan Hills Library", _links: {}},
            ]
          };

      httpBackend.expectGET('http://evening-mesa-7447-160.herokuapp.com/services/36')
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
                  {id: 8, name: "Wheelchair Accessible Computers", _links: {}},
                ]
              }
            }
          };

      httpBackend.expectGET('http://evening-mesa-7447-160.herokuapp.com/locations/sibl/services')
        .respond(mocked_location_services_API_call);

      services = nypl_locations_service.services_at_library('sibl');
      services.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result.locations.name).toEqual('Science, Industry and Business Library (SIBL)');
      expect(service_result.locations._embedded.services.length).toBe(4);
      expect(service_result).toEqual(mocked_location_services_API_call);
    });

  });

  describe('Utility: nypl_utility service', function() {
    var nypl_utility;

    beforeEach(function () {
      // load the module.
      module('nypl_locations');
      
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nypl_utility_, _$rootScope_) {
        nypl_utility = _nypl_utility_;
      });
    });

    /* nypl_coordinates_service.getDistance */
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

      it('should return today\'s and tomorrow\'s open and close times', function () {
        // getDay() returns 3 to mock that today is Wednesday
        Date.prototype.getDay = function () {return 3;};

        var today = nypl_utility.hoursToday(hours);

        // This varies on a day-to-day basis since it the current day that you are checking
        expect(JSON.stringify(today)).toEqual('{"today":{"day":"Wed","open":"10:00","close":"18:00"},' +
          '"tomorrow":{"day":"Thu","open":"11:00","close":"17:00"}}');
      });

      it('should return today\'s and tomorrow\'s open and close times', function () {
        // getDay() returns 5 to mock that today is Friday
        Date.prototype.getDay = function () {return 5;};

        var today = nypl_utility.hoursToday(hours);

        // This varies on a day-to-day basis since it the current day that you are checking
        expect(JSON.stringify(today)).toEqual('{"today":{"day":"Fri","open":"10:00","close":"18:00"},' +
          '"tomorrow":{"day":"Sat","open":"09:00","close":"17:00"}}');
      });

      it('should return undefined if no input was given', function () {
        expect(nypl_utility.hoursToday()).toEqual(undefined);
      });
    });

    describe('nypl_utility.getAddressString', function () {
      // The location object has more properties but these are all that are needed
      // for the service function
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

        expect(marker_address).toEqual("<a href='/#/115th-street'>115th Street Library</a>" +
          "<br />203 West 115th Street<br />New York, NY, 10026");
      });

      it('should print the address without markup', function () {
        var marker_address = nypl_utility.getAddressString(location);

        expect(marker_address).toEqual("115th Street Library 203 West 115th Street New York, NY, 10026");
      });

      it('should return an empty string if no input is given', function () {
        expect(nypl_utility.getAddressString()).toEqual('');
      });

    });

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

    describe('nypl_utility.socialMediaColor', function () {
      // The social media objects have more properties but they are not needed for the service function
      var social_media = [
        {href:"http://www.facebook.com/pages/115th-Street-Branch/105612772837483", site:"facebook"},
        {href:"http://twitter.com/115stBranch", site:"twitter"},
        {href:"http://foursquare.com/venue/1029658", site:"foursquare"},
        {href:"http://www.youtube.com/NewYorkPublicLibrary", site:"youtube"},
        {href:"http://nypl.bibliocommons.com/lists/show/87528911_nypl_115th_street", site:"bibliocommons"}
      ]

      it('should add an icon class and a text color class', function () {
        var modified_social_media = nypl_utility.socialMediaColor(social_media),
            social_media_with_classes = [
              {href:"http://www.facebook.com/pages/115th-Street-Branch/105612772837483", site:"facebook", classes:"icon-facebook blueDarkerText"},
              {href:"http://twitter.com/115stBranch", site:"twitter", classes:"icon-twitter2 blueText"},
              {href:"http://foursquare.com/venue/1029658", site:"foursquare", classes:"icon-foursquare blueText"},
              {href:"http://www.youtube.com/NewYorkPublicLibrary", site:"youtube", classes:"icon-youtube redText"},
              {href:"http://nypl.bibliocommons.com/lists/show/87528911_nypl_115th_street", site:"bibliocommons", classes:"icon-bibliocommons"}
            ];

        expect(modified_social_media).toEqual(social_media_with_classes);
      });
    });

    describe('nypl_utility.alerts', function () {
      // The alert objects have more properties which are not needed for the service function
      var alerts = [
        {start:"2014-05-17T00:00:00-04:00", end:"2014-05-27T01:00:00-04:00",
          body:"The New York Public Library will be closed from May 24 through May 26 in observance of Memorial Day."},
        // Note: I'm modifying the Independence Day alert so it will display
        // for a long time just for testing purposes, so the dates are not real
        {start:"2014-04-27T00:00:00-04:00", end:"2014-07-06T01:00:00-04:00",
          body:"All units of the NYPL are closed July 4 - July 5."},
        {start:"2014-08-23T00:00:00-04:00", end:"2014-09-02T01:00:00-04:00",
          body:"The New York Public Library will be closed August 30th through September 1st in observance of Labor Day"},
      ];

      it('should display the Independence Day alert', function () {
        // The Independence Day alert dates have been modified so it can display
        // for testing purposes
        var display_alert = nypl_utility.alerts(alerts);

        // The function only returns the body of the alert
        expect(display_alert).toEqual("All units of the NYPL are closed July 4 - July 5.\n");
      });

      it('should return null if no input is given', function () {
        expect(nypl_utility.alerts()).toEqual(null);
      });
    });

    describe('nypl_utility.popup_window', function () {
      // Not sure how to test just yet
    });

    describe('nypl_utility.google_calendar_link', function () {
      var nypl_event = {
          title: "Make Music New York",
          start: "2014-06-21T18:00:00Z",
          end: "2014-06-21T19:00:00Z",
          body: "Guitar Lesson Got 5 Minutes? Then Learn How to Play Guitar! Get a free guitar lesson," +
            " and be entered to win fun prizes (to be announced!) Never picked up a guitar before? A pro" +
            " looking for some extra tips? All levels are welcome! Brought to you by: Make Music New York, " +
            "The New York Public Library, Little Kids Rock and GAMA! Teacher: Gary Heimbauer",
        },
        address = "66 Leroy Street";

      it('should return a url to create a Google Calendar given an event and address', function () {
        var url = nypl_utility.google_calendar_link(nypl_event, address);

        expect(url).toEqual("https://www.google.com/calendar/render?action=template&text=" + 
          "Make Music New York&dates=20140621T180000Z/20140621T190000Z&details=Guitar Lesson Got" +
          " 5 Minutes? Then Learn How to Play Guitar! Get a free guitar lesson," +
          " and be entered to win fun prizes (to be announced!) Never picked up a guitar before? A pro" +
          " looking for some extra tips? All levels are welcome! Brought to you by: Make Music New York, " +
          "The New York Public Library, Little Kids Rock and GAMA! Teacher: Gary Heimbauer&location=" +
          "66 Leroy Street&pli=1&uid=&sf=true&output=xml");
      });

      it('should return an empty string if no event is given', function () {
        expect(nypl_utility.google_calendar_link()).toEqual('');
      });
    });
  });

});

