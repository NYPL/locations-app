/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

var mockGeneralResearch = {
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
      collection_item: "http://cdn-prod.www.aws.nypl.org/sites/default/files" +
        "/images/locations/394/dc_sasb_grd.jpg"
    },
    name: "General Research Division",
    open: true,
    room: "315",
    slug: "general-research-division",
    social_media: [
      { site: "facebook", href: "http://www.facebook.com/pages/General-" +
        "Research-Division-The-New-York-Public-Library/105843439484043"},
      { site: "twitter", href: "http://twitter.com/NYPL_GRD"}
    ],
    synonyms: null,
    fundraising: {
      id: 275290,
      statement: "Friends of the Library can support their favorite library" +
        " and receive great benefits!",
      appeal: "Become a Member",
      button_label: "Join or Renew",
      link: "https://secure3.convio.net/nypl/site/SPageServer?pagename=bran" +
        "ch_friend_form&s_src=FRQ15ZZ_CADN"
    },
    type: "research",
    _embedded: {
      events: null,
      exhibitions: null,
      divisions: [
        {
          name: "DeWitt Wallace Periodical Room",
          access: "Fully Accessible",
          rank: 23,
          floor: "First Floor",
          room: "108",
          slug: "periodicals-room",
          hours: { regular: [
            { day: "Sun", open: null, close: null },
            { day: "Mon", open: "10:00", close: "17:45" },
            { day: "Tue", open: "10:00", close: "19:45" },
            { day: "Wed", open: "10:00", close: "19:45" },
            { day: "Thu", open: "10:00", close: "17:45" },
            { day: "Fri", open: "10:00", close: "17:45" },
            { day: "Sat", open: "10:00", close: "17:45" }
          ]}
        }
      ],
      location: {
        name: "Stephen A. Schwarzman Building",
        street_address: "Fifth Avenue at 42nd Street",
        cross_street: "",
        locality: "New York",
        region: "NY",
        access: "Fully Accessible",
        postal_code: 10018,
        type: "research",
        slug: "schwarzman"
      }
    }
  },
  mockArentsDivision = {
    name: "George Arents Collection",
    access: "Fully Accessible",
    rank: 0,
    floor: "Third Floor",
    room: "328",
    type: "research",
    slug: "arents-collection",
    // hours: {
    //   regular: [
    //     { day: "Sun", open: null, close: null },
    //     { day: "Mon", open: null, close: null },
    //     { day: "Tue", open: "10:00", close: "19:45" },
    //     { day: "Wed", open: "10:00", close: "19:45" },
    //     { day: "Thu", open: "10:00", close: "17:45" },
    //     { day: "Fri", open: "10:00", close: "17:45" },
    //     { day: "Sat", open: "10:00", close: "17:45" }
    //   ]
    // },
    open: true,
    images: {
    collection_item: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/444/dc_sasb_arents.jpg",
      interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/444/research_interior_2014_09_18_sasb_arents_8012.jpg"
    },
    plan_your_visit: null,
    fundraising: {
      _id: 275290,
      statement: "Friends of the Library can support their favorite library and receive great benefits!",
      appeal: "Become a Member",
      button_label: "Join or Renew",
      link: "https://secure3.convio.net/nypl/site/SPageServer?pagename=branch_friend_form&s_src=FRQ15ZZ_CADN"
    },
    social_media: null,
    id: "ARN",
    _embedded: {
      events: null,
      exhibitions: null,
      location: {
        name: "Stephen A. Schwarzman Building",
        street_address: "Fifth Avenue at 42nd Street",
        cross_street: "",
        locality: "New York",
        region: "NY",
        access: "Fully Accessible",
        postal_code: 10018,
        type: "research",
        slug: "schwarzman"
      },
      parent: {
        name: "Rare Book Division",
        access: "Partially Accessible",
        rank: 6,
        floor: "Third Floor",
        room: "328",
        slug: "rare-books-division",
        synonyms: [ ]
      }
    }
  },
  mockArentsDivisionHours = {
    name: "George Arents Collection",
    access: "Fully Accessible",
    rank: 0,
    floor: "Third Floor",
    room: "328",
    type: "research",
    slug: "arents-collection",
    hours: {
      regular: [
        { day: "Sun", open: null, close: null },
        { day: "Mon", open: null, close: null },
        { day: "Tue", open: "10:00", close: "19:45" },
        { day: "Wed", open: "10:00", close: "19:45" },
        { day: "Thu", open: "10:00", close: "17:45" },
        { day: "Fri", open: "10:00", close: "17:45" },
        { day: "Sat", open: "10:00", close: "17:45" }
      ],
      exceptions: {
        start: "2014-11-18T14:15:39-05:00",
        end: "2014-11-19T00:00:00-05:00",
        description: "<p>NOTE: The Stephen A. Schwarzman Building " +
          "will be CLOSED..."
      }
    },
    _embedded: {
      events: null,
      exhibitions: null,
      location: {
        name: "Stephen A. Schwarzman Building",
        street_address: "Fifth Avenue at 42nd Street",
        cross_street: "",
        locality: "New York",
        region: "NY",
        access: "Fully Accessible",
        postal_code: 10018,
        type: "research",
        slug: "schwarzman"
      },
      parent: {
        name: "Rare Book Division",
        access: "Partially Accessible",
        rank: 6,
        floor: "Third Floor",
        room: "328",
        slug: "rare-books-division",
        synonyms: [ ]
      }
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

      // httpBackend
      //   .expectGET('languages/en.json')
      //   .respond('public/languages/en.json');

      // Find out why this is needed:
      httpBackend
        .expectGET('views/locations.html')
        .respond('public/views/locations.html');

      httpBackend
        .expectGET('views/location-list-view.html')
        .respond('public/views/location-list-view.html');

      nyplLocationsService.getConfig();
      httpBackend.flush();
    });
  });

  describe('General Research Division', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      // getDay() returns 2 to mock that today is Tuesday
      Date.prototype.getDay = function () { return 2; };

      scope = _$rootScope_.$new();
      DivisionCtrl = _$controller_('DivisionCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN", "RBK", "MSS", "BRG",
            "PRN", "PHG", "SPN", "CPS"]},
        division: mockGeneralResearch
      });
    }));

    it('should get the mocked data', function () {
      expect(scope.division).toEqual(mockGeneralResearch);
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

    it('should have an embedded division', function () {
      expect(scope.division._embedded.divisions).toBeDefined();
    });

    it('should have hours for the embedded division', function () {
      var subdivision_hours = {
        today : { day : 'Tue', open : '10:00', close : '19:45' },
        tomorrow : { day : 'Wed', open : '10:00', close : '19:45' }
      };

      expect(scope.division._embedded.divisions[0].hoursToday)
        .toEqual(subdivision_hours);
    });
  });

  describe('George Arents Collection', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      scope = _$rootScope_.$new();
      DivisionCtrl = _$controller_('DivisionCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN", "RBK", "MSS", "BRG",
            "PRN", "PHG", "SPN", "CPS"]},
        division: mockArentsDivision
      });
    }));

    it('should get the mocked data', function () {
      expect(scope.division).toEqual(mockArentsDivision);
      expect(scope.division.name).toEqual('George Arents Collection');
    });

    it('should not have hours', function () {
      expect(scope.hoursToday).not.toBeDefined();
    });

    it('should have an appointment button', function () {
      expect(scope.has_appointment).toBe(true);
    });

    it('should not have any social media buttons', function () {
      expect(scope.division.social_media).toBe(null);
    });

    it('should not have an alert on the page', function () {
      // Alerts/exceptions are part of the hours property in the division
      expect(scope.division.hours).not.toBeDefined();
    });

    it('should not have embedded divisions', function () {
      expect(scope.division._embedded.divisions).not.toBeDefined();
    });

    it('should have an embedded parent division', function () {
      expect(scope.division._embedded.parent).toBeDefined();
    });

    it('should have an embedded location', function () {
      expect(scope.division._embedded.location).toBeDefined();
    });
  });

  describe('George Arents Collection - with hours', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      scope = _$rootScope_.$new();
      DivisionCtrl = _$controller_('DivisionCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN", "RBK", "MSS", "BRG",
            "PRN", "PHG", "SPN", "CPS"]},
        division: mockArentsDivisionHours
      });
    }));

    it('should have an alert on the page', function () {
      // Alerts/exceptions are part of the hours property in the division
      expect(scope.division.hours).toBeDefined();
      expect(scope.division.hours.exceptions).toBeDefined();
    });
  });

});

