/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */

describe('Locations: Page to Page tests', function () {
  "use strict";

  var landingPage = require('../homepage/homepage.po.js'),
    locationPage = require('../location/location.po.js'),
    divisionPage = require('../division/division.po.js'),
    amenitiesPage = require('../amenities/amenities.po.js');

  beforeEach(function () {
    // Pass the good JSON from the API call.
    browser.get('/#/');
    browser.waitForAngular();
  });

  describe('Saved Search State', function () {
    it('should save the search field from the homepage when navigating to ' +
      'a location page',
      function () {
        landingPage.search('jefferson market');
        browser.sleep(1000);

        expect(landingPage.firstLocName()).toEqual('Jefferson Market Library');
        expect(landingPage.nthLocName(1)).toEqual('Hudson Park Library');
        expect(element.all(by.css('tr.active')).count()).toBe(1);
        expect(landingPage.locations.first().getAttribute('class'))
          .toContain('active');
        expect(landingPage.resultsNear.getText())
          .toEqual('Showing search results near Jefferson Market Garden, ' +
            'New York, NY 10011, USA');


        landingPage.nthLocLink(0).click();
        browser.waitForAngular();
        expect(browser.getCurrentUrl())
          .toEqual('http://localhost:9292/#/jefferson-market');

        element(by.css('.nypl-logo a')).click();
        browser.waitForAngular();
        expect(browser.getLocationAbsUrl())
          .toEqual('http://localhost:9292/#/');

        expect(landingPage.searchInput.getAttribute('value'))
          .toEqual('jefferson market');
        expect(landingPage.firstLocName()).toEqual('Jefferson Market Library');
        expect(landingPage.nthLocName(1)).toEqual('Hudson Park Library');
        expect(element.all(by.css('tr.active')).count()).toBe(1);
        expect(landingPage.locations.first().getAttribute('class'))
          .toContain('active');
        expect(landingPage.resultsNear.getText())
          .toEqual('Showing search results near Jefferson Market Garden, ' +
            'New York, NY 10011, USA');
      });

    it('should save the search field from the homepage when navigating to ' +
      'the map page and then a location page',
      function () {
        landingPage.search('jefferson market');
        browser.sleep(1000);

        expect(landingPage.firstLocName()).toEqual('Jefferson Market Library');
        expect(landingPage.nthLocName(1)).toEqual('Hudson Park Library');
        expect(element.all(by.css('tr.active')).count()).toBe(1);
        expect(landingPage.locations.first().getAttribute('class'))
          .toContain('active');
        expect(landingPage.resultsNear.getText())
          .toEqual('Showing search results near Jefferson Market Garden, ' +
            'New York, NY 10011, USA');

        landingPage.mapViewBtn.click();
        expect(browser.getCurrentUrl())
          .toEqual('http://localhost:9292/#/map');

        expect(landingPage.searchInput.getAttribute('value'))
          .toEqual('jefferson market');
        expect(landingPage.firstLocName()).toEqual('Jefferson Market Library');
        expect(landingPage.nthLocName(1)).toEqual('Hudson Park Library');
        expect(element.all(by.css('.location-data.active')).count()).toBe(1);
        expect(landingPage.locations.first().getAttribute('class'))
          .toContain('active');
        expect(landingPage.resultsNear.getText())
          .toEqual('Showing search results near Jefferson Market Garden, ' +
            'New York, NY 10011, USA');

        landingPage.nthLocLink(3).click();
        browser.waitForAngular();
        expect(browser.getCurrentUrl())
          .toEqual('http://localhost:9292/#/muhlenberg');

        element(by.css('.nypl-logo a')).click();
        browser.waitForAngular();
        expect(browser.getLocationAbsUrl())
          .toEqual('http://localhost:9292/#/');

        expect(landingPage.searchInput.getAttribute('value'))
          .toEqual('jefferson market');
        expect(landingPage.firstLocName()).toEqual('Jefferson Market Library');
        expect(landingPage.nthLocName(1)).toEqual('Hudson Park Library');
        expect(element.all(by.css('tr.active')).count()).toBe(1);
        expect(landingPage.locations.first().getAttribute('class'))
          .toContain('active');
        expect(landingPage.resultsNear.getText())
          .toEqual('Showing search results near Jefferson Market Garden, ' +
            'New York, NY 10011, USA');
      });
  
    it('should save state when visiting a division and then home', function () {
      landingPage.search('bryant park');
      browser.sleep(1000);

      expect(landingPage.firstLocName())
        .toEqual('Stephen A. Schwarzman Building');
      expect(landingPage.nthLocName(1)).toEqual('Mid-Manhattan Library');
      expect(landingPage.resultsNear.getText())
        .toEqual('Showing search results near Bryant Park, New York, NY, USA');

      landingPage.mapViewBtn.click();
      expect(browser.getCurrentUrl())
        .toEqual('http://localhost:9292/#/map');

      landingPage.nthLocLink(0).click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl())
        .toEqual('http://localhost:9292/#/schwarzman');

      expect(locationPage.divisions.count()).toBe(9);
      locationPage.divisions.get(0).element(by.css('h4 a')).click();

      browser.waitForAngular();
      expect(browser.getLocationAbsUrl()).toEqual('http://localhost:9292/#/' +
        'divisions/pforzheimer-collection-shelley-and-his-circle');

      element(by.css('.nypl-logo a')).click();
      browser.waitForAngular();
      expect(browser.getLocationAbsUrl())
        .toEqual('http://localhost:9292/#/');

      expect(landingPage.searchInput.getAttribute('value'))
        .toEqual('bryant park');
      expect(landingPage.firstLocName())
        .toEqual('Stephen A. Schwarzman Building');
      expect(landingPage.nthLocName(1)).toEqual('Mid-Manhattan Library');
      expect(landingPage.resultsNear.getText())
        .toEqual('Showing search results near Bryant Park, New York, NY, USA');
    });
  });

});

