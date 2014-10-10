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
          $httpBackend
            .whenJSONP('http://locations-api-beta.nypl.org' +
                '/amenities?callback=JSON_CALLBACK')
            .respond(response);

          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();
        });
    };

  describe('Good API Call', function () {
    beforeEach(function () {
      // Pass the good JSON from the API call.
      // browser.addMockModule('httpBackendMock', httpBackendMock,
      //     APIresponse.good);
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
            .toEqual('Computers for Public Use\nReserve a PC Learn more\n' +
              'Wireless Internet Access\nLearn more\n' +
              'Printing (from PC)\n' +
              'Laptops for Public Use\n' +
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
            .toEqual('Book drop box (24 hour)\nLearn more\n' +
              'Self-service check-out\n' +
              'Inter-Library Loan\nLearn more\n' +
              'Book drop box (limited hours)\n' +
              'Talking Books\nLearn more\n' +
              'Books in braille\n');
        });
      });

      describe('Office Services category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.category_title')).getText())
            .toEqual('Printing and Copy Services');
        });

        it('should contain five amenities', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Photocopiers (black/white)\n' +
              'Photocopiers (color)\n' +
              'Scanners\n' +
              'Change machine\n' +
              'Map photocopiers (up to 36" wide)');
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
            .toEqual('Children\'s Only Restrooms\n' +
              'Changing station\n' +
              'Bicycle Rack\n' +
              'Research Study Rooms\n' +
              'Public Restrooms\n' +
              'Parking\n' +
              'Lost and found\n' +
              'Checkroom Service\n' +
              'Payphones\n' +
              'Water fountain');
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
            .toEqual('Screen magnification software (MAGic)\nLearn more\n' +
              'Screen reading software (JAWS)\nLearn more\n' +
              'Adjustable height tables\n' +
              'Braille embossing\n' +
              'Brailler translation software\n' +
              'Closed-Circuit Television Enlargers (CCTVs)\nLearn more\n' +
              'Refreshable braille display\n' +
              'Scanner/Reading Rooms\n' +
              'Braille writers\nLearn more' +
              'Assistive Amplification Systems\nLearn more\n' +
              'Telecommunications Devices for the Deaf (TTYs)\n' +
              'Personal Reading Machines\nLearn more\n' +
              'VRS (Video Relay Service)');
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
  //     browser.get('/#/amenities');
  //     browser.waitForAngular();
  //   });

  //   // TODO: Write tests
  // });

});