describe('Locations: library', function () {
  'use strict';

  var locationPage = require('./location.po.js');

  describe('Circulating branch', function () {
    beforeEach(function () {
      browser.get('/#/grand-central');
      browser.waitForAngular();
    });

    it('should display the name', function () {
      expect(locationPage.name.getText()).toEqual('Grand Central Library');
    });

    it('should have a complete address', function () {
      expect(locationPage.street_address.getText()).toEqual('135 East 46th Street');
      expect(locationPage.locality.getText()).toEqual('New York');
      expect(locationPage.region.getText()).toEqual('NY');
      expect(locationPage.postal_code.getText()).toEqual('10017');
    });

    it('should have a library manager', function () {
      expect(locationPage.manager.getText()).toEqual('Library Manager: Genoveve Stowell');
    });

    it('should display three social media icons', function () {
      // There are only three icons available to display
      expect(locationPage.social_media.count()).toBe(5);
    });

    it('should display hours for today', function () {
      // Hours change everyday
      expect(locationPage.hoursToday.getText()).not.toEqual('');
    });

    it('should display hours for all seven days', function () {
      expect(locationPage.hours.count()).toBe(7);
    });

    it('should display three events', function () {
      expect(locationPage.events.count()).toBe(3);
    });

    it('should have an about blurb', function () {
      expect(locationPage.about.isPresent()).toBe(true);
    });

    it('should display three blogs', function () {
      expect(locationPage.blogs.count()).toBe(3);
    });

  });

  describe('Research branch', function () {
    beforeEach(function () {
      browser.get('/#/schwarzman');
      browser.waitForAngular();
    });

    it('should display the name', function () {
      expect(locationPage.name.getText()).toEqual('Stephen A. Schwarzman Building');
    });

    it('should have a complete address', function () {
      expect(locationPage.street_address.getText()).toEqual('Fifth Avenue at 42nd Street');
      expect(locationPage.locality.getText()).toEqual('New York');
      expect(locationPage.region.getText()).toEqual('NY');
      expect(locationPage.postal_code.getText()).toEqual('10018');
    });

    it('should have a library manager', function () {
      expect(locationPage.manager.getText()).not.toEqual('');
    });

    it('should display hours for today', function () {
      // Hours change everyday
      expect(locationPage.hoursToday.getText()).not.toEqual('');
    });

    it('should display hours for all seven days', function () {
      expect(locationPage.hours.count()).toBe(7);
    });

    it('should display 12 divisions', function () {
      expect(locationPage.divisions.count()).toBe(12);
    });

    it('should display three events', function () {
      expect(locationPage.events.count()).toBe(3);
    });

    it('should have an about blurb', function () {
      expect(locationPage.about.isPresent()).toBe(true);
    });

    it('should not display blogs', function () {
      expect(locationPage.blogs.count()).toBe(0);
    });

    it('should display two exhibitions', function () {
      expect(locationPage.exhibitions.count()).toBe(2);
    });

  });
});