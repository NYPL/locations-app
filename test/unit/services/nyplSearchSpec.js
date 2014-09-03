/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Search Service Tests', function () {
  'use strict';

  describe('nyplSearch', function () {
    var nyplSearch;

    beforeEach(function () {
      module('nypl_locations');
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nyplSearch_) {
        nyplSearch = _nyplSearch_;
      });
    });

    /*
     * nyplSearch.idLocationSearch(locations, searchTerm)
     *   locations: Array with location objects.
     *   searchTerm: What the user searched for.
     *
     *   Returns an array with one object where the searchTerm matches the 'id'
     *   property of one of the location objects in the locations array.
     */
    describe('nyplSearch.idLocationSearch()', function () {
      it('should return the location object that matches the id that was ' +
        'searched',
        function () {
          var search = 'bar', // Baychester
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'}
            ],
            location;

          location = nyplSearch.idLocationSearch(locations, search);
          expect(location).toEqual([{id: 'BAR', name: 'Baychester Library'}]);
        });

      it('should return an empty array if the search did not match',
        function () {
          var search = 'upper west side',
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'}
            ],
            location;

          location = nyplSearch.idLocationSearch(locations, search);
          // Should not match any ids in any library object.
          expect(location).toEqual([]);
        });
    });

    /*
     * nyplSearch.locationSearch(locations, searchTerm)
     *   locations: Array with location objects.
     *   searchTerm: What the user searched for.
     *
     *   Returns an array with all the location objects that match what
     *   the user searched for.
     */
    describe('nyplSearch.locationSearch()', function () {
      it('should return an array with locations that match ' +
        'what was searched for',
        function () {
          var search = 'bay',
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'},
              {id: 'KP', name: 'Kips Bay Library'},
              {id: 'PM', name: 'Pelham Bay Library'}
            ],
            location;

          location = nyplSearch.locationSearch(locations, search);
          expect(location).toEqual([
            {id: 'BAR', name: 'Baychester Library'},
            {id: 'KP', name: 'Kips Bay Library'},
            {id: 'PM', name: 'Pelham Bay Library'}
          ]);
        });

      it('should return an empty array if the search did not match',
        function () {
          var search = 'upper west side',
            locations = [
              {id: 'AG', name: 'Aguilar Library'},
              {id: 'AL', name: 'Allerton Library'},
              {id: 'BAR', name: 'Baychester Library'},
              {id: 'BLC', name: 'Bronx Library Center'},
              {id: 'KP', name: 'Kips Bay Library'},
              {id: 'PM', name: 'Pelham Bay Library'}
            ],
            location;

          location = nyplSearch.locationSearch(locations, search);
          // Should not match any ids in any library object.
          expect(location).toEqual([]);
        });
    });

    /*
     * nyplSearch.searchWordFilter(query)
     *   query: a string coming form a search input field
     *
     *   Returns a string but with a set of words removed from the string.
     */
    describe('nyplSearch.searchWordFilter()', function () {
      // The set of words to remove from searchs only include 'branch'
      // at the moment.
      it('should remove the word "branch" from a search', function () {
        var query = "columbus circle branch";

        expect(nyplSearch.searchWordFilter(query)).toEqual('columbus circle ');
      });

      it('should return the same string if no filtered words are in the search',
        function () {
          var query = "library of performing arts";

          expect(nyplSearch.searchWordFilter(query))
            .toEqual('library of performing arts');
        });
    });

  });
});
