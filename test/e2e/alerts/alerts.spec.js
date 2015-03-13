/*jslint indent: 2, maxlen: 80, regexp: true*/
/*global describe, require, beforeEach, browser,
angular, it, expect, element, by */

describe('NYPL Alerts Module', function () {
  'use strict';

  var today = new Date(),
    yesterday = addDays(new Date(), -1),
    tomorrow = addDays(new Date(), 1),
    homepage = require('../homepage/homepage.po.js'),
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

  function addDays(dateObj, numDays) {
    dateObj.setDate(dateObj.getDate() + numDays);
    return dateObj;
  }

  describe('Global Alerts', function () {
    describe('Homepage', function () {
      describe('No alert or closing', function () {
        beforeEach(function () {
          browser.addMockModule('httpBackendMock', httpBackendMock, {alerts: []});
          browser.get('/');
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

        it('should display message or hours', function () {
          homepage.onlyResearch.click();
          expect(homepage.nthLocTodaysHoursText(0))
            .toEqual('10:00am - 6:00pm');
          expect(homepage.nthLocTodaysHoursText(1))
            .toEqual('12:00pm - 6:00pm');
        });
      }); /* End No alert or closing */

      describe('Only alert message only - no closing', function () {
        beforeEach(function () {
          browser.addMockModule('httpBackendMock', httpBackendMock,
            {
              alerts: [{
                id: 283839,
                scope: "all",
                _links: {web: {href: "http://dev.www.aws.nypl.org/node/283839"}},
                msg: "<p>The New York Public Library will be closed on Sunday, April 5.</p>",
                display: {start: yesterday, end: tomorrow}
              }]
            }
          );
          browser.get('/');
          browser.waitForAngular();
        });

        it('should have an alert message', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(true);
        });

        it('should not change the hours or display a message because it\'s ' +
          'an alert but not a closing', function () {
            // Not sure why these are blank... work on dev and qa!
            expect(homepage.nthLocTodaysHoursText(1))
              .toEqual('10:00am - 5:00pm');
            expect(homepage.nthLocTodaysHoursText(12))
              .toEqual('9:00am - 9:00pm');

            homepage.onlyResearch.click();
            expect(homepage.nthLocTodaysHoursText(0))
              .toEqual('10:00am - 6:00pm');
            expect(homepage.nthLocTodaysHoursText(1))
              .toEqual('12:00pm - 6:00pm');
          });
      });

      describe('Alert and closing', function () {
        beforeEach(function () {
          browser.addMockModule('httpBackendMock', httpBackendMock,
            {alerts: [
              {
                id: 287824,
                scope: "all",
                _links: {web: {href: "http://dev.www.aws.nypl.org/node/287824"}},
                closed_for: "Daylight closing",
                msg: "Daylight Test Alert",
                display: {start: yesterday, end: tomorrow},
                applies: {start: yesterday, end: tomorrow}
              }
            ]}
          );
          browser.get('/');
          browser.waitForAngular();
        });

        it('should have one global alert', function () {
          // var todaysDateMock = new Date(2015, 2, 9);
          // jasmine.clock().mockDate(todaysDateMock);

          expect(header.globalAlertsContainer.isPresent()).toBe(true);
        });

        it('should display the closed_for message instead of hours', function () {
          expect(homepage.nthLocTodaysHoursText(1)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(2)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(4)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(7)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(22)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(45)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(77)).toEqual('Daylight closing');
        });

        it('should display the closed_for message on the map page', function () {
          homepage.mapViewBtn.click();
          browser.waitForAngular();
          expect(homepage.nthLocTodaysHoursText(1)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(2)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(4)).toEqual('Daylight closing');
          expect(homepage.nthLocTodaysHoursText(7)).toEqual('Daylight closing');

        });
      });
    });

    // describe('Map Page', function () {
    //   beforeEach(function () {
    //     // browser.addMockModule('httpBackendMock', httpBackendMock,
    //     //     APIresponse.global);
    //     browser.get('/map');
    //     browser.waitForAngular();
    //   });

    //   it('should not have any global alerts', function () {
    //     expect(header.globalAlertsContainer.isPresent()).toBe(false);
    //   });

    //   it('should display closed branch message', function () {
    //     // 115th is closed on dev
    //     expect(homepage.nthLocTodaysHoursText(0))
    //       .toEqual('Branch is temporarily closed.');
    //   });

    //   it('should display closed branch message', function () {
    //     // 115th is closed on dev
    //     homepage.onlyResearch.click();
    //     expect(homepage.nthLocTodaysHoursText(0))
    //       .toEqual('Closed due to Repairs');
    //     expect(homepage.nthLocTodaysHoursText(2))
    //       .toEqual('Today\'s Hours: 10:00am - 8:00pm');
    //   });
    // });

  }); /* End Global Alerts */

  // describe('Location Alerts', function () {
  //   beforeEach(function () {
  //     // browser.addMockModule('httpBackendMock', httpBackendMock,
  //     //     APIresponse.global);
  //     browser.get('/schwarzman');
  //     browser.waitForAngular();
  //   });

  //   it('should not have any global alerts', function () {
  //     expect(header.globalAlertsContainer.isPresent()).toBe(false);
  //   });

  //   it('should have one global alert', function () {
  //     // expect(header.globalAlertsContainer.isPresent()).toBe(true);
  //   });
  // });

});

