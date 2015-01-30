/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it,
console, protractor, expect, element, by */

describe('Research Collections: Google Analytics', function () {
  'use strict';

  var collectionsPage = require('./collections.po.js');

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

  // Structure of pageview array for angularitics plugin
  // ['send', 'pageview', 'URL']
  describe('Page view tracking', function () {
    beforeEach(function () {
      browser.get('/research-collections');
      browser.waitForAngular();
      browser.executeScript(mockGA());
    });

    it('should track a page view', function () {
      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][1]).toEqual('pageview');
        expect(ga[0][2]).toEqual('/research-collections');
      });
    });
    
  });

  // Structure of event array for angularitics plugin
  // ['send', 'event', {eventLabel: '', eventAction: '', eventCategory: ''}]
  describe('Event tracking', function () {
    beforeEach(function () {
      browser.get('/research-collections');
      browser.waitForAngular();
      browser.executeScript(mockGA());
    });

  });

});
