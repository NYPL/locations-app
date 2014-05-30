'use strict';

describe('NYPL Filter Tests', function() {
	// Load App dependency
  var timeFormatFilter,
      dateToISOFilter,
      capitalizeFilter,
      hoursTodayFormatFilter,
      truncateFilter;

  beforeEach(module('nypl_locations'));

  describe('timeFormat', function() {
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

    it('should also accept an object with today\'s and tomorrow\'s hours', function () {
      var time; 

      time = timeFormatFilter({'today': {'open': '00:00', 'close': '2:00'}});
      expect(time).toBe('12:00am - 2:00am');

      time = timeFormatFilter({'today': {'open': '10:00', 'close': '18:00'}});
      expect(time).toBe('10:00am - 6:00pm');
    });

    // The API returns null
    it('should say Closed if there is no open time', function () {
      expect(timeFormatFilter({'open': null, 'close': null})).toBe('Closed');
    });

    it('should be truthy if input is given', function () {
      expect(timeFormatFilter({'open': '17:00', 'close': '18:00'})).toBeTruthy();
    });

    it('should be false if input is NOT given', function () {
      expect(timeFormatFilter()).toBeFalsy();
    });
  });

  describe('dateToISO', function() {
    beforeEach(inject(function (_dateToISOFilter_){
      dateToISOFilter = _dateToISOFilter_;
    }));

    it('should have a dateToISOFilter function', function () {
      expect(angular.isFunction(dateToISOFilter)).toBe(true);
    });

    it('Should convert MYSQL DATETIME stamp to ISO', function () {
      expect(dateToISOFilter('2014-04-22 15:00:00')).toBe('2014-04-22T19:00:00.000Z');
    });
  });

  describe('capitalize', function() {
    beforeEach(inject(function (_capitalizeFilter_){
      capitalizeFilter = _capitalizeFilter_;
    }));

    it('should have a dateToISOFilter function', function () {
      expect(angular.isFunction(capitalizeFilter)).toBe(true);
    });

    it('Should capitalize a word', function () {
      expect(capitalizeFilter('schwarzman')).toEqual('Schwarzman');
    });
  });

  describe('hoursTodayFormat', function () {
    beforeEach(inject(function (_hoursTodayFormatFilter_){
      hoursTodayFormatFilter = _hoursTodayFormatFilter_;
    }));

    describe('when closed', function () {
      it('should be false if no input is given', function () {
        expect(hoursTodayFormatFilter('')).toBeFalsy();
      });

      it('should say "Closed today" when there is no open or close data and no format', function () {
        expect(hoursTodayFormatFilter({'today':{'open': '', 'close': ''}})).toBe('Closed today');
      });

      it('should say "Closed today" when there is no open or close data and short format', function () {
        expect(hoursTodayFormatFilter({'today':{'open': '', 'close': ''}}, 'short')).toBe('Closed today');
      });

      it('should say "Closed today" when there is no open or close data and long format', function () {
        expect(hoursTodayFormatFilter({'today':{'open': '', 'close': ''}}, 'long')).toBe('Closed today');
      });
    });

    // The only big difference between short and long is the wording when the library
    // is currently opened. Short says "Open today until ..." and long says
    // "Open today ...".
    describe('when opened and using the "short" format', function () {
      it('should display the open times for today', function () {
        // Returns 13 for 1pm in the afternoon when a library is open.
        Date.prototype.getHours = function () {return 13;};

        expect(hoursTodayFormatFilter({
          'today':{'open': '10:00', 'close': '18:00'},
          'tomorrow':{'open': '10:00', 'close': '18:00'}}, 'short'))
            .toBe('Open today until 6pm');
      });

      it('should display the open times for tomorrow', function () {
        // Returns 19 for 7pm after a library has closed.
        Date.prototype.getHours = function () {return 19;};

        expect(hoursTodayFormatFilter({
          'today':{'open': '10:00', 'close': '18:00'},
          'tomorrow':{'open': '10:00', 'close': '18:00'}}, 'short'))
          .toBe('Open tomorrow 10am-6pm');
      });

      it('should display the open times for later today', function () {
        // Returns 7 for 7am in the morning before a library has opened.
        Date.prototype.getHours = function () {return 7;};

        expect(hoursTodayFormatFilter({
          'today':{'open': '10:00', 'close': '18:00'},
          'tomorrow':{'open': '10:00', 'close': '18:00'}}, 'short'))
          .toBe('Open today 10am-6pm');
      });
    });

    describe('when opened and using the "long" format', function () {
      it('should display the open times for tomorrow', function () {
        // Returns 13 for 1pm in the afternoon when a library is open.
        Date.prototype.getHours = function () {return 13;};

        expect(hoursTodayFormatFilter({
          'today':{'open': '10:00', 'close': '18:00'},
          'tomorrow':{'open': '10:00', 'close': '18:00'}}, 'long'))
            .toBe('Open today 10am-6pm');
      });

      it('should display the open times for tomorrow', function () {
        // Returns 19 for 7pm after a library has closed.
        Date.prototype.getHours = function () {return 19;};

        expect(hoursTodayFormatFilter({
          'today':{'open': '10:00', 'close': '18:00'},
          'tomorrow':{'open': '10:00', 'close': '18:00'}}, 'long'))
          .toBe('Open tomorrow 10am-6pm');
      });

      it('should display the open times for later today', function () {
        // Returns 7 for 7am in the morning before a library has opened.
        Date.prototype.getHours = function () {return 7;};

        expect(hoursTodayFormatFilter({
          'today':{'open': '10:00', 'close': '18:00'},
          'tomorrow':{'open': '10:00', 'close': '18:00'}}, 'short'))
          .toBe('Open today 10am-6pm');
      });
    });
  });

  describe('truncate', function () {
    beforeEach(inject(function (_truncateFilter_){
      truncateFilter = _truncateFilter_;
    }));

    var blog_post = "If you think of poems as flowers, then the Aguilar Poetry Fest " +
        "was an exercise in charming cross-pollination. Sharing was the " +
        "thing. Students were seated in groups of about 6, where they read " + 
        "their chosen poems to each other and then intermixed with other tables" + 
        " to multiply the fun. Poets included Langston Hughes, Pablo Neruda," +
        " Maya Angelou, Naomi Shihab Nye, Shel Silverstein, Douglas Florian " + 
        "(on Silverstein s wavelength), Billy Collins, some haiku poets, and a smattering of others.";

    it('should truncate a piece of text and add ellipses at the end to 200 characters by default', function () {
      expect(blog_post.length).toBe(487);
      expect(truncateFilter(blog_post).length).toBe(200);
      expect(truncateFilter(blog_post).substring(197)).toBe('...');
    });

    it('should truncate a piece of text to an arbitary length and add ellipses', function () {
      expect(blog_post.length).toBe(487);
      expect(truncateFilter(blog_post, 100).length).toBe(100);
      expect(truncateFilter(blog_post, 100).substring(97)).toBe('...');
    });

    it('should truncate a piece of text to an arbitary length and add an arrow at th end', function () {
      expect(blog_post.length).toBe(487);
      expect(truncateFilter(blog_post, 150, ' ->').length).toBe(150);
      expect(truncateFilter(blog_post, 150, ' ->').substring(147)).toBe(' ->');
    });
  });

});