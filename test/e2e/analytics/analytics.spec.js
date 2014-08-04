/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */


describe('Google analytics configuration', function () {
  'use strict';

  var landingPage = require('./analytics.po.js');

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

    it('should do the thing', function () {
      landingPage.branch_link.click();
      expect(browser.executeScript('return window.ga_msg[0][2];'))
        .toEqual('/115th-street');
    });
  });
});
