/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
// Basic test template - services pages are not done

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
          
        });

        it('should contain five amenities', function () {

          expect(amenitiesPage.amenities_categories.get(0).element(by.css('.category_title')).getText()).toEqual('Computer Services')
          expect(amenitiesPage.amenities_categories.get(0).element(by.css('.amenity_name')).getText()).toEqual('Computer Services')
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


});