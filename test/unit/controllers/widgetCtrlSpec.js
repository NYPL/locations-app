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
      collection_item: "http://cdn-prod.www.aws.nypl.org/sites/default/files" +
        "/images/locations/394/dc_sasb_grd.jpg"
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
    fundraising: null,
    synonyms: null,
    type: "research",
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
        slug: "schwarzman",
        geolocation: {
          type: "Point",
          coordinates: [ -73.9822, 40.7532]
        },
        open: true,
        images: {
          exterior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/" +
            "images/locations/36/exterior_sasb2_0.jpg",
          interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/" +
            "images/locations/36/interior_sasb_reading_room.jpg"
        }
      }
    }
  },
  mockPeriodicalsRoom = {
    name: "DeWitt Wallace Periodical Room",
    access: "Fully Accessible",
    floor: "First Floor",
    room: "108",
    type: "research",
    slug: "periodicals-room",
    fundraising: {},
    hours: { regular: [
      { day: "Sun", open: null, close: null },
      { day: "Mon", open: "10:00", close: "17:45" },
      { day: "Tue", open: "10:00", close: "19:45" },
      { day: "Wed", open: "10:00", close: "19:45" },
      { day: "Thu", open: "10:00", close: "17:45" },
      { day: "Fri", open: "10:00", close: "17:45" },
      { day: "Sat", open: "10:00", close: "17:45" }
    ]},
    open: true,
    images: {
      interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/" + 
        "images/locations/173/research_interior_sasb_periodicals.jpg",
      collection_item: "http://cdn-prod.www.aws.nypl.org/sites/default/" + 
        "files/images/locations/173/dc_sasb_periodicals.jpg"
    },
    _embedded: {
      parent: {
        name: "General Research Division",
        access: "Fully Accessible",
        rank: 0,
        floor: "Third Floor",
        room: "315",
        slug: "general-research-division",
        open: true,
      },
      location: {
        name: "Stephen A. Schwarzman Building",
        street_address: "Fifth Avenue at 42nd Street",
        cross_street: "",
        locality: "New York",
        region: "NY",
        access: "Fully Accessible",
        postal_code: 10018,
        type: "research",
        slug: "schwarzman",
      }
    }
  },
  mockCathedralLocation = {
    access: "Partially Accessible",
    accessibility_note: null,
    cross_street: "at E. 50th St., lower level",
    fundraising: {},
    id: "CA",
    images: { interior: "http://cdn-prod.www.aws.nypl.org/sites/default/" +
      "files/images/000_0362.jpg" },
    locality: "New York",
    name: "Terence Cardinal Cooke-Cathedral Library",
    open: false,
    postal_code: 10022,
    region: "NY",
    slug: "cathedral",
    social_media: [
    { site: "facebook", href: "https://www.facebook.com/CathedralNYPL" },
    { site: "youtube", href: "http://www.youtube.com/NewYorkPublicLibrary" },
    { site: "bibliocommons", href: "http://nypl.bibliocommons.com/lists/" +
      "show/87527711_nypl_cathedral" }
    ],
    street_address: "560 Lexington Avenue",
    type: "circulating",
    _embedded: {}
  };

