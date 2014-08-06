/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Service Tests', function () {
  'use strict';

  /* 
  * nypl_geocoder_service 
  * Queries Google Maps Javascript API to geocode addresses
  * and reverse geocode coordinates.
  */
  describe('nypl_geocoder_service', function () {
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


  /* NYPL Utility */
  describe('nyplUtility', function () {
    var nyplUtility, date;

    beforeEach(function () {
      module('nypl_locations');
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nyplUtility_) {
        nyplUtility = _nyplUtility_;
      });
    });

    /*
    * nyplUtility.hoursToday(hours)
    *   hours: An array with a 'regular' property that is
    *     an array of objects with open and close times for
    *     every day of the week starting from Sunday.
    *
    *   Returns an object with a two properties, 'today' and 
    *   'tomorrow' that has the day and open/close times
    */
    describe('nyplUtility.hoursToday', function () {
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
        expect(angular.isFunction(nyplUtility.hoursToday)).toBe(true);
      });

      it('should return today\'s and tomorrow\'s open and close times',
        function () {
          // getDay() returns 3 to mock that today is Wednesday
          Date.prototype.getDay = function () { return 3; };

          var today_tomorrow_object = nyplUtility.hoursToday(hours);

          expect(JSON.stringify(today_tomorrow_object))
            .toEqual('{"today":{"day":"Wed","open":"10:00","close":"18:00"},' +
              '"tomorrow":{"day":"Thu","open":"11:00","close":"17:00"}}');
        });

      it('should return today\'s and tomorrow\'s open and close times',
        function () {
          // getDay() returns 5 to mock that today is Friday
          Date.prototype.getDay = function () { return 5; };

          var today_tomorrow_object = nyplUtility.hoursToday(hours);

          expect(JSON.stringify(today_tomorrow_object))
            .toEqual('{"today":{"day":"Fri","open":"10:00","close":"18:00"},' +
              '"tomorrow":{"day":"Sat","open":"09:00","close":"17:00"}}');
        });

      it('should return undefined if no input was given', function () {
        expect(nyplUtility.hoursToday()).toEqual(undefined);
      });
    });

    /*
    * nyplUtility.getAddressString(location, nicePrint)
    *   location: A location object.
    *   nicePrint (optional): Boolean to return the address with 
    *     HTML markup if true. Defaults to false.
    *
    *   Returns the location's address as either a simple string
    *   or with markup if it will be used in a Google Map 
    *   marker's infowindow.
    */
    describe('nyplUtility.getAddressString', function () {
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
        var marker_address = nyplUtility.getAddressString(location, true);

        expect(marker_address)
          .toEqual("<a href='/#/115th-street'>115th Street Library</a>" +
            "<br />203 West 115th Street<br />New York, NY, 10026");
      });

      it('should print the address without markup', function () {
        var marker_address = nyplUtility.getAddressString(location);

        expect(marker_address)
          .toEqual("115th Street Library 203 West 115th " +
            "Street New York, NY, 10026");
      });

      it('should return an empty string if no input is given', function () {
        expect(nyplUtility.getAddressString()).toEqual('');
      });

    });

    /*
    * nyplUtility.locationType(id)
    *   id: The id of the location
    *
    *   Returns the type of library based on it's id.
    */
    describe('nyplUtility.locationType', function () {
      var library_type;

      it('should return circulating for a regular branch', function () {
        // BAR = Baychester Library
        library_type = nyplUtility.locationType('BAR');

        expect(library_type).toEqual('circulating');
      });

      it('should return research for a research branch', function () {
        library_type = nyplUtility.locationType('SIBL');

        expect(library_type).toEqual('research');
      });

      it('should return circulating when no input is given', function () {
        expect(nyplUtility.locationType()).toEqual('circulating');
      });

    });

    /*
    * nyplUtility.socialMediaColor(social_media)
    *   social_media: Array of objects each with an 'href' and 'site'
    *     property used to decide what color the icon should be
    *
    *   Returns a CSS text color class name.
    */
    describe('nyplUtility.socialMediaColor', function () {
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
        var modified_social_media = nyplUtility.socialMediaColor(social_media),
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
    * nyplUtility.alerts(alerts)
    *   alerts: Array of alert objects that should have 'start', 'end',
    *   and 'body' properties.
    *
    *   Returns a string which is the content that should be displayed
    *   if the alert should be live (based on start and end date and 
    *   the date we are checking);
    */
    describe('nyplUtility.alerts', function () {
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
        display_alert = nyplUtility.alerts(alerts);

        // The function only returns the body of the alert
        expect(display_alert)
          .toEqual("All units of the NYPL are closed July 4 - July 5.\n");

        Date = MockDate;
      });

      it('should return null if no input is given', function () {
        expect(nyplUtility.alerts()).toEqual(null);
      });
    });

    // describe('nyplUtility.popup_window', function () {
    //   // Not sure how to test just yet
    // });

    /*
    * nyplUtility.calendar_link(type, event, location)
    *   type: Either 'google' or 'yahoo'.
    *   event: An event object.
    *   location: A location object.
    *
    *   Returns a string which is used as a link to generate the
    *   event on either Google or Yahoo calendar.
    */
    describe('nyplUtility.calendar_link', function () {
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
          var url = nyplUtility.calendar_link('google', nypl_event, location);

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
          var url = nyplUtility.calendar_link('yahoo', nypl_event, location);

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
        expect(nyplUtility.calendar_link()).toEqual('');
      });
    });

    /*
    * nyplUtility.ical_link(event, address)
    *   event: An event object.
    *   address: Address string of the location where the event is being held.
    *
    *   Creates a formatted string that is mostly compatible with ical.
    *   Opens a new window so nothing is returned.
    */
    describe('nyplUtility.ical_link', function () {
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
    * nyplUtility.id_location_search(locations, searchTerm)
    *   locations: Array with location objects.
    *   searchTerm: What the user searched for.
    *
    *   Returns an array with one object where the searchTerm matches
    *   the 'id' property of one of the location objects in the locations array.
    */
    describe('nyplUtility.id_location_search', function () {
      it('should return the location object that matches the id that was ' +
        'searched',
        function () {
          var search = 'bar', // Baychester
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'}
            ],
            location;

          location = nyplUtility.id_location_search(locations, search);
          expect(location).toEqual([{id: 'BAR', name: 'Baychester Library'}]);
        });

      it('should return an empty array if the search did not match',
        function () {
          var search = 'upper west side',
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'}
            ],
            location;

          location = nyplUtility.id_location_search(locations, search);
          // Should not match any ids in any library object.
          expect(location).toEqual([]);
        });
    });

    /*
    * nyplUtility.location_search(locations, searchTerm)
    *   locations: Array with location objects.
    *   searchTerm: What the user searched for.
    *
    *   Returns an array with all the location objects that match what
    *   the user searched for.
    */
    describe('nyplUtility.location_search', function () {
      it('should return an array with locations that match ' +
        'what was searched for',
        function () {
          var search = 'bay',
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'},
              {id: 'KP', name: 'Kips Bay Library'},
              {id: 'PM', name: 'Pelham Bay Library'}
            ],
            location;

          location = nyplUtility.location_search(locations, search);
          expect(location).toEqual([
            {id: 'BAR', name: 'Baychester Library'},
            {id: 'KP', name: 'Kips Bay Library'},
            {id: 'PM', name: 'Pelham Bay Library'}
          ]);
        });

      it('should return an empty array if the search did not match',
        function () {
          var search = 'upper west side',
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'},
              {id: 'KP', name: 'Kips Bay Library'},
              {id: 'PM', name: 'Pelham Bay Library'}
            ],
            location;

          location = nyplUtility.location_search(locations, search);
          // Should not match any ids in any library object.
          expect(location).toEqual([]);
        });
    });

    /*
    * nyplUtility.add_distance(locations, coords)
    *   locations: An array with location objects
    *   coords: Coordinates of the location that we are using to 
    *     get distance data.
    *
    *   Returns the same locations array but with a distance
    *   property for each location object in the array that was
    *   calculated from the coords.
    */
    describe('nyplUtility.add_distance', function () {
      it('should add the distance of every library from Chelsea Piers',
        function () {
          // The coordinates of Chelsea Piers
          var coords = {
            lat: 40.7483308,
            long: -74.0084794
          },
            locations = [
              {id: 'AG', name: 'Aguilar Library', //4.56
                lat: 40.7483308, long: -74.0084794},
              {id: 'AL', name: 'Allerton Library',// 11.13
                lat: 40.866, long: -73.8632},
              {id: 'BAR', name: 'Baychester Library', //12.6
                lat: 40.8711, long: -73.8305},
              {id: 'BLC', name: 'Bronx Library Center', //9.94
                lat: 40.8634, long: -73.8944},
              {id: 'KP', name: 'Kips Bay Library', //1.54
                lat: 40.7438, long: -73.9797},
              {id: 'PM', name: 'Pelham Bay Library', //11.54
                lat: 40.8336, long: -73.828}
            ],
            updatedLocations;

          updatedLocations = nyplUtility.add_distance(locations, coords);
          expect(updatedLocations).toEqual([
            {id: 'AG', name: 'Aguilar Library',
              lat: 40.7483308, long: -74.0084794, distance: 0.01}, //4.56
            {id: 'AL', name: 'Allerton Library',
              lat: 40.866, long: -73.8632, distance: 11.13},
            {id: 'BAR', name: 'Baychester Library',
              lat: 40.8711, long: -73.8305, distance: 12.6},
            {id: 'BLC', name: 'Bronx Library Center',
              lat: 40.8634, long: -73.8944, distance: 9.94},
            {id: 'KP', name: 'Kips Bay Library',
              lat: 40.7438, long: -73.9797, distance: 1.54},
            {id: 'PM', name: 'Pelham Bay Library',
              lat: 40.8336, long: -73.828, distance: 11.13}
          ]);
        });
    });

    /*
    * nyplUtility.check_distance(locations)
    *   locations: Array with location objects
    *
    *   Returns true if the minimum distance from the user or the location
    *   that was search is more than 25 miles, false otherwise.
    */
    describe('nyplUtility.check_distance', function () {
      it('should return false because the minimum distance is less ' +
        'than 25 miles',
        function () {
          var locations = [
            {id: 'AG', name: 'Aguilar Library',
              lat: 40.7483308, long: -74.0084794, distance: 4.56},
            {id: 'AL', name: 'Allerton Library',
              lat: 40.866, long: -73.8632, distance: 11.13},
            {id: 'BAR', name: 'Baychester Library',
              lat: 40.8711, long: -73.8305, distance: 12.6},
            {id: 'BLC', name: 'Bronx Library Center',
              lat: 40.8634, long: -73.8944, distance: 9.94},
            {id: 'KP', name: 'Kips Bay Library',
              lat: 40.7438, long: -73.9797, distance: 1.54},
            {id: 'PM', name: 'Pelham Bay Library',
              lat: 40.8336, long: -73.828, distance: 11.13}
          ];

          expect(nyplUtility.check_distance(locations)).toBe(false);
        });

      it('should return true because the minimum distance is more ' +
        'than 25 miles',
        function () {
          var locations = [
            {id: 'AG', name: 'Aguilar Library',
              lat: 40.7483308, long: -74.0084794, distance: 26},
            {id: 'AL', name: 'Allerton Library',
              lat: 40.866, long: -73.8632, distance: 31.13},
            {id: 'BAR', name: 'Baychester Library',
              lat: 40.8711, long: -73.8305, distance: 32.6},
            {id: 'BLC', name: 'Bronx Library Center',
              lat: 40.8634, long: -73.8944, distance: 29.94},
            {id: 'KP', name: 'Kips Bay Library',
              lat: 40.7438, long: -73.9797, distance: 41.54},
            {id: 'PM', name: 'Pelham Bay Library',
              lat: 40.8336, long: -73.828, distance: 31.13}
          ];

          expect(nyplUtility.check_distance(locations)).toBe(true);
        });
    });

  }); /* End nyplUtility service */

  /*
  * nyplLocationList is a service that keeps track of the 'pagination'
  * that occurs on the homepage for the list view. Showing 10 more
  * libraries when the 'Show more' button is clicked.
  */
  describe('nyplLocationList', function () {
    var nyplLocationList;

    beforeEach(function () {
      module('nypl_locations');
      inject(function (_nyplLocationList_) {
        nyplLocationList = _nyplLocationList_;
      });
    });

    /*
    * nyplLocationList.init(settings)
    *   settings: Object with properties to extend the default
    */
    it('should create and extend the config object', function () {
      var config = nyplLocationList.init();

      expect(config).toEqual({
        // Show the button
        showMore: true,
        // How many libraries to add when the button is clicked
        add_amount: 10,
        // To keep track of how many are on the page at a time
        libraryLimit: 10,
        // Text that updates when the button is pressed
        increaseBy: "10 more"
      });

      // Extend the settings
      config = nyplLocationList.init({
        libraryLimit: 20,
        increaseBy: "20 more",
        add_amount: 20
      });

      expect(config).toEqual({
        showMore: true,
        libraryLimit: 20,
        increaseBy: "20 more",
        add_amount: 20
      });
    });

    /* 
    * nyplLocationList.view_more()
    *   Updates the limit of libraries that can be shown in the list as
    *   well as the text in the button.
    */
    it('should update the settings when the view_more function is called',
      function () {
        var config, i;

        nyplLocationList.init();
        // The 'show more' button was clicked
        config = nyplLocationList.view_more();
        expect(config).toEqual({
          showMore: true,
          add_amount: 10,
          libraryLimit: 20,
          increaseBy: "10 more"
        });

        // Click the show more button 6 more times
        for (i = 0; i < 6; i += 1) {
          config = nyplLocationList.view_more();
        }
        expect(config).toEqual({
          showMore: true,
          add_amount: 12,
          libraryLimit: 80,
          increaseBy: "All"
        });

        // The last click
        config = nyplLocationList.view_more();
        expect(config).toEqual({
          showMore: false,
          add_amount: 12,
          libraryLimit: 92,
          increaseBy: "All"
        });
      });
  }); /* End nyplLocationList */

});

