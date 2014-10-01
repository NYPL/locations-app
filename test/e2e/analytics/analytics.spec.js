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
    beforeEach(function () {
      browser.executeScript(mockGA());
    });

    it('should log a branch path as a page view', function () {
      landingPage.nthLocLink(0).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[1][1]).toEqual('pageview')
        expect(ga[1][2]).toEqual('/115th-street');
      });
    });

    it('should log a division path as a page view', function () {
      landingPage.onlyResearch.click();

      element(by.linkText('Stephen A. Schwarzman Building')).click();
      browser.waitForAngular();

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

      element(by.linkText('See all amenities')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[2][1]).toEqual('pageview');
        expect(ga[2][2]).toEqual('/amenities/loc/115th-street');
      });
    });
      
  });

  describe('Homepage event tracking', function () {
    beforeEach(function () {
      browser.executeScript(mockGA());
    });

    it('should track a click event on geolocation search', function () {
      landingPage.currLoc.click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][1]).toEqual('event');
        expect(ga[0][2]).toEqual('Locations'); // Category
        expect(ga[0][3]).toEqual('Filter by'); // Event/Action
        expect(ga[0][4]).toEqual('Near me');   // Label
      });
    });

    it('should track a click event on the research only button', function () {
      landingPage.onlyResearch.click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][1]).toEqual('event');
        expect(ga[0][2]).toEqual('Locations');
        expect(ga[0][3]).toEqual('Filter by');
        expect(ga[0][4]).toEqual('Research');
      });
    });

    // it('should track a search with a library search', function () {
    //   landingPage.search('aguilar');

    //   // Tracks event when the 'Find a library!' button is clicked:
    //   browser.executeScript('return window.ga_msg;').then(function (ga) {
    //     expect(ga[0][1]).toEqual('event');
    //     expect(ga[0][2]).toEqual('Search');
    //     expect(ga[0][3]).toEqual('click');
    //     expect(ga[0][4]).toEqual('aguilar');
    //   });
    // });

    // it('should track a search with a location search', function () {
    //   landingPage.search('upper east side');

    //   browser.executeScript('return window.ga_msg;').then(function (ga) {
    //     expect(ga[0][1]).toEqual('event');
    //     expect(ga[0][2]).toEqual('Search');
    //     expect(ga[0][3]).toEqual('click');
    //     expect(ga[0][4]).toEqual('upper east side');
    //   });
    // });

    it('should track a click on a library name on the homepage list', function () {
      landingPage.search('mid manhattan');
      browser.sleep(1000);

      landingPage.nthLocLink(0).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        console.log(ga);
        // ga[0] is the search event
        // ga[1] should be clicking on the library name from the list, in this
        // case the selected library should be Mid-Manhattan Library
        expect(ga[1][1]).toEqual('event');
        expect(ga[1][2]).toEqual('Locations');
        expect(ga[1][3]).toEqual('Click');
        expect(ga[1][4]).toEqual('Mid-Manhattan Library');

        // ga[2] is tracking the pageview
        expect(ga[2][1]).toEqual('pageview');
        expect(ga[2][2]).toEqual('/mid-manhattan-library');
      });
    });
  });
});
