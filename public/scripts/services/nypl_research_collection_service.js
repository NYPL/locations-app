/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:researchService
   * @description
   * ...
   */
  function researchCollectionService($filter) {
    var researchService = {},
      researchValues = {};

    /**
     * @ngdoc function
     * @name setResearchValue
     * @methodOf nypl_locations.service:researchService
     * @param {string} prop ...  
     * @param {string} val ...
     * @returns {object} ...
     * @description
     * ...
     */
    researchService.setResearchValue = function (prop, val) {
      researchValues[prop] = val;
      return this;
    };

    /**
     * @ngdoc function
     * @name getResearchValues
     * @methodOf nypl_locations.service:researchService
     * @returns {object} ...
     * @description
     * ...
     */
    researchService.getResearchValues = function () {
      return researchValues;
    };

    /**
     * @ngdoc function
     * @name resetResearchValues
     * @methodOf nypl_locations.service:researchService
     * @returns {object} ...
     * @description
     * ...
     */
    researchService.resetResearchValues = function () {
      researchValues = {};
      return this;
    };

    return researchService;
  }

  angular
    .module('nypl_locations')
    .factory('researchCollectionService', researchCollectionService);

})();
