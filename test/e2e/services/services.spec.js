/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
// Basic test template - services pages are not done
describe('Locations: services', function () {
  'use strict';

  var servicesPage = require('./services.po.js');

  describe('All services page', function () {
    beforeEach(function () {
      browser.get('/#/services');
      browser.sleep(1000);
    });

    it('should display a list of services', function () {
      expect(servicesPage.services.count()).toBe(49);
    });
  });

  describe('One service page', function () {
    beforeEach(function () {
      browser.get('/#/services/36');
      browser.sleep(1000);
    });

    it('should display the name of the service', function () {
      expect(servicesPage.serviceName.getText()).toEqual('Bicycle Rack');
    });

    it('should display a list of locations', function () {
      expect(servicesPage.locations.count()).toBe(24);
    });
  });

  describe('One location page', function () {
    beforeEach(function () {
      browser.get('/#/services/location/CHR');
      browser.sleep(1000);
    });

    it('should display the name of the service', function () {
      expect(servicesPage.locationName.getText())
        .toEqual('Chatham Square Library');
    });

    it('should display a list of services', function () {
      expect(servicesPage.services.count()).toBe(49);
    });
  });

});