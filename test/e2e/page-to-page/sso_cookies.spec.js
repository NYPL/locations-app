/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */

describe('Locations: Header SSO Login', function () {
  "use strict";

  var landingPage = require('../homepage/homepage.po.js'),
    locationPage = require('../location/location.po.js'),
    divisionPage = require('../division/division.po.js'),
    amenitiesPage = require('../amenities/amenities.po.js'),
    header = require('./header.po.js');

  beforeEach(function () {
    // browser.get('/#/');
    // browser.waitForAngular();
  });

  describe('Login header form', function () {
    it('test', function () {
      browser.get('/#/');
      browser.waitForAngular();
      browser.manage().addCookie('remember_me', 'edwinguzman');

      header.loginBtn.click();

      var cookieObj = browser.manage().getCookie('remember_me')
      expect(cookieObj.name)
        .toEqual('edwinguzman');
    });

  });

});
