/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Circulating branch page', function () {
  'use strict';

  var locationPage = require('./location.po.js');

  beforeEach(function () {
    browser.get('/#/grand-central');
    browser.waitForAngular();
  });

  describe('basic info section', function () {

    it('should display the name', function () {
      expect(locationPage.name.getText()).toEqual('Grand Central Library');
    });

    it('should display the image for the library', function () {
      expect(locationPage.image.isPresent()).toBe(true);
    });

    it('should have a street address', function () {
      expect(locationPage.street_address.getText())
        .toEqual('135 East 46th Street');
    });

    it('should have the city in the address', function () {
      expect(locationPage.locality.getText()).toEqual('New York');
    });

    it('should have the state in the address', function () {
      expect(locationPage.region.getText()).toEqual('NY');
    });

    it('should have the zipcode in the address', function () {
      expect(locationPage.postal_code.getText()).toEqual('10017');
    });

    it('should have a library manager', function () {
      expect(locationPage.manager.getText())
        .toEqual('Library Manager: Genoveve Stowell');
    });

    it('should display five social media icons', function () {
      expect(locationPage.social_media_container.isPresent()).toBe(true);
      expect(locationPage.social_media.count()).toBe(5);
    });

    it('should display hours for today', function () {
      // Hours change everyday
      expect(locationPage.hoursToday.getText()).not.toEqual('');
    });

    it('should display hours for all seven days', function () {
      expect(locationPage.hours.count()).toBe(7);
    });
  });
});



