/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('NYPL Widget', function () {
  'use strict';

  var widgetPage = require('./widget.po.js'),
    circulating = require('../APImocks/circulating.js'),
    research = require('../APImocks/research.js'),
    division = require('../APImocks/division.js'),
    httpBackendMock = function (page, response) {
      var API_URL = 'http://locations-api-alpha.herokuapp.com';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.whenGET('/languages/en.json').passThrough();
          $httpBackend
            .whenGET('/config')
            .respond({ config: { api_root: API_URL } });

          $httpBackend
            .whenJSONP(API_URL + page + '?callback=JSON_CALLBACK')
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

  // describe('Location page', function () {
  //   beforeEach(function () {
  //     browser.addMockModule('httpBackendMock', httpBackendMock,
  //       '/locations/grand-central', circulating.good);
  //     browser.get('/widget/grand-central');
  //     browser.waitForAngular();
  //   });

  //   it('should have an image', function () {
  //     expect(widgetPage.image.isPresent()).toBe(true);
  //   });

  //   it('should display the location\'s address', function () {
  //     expect(widgetPage.street_address.getText())
  //       .toEqual('135 East 46th Street');
  //     expect(widgetPage.locality.getText()).toEqual('New York');
  //     expect(widgetPage.region.getText()).toEqual('NY');
  //     expect(widgetPage.postal_code .getText()).toEqual('10017');
  //   });

  //   it('should have a telephone number', function () {
  //     expect(widgetPage.telephone.getText()).toEqual('(212) 621-0670');
  //   });

  //   it('should have a library manager', function () {
  //     expect(widgetPage.manager.getText())
  //       .toEqual('Library Manager: Genoveve Stowell');
  //   });

  //   it('should be fully accessible', function () {
  //     expect(widgetPage.accessibility.getText())
  //       .toEqual('Fully Accessible');
  //   });

  //   it('should have a Google Maps directions link', function () {
  //     expect(widgetPage.directions_link.getText()).toEqual('Get Directions');
  //     expect(widgetPage.directions_link.getAttribute('href'))
  //       .toEqual('https://maps.google.com/maps?saddr=&daddr=Grand%20' +
  //         'Central%20Library%20135%20East%2046th%20Street%20New%20York' +
  //         ',%20NY,%2010017');
  //   });

  //   it('should have a catalog link', function () {
  //     expect(widgetPage.catalog_link.getText()).toEqual('On Our Shelves Now');
  //     expect(widgetPage.catalog_link.getAttribute('href'))
  //       .toEqual('http://nypl.bibliocommons.com/search?custom_query' +
  //         '=available%3A%22Grand+Central%22&circ=CIRC|NON%20CIRC');
  //   });

  //   it('should have four social media buttons', function () {
  //     expect(widgetPage.social_media_container.isPresent()).toBe(true);
  //     expect(widgetPage.social_media.count()).toBe(4);
  //   });

  //   it('should display the hours today', function () {
  //     expect(widgetPage.hours_container.isPresent()).toBe(true);
  //     expect(widgetPage.hoursToday.getText()).not.toEqual('');
  //   });

  //   it('should have a link back to the Locinator', function () {
  //     expect(widgetPage.locinator_url.getText())
  //       .toEqual('Learn about hours, amenities, events, and more.');
  //     expect(widgetPage.locinator_url.getAttribute('href'))
  //       .toEqual('http://locations-beta.nypl.org/grand-central');
  //   });

  //   it('should have a donate button', function () {
  //     expect(widgetPage.appeal.isPresent()).toBe(true);
  //     expect(widgetPage.donate_btn.isPresent()).toBe(true);
  //   });

  //   it('should have chat/email links', function () {
  //     expect(widgetPage.askNYPL.isPresent()).toBe(true);
  //     expect(widgetPage.email_us.isPresent()).toBe(true);
  //   });
  // });

  // describe('Research page', function () {
  //   beforeEach(function () {
  //     browser.addMockModule('httpBackendMock', httpBackendMock,
  //       '/locations/schomburg', research.good);
  //     browser.get('/widget/schomburg');
  //     browser.waitForAngular();
  //   });

  //   it('should have an image', function () {
  //     expect(widgetPage.image.isPresent()).toBe(true);
  //   });

  //   it('should display the location\'s address', function () {
  //     expect(widgetPage.street_address.getText())
  //       .toEqual('515 Malcolm X Boulevard');
  //     expect(widgetPage.locality.getText()).toEqual('New York');
  //     expect(widgetPage.region.getText()).toEqual('NY');
  //     expect(widgetPage.postal_code .getText()).toEqual('10037');
  //   });

  //   it('should have a telephone number', function () {
  //     expect(widgetPage.telephone.getText()).toEqual('(917) 275-6975');
  //   });

  //   it('should have a library manager', function () {
  //     expect(widgetPage.manager.getText())
  //       .toEqual('Library Manager: ');
  //   });

  //   it('should be partially accessible', function () {
  //     expect(widgetPage.accessibility.getText())
  //       .toEqual('Partially Accessible');
  //   });

  //   it('should have a Google Maps directions link', function () {
  //     expect(widgetPage.directions_link.getText()).toEqual('Get Directions');
  //     expect(widgetPage.directions_link.getAttribute('href'))
  //       .toEqual('https://maps.google.com/maps?saddr=&daddr=Schomburg%20' +
  //         'Center%20for%20Research%20in%20Black%20Culture%20515%20' +
  //         'Malcolm%20X%20Boulevard%20New%20York,%20NY,%2010037');
  //   });

  //   it('should not have a catalog link', function () {
  //     expect(widgetPage.catalog_link.isPresent()).toBe(false);
  //   });

  //   it('should have five social media buttons', function () {
  //     expect(widgetPage.social_media_container.isPresent()).toBe(true);
  //     expect(widgetPage.social_media.count()).toBe(5);
  //   });

  //   it('should display the hours today', function () {
  //     expect(widgetPage.hours_container.isPresent()).toBe(true);
  //     expect(widgetPage.hoursToday.getText()).not.toEqual('');
  //   });

  //   it('should have a link back to the Locinator', function () {
  //     expect(widgetPage.locinator_url.getText())
  //       .toEqual('Learn about hours, amenities, events, and more.');
  //     expect(widgetPage.locinator_url.getAttribute('href'))
  //       .toEqual('http://locations-beta.nypl.org/schomburg');
  //   });

  //   it('should have a donate button', function () {
  //     expect(widgetPage.appeal.isPresent()).toBe(true);
  //     expect(widgetPage.donate_btn.isPresent()).toBe(true);
  //   });

  //   it('should have chat/email links', function () {
  //     expect(widgetPage.askNYPL.isPresent()).toBe(true);
  //     expect(widgetPage.email_us.isPresent()).toBe(true);
  //   });
  // });


  describe('Division page', function () {
    beforeEach(function () {
      browser.addMockModule('httpBackendMock', httpBackendMock,
        '/divisions/general-research-division', division.good);
      browser.get('/widget/divisions/general-research-division');
      browser.waitForAngular();
    });

    it('should have an image', function () {
      expect(widgetPage.image.isPresent()).toBe(true);
    });

    it('should have the research branch\'s name', function () {
      expect(widgetPage.location_name.getText())
        .toEqual('Stephen A. Schwarzman Building');
    });

    it('should display the location\'s address', function () {
      expect(widgetPage.street_address.getText())
        .toEqual('Fifth Avenue at 42nd Street');
      expect(widgetPage.locality.getText()).toEqual('New York');
      expect(widgetPage.region.getText()).toEqual('NY');
      expect(widgetPage.postal_code .getText()).toEqual('10018');
    });

    it('should have a floor and room number', function () {
      expect(widgetPage.floor.getText()).toEqual('Third Floor,')
      expect(widgetPage.room.getText()).toEqual('Room 315')
    });

    it('should have a telephone number', function () {
      expect(widgetPage.telephone.getText()).toEqual('(917) 275-6975');
    });

    it('should have a library manager', function () {
      expect(widgetPage.manager.getText())
        .toEqual('Library Manager: Marie Coughlin');
    });

    it('should be fully accessible', function () {
      expect(widgetPage.accessibility.getText())
        .toEqual('Fully Accessible');
    });

    it('should not have a Google Maps directions link', function () {
      expect(widgetPage.directions_link.isPresent()).toBe(false);
    });

    it('should not have a catalog link', function () {
      expect(widgetPage.catalog_link.isPresent()).toBe(false);
    });

    it('should have four social media buttons', function () {
      expect(widgetPage.social_media_container.isPresent()).toBe(true);
      expect(widgetPage.social_media.count()).toBe(4);
    });

    it('should display the hours today', function () {
      expect(widgetPage.hours_container.isPresent()).toBe(true);
      expect(widgetPage.hoursToday.getText()).not.toEqual('');
    });

    it('should have a link back to the Locinator', function () {
      expect(widgetPage.locinator_url.getText())
        .toEqual('Learn about hours, amenities, events, and more.');
      expect(widgetPage.locinator_url.getAttribute('href'))
        .toEqual('http://locations-beta.nypl.org/divisions/' +
          'general-research-division');
    });

    it('should have a donate button', function () {
      expect(widgetPage.appeal.isPresent()).toBe(true);
      expect(widgetPage.donate_btn.isPresent()).toBe(true);
    });

    it('should have chat/email links', function () {
      expect(widgetPage.askNYPL.isPresent()).toBe(true);
      expect(widgetPage.email_us.isPresent()).toBe(true);
    });
  });


});

