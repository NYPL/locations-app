/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it,
console, protractor, expect, element, by */

describe('Research Collections: Google Analytics', function () {
  'use strict';

  var collectionsPage = require('./collections.po.js'),
    subjectsFilter,
    mediaFilter,
    locationFilter;

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

  beforeEach(function () {
    subjectsFilter = element(by.buttonText('Subjects'));
    mediaFilter = element(by.buttonText('Media'));
    locationFilter = element(by.buttonText('Locations'));
  });

  // Structure of pageview array for angularitics plugin
  // ['send', 'pageview', 'URL']
  describe('Page view tracking', function () {
    it('should track a page view', function () {
      browser.get('/research-collections');
      browser.waitForAngular();
      browser.executeScript(mockGA());

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        console.log(ga);
        expect(ga[0][1]).toEqual('pageview');
        expect(ga[0][2]).toEqual('/research-collections');
      });
    });
    
  });

  // Structure of event array for angularitics plugin
  // ['send', 'event', {eventLabel: '', eventAction: '', eventCategory: ''}]
  // Therefore need to retrieve the third element of the array.
  describe('Event tracking', function () {
    beforeEach(function () {
      browser.get('/research-collections');
      browser.waitForAngular();
      browser.executeScript(mockGA());
    });

    describe('Main Filters', function () {
      it('should track a click event on the Subjects filter', function () {
        subjectsFilter.click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Research Collections');
          expect(ga[0][2].eventAction).toEqual('Main Filter');
          expect(ga[0][2].eventLabel).toEqual('Subjects');
        });
      });

      it('should track a click event on the Media filter', function () {
        mediaFilter.click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Research Collections');
          expect(ga[0][2].eventAction).toEqual('Main Filter');
          expect(ga[0][2].eventLabel).toEqual('Media');
        });
      });

      it('should track a click event on the Locations filter', function () {
        locationFilter.click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Research Collections');
          expect(ga[0][2].eventAction).toEqual('Main Filter');
          expect(ga[0][2].eventLabel).toEqual('Locations');
        });
      });
    });

    describe('Divisions', function () {

      it('should track a click on a Division Name', function () {
        element(by.linkText('Dorot Jewish Division')).click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Research Collections');
          expect(ga[0][2].eventAction).toEqual('Division Image');
          expect(ga[0][2].eventLabel).toEqual('Dorot Jewish Division');
        });
      });

      it('should track a click on a Division Name', function () {
        element(by.linkText('George Arents Collection')).click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Research Collections');
          expect(ga[0][2].eventAction).toEqual('Division Image');
          expect(ga[0][2].eventLabel).toEqual('George Arents Collection');
        });
      });
    });

  });
});

