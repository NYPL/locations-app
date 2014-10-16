/*jslint indent: 2, maxlen: 80, regexp: true*/
/*global describe, require, beforeEach, browser, it, expect,
angular, element, by */

describe('Locations: Amenity', function () {
  'use strict';

  var amenitiesPage = require('./amenities.po.js'),
    APIresponse = require('../APImocks/amenity.js'),
    // Function that creates a module that is injected at run time,
    // overrides and mocks httpbackend to mock API call. 
    httpBackendMock = function (response) {
      var API_URL = 'http://locations-api-alpha.herokuapp.com';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.whenGET('/languages/en.json').passThrough();
          $httpBackend.whenGET('/views/amenities.html').passThrough();
          $httpBackend
            .whenGET('/config')
            .respond({ config: { api_root: API_URL } });

          $httpBackend
            .whenJSONP(API_URL + '/amenities/7964?callback=JSON_CALLBACK')
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

  describe('Good API Call', function () {
    beforeEach(function () {
      browser.addMockModule('httpBackendMock', httpBackendMock,
          APIresponse.good);
      browser.get('/amenities/id/7964');
    });

    it('should have a "Reserve a PC" link', function () {
      expect(amenitiesPage.action_link.getText()).toEqual('Reserve a PC');
    });

    it('should have a "Learn more" link', function () {
      expect(amenitiesPage.learn_more.getText()).toEqual('Learn more');
    });

    it('should display the name of the service', function () {
      expect(amenitiesPage.amenity_name.getText())
        .toEqual('Computers for Public Use');
    });

    it('should display a list of locations', function () {
      // More in the real response but only 5 in the mock response.
      expect(amenitiesPage.locations.count()).toBe(5);
    });
  });

  describe('Services Callout', function () {
    it('should have a callout section on the right side', function () {
      expect(amenitiesPage.services_callout.isPresent()).toBe(true);
    });

    it('should say that the library also offers services', function () {
      expect(amenitiesPage.services_callout.getText())
        .toEqual('The Library also offers\nservices\nof all kinds!' +
          '\nFind out more');
    });
  });

  // describe('Bad API Call', function () {
  //   beforeEach(function () {
  //     browser.addMockModule('httpBackendMock', httpBackendMock,
  //         APIresponse.bad);
  //     browser.get('/#/amenities/id/7950');
  //     browser.waitForAngular();
  //   });
  // });
});
