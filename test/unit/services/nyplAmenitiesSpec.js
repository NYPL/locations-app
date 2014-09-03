/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Amenities Service Tests', function () {
  'use strict';

  /*
   * nyplAmenities
   *   AngularJS service that adds icon class names to amenities.
   */
  describe('nyplAmenities', function () {
    var nyplAmenities;

    beforeEach(function () {
      module('nypl_locations');
      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nyplAmenities_) {
        nyplAmenities = _nyplAmenities_;
      });
    });

    /*
     * nyplAmenities.addIcon(amenities, default_icon)
     *   amenities: Array of amenities objects
     *   default_icon: The CSS class name of what the default icon should be.
     *
     *   Returns the array of amenities object with each amenity now having
     *   an icon property set. There are cases that need specific icons but
     *   the rest use amenity category icons.
     */
    describe('nyplAmenities.addIcon()', function () {
      it('should add icon class names to every amenity', function () {
        var amenities = [
            { 'id': 4, 'name': 'Computers for Public Use' },
            { 'id': 8000, 'name': 'Wireless Internet Access' },
            { 'id': 7980, 'name': 'Laptops for Public Use' },
            { 'id': 7987, 'name': 'Printing (From PC)' },
            { 'id': 7978, 'name': 'Electrical Outlets Available' },
            { 'id': 39, 'name': 'Book Drop Box (24 Hour)' },
            { 'id': 7967, 'name': 'Book Drop Box (Limited Hours)' }
          ];

        expect(nyplAmenities.addIcon(amenities))
          .toEqual([
            { 'id': 4, 'name': 'Computers for Public Use', 'icon': '' },
            { 'id': 8000, 'name': 'Wireless Internet Access',
              'icon': 'icon-connection' },
            { 'id': 7980, 'name': 'Laptops for Public Use',
              'icon': 'icon-laptop' },
            { 'id': 7987, 'name': 'Printing (From PC)', 'icon': 'icon-print' },
            { 'id': 7978, 'name': 'Electrical Outlets Available',
              'icon': 'icon-power-cord' },
            { 'id': 39, 'name': 'Book Drop Box (24 Hour)',
              'icon': 'icon-box-add' },
            { 'id': 7967, 'name': 'Book Drop Box (Limited Hours)',
              'icon': 'icon-box-add' }
          ]);
      });

      it('should give all amenities a default icon class', function () {
        var amenities = [
            { 'id': 4, 'name': 'Computers for Public Use' },
            { 'id': 8000, 'name': 'Wireless Internet Access' },
            { 'id': 7980, 'name': 'Laptops for Public Use' },
            { 'id': 234, 'name': 'Inter-Library Loan' }
          ];

        expect(nyplAmenities.addIcon(amenities, 'icon-class-test'))
          .toEqual([
            { 'id': 4, 'name': 'Computers for Public Use',
              'icon': 'icon-class-test' },
            { 'id': 8000, 'name': 'Wireless Internet Access',
              'icon': 'icon-connection' },
            { 'id': 7980, 'name': 'Laptops for Public Use',
              'icon': 'icon-laptop' },
            { 'id': 234, 'name': 'Inter-Library Loan',
              'icon': 'icon-class-test' }
          ]);
      });
    });

    /*
     * nyplAmenities.addCategoryIcon(amenities)
     *   amenities: Array of amenity categories, with each category containing
     *   an array of amenities objects.
     *
     *   Returns the same array but now every amenity category has an icon
     *   class name and every amenity in the category has its own icon.
     */
    describe('nyplAmenities.addCategoryIcon()', function () {
      it('should add icon class names to every amenity category and to ' +
        'every amenity in each category',
        function () {
          var amenitiesCategories = [
              {
                'name': 'Computer Services',
                'weight': 0,
                'amenities': [
                  { 'id': 4, 'name': 'Computers for Public Use' },
                  { 'id': 8000, 'name': 'Wireless Internet Access' }
                ]
              },
              {
                'name': 'Circulation',
                'weight': 1,
                'amenities': [
                  { 'id': 234, 'name': 'Inter-Library Loan' },
                  { 'id': 1234, 'name': 'Self-service check-out' }
                ]
              },
              {
                'name': 'Office Services',
                'weight': 1,
                'amenities': [
                  { 'id': 234, 'name': 'Photocopiers (black/white)' },
                  { 'id': 1234, 'name': 'Photocopiers (color)' }
                ]
              }
            ];

          expect(nyplAmenities.addCategoryIcon(amenitiesCategories))
            .toEqual([
              {
                'name': 'Computer Services',
                'weight': 0,
                'icon': 'icon-screen2',
                'amenities': [
                  { 'id': 4, 'name': 'Computers for Public Use',
                    'icon': 'icon-screen2' },
                  { 'id': 8000, 'name': 'Wireless Internet Access',
                    'icon': 'icon-connection' }
                ]
              },
              {
                'name': 'Circulation',
                'weight': 1,
                'icon': 'icon-book',
                'amenities': [
                  { 'id': 234, 'name': 'Inter-Library Loan',
                    'icon': 'icon-book' },
                  { 'id': 1234, 'name': 'Self-service check-out',
                    'icon': 'icon-book' }
                ]
              },
              {
                'name': 'Office Services',
                'weight': 1,
                'icon': 'icon-copy',
                'amenities': [
                  { 'id': 234, 'name': 'Photocopiers (black/white)',
                    'icon': 'icon-copy' },
                  { 'id': 1234, 'name': 'Photocopiers (color)',
                    'icon': 'icon-copy' }
                ]
              }
            ]);
        });

    });
  }); /* End nyplAmenities */
});