describe('WidgetCtrl', function () {
  'use strict';

  var scope, WidgetCtrl, httpBackend, nyplLocationsService;

  beforeEach(function () {
    module('nypl_widget');
    inject(function (_nyplLocationsService_, _$httpBackend_) {
      httpBackend = _$httpBackend_;
      nyplLocationsService = _nyplLocationsService_;

      httpBackend
        .expectGET('/config')
        .respond({
          config: {
            api_root: 'http://locations-api-beta.nypl.org',
            closed_img: "http://ux-static.nypl.org/images/branch_closed.jpg",
            divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN",
              "PHG","SPN","CPS"]
          }
        });

      nyplLocationsService.getConfig();
      httpBackend.flush();
    })
  });

  describe('Division: General Research Division', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      // getDay() returns 2 to mock that today is Tuesday
      Date.prototype.getDay = function () { return 2; };

      scope = _$rootScope_.$new();
      WidgetCtrl = _$controller_('WidgetCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN",
            "PHG","SPN","CPS"]},
        data: mockGeneralResearchDivision
      });
    }));

    it('should get the mocked data', function () {
      expect(scope.data).toEqual(mockGeneralResearchDivision);
    });

    it('should generate a url to the Locinator', function () {
      expect(scope.locinator_url).toEqual('http://locations-beta.nypl.org');
    });

    it('should get the widget\'s name', function () {
      expect(scope.widget_name).toEqual('General Research Division');
    });

    it('should have hours today, mocking for Tuesday', function () {
      expect(scope.hoursToday).toEqual({
        today : { day : 'Tue', open : '10:00', close : '19:45' },
        tomorrow : { day : 'Wed', open : '10:00', close : '19:45' }
      });
    });

    it('should have two social media objects', function () {
      expect(scope.data.social_media).toEqual([
        {
          site: "facebook",
          href: "http://www.facebook.com/pages/General-" +
            "Research-Division-The-New-York-Public-Library/105843439484043",
          classes : 'icon-facebook blueDarkerText'
        },
        {
          site: "twitter",
          href: "http://twitter.com/NYPL_GRD",
          classes : 'icon-twitter2 blueText'
        }
      ]);
    });

    it('should not display a closed image, not coming from /config',
      function () {
        expect(scope.data.images.closed).not.toBeDefined();
      });

    it('should be regarded as a division', function () {
      expect(scope.division).toBe(true);
    });

    it('should get its location interior image and make it its exterior ' +
      'image',
      function () {
        expect(scope.data.images.exterior)
          .toEqual("http://www.nypl.org/sites/default/files" +
            "/images/stacks.jpeg");
      });
  });

  describe('Subdivision: DeWitt Wallace Periodical Room', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      // getDay() returns 2 to mock that today is Wednesday
      Date.prototype.getDay = function () { return 3; };

      scope = _$rootScope_.$new();
      WidgetCtrl = _$controller_('WidgetCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN",
            "PHG","SPN","CPS"]},
        data: mockPeriodicalsRoom
      });
    }));

    it('should get the mocked data', function () {
      expect(scope.data).toEqual(mockPeriodicalsRoom);
    });

    it('should generate a url to the Locinator', function () {
      expect(scope.locinator_url).toEqual('http://locations-beta.nypl.org');
    });

    it('should get the widget\'s name', function () {
      expect(scope.widget_name)
        .toEqual('DeWitt Wallace Periodical Room');
    });

    it('should have hours today, mocking Wednesday', function () {
      expect(scope.hoursToday).toEqual({
        today : { day : 'Wed', open : '10:00', close : '19:45' },
        tomorrow : { day : 'Thu', open : '10:00', close : '17:45' } });
    });

    it('should have a closed image, coming from /config', function () {
      expect(scope.data.images.closed).not.toBeDefined();
    });

    it('should be regarded as a division', function () {
      expect(scope.division).toBe(true);
    });
  });

  describe('Location: Terence Cardinal Cooke-Cathedral Library', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      // getDay() returns 2 to mock that today is Tuesday
      Date.prototype.getDay = function () { return 2; };

      scope = _$rootScope_.$new();
      WidgetCtrl = _$controller_('WidgetCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          closed_img: "http://ux-static.nypl.org/images/branch_closed.jpg",
          divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN",
            "PHG","SPN","CPS"]},
        data: mockCathedralLocation
      });
    }));

    it('should get the mocked data', function () {
      expect(scope.data).toEqual(mockCathedralLocation);
    });

    it('should generate a url to the Locinator', function () {
      expect(scope.locinator_url).toEqual('http://locations-beta.nypl.org');
    });

    it('should get the widget\'s name', function () {
      expect(scope.widget_name)
        .toEqual('Terence Cardinal Cooke-Cathedral Library');
    });

    it('should not have hours today - not in the data', function () {
      expect(scope.hoursToday).not.toBeDefined();
    });

    it('should have two social media objects', function () {
      expect(scope.data.social_media).toEqual([
        {
          site: "facebook",
          href: "https://www.facebook.com/CathedralNYPL",
          classes : 'icon-facebook blueDarkerText'
        },
        { site: "youtube", href: "http://www.youtube.com/NewYorkPublicLibrary",
          classes: "icon-youtube redText" },
        { site: 'bibliocommons',
          href: 'http://nypl.bibliocommons.com/lists/show/' +
            '87527711_nypl_cathedral',
          classes : 'icon-bibliocommons'}
      ]);
    });

    it('should display a closed image', function () {
      expect(scope.data.images.closed)
        .toEqual('http://ux-static.nypl.org/images/branch_closed.jpg');
    });

    it('should not be regarded as a division', function () {
      expect(scope.division).not.toBeDefined();
    });

  });
});


