/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Research branch page', function () {
  'use strict';

  var locationPage = require('./location.po.js'),
    APIresponse = require('../APImocks/research.js'),
    httpBackendMock = function (response) {
      var API_URL = 'http://dev.locations.api.nypl.org';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.whenGET('languages/en.json').passThrough();

          $httpBackend
            .whenJSONP(API_URL + '/locations/schomburg?callback=JSON_CALLBACK')
            .respond(response);

          $httpBackend
            .whenJSONP(API_URL + '/alerts?callback=JSON_CALLBACK')
            .respond({});

          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();
        });
    };

  beforeEach(function () {
    // Pass the good JSON from the API call.
    browser.addMockModule('httpBackendMock', httpBackendMock,
      APIresponse.good);
    browser.get('/schomburg');
    browser.waitForAngular();
  });

  describe('basic info section', function () {
    it('should display an alert message', function () {
      expect(locationPage.alert.isPresent()).toBe(true);
    });

    it('should display the name', function () {
      expect(locationPage.name.getText())
        .toEqual('Schomburg Center for Research in Black Culture');
    });

    it('should display the image for the library', function () {
      expect(locationPage.image.isPresent()).toBe(true);
    });

    it('should have a street address', function () {
      expect(locationPage.street_address.getText())
        .toEqual('515 Malcolm X Boulevard');
    });

    it('should have the city in the address', function () {
      expect(locationPage.locality.getText()).toEqual('New York');
    });

    it('should have the state in the address', function () {
      expect(locationPage.region.getText()).toEqual('NY');
    });

    it('should have the zipcode in the address', function () {
      expect(locationPage.postal_code.getText()).toEqual('10037');
    });

    it('should not have a library manager', function () {
      expect(locationPage.manager.isPresent()).toBe(false);
    });

    it('should be Partially Accessible', function () {
      expect(locationPage.accessibility.getText())
        .toEqual('Partially Accessible');
      expect(locationPage.accessibility.getAttribute('class'))
        .toContain('accessible');
    });

    it('should have a Google Maps Directions link', function () {
      expect(locationPage.directions_link.getAttribute('href'))
        .toMatch(/google.com\/maps/);
    });

    it('should not have an \'On Our Shelves Now\' link', function () {
      expect(locationPage.catalog_link.isPresent()).toBe(false);
    });

    it('should display five social media icons', function () {
      expect(locationPage.social_media_container.isPresent()).toBe(true);
      expect(locationPage.social_media.count()).toBe(5);
    });

    it('should display hours for today', function () {
      // Hours change everyday
      expect(locationPage.hoursToday.getText()).not.toEqual('');
    });

    it('should display hours for all seven days', function () {
      expect(locationPage.hours.count()).toBe(7);
    });
  });

  describe('amenities section', function () {
    it('should have an "All Amenities" link', function () {
      expect(locationPage.allAmenities.getText()).toBe('See all amenities');
    });

    it('should have a link with the slug, not abbreviation', function () {
      expect(locationPage.allAmenities.getAttribute('href'))
        .toMatch(/amenities\/loc\/schomburg/);
    });
  });

  describe('divisions section', function () {
    it('should be present', function () {
      expect(locationPage.divisions_container.isPresent()).toBe(true);
    });

    it('should display five divisions', function () {
      expect(locationPage.divisions.count()).toBe(5);
    });
  });

  describe('featured section', function () {
    it('should be present', function () {
      expect(locationPage.featured_container.isPresent()).toBe(true);
    });

    it('should contain five featured content', function () {
      expect(locationPage.features.count()).toBe(5);
    });
  });

  describe('events section', function () {
    it('should be present', function () {
      expect(locationPage.events_container.isPresent()).toBe(true);
    });

    it('should display six events', function () {
      expect(locationPage.events.count()).toBe(6);
    });

    it('should have a \'See more events\' link', function () {
      expect(locationPage.events_more_link.getAttribute('href'))
        .toEqual('http://www.nypl.org/events/calendar?location=64');
    });

    // describe('individual event', function () {
    //   describe('Google calendar link', function () {
    //     it('should link to Google', function () {
    //       expect(locationPage.google.get(0).getAttribute('href'))
    //         .toMatch(/https:\/\/www.google.com\/calendar\/render/);
    //     });

    //     it('should pass the correct date', function () {
    //       expect(locationPage.google.get(0).getAttribute('href'))
    //         .toMatch(/dates\=20140814T200000Z\/20140814T200000Z/);
    //     });
    //   });

    //   describe('Yahoo calendar link', function () {
    //     it('should link to Yahoo', function () {
    //       expect(locationPage.yahoo.get(0).getAttribute('href'))
    //         .toMatch(/https:\/\/calendar.yahoo.com\//);
    //     });

    //     it('should pass the correct start time', function () {
    //       expect(locationPage.yahoo.get(0).getAttribute('href'))
    //         .toMatch(/ST\=20140814T200000Z/);
    //     });
    //   });
    // });
  });

  describe('about section', function () {
    it('should have another image', function () {
      expect(locationPage.secondary_image.isPresent()).toBe(true);
    });

    it('should have a blurb', function () {
      expect(locationPage.about.isPresent()).toBe(true);
    });

    it('should have a "Plan Your Visit" section', function () {
      expect(locationPage.plan_your_visit.isPresent()).toBe(true);
    });

    it('should have an "Email a Librarian" link', function () {
      expect(locationPage.email_librarian.getAttribute('href'))
        .toEqual('http://www.nypl.org/locations/tid/64/node/126585');
    });
  });

  describe('blog section', function () {
    it('should be present', function () {
      expect(locationPage.blogs_container.isPresent()).toBe(true);
    });

    it('should display six blogs', function () {
      expect(locationPage.blogs.count()).toBe(6);
    });

    it('should display a \'See more blogs\' link', function () {
      expect(locationPage.blogs_more_link.getAttribute('href'))
        .toEqual('http://www.nypl.org/blog/library/64');
    });
  });

  describe('exhibitions section', function () {
    it('should be present', function () {
      expect(locationPage.exhibitions_container.isPresent()).toBe(true);
    });

    it('should display five exhibitions', function () {
      expect(locationPage.exhibitions.count()).toBe(5);
    });
  });

  describe('bottom links section', function () {
    it('should display email us your question link', function () {
      expect(locationPage.email_us.getAttribute('href'))
        .toBe('http://www.nypl.org/locations/tid/64/node/126585');
    });
  });
});
