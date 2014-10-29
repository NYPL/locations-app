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
          exterior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/36/exterior_sasb2_0.jpg",
          interior: "http://cdn-prod.www.aws.nypl.org/sites/default/files/images/locations/36/interior_sasb_reading_room.jpg"
        }
      }
    }
  },
  mockCathedralLocation = {
    
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
            divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN","PHG","SPN","CPS"]
          }
        });

      nyplLocationsService.getConfig();
      httpBackend.flush();
    })
  });

  describe('General Research Division', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_, _$location_) {
      // getDay() returns 2 to mock that today is Tuesday
      Date.prototype.getDay = function () { return 2; };

      scope = _$rootScope_.$new();
      WidgetCtrl = _$controller_('WidgetCtrl', {
        $scope: scope,
        config: {api_root: 'http://locations-api-beta.nypl.org',
          divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN","PHG","SPN","CPS"]},
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

    it('should not display a closed image', function () {
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
});

