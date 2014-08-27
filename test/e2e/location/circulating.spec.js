/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Circulating branch page', function () {
  'use strict';

  var locationPage = require('./location.po.js'),
    APIresponse = require('../APImocks/circulating.js'),
    httpBackendMock = function (response) {
      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.when('GET', 'http://evening-mesa-7447-160' +
              '.herokuapp.com/locations/grand-central')
            .respond(response);

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
    browser.get('/#/grand-central');
    browser.waitForAngular();
  });

  describe('basic info section', function () {
    it('should display the name', function () {
      expect(locationPage.name.getText()).toEqual('Grand Central Library');
    });

    it('should display the image for the library', function () {
      expect(locationPage.image.isPresent()).toBe(true);
    });

    it('should have a street address', function () {
      expect(locationPage.street_address.getText())
        .toEqual('135 East 46th Street');
    });

    it('should have the city in the address', function () {
      expect(locationPage.locality.getText()).toEqual('New York');
    });

    it('should have the state in the address', function () {
      expect(locationPage.region.getText()).toEqual('NY');
    });

    it('should have the zipcode in the address', function () {
      expect(locationPage.postal_code.getText()).toEqual('10017');
    });

    it('should have a library manager', function () {
      expect(locationPage.manager.getText())
        .toEqual('Library Manager: Genoveve Stowell');
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
        .toMatch(/amenities\/loc\/grand-central/);
    });
  });

  describe('divisions section', function () {
    it('should not be present', function () {
      expect(locationPage.divisions_container.isPresent()).toBe(false);
      expect(locationPage.divisions.count()).toBe(0);
    });
  });

  describe('events section', function () {
    it('should be present', function () {
      expect(locationPage.events_container.isPresent()).toBe(true);
    });

    it('should display six events', function () {
      expect(locationPage.events.count()).toBe(6);
    });

    describe('individual event', function () {
      describe('Google calendar link', function () {
        it('should link to Google', function () {
          expect(locationPage.google.get(0).getAttribute('href'))
            .toMatch(/https:\/\/www.google.com\/calendar\/render/);
        });

        it('should pass the correct date', function () {
          expect(locationPage.google.get(0).getAttribute('href'))
            .toMatch(/dates\=20140814T200000Z\/20140814T200000Z/);
        });
      });

      describe('Yahoo calendar link', function () {
        it('should link to Yahoo', function () {
          expect(locationPage.yahoo.get(0).getAttribute('href'))
            .toMatch(/https:\/\/calendar.yahoo.com\//);
        });

        it('should pass the correct start time', function () {
          expect(locationPage.yahoo.get(0).getAttribute('href'))
            .toMatch(/ST\=20140814T200000Z/);
        });
      });
    });
  });

  describe('about section', function () {
    it('should have another image', function () {
      expect(locationPage.secondary_image.isPresent()).toBe(true);
    });

    it('should have a blurb', function () {
      expect(locationPage.about.isPresent()).toBe(true);
    });

    it('should not have a "Plan Your Visit" section', function () {
      expect(locationPage.plan_your_visit.isPresent()).toBe(false);
    });
  });

  describe('blog section', function () {
    it('should be present', function () {
      expect(locationPage.blogs_container.isPresent()).toBe(true);
    });

    it('should display six blogs', function () {
      expect(locationPage.blogs.count()).toBe(6);
    });
  });

  describe('bottom links section', function () {
    it('should display email us your question link', function () {
      expect(locationPage.email_us.getAttribute('href'))
        .toBe('http://www.questionpoint.org/crs/servlet/org.oclc.admin.' +
          'BuildForm?&institution=10208&type=1&language=1');
    });
  });

  describe('specific scenarios', function () {
    beforeEach(function () {
      browser.addMockModule('httpBackendMock', httpBackendMock);
      browser.get('/#/grand-central');
      browser.waitForAngular();
    });

    describe('when there are no events', function () {
      it('the Events block should not appear on the page', function () {
        expect(locationPage.events_container.isPresent()).toBe(false);
        expect(locationPage.events.count()).toBe(0);
      });
    });

    describe('when there are no blogs', function () {
      it('the Blogs block should not appear on the page', function () {
        expect(locationPage.blogs_container.isPresent()).toBe(false);
        expect(locationPage.blogs.count()).toBe(0);
      });
    });

    describe('when there are no social media links', function () {
      it('should not generate the social media icons', function () {
        expect(locationPage.social_media_container.isPresent()).toBe(false);
        expect(locationPage.social_media.count()).toBe(0);
      });
    });
  });
});
