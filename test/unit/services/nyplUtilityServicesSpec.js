/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Utility Service Tests', function () {
  'use strict';

  /* 
   * nyplUtility
   *   An AngularJS service with functions for simple routine and model 
   *   changes and logic that should not be in the controller.
   */
  describe('Service: nyplUtility', function () {
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
    describe('nyplUtility.hoursToday()', function () {
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

      it('should return today\'s and tomorrow\'s open and close times ' +
        '- mocking Wednesday',
        function () {
          // getDay() returns 3 to mock that today is Wednesday
          Date.prototype.getDay = function () { return 3; };

          var todayTomorrowObject = nyplUtility.hoursToday(hours);

          expect(JSON.stringify(todayTomorrowObject))
            .toEqual('{"today":{"day":"Wed","open":"10:00","close":"18:00"},' +
              '"tomorrow":{"day":"Thu","open":"11:00","close":"17:00"}}');
        });

      it('should return today\'s and tomorrow\'s open and close times ' +
        '- mocking Friday',
        function () {
          // getDay() returns 5 to mock that today is Friday
          Date.prototype.getDay = function () { return 5; };

          var todayTomorrowObject = nyplUtility.hoursToday(hours);

          expect(JSON.stringify(todayTomorrowObject))
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
     *   nicePrint (optional): Boolean to return the address with HTML 
     *   markup if true. Defaults to false.
     *
     *   Returns the location's address as either a simple string or with 
     *   markup if it will be used in a Google Map marker's infowindow.
     */
    describe('nyplUtility.getAddressString()', function () {
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
     * nyplUtility.socialMediaColor(social_media)
     *   social_media: Array of objects each with an 'href' and 'site'
     *     property used to decide what color the icon should be
     *
     *   Returns a CSS text color class name.
     */
    describe('nyplUtility.socialMediaColor()', function () {
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
          expected_social_media = [
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

        expect(modified_social_media).toEqual(expected_social_media);
      });
    });

    /*
     * nyplUtility.alerts(alerts)
     *   alerts: Array of alert objects or just one object that have 
     *   'start', 'end', and 'body' properties.
     *
     *   Returns a string which is the content that should be displayed
     *   if the alert should be live (based on start and end date and 
     *   the date we are checking);
     */
    describe('nyplUtility.alerts()', function () {
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
      ],
        one_alert = {
          start: "2014-08-23T00:00:00-04:00",
          end: "2014-09-02T01:00:00-04:00",
          description: "The New York Public Library will be closed August " +
            "30th through September 1st in observance of Labor Day"
        };

      it('should display the Independence Day alert - array of alerts',
        function () {
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

    // describe('nyplUtility.popupWindow', function () {
    //   // Not sure how to test just yet
    // });

    /*
     * nyplUtility.calendarLink(type, event, location)
     *   type: Either 'google' or 'yahoo'.
     *   event: An event object.
     *   location: A location object.
     *
     *   Returns a string which is used as a link to generate the
     *   event on either Google or Yahoo calendar.
     */
    describe('nyplUtility.calendarLink()', function () {
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
          var url = nyplUtility.calendarLink('google', nypl_event, location);

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
          var url = nyplUtility.calendarLink('yahoo', nypl_event, location);

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
        expect(nyplUtility.calendarLink()).toEqual('');
      });
    });

    /*
     * nyplUtility.icalLink(event, address)
     *   event: An event object.
     *   address: Address string of the location where the event is being held.
     *
     *   Creates a formatted string that is mostly compatible with ical.
     *   Opens a new window so nothing is returned.
     */
    describe('nyplUtility.icalLink()', function () {
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
     * nyplUtility.calcDistance(locations, coords)
     *   locations: An array with location objects
     *   coords: Coordinates of the location that we are using to 
     *     get distance data.
     *
     *   Returns the same locations array but with a distance
     *   property for each location object in the array that was
     *   calculated from the coords.
     */
    describe('nyplUtility.calcDistance()', function () {
      it('should add the distance of every library from Chelsea Piers',
        function () {
          // The coordinates of Chelsea Piers
          var coords = {
              lat: 40.7483308,
              long: -74.0084794
            },
            locations = [
              {id: 'AG', name: 'Aguilar Library',
                geolocation: { coordinates: [-74.0084794, 40.7483308] } },
              {id: 'AL', name: 'Allerton Library',
                lat: 40.866, long: -73.8632},
              {id: 'BAR', name: 'Baychester Library',
                lat: 40.8711, long: -73.8305},
              {id: 'BLC', name: 'Bronx Library Center',
                lat: 40.8634, long: -73.8944},
              {id: 'KP', name: 'Kips Bay Library',
                lat: 40.7438, long: -73.9797},
              {id: 'PM', name: 'Pelham Bay Library',
                lat: 40.8336, long: -73.828}
            ],
            updatedLocations;

          updatedLocations = nyplUtility.calcDistance(locations, coords);

          expect(updatedLocations).toEqual([
            {id: 'AG', name: 'Aguilar Library',
              geolocation: { coordinates: [-74.0084794, 40.7483308] },
              distance: 0.01}, //4.56
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

      it('should return an empty array if no params are passed', function () {
        var empty_result = nyplUtility.calcDistance();

        expect(empty_result).toEqual([]);
      });
    });

    /*
     * nyplUtility.checkDistance(locations)
     *   locations: Array with location objects
     *
     *   Returns true if the minimum distance from the user or the location
     *   that was search is more than 25 miles, false otherwise.
     */
    describe('nyplUtility.checkDistance()', function () {
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

          expect(nyplUtility.checkDistance(locations)).toBe(false);
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

          expect(nyplUtility.checkDistance(locations)).toBe(true);
        });
    });

    /*
     * nyplUtility.returnHTML(html)
     *   html: a string with HTML elements
     *
     *   Returns HTML as returned by the ngSanitize function trustAsHtml.
     */
    describe('nyplUtility.returnHTML()', function () {
      it('should return html from a string', function () {
        var html = "<p>hello world</p>";

        // TODO: not sure how to test yet since it must use Angular's
        // ng-bind-html in the element that it will be placed.
      });
    });

    /*
     * nyplUtility.divisionHasAppointment(id)
     *   id: the ID of a division as a string.
     *
     *   Returns true if the division is part of the list, false otherwise.
     *   Used to determined if the division should have a
     *   'Make an Appointment' link on its page.
     */
    describe('nyplUtility.divisionHasAppointment()', function () {
      it('should return false because Map Division should not have the link',
        function () {
          expect(nyplUtility.divisionHasAppointment('MAP')).toBe(false);
        });

      it('should return true because Arents Division should have the link',
        function () {
          expect(nyplUtility.divisionHasAppointment('ARN')).toBe(true);
        });
    });

  }); /* End nyplUtility service */

});

