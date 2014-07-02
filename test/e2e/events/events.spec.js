/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
describe('Locations: events', function () {
  'use strict';

  var eventsPage = require('./events.po.js');

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

  it('should display three evnets on the page', function () {
    expect(eventsPage.events.count()).toBe(3);
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

      eventsPage.google.click().then(function () {
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

      eventsPage.yahoo.click().then(function () {
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