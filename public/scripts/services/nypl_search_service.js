/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplSearch
   * @description
   * AngularJS service that deals preserving data across the app, specifically
   * used for saving the home state.
   */
  function nyplSearch($filter) {
    var search = {},
      searchValues = {};

    /**
     * @ngdoc function
     * @name setSearchValue
     * @methodOf nypl_locations.service:nyplSearch
     * @param {string} prop ...  
     * @param {string} val ...
     * @returns {object} ...
     * @description
     * ...
     */
    search.setSearchValue = function (prop, val) {
      searchValues[prop] = val;
      return this;
    };

    /**
     * @ngdoc function
     * @name getSearchValues
     * @methodOf nypl_locations.service:nyplSearch
     * @returns {object} ...
     * @description
     * ...
     */
    search.getSearchValues = function () {
      return searchValues;
    };

    /**
     * @ngdoc function
     * @name resetSearchValues
     * @methodOf nypl_locations.service:nyplSearch
     * @returns {object} ...
     * @description
     * ...
     */
    search.resetSearchValues = function () {
      searchValues = {};
      return this;
    };

    /**
     * @ngdoc function
     * @name idLocationSearch
     * @methodOf nypl_locations.service:nyplSearch
     * @param {array} locations Array containing a list of all the
     *  locations objects.
     * @param {string} searchTerm The id to search for in all the locations.
     * @returns {array} An array containing the location object with the
     *  searched id. An empty array if there is no match.
     * @description All the locations are being searched with a specific ID in
     *  mind. If there is a location object where the 'id' property matches the
     *  id that was being searched, then it is returned in an array.
     */
    search.idLocationSearch = function (locations, searchTerm) {
      var IDFilter = [];

      if (!locations || !searchTerm) {
        return;
      }

      if (searchTerm.length >= 2 && searchTerm.length <= 4) {
        IDFilter = _.where(locations, { 'id' : searchTerm.toUpperCase() });
      }

      return IDFilter;
    };

    /**
     * @ngdoc function
     * @name locationSearch
     * @methodOf nypl_locations.service:nyplSearch
     * @param {array} locations An array with all the location objects.
     * @param {string} searchTerm The search word or phrased to look for in the
     *  locations objects.
     * @returns {array} An array that returns filtered locations based on what
     *  was queried and what AngularJS' filter returns.
     * @description Using the native AngularJS filter, we do a lazy and strict
     *  filter through the locations array. The strict filter has a higher
     *  priority since it's a better match. The 'lazy' filter matches anything,
     *  even part of a word. For example, 'sibl' would match with 'accesSIBLe'
     *  which is undesirable.
     */
    search.locationSearch = function (locations, searchTerm) {
      // how to search the object?
      // name, address, zipcode, locality, synonyms (amenities and divisions?)

      var lazyFilter, strictFilter;

      if (!locations || !searchTerm || searchTerm.length < 3) {
        return;
      }

      lazyFilter = $filter('filter')(locations, searchTerm);
      strictFilter = $filter('filter')(locations, searchTerm, true);

      return lazyFilter;
    };

    /**
     * @ngdoc function
     * @name searchWordFilter
     * @methodOf nypl_locations.service:nyplSearch
     * @param {string} query The search word or phrase.
     * @returns {string} The same search phrase but with stop words removed.
     * @description Some words should be removed from a user's search query.
     *  Those words are removed before doing any filtering or searching using 
     *  Google's service.
     */
    search.searchWordFilter = function (query) {
      var words = ['branch'];

      if (!query) {
        return;
      }

      _.each(words, function (word) {
        query = query.replace(word, '');
      });

      return query;
    };

    return search;
  }

  angular
    .module('nypl_locations')
    .factory('nyplSearch', nyplSearch);

})();
