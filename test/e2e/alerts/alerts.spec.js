/*jslint indent: 2, maxlen: 80, regexp: true*/
/*global describe, require, beforeEach, browser,
angular, it, expect, element, by */

describe('NYPL Alerts Module', function () {
  'use strict';

  var homepage = require('../homepage/homepage.po.js'),
    header = require('../global-elements/header.po.js'),
    APIresponse = require('../APImocks/alerts.js'),
    // Function that creates a module that is injected at run time,
    // overrides and mocks httpbackend to mock API call. 
    httpBackendMock = function (response) {
      var API_URL = 'http://dev.locations.api.nypl.org/api/v0.7';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          // Let it handle the actual API response
          $httpBackend
            .whenJSONP(API_URL + '/locations?callback=JSON_CALLBACK')
            .passThrough();

          // Mock the alert response
          $httpBackend
            .whenJSONP(API_URL + '/alerts?callback=JSON_CALLBACK')
            .respond(response);

          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();
        });
    };

  describe('Global Alerts', function () {
    describe('Homepage', function () {
      beforeEach(function () {
        // browser.addMockModule('httpBackendMock', httpBackendMock,
        //     APIresponse.global);
        browser.get('/');
        browser.waitForAngular();
      });

      it('should not have any global alerts', function () {
        // var todaysDateMock = new Date(2015, 1, 25);
        // jasmine.clock().mockDate(todaysDateMock);

        expect(header.globalAlertsContainer.isPresent()).toBe(false);
      });

      it('should have one global alert', function () {
        // var todaysDateMock = new Date(2015, 2, 9);
        // jasmine.clock().mockDate(todaysDateMock);

        // expect(header.globalAlertsContainer.isPresent()).toBe(true);
      });

      it('should display closed branch message', function () {
        // 115th is closed on dev
        expect(homepage.nthLocTodaysHoursText(0))
          .toEqual('Branch is temporarily closed.');
      });

      it('should display message or hours', function () {
        // 115th is closed on dev
        homepage.onlyResearch.click();
        expect(homepage.nthLocTodaysHoursText(0))
          .toEqual('Closed due to Repairs');
        expect(homepage.nthLocTodaysHoursText(2))
          .toEqual('10:00am - 8:00pm');
      });
    });

    describe('Map Page', function () {
      beforeEach(function () {
        // browser.addMockModule('httpBackendMock', httpBackendMock,
        //     APIresponse.global);
        browser.get('/map');
        browser.waitForAngular();
      });

      it('should not have any global alerts', function () {
        expect(header.globalAlertsContainer.isPresent()).toBe(false);
      });

      it('should display closed branch message', function () {
        // 115th is closed on dev
        expect(homepage.nthLocTodaysHoursText(0))
          .toEqual('Branch is temporarily closed.');
      });

      it('should display closed branch message', function () {
        // 115th is closed on dev
        homepage.onlyResearch.click();
        expect(homepage.nthLocTodaysHoursText(0))
          .toEqual('Closed due to Repairs');
        expect(homepage.nthLocTodaysHoursText(2))
          .toEqual('Today\'s Hours: 10:00am - 8:00pm');
      });
    });

  }); /* End Global Alerts */

  describe('Location Alerts', function () {
    beforeEach(function () {
        // browser.addMockModule('httpBackendMock', httpBackendMock,
        //     APIresponse.global);
        browser.get('/schwarzman');
        browser.waitForAngular();
      });

      it('should not have any global alerts', function () {
        expect(header.globalAlertsContainer.isPresent()).toBe(false);
      });

      it('should have one global alert', function () {
        // expect(header.globalAlertsContainer.isPresent()).toBe(true);
      });
  });

});

