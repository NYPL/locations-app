/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplAmenities
   * @description
   * AngularJS service that deals with all amenity related configuration.
   * Sets amenities categories, icons for each amenity, and highlighted
   * amenities for each branch.
   */
  function nyplAmenities() {

    var amenities = {},
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

    /**
     * @ngdoc function
     * @name addAmenitiesIcon
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {object} amenity An amenity object.
     * @returns {object} The amenity with an added icon property.
     * @description
     * Adds the appropriate icon to an amenity. First it checks the amenity's
     * category and adds the icon to match the category. Then it check's its
     * id to see if it's an amenity with a special icon. If so, it adds it.
     */
    amenities.addAmenitiesIcon = function (amenity) {
      if (!amenity || !amenity.category) {
        return;
      }

      amenity.icon = this.getCategoryIcon(amenity.category);
      amenity.icon = this.getAmenityIcon(amenity.id, amenity.icon);

      return amenity;
    };

    /**
     * @ngdoc function
     * @name getCategoryIcon
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {string} category The category for the amenity.
     * @param {string} [default_icon] The default icon class.
     * @returns {string} The icon class for the amenity category. 
     * @description
     * Returns a class for the correct icon class for an amenity category.
     */
    amenities.getCategoryIcon = function (category, default_icon) {
      var icon = default_icon || '';

      switch (category) {
      case 'Computer Services':
        icon = 'icon-screen2';
        break;
      case 'Circulation':
        icon = 'icon-book';
        break;
      case 'Printing and Copy Services':
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

    /**
     * @ngdoc function
     * @name getAmenityIcon
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {number} id The amenity's id.
     * @param {string} [default_icon] The default icon class.
     * @returns {string} The icon class for the amenity. 
     * @description
     * Returns the icon for a few special amenities.
     */
    amenities.getAmenityIcon = function (id, default_icon) {
      var icon = default_icon || '';

      switch (id) {
      case 7967: // Wireless
        icon = 'icon-connection';
        break;
      case 7965: // Laptop
        icon = 'icon-laptop';
        break;
      case 7966: // Printing
        icon = 'icon-print';
        break;
      case 7968: // Electrical oulets
        icon = 'icon-power-cord';
        break;
      case 7971: // Book drop
      case 7972:
        icon = 'icon-box-add';
        break;
      default:
        break;
      }

      return icon;
    };

    /**
     * @ngdoc function
     * @name allAmenitiesArray
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities Array with amenities categories, each
     *  category with it's own amenities property which is an array of
     *  amenities under that category.
     * @returns {array} An array with all the amenities plucked from every
     *  category at a single top level, without any categories involved.
     * @description
     * Deprecated. Creates an flat array of all the amenities from a nested
     * array of amenity categories.
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

    /**
     * @ngdoc function
     * @name getAmenityCategories
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities An array with amenity objects.
     * @returns {array} Returns an array created with objects extracted from
     *  every amenity's category property.
     * @description
     * Used to get the categories from the flat array of amenity objects.
     */
    amenities.getAmenityCategories = function (amenities) {
      if (!amenities) {
        return;
      }

      return _.chain(amenities)
              .pluck('category')
              .flatten(true)
              .unique()
              .value();
    };

    /**
     * @ngdoc function
     * @name createAmenitiesCategories
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities ...
     * @returns {array} Returns ...
     * @description
     * ...
     */
    amenities.createAmenitiesCategories = function (amenities) {
      var default_order = ['Computer Services', 'Circulation',
          'Printing and Copy Services', 'Facilities', 'Assistive Technologies'],
        categoryNames,
        categories = [],
        categoryObj,
        self = this;

      if (!amenities) {
        return;
      }

      categoryNames = this.getAmenityCategories(amenities);

      _.each(categoryNames, function (category) {
        categoryObj = {};
        categoryObj.amenities = _.where(amenities, {'category': category});
        categoryObj.name = category;
        categoryObj.icon = self.getCategoryIcon(category);

        if (categoryObj.amenities.length) {
          categories[_.indexOf(default_order, category)] = categoryObj;
        }
      });

      return categories;
    };

    /**
     * @ngdoc function
     * @name getHighlightedAmenities
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities Array with amenities categories, each category
     *  with it's own amenities property which is an array of amenities
     *  under that category.
     * @param {number} rank How many institution ranked amenities should be
     *  returned in the beginning of the array.
     * @param {number} loc_rank How many location ranked amenities should be
     *  returned at the end of the array.
     * @returns {array} An array containing a specific number of institution
     *  and location ranked amenities, with institution amenities listed first.
     * @description
     * ...
     * @example
     * <pre>
     *  // Get three institution and two location ranked amenities.
     *  var highlightedAmenities =
     *    nyplAmenities
     *      .getHighlightedAmenities(location._embedded.amenities, 3, 2);
     * </pre>
     */
    amenities.getHighlightedAmenities = function (amenities, rank, loc_rank) {
      var initial_list = amenities,
        amenities_list = [];

      if (!(amenities && amenities.length && rank && loc_rank)) {
        return;
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

    /**
     * @ngdoc function
     * @name getAmenityConfig
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {object} config Config object from Sinatra.
     * @param {number} globalDefault How many institution wide amenities.
     * @param {number} localDefault How many local amenities to show.
     * @returns {object} Object with how many global and local amenities to
     * display.
     * @description
     * ...
     */
    amenities.getAmenityConfig =
      function (config, globalDefault, localDefault) {
        var obj = {},
          global = globalDefault || 3,
          local  = localDefault || 2;

        if (config && config.featured_amenities) {
          obj.global = config.featured_amenities.global || global;
          obj.local  = config.featured_amenities.local || local;
        } else {
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

