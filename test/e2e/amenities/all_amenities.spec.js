/*jslint indent: 2, maxlen: 80, regexp: true*/
/*global describe, require, beforeEach, browser,
angular, it, expect, element, by */

describe('Locations: Amenities', function () {
  'use strict';

  var amenitiesPage = require('./amenities.po.js'),
    APIresponse = require('../APImocks/amenities.js'),
    // Function that creates a module that is injected at run time,
    // overrides and mocks httpbackend to mock API call. 
    httpBackendMock = function (response) {
      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();

          $httpBackend.when('GET', 'json/amenitiesAtLibrary.json')
            .respond(response);
        });
    };

  describe('Good API Call', function () {
    beforeEach(function () {
      // Pass the good JSON from the API call.
      browser.addMockModule('httpBackendMock', httpBackendMock,
          APIresponse.good);
      browser.get('/#/amenities');
      browser.waitForAngular();
    });

    it('should have a title', function () {
      expect(amenitiesPage.title.getText()).toEqual('Amenities at NYPL');
    });

    describe('Amenities list', function () {
      it('should contain five categories', function () {
        expect(amenitiesPage.amenities_categories.count()).toBe(5);
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
            .toEqual('Computers for Public Use Reserve a PC Learn more\n' +
              'Wireless Internet Access Learn more\n' +
              'Laptops for Public Use Reserve a Laptop Learn more\n' +
              'Printing (from PC)\n' +
              'Electric outlets available');
        });
      });

      describe('Circulation category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(1)
            .element(by.css('.category_title')).getText())
            .toEqual('Circulation');
        });

        it('should contain six amenities', function () {
          expect(amenitiesPage.getNthCategory(1)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Inter-Library Loan\n' +
              'Self-service check-out Learn more\n' +
              'Book drop box (24 hour) Learn more\n' +
              'Book drop box (limited hours) Learn more\n' +
              'Books in Braille\n' +
              'Talking Books');
        });
      });

      describe('Office Services category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.category_title')).getText())
            .toEqual('Office Services');
        });

        it('should contain five amenities', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Photocopiers (black/white)\n' +
              'Photocopiers (color)\n' +
              'Scanners\n' +
              'Map photocopiers (up to 36" wide)\n' +
              'Change machine');
        });
      });

      describe('Facilities category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(3)
            .element(by.css('.category_title')).getText())
            .toEqual('Facilities');
        });

        it('should contain six amenities', function () {
          expect(amenitiesPage.getNthCategory(3)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Public Restrooms\n' +
              'Children\'s Only Restrooms\n' +
              'Research Study Rooms\n' +
              'Parking\n' +
              'Lost and found\n' +
              'Bicycle Rack');
        });
      });

      describe('Assistive Technologies category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(4)
            .element(by.css('.category_title')).getText())
            .toEqual('Assistive Technologies');
        });

        it('should contain six amenities', function () {
          expect(amenitiesPage.getNthCategory(4)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Screen magnification software (MAGic)\n' +
              'Screen reading software (JAWS)\n' +
              'Closed-Circuit Television Enlargers (CCTVs)\n' +
              'Scanner/reading Rooms\n' +
              'Brailler Translation Software\n' +
              'Braille Embossing');
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

  describe('Bad API Call', function () {
    beforeEach(function () {
      browser.addMockModule('httpBackendMock', httpBackendMock,
          APIresponse.bad);
      browser.get('/#/amenities');
      browser.waitForAngular();
    });

  });

});