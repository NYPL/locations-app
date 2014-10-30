/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

var mockGeneralResearchDivision = {
    access: "Fully Accessible",
    contacts: { phone: "(917) 275-6975", manager: "Marie Coughlin" },
    hours: {
      regular: [
        { day: "Sun", open: null, close: null },
        { day: "Mon", open: "10:00", close: "17:45" },
        { day: "Tue", open: "10:00", close: "19:45" },
        { day: "Wed", open: "10:00", close: "19:45" },
        { day: "Thu", open: "10:00", close: "17:45" },
        { day: "Fri", open: "10:00", close: "17:45" },
        { day: "Sat", open: "10:00", close: "17:45" }
      ]
    },
    id: "GRD",
    images: {
      interior: "http://www.nypl.org/sites/default/files/images/stacks.jpeg",
      collection_item: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/394/dc_sasb_grd.jpg"
    },
    name: "General Research Division",
    open: true,
    room: "315",
    slug: "general-research-division",
    social_media: [
      { site: "facebook",href: "http://www.facebook.com/pages/General-" +
        "Research-Division-The-New-York-Public-Library/105843439484043"},
      { site: "twitter", href: "http://twitter.com/NYPL_GRD"}
    ],
    synonyms: null,
    type: "research",
    _embedded: {
      events: null,
      exhibitions: null,
    }
  },
  mockRareBookDivision = {
    access: "Partially Accessible",
    contacts: { phone: "(212) 642-0110"},
    hours: {
      regular: [
        { day: "Sun", open: null, close: null },
        { day: "Mon", open: null, close: null },
        { day: "Tue", open: "10:00", close: "19:45" },
        { day: "Wed", open: "10:00", close: "19:45" },
        { day: "Thu", open: "10:00", close: "17:45" },
        { day: "Fri", open: "10:00", close: "17:45" },
        { day: "Sat", open: "10:00", close: "17:45" }
      ]
    },
    id: "RBK",
    images: {
      interior: "http://www.nypl.org/sites/default/files/emblemssquirrel.jpg"
    },
    locality: "New York",
    location_id: "SASB",
    location_name: "Stephen A. Schwarzman Building",
    location_slug: "schwarzman",
    name: "Rare Book Division",
    open: true,
    postal_code: 10018,
    region: "NY",
    room: "328",
    slug: "rare-books-division",
    social_media: null,
    street_address: "Fifth Avenue at 42nd Street",
    synonyms: null,
    type: "research",
    _embedded: {
      events: null,
      exhibitions: null,
      divisions: [
        {
          _id: "ARN",
          name: "George Arents Collection",
          street_address: "Fifth Avenue at 42nd Street",
        }
      ]
    }
  };


describe('DivisionCtrl', function () {
  'use strict';

  var scope, DivisionCtrl, httpBackend, nyplLocationsService;

  beforeEach(function () {
    module('nypl_locations');
    inject(function (_nyplLocationsService_, _$httpBackend_) {
      httpBackend = _$httpBackend_;
      nyplLocationsService = _nyplLocationsService_;

      httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');

      httpBackend
        .expectGET('/config')
        .respond({
          config: {
            api_root: 'http://locations-api-beta.nypl.org',
            divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN","PHG","SPN","CPS"]
          }
        });

      // TODO:
      // Find out why this is needed:
      httpBackend
        .expectGET('views/locations.html')
        .respond('public/views/locations.html');

      httpBackend
        .expectGET('views/location-list-view.html')
        .respond('public/views/location-list-view.html');

      nyplLocationsService.getConfig();
      httpBackend.flush();
    })
  });

  describe('General Research Division', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      // getDay() returns 2 to mock that today is Tuesday
      Date.prototype.getDay = function () { return 2; };

      scope = _$rootScope_.$new();
      DivisionCtrl = _$controller_('DivisionCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN","PHG","SPN","CPS"]},
        division: mockGeneralResearchDivision
      });
    }));

    it('should get the mocked data', function () {
      expect(scope.division).toEqual(mockGeneralResearchDivision);
      expect(scope.division.name).toEqual('General Research Division');
    });

    it('should have the correct hours for Tuesday', function () {
      var hoursTodayObj = {
        today: {day: 'Tue', open: '10:00', close: '19:45'},
        tomorrow: {day: 'Wed', open: '10:00', close: '19:45'}
      };

      // From above, we are mocking the day to be Tuesday.
      expect(scope.hoursToday).toEqual(hoursTodayObj);
    });

    it('should not have an appointment button', function () {
      expect(scope.has_appointment).toBe(false);
    });

    it('should add text color class to each social media object', function () {
      expect(scope.division.social_media).toEqual([
        { site: "facebook", href: "http://www.facebook.com/pages/General" +
          "-Research-Division-The-New-York-Public-Library/105843439484043",
          classes: "icon-facebook blueDarkerText"},
        { site: "twitter", href: "http://twitter.com/NYPL_GRD",
          classes: "icon-twitter2 blueText"}
      ]);
    });

    // it('should have an alert on the page', function () {
    //   // Need mocked data for this but get error based on the content
    //   // being run through $sce to output html.
    //   expect(scope.division.hours.exceptions).toBeDefined();
    // });

    it('should have no embedded divisions', function () {
      expect(scope.division._embedded.divisions).not.toBeDefined();
    });
  });

  describe('Rare Book Division', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      // getDay() returns 2 to mock that today is Thursday
      Date.prototype.getDay = function () { return 4; };

      scope = _$rootScope_.$new();
      DivisionCtrl = _$controller_('DivisionCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN","PHG","SPN","CPS"]},
        division: mockRareBookDivision
      });
    }));

    it('should get the mocked data', function () {
      expect(scope.division).toEqual(mockRareBookDivision);
      expect(scope.division.name).toEqual('Rare Book Division');
    });

    it('should have the correct hours for Thursday', function () {
      var hoursTodayObj = {
        today: {day: 'Thu', open: '10:00', close: '17:45'},
        tomorrow: {day: 'Fri', open: '10:00', close: '17:45'}
      };

      // From above, we are mocking the day to be Thursday.
      expect(scope.hoursToday).toEqual(hoursTodayObj);
    });

    it('should have an appointment button', function () {
      expect(scope.has_appointment).toBe(true);
    });

    it('should not have any social media buttons', function () {
      expect(scope.division.social_media).toBe(null);
    });

    it('should not have an alert on the page', function () {
      expect(scope.division.hours.exceptions).not.toBeDefined();
    });

    it('should have an embedded division', function () {
      expect(scope.division._embedded.divisions).toBeDefined();
      expect(scope.division._embedded.divisions.length).toBe(1);
    });
  });

});

