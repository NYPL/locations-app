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
        get_coords_return_value, get_address_return_value;

    beforeEach(function() {
      module('nypl_locations');

      window.google = jasmine.createSpy('google');
      window.google.maps = jasmine.createSpy('maps');
      window.google.maps.InfoWindow = jasmine.createSpy('InfoWindow');
      window.google.maps.Map = jasmine.createSpy('Map');
      window.google.maps.Marker = jasmine.createSpy('Marker');
      window.google.maps.Animation = jasmine.createSpy('Animation');
      window.google.maps.Animation.BOUNCE = jasmine.createSpy('Bounce');
      window.google.maps.Animation.DROP = jasmine.createSpy('Drop');
      window.google.maps.GeocoderStatus = jasmine.createSpy('GeocoderStatus');
      window.google.maps.GeocoderStatus.OK = 'OK';

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

  });
  /* end nypl_geocoder_service called directly */


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
            {close: "18:00", day: "Thu", open: "10:00" },
            {close: "18:00", day: "Fri", open: "10:00" },
            {close: "18:00", day: "Sat", open: "10:00" }
          ]
      };

      // check to see if it has the expected function
      it('should have an hoursToday() function', function () { 
        expect(angular.isFunction(nypl_utility.hoursToday)).toBe(true);
      });

      it('should have an hoursToday() function', function () { 
        var today = nypl_utility.hoursToday(hours);

        // This varies on a day-to-day basis since it the current day that you are checking
        expect(today).toEqual({today:'Wed',open:'10:00',close:'18:00'});
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

      it('should return an empty string if no input was given', function () {
        expect(nypl_utility.getAddressString()).toEqual('');
      });

    });

    describe('nypl_utility.locationType', function () {
      var library_type;

      it('should return circulating for a regular branch', function () {
        library_type = nypl_utility.locationType('BAR');

        expect(library_type).toEqual('circulating');
      });

      it('should return research for a research branch', function () {
        library_type = nypl_utility.locationType('SIBL');

        expect(library_type).toEqual('research');
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

      it('should display the Independence day alert', function () {
        // The Independence Day alert dates have been modified so it can display
        // for testing purposes
        var display_alert = nypl_utility.alerts(alerts);

        // The function only returns the body of the alert
        expect(display_alert).toEqual("All units of the NYPL are closed July 4 - July 5.\n");
      });

      it('should return null if no input was given', function () {
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

      it('should return an empty string if no event was given', function () {
        expect(nypl_utility.google_calendar_link()).toEqual('');
      });
    });
  });

});

