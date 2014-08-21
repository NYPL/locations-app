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
      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.when('GET', 'http://evening-mesa-7447-160.herokuapp' +
              '.com/locations/115th-street/amenities')
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
      browser.addMockModule('httpBackendMock', httpBackendMock,
          APIresponse.good);
      browser.get('/#/amenities/location/115th-street');
      browser.waitForAngular();
    });

    it('should have a title', function () {
      expect(amenitiesPage.location_name.getText())
        .toEqual('Amenities at 115th Street Library');
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

        it('should contain three amenities', function () {
          expect(amenitiesPage.getNthCategory(0)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Computers for Public Use Reserve a PC Learn more\n' +
              'Wireless Internet Access Learn more\n' +
              'Laptops for Public Use Reserve a Laptop Learn more');
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
            .toEqual('Inter-Library Loan\n' +
              'Self-service check-out Learn more\n' +
              'Book drop box (24 hour) Learn more');
        });
      });

      describe('Office Services category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.category_title')).getText())
            .toEqual('Office Services');
        });

        it('should contain three amenities', function () {
          expect(amenitiesPage.getNthCategory(2)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Photocopiers (black/white)\n' +
              'Photocopiers (color)\n' +
              'Scanners');
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
              'Children\'s Only Restrooms\n' +
              'Research Study Rooms');
        });
      });

      describe('Assistive Technologies category', function () {
        it('should display the category name', function () {
          expect(amenitiesPage.getNthCategory(4)
            .element(by.css('.category_title')).getText())
            .toEqual('Assistive Technologies');
        });

        it('should contain three amenities', function () {
          expect(amenitiesPage.getNthCategory(4)
            .element(by.css('.amenities-list')).getText())
            .toEqual('Screen magnification software (MAGic)\n' +
              'Screen reading software (JAWS)\n' +
              'Closed-Circuit Television Enlargers (CCTVs)');
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