/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */


describe('Google analytics configuration', function () {
  'use strict';

  var landingPage = require('./analytics.po.js');

  beforeEach(function () {
    browser.get('/#/');
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
      landingPage.branch_link.click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][1]).toEqual('pageview')
        expect(ga[0][2]).toEqual('/115th-street');
      });
    });

    it('should log a division path as a page view', function () {
      landingPage.research.click();

      element(by.linkText('Stephen A. Schwarzman Building')).click();
      browser.waitForAngular();

      element(by.linkText('General Research Division')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/divisions/general-research-division');
      });
    });

    it('should log amenities path as a page view', function () {
      landingPage.branch_link.click();
      browser.waitForAngular();

      element(by.linkText('See all amenities')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/amenities/loc/115th-street');
      });
    });
      
  });
});
