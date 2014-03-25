'use strict';

describe('NYPL Filter Tests', function() {
	// Load App dependency
  beforeEach(module('nypl_locations'));

  describe('timeFormat', function() {

    it('should have a timeFormat function', inject(function(timeFormatFilter) {
      expect(angular.isFunction(timeFormatFilter)).toBe(true);
    }));

    it('should convert Military time into standard time', inject(function(timeFormatFilter) {
      expect(timeFormatFilter('17:00')).toBe('5:00pm');
      expect(timeFormatFilter('03:30')).toBe('3:30am');
      expect(timeFormatFilter('00:30')).toBe('12:30am');
      expect(timeFormatFilter('00:00')).toBe('12:00am');
    }));

    it('should be truthy if input is given', inject(function(timeFormatFilter) {
      expect(timeFormatFilter('00:00')).toBeTruthy();
    }));

    it('should be false if input is NOT given', inject(function(timeFormatFilter) {
      expect(timeFormatFilter()).toBeFalsy();
    }));
  });

  describe('dateToISO', function() {

    it('should have a dateToISOFilter function', inject(function(dateToISOFilter) {
      expect(angular.isFunction(dateToISOFilter)).toBe(true);
    }));

    it('Should convert MYSQL DATETIME stamp to ISO', inject(function(dateToISOFilter) {
      expect(dateToISOFilter('2014-04-22 15:00:00')).toBe('2014-04-22T19:00:00.000Z');
    }));
  });

});