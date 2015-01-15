/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

/*
 * The following tests are for custom AngularJS filters.
 */
describe('NYPL Filter Unit Tests', function () {
  'use strict';

  // Load App dependency
  var timeFormatFilter,
    dateToISOFilter,
    capitalizeFilter,
    hoursTodayFormatFilter,
    truncateFilter;

  beforeEach(module('nypl_locations'));

  /*
   * {object} | timeFormat
   *   Input is an object with 'open' and 'close' properties OR
   *   it can be an object with 'today' and 'tomorrow' properties, each with
   *   their own 'open' and 'close' properties.
   *
   *   Returns a string of nicely military-formatted time. If there is
   *   no open time in the input object, 'Closed' is returned.
   */
  describe('Filter: timeFormat', function () {
    beforeEach(inject(function (_timeFormatFilter_) {
      timeFormatFilter = _timeFormatFilter_;
    }));

    it('should have a timeFormat function', function () {
      expect(timeFormatFilter).toBeDefined();
      expect(angular.isFunction(timeFormatFilter)).toBe(true);
    });

    // The input is a simple object with 'open' and 'close' properties
    it('should convert Military time into standard time', function () {
      expect(timeFormatFilter({'open': '17:00', 'close': '18:00'}))
        .toEqual('5:00pm - 6:00pm');
      expect(timeFormatFilter({'open': '03:30', 'close': '05:30'}))
        .toEqual('3:30am - 5:30am');
      expect(timeFormatFilter({'open': '00:30', 'close': '02:30'}))
        .toEqual('12:30am - 2:30am');
      expect(timeFormatFilter({'open': '00:00', 'close': '2:00'}))
        .toEqual('12:00am - 2:00am');
    });

    // The input is an object with 'today' and 'tomorrow' properties but only
    // the 'today' property is used.
    it('should also accept an object with today\'s and tomorrow\'s hours',
      function () {
        expect(timeFormatFilter({'today': {'open': '00:00', 'close': '2:00'}}))
          .toEqual('12:00am - 2:00am');

        expect(timeFormatFilter({'today': {'open': '10:00', 'close': '18:00'}}))
          .toEqual('10:00am - 6:00pm');
      });

    // The API returns null values
    it('should say Closed if there is no open time', function () {
      expect(timeFormatFilter({'open': null, 'close': null})).toEqual('Closed');
    });

    it('should be false if input is NOT given', function () {
      expect(timeFormatFilter()).toEqual('');
      expect(timeFormatFilter()).toBeFalsy();
    });
  });

  /*
   * dateToISO
   *   The input is a string date stamp.
   *
   *   Returns the date in ISO format.
   */
  describe('Filter: dateToISO', function () {
    beforeEach(inject(function (_dateToISOFilter_) {
      dateToISOFilter = _dateToISOFilter_;
    }));

    it('should have a dateToISOFilter function', function () {
      expect(dateToISOFilter).toBeDefined();
      expect(angular.isFunction(dateToISOFilter)).toBe(true);
    });

    it('should convert MYSQL DATETIME stamp to ISO', function () {
      expect(dateToISOFilter('2014-04-22 15:00:00'))
        .toEqual('2014-04-22T19:00:00.000Z');
    });
  }); /* End dateToISO */

  /*
   * 'string' | capitalize
   *   Input is a string.
   *
   *   Returns a string with every word capitalized. If the input is not
   *   a string, it returns the input untouched.
   */
  describe('Filter: capitalize', function () {
    beforeEach(inject(function (_capitalizeFilter_) {
      capitalizeFilter = _capitalizeFilter_;
    }));

    it('should have a capitalize filter function', function () {
      expect(capitalizeFilter).toBeDefined();
      expect(angular.isFunction(capitalizeFilter)).toBe(true);
    });

    it('should capitalize a word', function () {
      expect(capitalizeFilter('schwarzman')).toEqual('Schwarzman');
    });

    it('should capitalize every word in a phrase', function () {
      expect(capitalizeFilter('stephen a. schwarzman building'))
        .toEqual('Stephen A. Schwarzman Building');
    });

    it('should return an empty string', function () {
      expect(capitalizeFilter(1234)).toEqual(1234);
    });
  }); /* End capitalize */

  /*
   * {object} | hoursTodayFormat
   *   Input is an object with a 'today' and 'tomorrow' object properties.
   *
   *   It returns 'Closed today' if there is no data, otherwise it checks the
   *   current time and compares the times for the library and outputs
   *   when the library opens, when it is open until, and what time
   *   it is open tomorrow - if tomorrow data is available.
   */
  describe('Filter: hoursTodayFormat', function () {
    beforeEach(inject(function (_hoursTodayFormatFilter_) {
      hoursTodayFormatFilter = _hoursTodayFormatFilter_;
    }));

    it('should be defined', function () {
      expect(hoursTodayFormatFilter).toBeDefined();
      expect(angular.isFunction(hoursTodayFormatFilter)).toBe(true);
    });

    describe('when closed', function () {
      it('should be false if no input is given', function () {
        expect(hoursTodayFormatFilter('')).toEqual('Not available');
      });

      // Note how the following tests don't have data for the 'tomorrow'
      // object, meaning if the today object has no data, no need to check
      // tomorrow's object.
      it('should say "Closed today" when there is no open or close ' +
        'data and no format',
        function () {
          expect(
            hoursTodayFormatFilter({'today': {'open': null, 'close': null}})
          ).toEqual('Closed today');
        });

      it('should say "Closed today" when there is no open or close ' +
        'data and short format',
        function () {
          expect(
            hoursTodayFormatFilter({'today': {'open': null, 'close': null}},
              'short')
          ).toEqual('Closed today');
        });

      it('should say "Closed today" when there is no open or close ' +
        'data and long format',
        function () {
          expect(
            hoursTodayFormatFilter({'today': {'open': null, 'close': null}},
              'long')
          ).toEqual('Closed today');
        });
    });

    describe('when not using a "short" or "long" format', function () {
      it('should output the default setting', function () {
        // Returns 13 for 1pm in the afternoon when a library is open.
        Date.prototype.getHours = function () { return 13; };

        expect(hoursTodayFormatFilter({
          'today': {'open': '10:00', 'close': '18:00'},
          'tomorrow': {'open': '10:00', 'close': '18:00'}
        })).toEqual('10:00am-6:00pm');
      });
    });

    /*
     * The only big difference between short and long is the wording 
     * when the library is currently opened.
     * Short says "Open today until ..."
     * Long says "Open today ...".
     */
    describe('when opened and using the "short" format', function () {
      it('should display the open times for today', function () {
        // Returns 13 for 1pm in the afternoon when a library is open.
        Date.prototype.getHours = function () { return 13; };

        expect(hoursTodayFormatFilter({
          'today': {'open': '10:00', 'close': '18:00'},
          'tomorrow': {'open': '10:00', 'close': '18:00'}
        }, 'short'))
          .toEqual('Open today until 6pm');
      });

      it('should display the open times for today with minutes', function () {
        // Returns 13 for 1pm in the afternoon when a library is open.
        Date.prototype.getHours = function () { return 13; };

        expect(hoursTodayFormatFilter({
          'today': {'open': '10:00', 'close': '18:45'},
          'tomorrow': {'open': '10:00', 'close': '18:45'}
        }, 'short'))
          .toEqual('Open today until 6:45pm');
      });

      it('should display the open times for tomorrow', function () {
        // Returns 19 for 7pm after a library has closed.
        Date.prototype.getHours = function () { return 19; };

        expect(hoursTodayFormatFilter({
          'today': {'open': '10:00', 'close': '18:00'},
          'tomorrow': {'open': '10:00', 'close': '18:00'}
        }, 'short'))
          .toEqual('Open tomorrow 10am-6pm');
      });

      it('should display the open times for tomorrow with minutes',
        function () {
          // Returns 19 for 7pm after a library has closed.
          Date.prototype.getHours = function () { return 19; };

          expect(hoursTodayFormatFilter({
            'today': {'open': '10:30', 'close': '18:30'},
            'tomorrow': {'open': '10:30', 'close': '18:30'}
          }, 'short'))
            .toEqual('Open tomorrow 10:30am-6:30pm');
        });

      it('should display the open times for later today', function () {
        // Returns 7 for 7am in the morning before a library has opened.
        Date.prototype.getHours = function () { return 7; };

        expect(hoursTodayFormatFilter({
          'today': {'open': '10:00', 'close': '18:00'},
          'tomorrow': {'open': '10:00', 'close': '18:00'}
        }, 'short'))
          .toEqual('Open today 10am-6pm');
      });
    });

    describe('when opened and using the "long" format', function () {
      it('should display that it is currently open when checking during ' +
        'open hours',
        function () {
          // Returns 13 for 1pm in the afternoon when a library is open.
          Date.prototype.getHours = function () { return 13; };

          expect(hoursTodayFormatFilter({
            'today': {'open': '10:00', 'close': '18:00'},
            'tomorrow': {'open': '10:00', 'close': '18:00'}
          }, 'long'))
              .toEqual('Open today 10am-6pm');
        });

      it('should display that it is currently open when checking during ' +
        'open hours with minutes',
        function () {
          // Returns 13 for 1pm in the afternoon when a library is open.
          Date.prototype.getHours = function () { return 13; };

          expect(hoursTodayFormatFilter({
            'today': {'open': '10:30', 'close': '18:45'},
            'tomorrow': {'open': '10:30', 'close': '18:45'}
          }, 'long'))
              .toEqual('Open today 10:30am-6:45pm');
        });

      it('should display that it is currently open when checking during ' +
        'open hours',
        function () {
          // Returns 13 for 1pm in the afternoon when a library is open.
          Date.prototype.getHours = function () { return 13; };

          expect(hoursTodayFormatFilter({
            'today': {'open': '10:00', 'close': '18:00'},
            'tomorrow': {'open': '10:00', 'close': '18:00'}
          }, 'long'))
              .toEqual('Open today 10am-6pm');
        });

      it('should display the open times for tomorrow when checking after ' +
        'closing time but before midnight',
        function () {
          // Returns 19 for 7pm after a library has closed.
          Date.prototype.getHours = function () { return 19; };

          expect(hoursTodayFormatFilter({
            'today': {'open': '10:00', 'close': '18:00'},
            'tomorrow': {'open': '10:00', 'close': '18:00'}
          }, 'long'))
            .toEqual('Open tomorrow 10am-6pm');
        });

      it('should display the open times for later today when checking after ' +
        'midnight but before the library is open',
        function () {
          // Returns 7 for 7am in the morning before a library has opened.
          Date.prototype.getHours = function () { return 7; };

          expect(hoursTodayFormatFilter({
            'today': {'open': '10:00', 'close': '18:00'},
            'tomorrow': {'open': '10:00', 'close': '18:00'}
          }, 'long'))
            .toEqual('Open today 10am-6pm');
        });
    });

    describe('when tomorrow\'s time is closed', function () {
      it('should say closed but not "Open tomorrow ..."', function () {
        // Returns 19 for 7pm in the afternoon when a library is open.
        Date.prototype.getHours = function () { return 19; };

        // Since there are no hours for the tomorrow object and we are checking
        // after today's closing time, then we cannot display, for example,
        // "Open tomorrow 10am - 6pm". Display that it's just closed.
        expect(hoursTodayFormatFilter({
          'today': {'open': '10:00', 'close': '18:00'},
          'tomorrow': {'open': null, 'close': null}
        }, 'short'))
          .toEqual('Closed today');
      });
    });
  }); /* End hoursTodayFormat */

  /*
   * 'String' | truncate
   *   The input is a long string.
   *
   *   Returns shortened text by a given length and adds ellipsis
   *   to the end of the truncated text.
   */
  describe('Filter: truncate', function () {
    beforeEach(inject(function (_truncateFilter_) {
      truncateFilter = _truncateFilter_;
    }));

    var blog_post = "If you think of poems as flowers, then the Aguilar " +
        "Poetry Fest was an exercise in charming cross-pollination. Sharing " +
        "was the thing. Students were seated in groups of about 6, where " +
        "they read their chosen poems to each other and then intermixed " +
        "with other tables to multiply the fun. Poets included Langston " +
        "Hughes, Pablo Neruda, Maya Angelou, Naomi Shihab Nye, Shel " +
        "Silverstein, Douglas Florian (on Silverstein s wavelength), " +
        "Billy Collins, some haiku poets, and a smattering of others.",
      short_blog_post = "If you think of poems as flowers, then the Aguilar " +
        "Poetry Fest was an exercise in charming cross-pollination. Sharing " +
        "was the thing.";

    it('should be defined', function () {
      expect(truncateFilter).toBeDefined();
      expect(angular.isFunction(truncateFilter)).toBe(true);
    });

    it('should return the input if it is not a string', function () {
      expect(truncateFilter(1234)).toEqual(1234);
    });

    describe('long blog post', function () {
      it('should truncate a piece of text and add ellipses at the end to ' +
        '200 characters by default',
        function () {
          expect(blog_post.length).toEqual(487);
          expect(truncateFilter(blog_post).length).toEqual(200);
          expect(truncateFilter(blog_post).substring(197)).toEqual('...');
        });

      it('should truncate a piece of text to an arbitary length and ' +
        'add ellipses',
        function () {
          expect(blog_post.length).toBe(487);
          expect(truncateFilter(blog_post, 100).length).toEqual(100);
          expect(truncateFilter(blog_post, 100).substring(97)).toEqual('...');
        });

      it('should truncate a piece of text to an arbitary length and add ' +
        'an arrow at the end',
        function () {
          expect(blog_post.length).toEqual(487);
          expect(truncateFilter(blog_post, 150, ' ->').length).toEqual(150);
          expect(truncateFilter(blog_post, 150, ' ->').substring(147))
            .toEqual(' ->');
        });

      it('should return the same string if a length option is added but is' +
        'greater than the length of the text',
        function () {
          expect(blog_post.length).toEqual(487);
          expect(truncateFilter(blog_post, 500).length).toBe(487);
        });
    });

    describe('short blog post less than 200 characters', function () {
      it('should return the same string', function () {
        expect(short_blog_post.length).toEqual(132);
        expect(truncateFilter(short_blog_post).length).toEqual(132);
      });
    });
  }); /* End truncate */

});
