/*jslint indent: 2, maxlen: 80, regexp: true*/
/*global describe, require, beforeEach, browser,
angular, it, expect, element, by */

describe('Locations: Amenities at a branch', function () {
  'use strict';

  var amenitiesPage = require('./amenities.po.js'),
    APIresponse = require('../APImocks/amenities_at_branch.js'),
    // Function that creates a module that is injected at run time,
    // overrides and mocks httpbackend to mock API call. 
    httpBackendMock = function (response) {
      var API_URL = 'http://locations-api-alpha.herokuapp.com';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.whenGET('/languages/en.json').passThrough();
          $httpBackend.whenGET('/views/amenities.html').passThrough();
          $httpBackend.whenGET('/config').passThrough();

          $httpBackend
            .whenJSONP(API_URL +
              '/locations/grand-central?callback=JSON_CALLBACK')
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
      // Pass the good JSON from the API call.
      browser.addMockModule('httpBackendMock', httpBackendMock,
          APIresponse.good);
      browser.get('/amenities/loc/grand-central');
      browser.waitForAngular();
    });

    it('should have a title', function () {
      expect(amenitiesPage.location_name.getText())
        .toEqual('Amenities at Grand Central Library');
    });

    describe('Amenities list', function () {
      it('should contain four categories', function () {
        expect(amenitiesPage.amenities_categories.count()).toBe(4);
      });

      describe('Computer Services category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(0)
            .element(by.css('.category_title')).getText())
            .toEqual('Computer Services');
        });

        it('should contain five amenities', function () {
          expect(amenitiesPage.getNthCategory(0)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Computers for Public Use\nReserve a PC Learn more\n' +
              'Laptops for Public Use\n' +
              'Printing (from PC)\n' +
              'Wireless Internet Access\nLearn more\n' +
              'Electric outlets available');
        });
      });

      describe('Circulation category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(1)
            .element(by.css('.category_title')).getText())
            .toEqual('Circulation');
        });

        it('should contain three amenities', function () {
          expect(amenitiesPage.getNthCategory(1)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Inter-Library Loan\nLearn more\n' +
              'Self-service check-out\n' +
              'Book drop box (limited hours)');
        });
      });

      describe('Printing and Copy Services category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.category_title')).getText())
            .toEqual('Printing and Copy Services');
        });

        it('should contain two amenities', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Photocopiers (black/white)\n' +
              'Photocopiers (color)');
        });
      });

      describe('Facilities category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(3)
            .element(by.css('.category_title')).getText())
            .toEqual('Facilities');
        });

        it('should contain three amenities', function () {
          expect(amenitiesPage.getNthCategory(3)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Public Restrooms\n' +
              'Lost and found\n' +
              'Water fountain');
        });
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
  });

  // describe('Bad API Call', function () {
  //   beforeEach(function () {
  //     browser.addMockModule('httpBackendMock', httpBackendMock,
  //         APIresponse.bad);
  //     browser.get('/#/amenities/loc/115th-street');
  //     browser.waitForAngular();
  //   });
  // });

});