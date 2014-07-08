/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
describe('Locations: library', function () {
  'use strict';

  var locationPage = require('./location.po.js');

  var httpBackendMock = function () {
    var bad_response = {
      location: {
        "_id": "GC",
        "_links": {},
        "about": "",
        "access": "Fully Accessible",
        "contacts": {
            "phone": "(212) 621-0670",
            "manager": "Genoveve Stowell"
        },
        "cross_street": null,
        "floor": null,
        "geolocation": {
            "type": "Point",
            "coordinates": [
                -73.974,
                40.7539
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
        "id": "GC",
        "image": "/sites/default/files/images/grand_central.jpg",
        "lat": null,
        "locality": "New York",
        "long": null,
        "name": "Grand Central Library",
        "postal_code": 10017,
        "region": "NY",
        "room": null,
        "slug": "grand-central",
        "social_media": [],
        "street_address": "135 East 46th Street",
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
        $httpBackend.when('GET', 'http://evening-mesa-7447-160.herokuapp.com/locations/grand-central')
          .respond(bad_response);

        // For everything else, don't mock
        $httpBackend.whenGET(/^\w+.*/).passThrough();
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/^\w+.*/).passThrough();
      });

    // angular.module('nypl_locations').requires.push('httpBackendMock');
  };

  describe('Circulating branch - Testing Grand Central Library',
    function () {
      beforeEach(function () {
        browser.get('/#/grand-central');
        browser.waitForAngular();
      });

      it('should display the name', function () {
        expect(locationPage.name.getText()).toEqual('Grand Central Library');
      });

      it('should display the image for the library', function () {
        expect(locationPage.image.isPresent()).toBe(true);
      });

      it('should have a complete address', function () {
        expect(locationPage.street_address.getText())
          .toEqual('135 East 46th Street');
        expect(locationPage.locality.getText()).toEqual('New York');
        expect(locationPage.region.getText()).toEqual('NY');
        expect(locationPage.postal_code.getText()).toEqual('10017');
      });

      it('should have a library manager', function () {
        expect(locationPage.manager.getText())
          .toEqual('Library Manager: Genoveve Stowell');
      });

      it('should display five social media icons', function () {
        expect(locationPage.social_media.count()).toBe(5);
      });

      it('should display hours for today', function () {
        // Hours change everyday
        expect(locationPage.hoursToday.getText()).not.toEqual('');
      });

      it('should display hours for all seven days', function () {
        expect(locationPage.hours.count()).toBe(7);
      });

      it('should not display any divisions', function () {
        expect(locationPage.divisions_container.isPresent()).toBe(false);
        expect(locationPage.divisions.count()).toBe(0);
      });

      it('should display three events', function () {
        expect(locationPage.events_container.isPresent()).toBe(true);
        expect(locationPage.events.count()).toBe(3);
      });

      it('should have another image and a blurb', function () {
        expect(locationPage.secondary_image.isPresent()).toBe(true);
        expect(locationPage.about.isPresent()).toBe(true);
      });

      it('should not have a "Plan Your Visit" section', function () {
        expect(locationPage.plan_your_visit.isPresent()).toBe(false);
      });

      it('should display three blogs', function () {
        expect(locationPage.blogs_container.isPresent()).toBe(true);
        expect(locationPage.blogs.count()).toBe(3);
      });

      describe('Calendar links', function () {
        // Protractor opens the browser in a new instance
        // which means that you will not be logged in.
        // The first assertion tests whether you are redirected
        // to the login page for either Google or Yahoo.
        // The second assertion tests that the redirect url
        // is going to the calendar section.
        it('should verify new window and url for Google calendar link', function () {
          var appWindow = browser.getWindowHandle();

          locationPage.google.click().then(function () {
            browser.getAllWindowHandles().then(function (handles) {
              var newWindowHandle = handles[1];
              browser.switchTo().window(newWindowHandle).then(function () {
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

        it('should verify new window and url for Yahoo calendar link', function () {
          var appWindow = browser.getWindowHandle();

          locationPage.yahoo.click().then(function () {
            browser.getAllWindowHandles().then(function (handles) {
              var newWindowHandle = handles[1];
              browser.switchTo().window(newWindowHandle).then(function () {
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

  describe('Research branch - Testing Schomburg', function () {
    beforeEach(function () {
      browser.get('/#/schomburg');
      browser.waitForAngular();
    });

    it('should display the name', function () {
      expect(locationPage.name.getText())
        .toEqual('Schomburg Center for Research in Black Culture');
    });

    it('should have a complete address', function () {
      expect(locationPage.street_address.getText())
        .toEqual('515 Malcolm X Boulevard');
      expect(locationPage.locality.getText()).toEqual('New York');
      expect(locationPage.region.getText()).toEqual('NY');
      expect(locationPage.postal_code.getText()).toEqual('10037');
    });

    it('should have a library manager', function () {
      expect(locationPage.manager.getText()).not.toEqual('');
    });

    it('should display hours for today', function () {
      // Hours change everyday
      expect(locationPage.hoursToday.getText()).not.toEqual('');
    });

    it('should display five social media icons', function () {
      expect(locationPage.social_media.count()).toBe(5);
    });

    it('should display hours for all seven days', function () {
      expect(locationPage.hours.count()).toBe(7);
    });

    it('should display 5 divisions', function () {
      expect(locationPage.divisions_container.isPresent()).toBe(true);
      expect(locationPage.divisions.count()).toBe(5);
    });

    it('should display three events', function () {
      expect(locationPage.events_container.isPresent()).toBe(true);
      expect(locationPage.events.count()).toBe(3);
    });

    it('should have a "Plan your visit" and about blurb section', function () {
      expect(locationPage.plan_your_visit.isPresent()).toBe(true);
      expect(locationPage.about.isPresent()).toBe(true);
    });

    it('should not display blogs', function () {
      expect(locationPage.blogs_container.isPresent()).toBe(false);
      expect(locationPage.blogs.count()).toBe(0);
    });

    it('should not display any exhibitions', function () {
      expect(locationPage.exhibitions.count()).toBe(0);
    });

    describe('Calendar links', function () {
      // Protractor opens the browser in a new instance
      // which means that you will not be logged in.
      // The first assertion tests whether you are redirected
      // to the login page for either Google or Yahoo.
      // The second assertion tests that the redirect url
      // is going to the calendar section.
      it('should verify new window and url for Google calendar link', function () {
        var appWindow = browser.getWindowHandle();

        locationPage.google.click().then(function () {
          browser.getAllWindowHandles().then(function (handles) {
            var newWindowHandle = handles[1];
            browser.switchTo().window(newWindowHandle).then(function () {
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

      it('should verify new window and url for Yahoo calendar link', function () {
        var appWindow = browser.getWindowHandle();

        locationPage.yahoo.click().then(function () {
          browser.getAllWindowHandles().then(function (handles) {
            var newWindowHandle = handles[1];
            browser.switchTo().window(newWindowHandle).then(function () {
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

  describe('Circulating branch - Bad API call', function () {
   beforeEach(function () {
      browser.addMockModule('httpBackendMock', httpBackendMock);
      browser.get('/#/grand-central');
      browser.waitForAngular();
    });

    describe('Bad hours', function () {
      it('should say that the library is closed every day', function () {
        expect(locationPage.hoursToday.getText()).toEqual('Closed today');

        var i = 0;
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        locationPage.hours.each(function (h) { 
          expect(h.getText()).toEqual(days[i] + ' Closed');
          i++;
        });
      });
    });

    describe('No events in the API', function () {
      it('should not generate the Events block on the page', function () {
        expect(locationPage.events_container.isPresent()).toBe(false);
        expect(locationPage.events.count()).toBe(0);
      });
    });

    describe('No blogs in the API', function () {
      it('should not genereate the Blogs block on the page', function () {
        expect(locationPage.blogs_container.isPresent()).toBe(false);
        expect(locationPage.blogs.count()).toBe(0);
      });
    });
  });

});