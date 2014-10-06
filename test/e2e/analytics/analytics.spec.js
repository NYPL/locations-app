/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */


describe('Google analytics configuration', function () {
  'use strict';

  // var landingPage = require('./analytics.po.js');
  var landingPage = require('../homepage/homepage.po.js');

  beforeEach(function () {
    browser.get('/');
    browser.waitForAngular();
  });

  function mockGA() {
    return "window.ga_msg = [];" +
           "ga = function () {" +
           "  var msg = [];" +
           "  for (var i = 0; i < arguments.length; i++) {" +
           "    msg.push(arguments[i]); " +
           "  }" +
           "  window.ga_msg.push(msg);" +
           "}";
  }

  describe('Page view tracking', function () {
    // Structure of array
    // ['send', 'pageview', 'URL']

    beforeEach(function () {
      browser.executeScript(mockGA());
    });

    it('should log a branch path as a page view', function () {
      // This triggers a click event and a pageview event
      landingPage.nthLocLink(0).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[1][1]).toEqual('pageview')
        expect(ga[1][2]).toEqual('/115th-street');
      });
    });

    it('should log a division path as a page view', function () {
      // This triggers the first GA click event
      landingPage.onlyResearch.click();

      // This triggers the second GA click event
      // and the first pageview event
      element(by.linkText('Stephen A. Schwarzman Building')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[2][1]).toEqual('pageview');
        expect(ga[2][2]).toEqual('/schwarzman');
      });

      // This triggers the second pageview event
      element(by.linkText('General Research Division')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[3][1]).toEqual('pageview');
        expect(ga[3][2]).toEqual('/divisions/general-research-division');
      });
    });

    it('should log amenities path as a page view', function () {
      landingPage.nthLocLink(0).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/115th-street');
      });

      element(by.linkText('See all amenities')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[2][1]).toEqual('pageview');
        expect(ga[2][2]).toEqual('/amenities/loc/115th-street');
      });
    });
  });

  describe('Homepage event tracking', function () {
    // Structure of array
    // ['send', 'event', 'Category', 'Event/Action', 'Label']

    beforeEach(function () {
      browser.executeScript(mockGA());
    });

    describe('Geolocation search button', function () {
      beforeEach(function () {
        landingPage.currLoc.click();
        browser.waitForAngular();
      });

      it('should track a click event', function () {
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2]).toEqual('Locations');
          expect(ga[0][3]).toEqual('Filter by');
          expect(ga[0][4]).toEqual('Near me');
        });
      });

      it('should also track a pageview after the click event', function () {
        browser.sleep(500);
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[1][1]).toEqual('pageview');
          expect(ga[1][2]).toEqual('/map');
        });
      });
    });

    describe('Research Libraries', function () {
      it('should track a click event on the research button', function () {
        landingPage.onlyResearch.click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2]).toEqual('Locations');
          expect(ga[0][3]).toEqual('Filter by');
          expect(ga[0][4]).toEqual('Research');
        });
      });
    });

    describe('List and Map View', function () {
      it('should track a click and pageview event on the Map View button',
        function () {
          landingPage.mapViewBtn.click();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2]).toEqual('Locations');
            expect(ga[0][3]).toEqual('View');
            expect(ga[0][4]).toEqual('Map view');

            expect(ga[1][1]).toEqual('pageview');
            expect(ga[1][2]).toEqual('/map');
          });
        });

      it('should track a click and pageview event on the List View button',
        function () {
          // Start by going to the map page
          // It will already track two events (click and pageview)
          landingPage.mapViewBtn.click();

          // Go back to the list view page
          landingPage.listViewBtn.click();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[2][2]).toEqual('Locations');
            expect(ga[2][3]).toEqual('View');
            expect(ga[2][4]).toEqual('List view');

            expect(ga[3][1]).toEqual('pageview');
            expect(ga[3][2]).toEqual('/list');
          });
        });
    });

    describe('Library click events', function () {
      it('should track a click on a library\'s name on the list view', function () {
        landingPage.nthLocLink(0).click();
        browser.waitForAngular();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          // ga[0] is the click event on the library name from the list
          // ga[1] is the pageview event
          expect(ga[0][2]).toEqual('Locations');
          expect(ga[0][3]).toEqual('Click');
          expect(ga[0][4]).toEqual('115th Street Library');

          expect(ga[1][1]).toEqual('pageview');
          expect(ga[1][2]).toEqual('/115th-street');
        });
      });

      it('should track a click on a library\'s name on the map view', function () {
        landingPage.search('mid manhattan');
        browser.sleep(1000);

        landingPage.nthLocLink(0).click();
        browser.waitForAngular();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          // ga[0] is the pageview to the map page (from the search)
          // ga[1] is the click event on the library name from the list
          // ga[2] is the pageview event
          expect(ga[1][2]).toEqual('Locations');
          expect(ga[1][3]).toEqual('Click');
          expect(ga[1][4]).toEqual('Mid-Manhattan Library');

          expect(ga[2][1]).toEqual('pageview');
          expect(ga[2][2]).toEqual('/mid-manhattan-library');
        });
      });

      it('should track a click on a library\'s View on Map button on the list view', function () {
        landingPage.nthLocViewMapBtn(0).click();
        browser.waitForAngular();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2]).toEqual('Locations');
          expect(ga[0][3]).toEqual('View map');
          expect(ga[0][4]).toEqual('115th Street Library');

          expect(ga[1][1]).toEqual('pageview');
          expect(ga[1][2]).toEqual('/map');
        });
      });

      it('should track a click on a library\'s View on Map button on the map view', function () {
        landingPage.mapViewBtn.click();
        browser.waitForAngular();

        landingPage.nthLocViewMapBtn(0).click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[1][2]).toEqual('Locations');
          expect(ga[1][3]).toEqual('View map');
          expect(ga[1][4]).toEqual('115th Street Library');
        });
      });

      it('should track a click on a library\'s direction button on the list view', function () {
        landingPage.nthLoc(0).element(by.css('.icon-compass')).click();
        browser.sleep(500);

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2]).toEqual('Locations');
          expect(ga[0][3]).toEqual('Directions');
          expect(ga[0][4]).toEqual('115th Street Library');
        });
      });

      it('should track a click on a library\'s direction button on the map view', function () {
        landingPage.search('mid manhattan');
        browser.sleep(500);
        landingPage.nthLoc(0).element(by.css('.icon-compass')).click();
        browser.sleep(500);

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[1][2]).toEqual('Locations');
          expect(ga[1][3]).toEqual('Directions');
          expect(ga[1][4]).toEqual('Mid-Manhattan Library');

        });
      });
    });

  });
});
