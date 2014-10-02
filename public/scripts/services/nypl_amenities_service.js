/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /** @namespace nyplAmenities */
  function nyplAmenities() {

    var amenities = {},
      default_amenities = [
        { amenity: { name: 'Computers for Public Use', id: 7950 } },
        { amenity: { name: 'Wireless Internet Access', id: 7950 } },
        { amenity: { name: 'Printing (from PC)', id: 7950 } }
      ],
      sortAmenitiesList = function (list, sortBy) {
        if (!(list instanceof Array)) {
          return;
        }

        return _.sortBy(list, function (item) {
          if (!item.amenity) {
            return;
          }
          if (!item.amenity[sortBy]) {
            return item.amenity[sortBy];
          }
          return item[sortBy];
        });
      };

    amenities.addAmenitiesIcon = function (amenity) {
      if (!amenity || !amenity.category) {
        return;
      }

      amenity.icon = this.getCategoryIcon(amenity.category);
      amenity.icon = this.getAmenityIcon(amenity.id, amenity.icon);

      return amenity;
    };

    amenities.getCategoryIcon = function (category, default_icon) {
      var icon = default_icon || '';

      switch (category) {
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

      return icon;
    };

    amenities.getAmenityIcon = function (id, default_icon) {
      var icon = default_icon || '';

      switch (id) {
      case 7952: // Wireless
        icon = 'icon-connection';
        break;
      case 7965: // Laptop
        icon = 'icon-laptop';
        break;
      case 7954: // Printing
        icon = 'icon-print';
        break;
      case 7955: // Electrical oulets
        icon = 'icon-power-cord';
        break;
      case 7958: // Book drop
      case 7951:
        icon = 'icon-box-add';
        break;
      default:
        break;
      }

      return icon;
    };

    /** @function nyplAmenities.allAmenitiesArray
     * @deprecated 
     * @param {array} amenitiesCategories Array with amenities categories, each
     *  category with it's own amenities property which is an array of
     *  amenities under that category.
     * @returns {array} An array with all the amenities plucked from every
     *  category at a single top level, without any categories involved.
     */
    amenities.allAmenitiesArray = function (amenities) {
      if (!amenities) {
        return;
      }

      return _.chain(amenities)
              // Get the 'amenities' property from every amenity category
              .pluck('amenity')
              // Flatten every array of amenities from each category into
              // a single array.
              .flatten(true)
              // Return the result.
              .value();
    };

    amenities.createAmenitiesCategories = function (amenities) {
      var categoryName = ['Computer Services', 'Circulation',
          'Printing and Copy Services', 'Facilities', 'Assistive Technologies'],
        categories = [],
        categoryObj,
        self = this;

      _.each(categoryName, function (category) {
        categoryObj = {};
        categoryObj.amenities = _.where(amenities, {'category': category});
        categoryObj.name = category;
        categoryObj.icon = self.getCategoryIcon(category);

        if (categoryObj.amenities.length) {
          categories.push(categoryObj);
        }
      });

      return categories;
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
      var initial_list = amenities,
        amenities_list = [];

      if (!(amenities.length && rank && loc_rank)) {
        return; // default_amenities;
      }

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

    amenities.getAmenityConfig = function (config, globalDefault, localDefault) {
      var obj = {},
        global = globalDefault || 3,
        local  = localDefault || 2;
      if (config.featured_amenities) {
        obj.global = config.featured_amenities.global || global;
        obj.local  = config.featured_amenities.local || local;
      }
      else {
        obj.global = global;
        obj.local  = local;
      }
      return obj;
    };

    return amenities;
  }

  angular
    .module('nypl_locations')
    .factory('nyplAmenities', nyplAmenities);

})();

