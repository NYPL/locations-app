/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Locations: events', function () {
  'use strict';

  var eventsPage = require('./events.po.js'),
    httpBackendMock = function () {
      var bad_response = {
        location: {
          "_id": "HU",
          "_links": {},
          "about": "",
          "access": "Fully Accessible",
          "contacts": {
            "phone": "(212) 669-9393",
            "manager": "Tequila Davis",
            "email": "115st_branch@nypl.org"
          },
          "cross_street": null,
          "floor": "First Floor",
          "geolocation": {
            "type": "Point",
            "coordinates": [
              -73.9532,
              40.8028
            ]
          },
          "hours": {
            "regular": [
              { "day": "Sun", "open": null, "close": null },
              { "day": "Mon", "open": null, "close": null },
              { "day": "Tue", "open": null, "close": null },
              { "day": "Wed", "open": null, "close": null },
              { "day": "Thu", "open": null, "close": null },
              { "day": "Fri", "open": null, "close": null },
              { "day": "Sat", "open": null, "close": null }
            ],
            "exceptions": {}
          },
          "id": "HU",
          "image": "/sites/default/files/images/branch01_003_corrected.jpg",
          "lat": null,
          "locality": "New York",
          "long": null,
          "name": "115th Street Library",
          "postal_code": 10026,
          "region": "NY",
          "room": null,
          "slug": "115th-street",
          "social_media": [],
          "street_address": "203 West 115th Street",
          "type": "circulating",
          "_embedded": {
            "services": [],
            "events": [],
            "exhibitions": null,
            "blogs": [],
            "alerts": [],
            "divisions": []
          }
        }
      };

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.when('GET', 'http://evening-mesa-7447-160' +
              '.herokuapp.com/locations/115th-street')
            .respond(bad_response);

          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();
        });

      // angular.module('nypl_locations').requires.push('httpBackendMock');
    };

  beforeEach(function () {
    browser.get('/#/115th-street/events');
    browser.waitForAngular();
  });

  it('should display the name', function () {
    expect(eventsPage.name.getText()).toEqual('Events at 115th Street Library');
  });

  it('should display hours for today', function () {
    // Hours change everyday
    expect(eventsPage.hoursToday.getText()).not.toEqual('');
  });

  it('should display six events on the page', function () {
    expect(eventsPage.events.count()).toBe(6);
  });

  describe('Calendar links', function () {
    // Protractor opens the browser in a new instance
    // which means that you will not be logged in.
    // The first assertion tests whether you are redirected
    // to the login page for either Google or Yahoo.
    // The second assertion tests that the redirect url
    // is going to the calendar section.
    it('should verify new window and url for Google calendar link',
      function () {
        var appWindow = browser.getWindowHandle();

        eventsPage.google.then(function (first_google_link) {
          first_google_link[0].click().then(function () {
            browser.getAllWindowHandles().then(function (handles) {
              var newWindowHandle = handles[1];
              browser.switchTo().window(newWindowHandle).then(function () {
                browser.sleep(1000);
                expect(browser.driver.getCurrentUrl())
                  .toMatch(/https:\/\/accounts.google.com/);
                expect(browser.driver.getCurrentUrl())
                  .toMatch(/https:\/\/www.google.com\/calendar\/render/);

                // Go back to app
                browser.driver.close().then(function () {
                  browser.switchTo().window(appWindow);
                });
              });
            });
          });
        });
      });

    it('should verify new window and url for Yahoo calendar link',
      function () {
        var appWindow = browser.getWindowHandle();

        eventsPage.yahoo.then(function (first_yahoo_link) {
          first_yahoo_link[0].click().then(function () {
            browser.getAllWindowHandles().then(function (handles) {
              var newWindowHandle = handles[1];
              browser.switchTo().window(newWindowHandle).then(function () {
                browser.sleep(1000);
                expect(browser.driver.getCurrentUrl())
                  .toMatch(/https:\/\/login.yahoo.com/);
                expect(browser.driver.getCurrentUrl())
                  .toMatch(/calendar.yahoo.com/);

                // Go back to app
                browser.driver.close().then(function () {
                  browser.switchTo().window(appWindow);
                });
              });
            });
          });
        });
      });
  });

  describe('Bad API call', function () {
    beforeEach(function () {
      browser.addMockModule('httpBackendMock', httpBackendMock);
      browser.get('/#/115th-street');
      browser.waitForAngular();
    });

    it('should say closed for today', function () {
      expect(eventsPage.hoursToday.getText()).toEqual('Closed today');
    });

    it('should not display any events', function () {
      expect(eventsPage.events.count()).toBe(0);
    });
  });
});