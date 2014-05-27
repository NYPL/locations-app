'use strict';

describe('NYPL Filter Tests', function() {
	// Load App dependency
  beforeEach(module('nypl_locations'));

  describe('timeFormat', function() {
    var timeFormatFilter;
    beforeEach(inject(function (_timeFormatFilter_){
      timeFormatFilter = _timeFormatFilter_;
    }));

    it('should have a timeFormat function', function () {
      expect(angular.isFunction(timeFormatFilter)).toBe(true);
    });

    it('should convert Military time into standard time', function () {
      expect(timeFormatFilter({'open': '17:00', 'close': '18:00'})).toBe('5:00pm - 6:00pm');
      expect(timeFormatFilter({'open': '03:30', 'close': '05:30'})).toBe('3:30am - 5:30am');
      expect(timeFormatFilter({'open': '00:30', 'close': '02:30'})).toBe('12:30am - 2:30am');
      expect(timeFormatFilter({'open': '00:00', 'close': '2:00'})).toBe('12:00am - 2:00am');
    });

    it('should be truthy if input is given', function () {
      expect(timeFormatFilter({'open': '17:00', 'close': '18:00'})).toBeTruthy();
    });

    it('should be false if input is NOT given', function () {
      expect(timeFormatFilter()).toBeFalsy();
    });
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