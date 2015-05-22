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
    location = require('../location/location.po.js'),
    APIresponse = require('../APImocks/alerts.js'),
    // Function that creates a module that is injected at run time,
    // overrides and mocks httpbackend to mock API call. 
    globalhttpBackendMock = function (response, location) {
      var API_URL = 'http://dev.refinery.aws.nypl.org/api/nypl/locations/v1.0',
        loc = location ? '/' + location : '';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(['$httpBackend', function ($httpBackend) {
          // Mock the alert response
          $httpBackend
            .whenJSONP(API_URL + '/alerts?callback=JSON_CALLBACK')
            .respond(response);

          // Let it handle the actual API response
          $httpBackend
            .whenJSONP(API_URL + '/locations' + loc + '?callback=JSON_CALLBACK')
            .passThrough();

          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();
        }]);
    },
    locationhttpBackendMock = function (alerts, location, locationMock) {
      var API_URL = 'http://dev.refinery.aws.nypl.org/api/nypl/locations/v1.0';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(['$httpBackend', function ($httpBackend) {
          // Mock the alert response
          $httpBackend
            .whenJSONP(API_URL + '/alerts?callback=JSON_CALLBACK')
            .respond(alerts);

          // Let it handle the actual API response
          $httpBackend
            .whenJSONP(API_URL + '/locations/' +
              location + '?callback=JSON_CALLBACK')
            .respond(locationMock);

          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();
        }]);
    };

  function addDays(dateObj, numDays) {
    dateObj.setDate(dateObj.getDate() + numDays);
    return dateObj;
  }

  function createMockedAlert(scope, msg, display, closed_for, applies) {
    var id = Math.floor(Math.random() * 100000) + 1,
      message = msg || '',
      display = display || {start: yesterday, end: tomorrow},
      alert = {
        id: id,
        msg: message,
        display: display
      };

    if (closed_for) {
      alert.closed_for = closed_for;
      if (applies) {
        alert.applies = applies;
      } else {
        alert.applies = display;
      }
    }

    return alert;
  }

  describe('Global Alerts', function () {
    describe('Homepage', function () {
      describe('No alert or closing', function () {
        var mockedAlerts = {alerts: []};

        beforeEach(function () {
          browser.addMockModule('httpBackendMock', globalhttpBackendMock, mockedAlerts);
          browser.get('/');
          browser.waitForAngular();
        });

        it('should not have any global alerts', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(false);

          // homepage.nthLocLink(0).click();
          // browser.waitForAngular();
          // expect(browser.getCurrentUrl())
          //   .toEqual('http://localhost:9292/67th-street');
          // expect(header.globalAlertsContainer.isPresent()).toBe(false);
        });

        it('should display closed branch message', function () {
          // Aguilar is closed on dev
          expect(homepage.nthLocTodaysHoursText(5))
            .toEqual('Branch is temporarily closed.');
        });

        it('should display message or hours', function () {
          homepage.onlyResearch.click();
          expect(homepage.nthLocTodaysHoursText(0)).not
            .toEqual('Branch is temporarily closed.');
          expect(homepage.nthLocTodaysHoursText(1)).not
            .toEqual('Branch is temporarily closed.');
          // Better test cases for when mocking dates works.
          // expect(homepage.nthLocTodaysHoursText(0))
          //   .toEqual('10:00am - 6:00pm');
          // expect(homepage.nthLocTodaysHoursText(1))
          //   .toEqual('12:00pm - 6:00pm');
        });
      }); /* End No alert or closing */

      // LOC-636
      describe('Upcoming alert/closing - should have no effect', function () {
        var mockedAlerts = {alerts: []},
          // Starts four days from now and ends seven days from now.
          display_and_applies = {
            start: addDays(new Date(), 4),
            end: addDays(new Date(), 7)
          };

        beforeEach(function () {
          mockedAlerts.alerts.push(
            createMockedAlert('all','<p>Future global alert.</p>',
              display_and_applies, 'Closing message for upcoming alert')
          );

          browser.addMockModule('httpBackendMock', globalhttpBackendMock, mockedAlerts);
          browser.get('/');
          browser.waitForAngular();
        });

        it('should not have any global alerts', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(false);
        });
      });

      // LOC-637
      describe('Passed alert/closing - should have no effect', function () {
        var mockedAlerts = {alerts: []},
          // Starts four days from now and ends seven days from now.
          display_and_applies = {
            start: addDays(new Date(), -5),
            end: addDays(new Date(), -3)
          };

        beforeEach(function () {
          mockedAlerts.alerts.push(
            createMockedAlert('all','<p>Past global alert.</p>',
              display_and_applies, 'Past message for upcoming alert')
          );

          browser.addMockModule('httpBackendMock', globalhttpBackendMock, mockedAlerts);
          browser.get('/');
          browser.waitForAngular();
        });

        it('should not have any global alerts', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(false);
        });
      });

      // LOC-632
      describe('Only alert message only - no closing', function () {
        var mockedAlerts = {alerts: []};

        beforeEach(function () {
          mockedAlerts.alerts.push(
            createMockedAlert('all','<p>The New York Public Library will be closed on Sunday, April 5.</p>')
          );
          browser.addMockModule('httpBackendMock', globalhttpBackendMock, mockedAlerts);
          browser.get('/');
          browser.waitForAngular();
        });

        it('should have an alert message', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(true);
        });

        it('should not change the hours or display a message because it\'s ' +
          'an alert but not a closing', function () {
            expect(homepage.nthLocTodaysHoursText(3)).not
              .toEqual('Branch is temporarily closed.');
            // expect(homepage.nthLocTodaysHoursText(1))
            //   .toEqual('10:00am - 5:00pm');
            // expect(homepage.nthLocTodaysHoursText(12))
            //   .toEqual('9:00am - 9:00pm');

            homepage.onlyResearch.click();
            expect(homepage.nthLocTodaysHoursText(0)).not
              .toEqual('Branch is temporarily closed.');
            // expect(homepage.nthLocTodaysHoursText(0))
            //   .toEqual('10:00am - 6:00pm');
            // expect(homepage.nthLocTodaysHoursText(1))
            //   .toEqual('12:00pm - 6:00pm');
          });
      });

      describe('Alert and closing', function () {
        var mockedAlerts = {alerts: []};

        beforeEach(function () {
          mockedAlerts.alerts.push(
            createMockedAlert('all', 'Daylight Test Alert', undefined, 'Daylight closing')
          );
          browser.addMockModule('httpBackendMock', globalhttpBackendMock, mockedAlerts);
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
          expect(homepage.nthLocTodaysHoursText(1)).toEqual('Today: Daylight closing');
          expect(homepage.nthLocTodaysHoursText(2)).toEqual('Today: Daylight closing');
          expect(homepage.nthLocTodaysHoursText(4)).toEqual('Today: Daylight closing');
          expect(homepage.nthLocTodaysHoursText(7)).toEqual('Today: Daylight closing');

        });
      });
    }); /* End homepage */

    describe('Specific Location - LPA', function () {
      describe('No global alert', function () {
        var mockedAlerts = {alerts: []};

        beforeEach(function () {
          browser.addMockModule('httpBackendMock', globalhttpBackendMock, mockedAlerts, 'lpa');
          browser.get('/lpa');
          browser.waitForAngular();
        });

        it('should not have any global alerts', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(false);
        });

        it('should not have a location alert', function () {
          expect(location.alerts_container.isPresent()).toBe(false);
        });

        // it('should display when it is open today', function () {
        //   // Eh, day specific test... for now.
        //   expect(location.hoursToday.getText()).toEqual('Open today until 6pm');
        // });

        it('should display the regular hours table', function () {
          expect(location.regular_hours_title.getText()).toEqual('REGULAR HOURS');
        });

        it('should not have any dynamic information', function () {
          expect(location.dynamic_hours_note.isPresent()).toBe(false);
          expect(location.dynamic_hours_btn.isPresent()).toBe(false);
        });
      });

      describe('Global alert but not a closing', function () {
        var mockedAlerts = {alerts: []};

        beforeEach(function () {
          mockedAlerts.alerts.push(
            createMockedAlert('all', 'Daylight Test Alert')
          );

          browser.addMockModule('httpBackendMock', globalhttpBackendMock, mockedAlerts, 'lpa');
          browser.get('/lpa');
          browser.waitForAngular();
        });

        it('should have a global alert in the header', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(true);
        });

        it('should not have a location alert', function () {
          expect(location.alerts_container.isPresent()).toBe(false);
        });

        it('should display the regular hours table', function () {
          // expect(location.hoursToday.getText()).toEqual('Open today until 6pm');
          expect(location.regular_hours_title.getText()).toEqual('REGULAR HOURS');
          expect(location.dynamic_hours_note.isPresent()).toBe(false);
          expect(location.dynamic_hours_btn.isPresent()).toBe(false);
        });
      });

      describe('Global alert and closing', function () {
        var mockedAlerts = {alerts: []};

        mockedAlerts.alerts.push(
          createMockedAlert('all',
            'Daylight Test Alert', undefined, 'Closed for Daylight Savings')
        );
        // APIresponse.lpa.location._embedded.alerts.push(
        //   createMockedAlert('all',
        //     'Daylight Test Alert', undefined, 'Closed for Daylight Savings')
        // );

        beforeEach(function () {
          browser.addMockModule(
            'httpBackendMock',
            locationhttpBackendMock,
            mockedAlerts,
            'lpa',
            APIresponse.lpa);
          browser.get('/lpa');
          browser.waitForAngular();
        });

        it('should have a global alert in the header', function () {
          expect(header.globalAlertsContainer.isPresent()).toBe(true);
        });

        it('should not have a location alert', function () {
          expect(location.alerts_container.isPresent()).toBe(false);
        });

        it('should display the dynamic hours table', function () {
          expect(location.hoursToday.getText())
            .toEqual('Today: Closed for Daylight Savings');
          expect(location.dynamic_hours_title.getText())
            .toEqual('UPCOMING HOURS');
          expect(location.dynamic_hours_note.isPresent()).toBe(true);
          expect(location.dynamic_hours_btn.isPresent()).toBe(true);
        });

        it('should display the regular hours when the button is clicked', function () {
          expect(location.dynamic_hours_title.getText())
            .toEqual('UPCOMING HOURS');
          expect(location.regular_hours_table
            .getCssValue('display')).toBe('none');

          location.dynamic_hours_btn.click();

          expect(location.regular_hours_title.getText())
            .toEqual('REGULAR HOURS');
          expect(location.dynamic_hours_table
            .getCssValue('display')).toBe('none');
        });
      });

    }); /* End LPA alert tests */

  }); /* End Global Alerts */


  describe('Location Alerts', function () {
    describe('No alert', function () {
      var globalMockedAlerts = {alerts: []};

      beforeEach(function () {
        browser.addMockModule(
          'httpBackendMock',
          locationhttpBackendMock,
          globalMockedAlerts,
          'grand-central',
          APIresponse.grand_central);
        browser.get('/grand-central');
        browser.waitForAngular();
      });

      it('should not have any type of alert', function () {
        expect(header.globalAlertsContainer.isPresent()).toBe(false);
        expect(location.alerts_container.isPresent()).toBe(false);
      });

      it('should display the regular hours table', function () {
        expect(location.regular_hours_title.getText()).toEqual('REGULAR HOURS');
        expect(location.dynamic_hours_note.isPresent()).toBe(false);
        expect(location.dynamic_hours_btn.isPresent()).toBe(false);
      });
    });
  });

  describe('Closing alert', function () {
    var globalMockedAlerts = {alerts: []};

    beforeEach(function () {
      browser.addMockModule(
        'httpBackendMock',
        locationhttpBackendMock,
        globalMockedAlerts,
        'new-amsterdam',
        APIresponse.new_amsterdam);
      browser.get('/new-amsterdam');
      browser.waitForAngular();
    });

    it('should not have any global alerts', function () {
      expect(header.globalAlertsContainer.isPresent()).toBe(false);
    });

    it('should have a location alert', function () {
      expect(location.alerts_container.isPresent()).toBe(true);
    });

    it('should display the dynamic hours table', function () {
      expect(location.hoursToday.getText())
        .toEqual('Today: Closed for repairs');
      expect(location.dynamic_hours_title.getText())
        .toEqual('UPCOMING HOURS');
      expect(location.dynamic_hours_note.isPresent()).toBe(true);
      expect(location.dynamic_hours_btn.isPresent()).toBe(true);
    });

    it('should display the regular hours when the button is clicked', function () {
      expect(location.dynamic_hours_title.getText())
        .toEqual('UPCOMING HOURS');
      expect(location.regular_hours_table
        .getCssValue('display')).toBe('none');

      location.dynamic_hours_btn.click();

      expect(location.regular_hours_title.getText())
        .toEqual('REGULAR HOURS');
      expect(location.dynamic_hours_table
        .getCssValue('display')).toBe('none');
    });

  });

});

