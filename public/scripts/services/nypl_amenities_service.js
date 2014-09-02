/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /** @namespace nyplAmenities */
  function nyplAmenities() {

    var amenities = {},
      sortAmenitiesList = function (list, sortBy) {
        return _.sortBy(list, function (item) {
          return item[sortBy];
        });
      };

    /** @function nyplAmenities.addIcon
     * @param {array} amenities Array with amenities objects.
     * @param {string} default_icon The default icon for an amenity.
     * @returns {array} 
     * @description Adds an icon class to an amenity category.
     */
    amenities.addIcon = function (amenities, default_icon) {
      var icon = default_icon || '';
      _.each(amenities, function (amenity) {
        switch (amenity.id) {
        case 6:
          amenity.icon = 'icon-connection';
          break;
        case 7953:
          amenity.icon = 'icon-laptop';
          break;
        case 7954:
          amenity.icon = 'icon-print';
          break;
        case 7955:
          amenity.icon = 'icon-power-cord';
          break;
        case 7951:
        case 39:
          amenity.icon = 'icon-box-add';
          break;
        default:
          amenity.icon = icon;
          break;
        }
      });

      return amenities;
    };

    amenities.addCategoryIcon = function (amenities) {
      var self = this;
      _.each(amenities, function (amenityCategory) {
        var icon = '';
        switch (amenityCategory.name) {
        case 'Computer Services':
          icon = 'icon-screen2';
          break;
        case 'Circulation':
          icon = 'icon-book';
          break;
        case 'Office Services':
          icon = 'icon-copy';
          break;
        case 'Facilities':
          icon = 'icon-library';
          break;
        case 'Assistive Technologies':
          icon = 'icon-accessibility2';
          break;
        }

        amenityCategory.icon = icon;
        amenityCategory.amenities =
          self.addIcon(amenityCategory.amenities, icon);
      });

      return amenities;
    };

    /** @function nyplAmenities.allAmenitiesArray
     * @param {array} amenitiesCategories Array with amenities categories, each
     *  category with it's own amenities property which is an array of
     *  amenities under that category.
     * @returns {array} An array with all the amenities plucked from every
     *  category at a single top level, without any categories involved.
     */
    amenities.allAmenitiesArray = function (amenitiesCategories) {
      if (!amenitiesCategories) {
        return;
      }

      return _.chain(amenitiesCategories)
              // Get the 'amenities' property from every amenity category
              .pluck('amenities')
              // Flatten every array of amenities from each category into
              // a single array.
              .flatten(true)
              // Return the result.
              .value();
    };

    /** @function nyplAmenities.getHighlightedAmenities
     * @param {array} amenities Array with amenities categories, each category
     *  with it's own amenities property which is an array of amenities
     *  under that category.
     * @param {number} rank How many institution ranked amenities should be
     *  returned in the beginning of the array.
     * @param {number} loc_rank How many location ranked amenities should be
     *  returned at the end of the array.
     * @returns {array} An array containing a specific number of institution
     *  and location ranked amenities, with institution amenities listed first.
     * @example
     *  // Get three institution and two location ranked amenities.
     *  var highlightedAmenities =
     *    nyplAmenities
     *      .getHighlightedAmenities(location._embedded.amenities, 3, 2);
     */
    amenities.getHighlightedAmenities = function (amenities, rank, loc_rank) {
      var initial_list = this.allAmenitiesArray(amenities),
        amenities_list = [];

      // Sort the list of all amenities by institution rank.
      initial_list = sortAmenitiesList(initial_list, 'rank');
      // Retrieve the first n institution ranked amentities.
      amenities_list = initial_list.splice(0, rank);
      // The institution ranked array that we retrieved are no longer in the
      // array. Sort the remaining list of amenities by location rank.
      initial_list = sortAmenitiesList(initial_list, 'location_rank');
      // Retrieve the first n location ranked amenities and add
      initial_list = initial_list.splice(0, loc_rank);

      // Combine the two arrays, listing the institution ranked amenities first.
      amenities_list = _.union(amenities_list, initial_list);

      return amenities_list;
    };

    return amenities;
  }

  angular
    .module('nypl_locations')
    .factory('nyplAmenities', nyplAmenities);

})();

