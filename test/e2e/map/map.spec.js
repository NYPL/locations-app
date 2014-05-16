/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
describe('Locations: map', function () {
  'use strict';

  var mapPage = require('./map.po.js');

  beforeEach(function () {
    browser.get('/#/115th-street/map');
    browser.waitForAngular();
  });

  it('should display the name', function () {
    expect(mapPage.name.getText()).toEqual('115th Street Library');
  });

  describe('address for the location', function () {
    it('should have a complete address', function () {
      expect(mapPage.street_address.getText()).toEqual('203 West 115th Street');
      expect(mapPage.locality.getText()).toEqual('New York');
      expect(mapPage.region.getText()).toEqual('NY');
      expect(mapPage.postal_code.getText()).toEqual('10026');
    });
  });

  it('should display hours for today', function () {
    // Hours change everyday
    expect(mapPage.hoursToday.getText()).not.toEqual('');
  });

  it('should load the map', function () {
    expect(mapPage.map.isPresent()).toBe(true);
  });

});