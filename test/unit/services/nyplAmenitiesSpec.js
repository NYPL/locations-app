/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Amenities Service Tests', function () {
  'use strict';

  /*
   * nyplAmenities
   *   AngularJS service that adds icon class names to amenities.
   */
  describe('Service: nyplAmenities', function () {
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
      it('should be defined', function () {
        expect(nyplAmenities.addIcon).toBeDefined();
      });

      it('should add icon class names to every amenity', function () {
        var amenities = [
            { 'id': 7950, 'name': 'Computers for Public Use' },
            { 'id': 7967, 'name': 'Wireless Internet Access' },
            { 'id': 7965, 'name': 'Laptops for Public Use' },
            { 'id': 7966, 'name': 'Printing (From PC)' },
            { 'id': 7968, 'name': 'Electrical Outlets Available' },
            { 'id': 7972, 'name': 'Book Drop Box (24 Hour)' },
            { 'id': 7971, 'name': 'Book Drop Box (Limited Hours)' }
          ];

        expect(nyplAmenities.addIcon(amenities))
          .toEqual([
            { 'id': 7950, 'name': 'Computers for Public Use', 'icon': '' },
            { 'id': 7967, 'name': 'Wireless Internet Access',
              'icon': 'icon-connection' },
            { 'id': 7965, 'name': 'Laptops for Public Use',
              'icon': 'icon-laptop' },
            { 'id': 7966, 'name': 'Printing (From PC)', 'icon': 'icon-print' },
            { 'id': 7968, 'name': 'Electrical Outlets Available',
              'icon': 'icon-power-cord' },
            { 'id': 7972, 'name': 'Book Drop Box (24 Hour)',
              'icon': 'icon-box-add' },
            { 'id': 7971, 'name': 'Book Drop Box (Limited Hours)',
              'icon': 'icon-box-add' }
          ]);
      });

      it('should give all amenities a default icon class', function () {
        var amenities = [
            { 'id': 7950, 'name': 'Computers for Public Use' },
            { 'id': 7967, 'name': 'Wireless Internet Access' },
            { 'id': 7965, 'name': 'Laptops for Public Use' },
            { 'id': 234, 'name': 'Inter-Library Loan' }
          ];

        expect(nyplAmenities.addIcon(amenities, 'icon-class-test'))
          .toEqual([
            { 'id': 7950, 'name': 'Computers for Public Use',
              'icon': 'icon-class-test' },
            { 'id': 7967, 'name': 'Wireless Internet Access',
              'icon': 'icon-connection' },
            { 'id': 7965, 'name': 'Laptops for Public Use',
              'icon': 'icon-laptop' },
            { 'id': 234, 'name': 'Inter-Library Loan',
              'icon': 'icon-class-test' }
          ]);
      });
    }); /* End nyplAmenities.addIcon() */

    /*
     * nyplAmenities.addCategoryIcon(amenities)
     *   amenities: Array of amenity categories, with each category containing
     *   an array of amenities objects.
     *
     *   Returns the same array but now every amenity category has an icon
     *   class name and every amenity in the category has its own icon.
     */
    describe('nyplAmenities.addCategoryIcon()', function () {
      it('should be defined', function () {
        expect(nyplAmenities.addCategoryIcon).toBeDefined();
      });

      it('should add icon class names to every amenity category and to ' +
        'every amenity in each category',
        function () {
          var amenitiesCategories = [
              {
                'name': 'Computer Services',
                'weight': 0,
                'amenities': [
                  { 'id': 7950, 'name': 'Computers for Public Use' },
                  { 'id': 7967, 'name': 'Wireless Internet Access' }
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
              },
              {
                'name': 'Facilities',
                'weight': 1,
                'amenities': [
                  { 'id': 7980, 'name': 'Public Restrooms' }
                ]
              },
              {
                'name': 'Assistive Technologies',
                'weight': 1,
                'amenities': [
                  {'id': 7990, 'name': 'Screen Magnification software (MAGic)'},
                  {'id': 1234, 'name': 'Screen Reading software (JAWS)'}
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
                  { 'id': 7950, 'name': 'Computers for Public Use',
                    'icon': 'icon-screen2' },
                  { 'id': 7967, 'name': 'Wireless Internet Access',
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
              },
              {
                'name': 'Facilities',
                'weight': 1,
                'icon': 'icon-library',
                'amenities': [
                  { 'id': 7980, 'name': 'Public Restrooms',
                    'icon': 'icon-library'}
                ]
              },
              {
                'name': 'Assistive Technologies',
                'weight': 1,
                'icon': 'icon-accessibility2',
                'amenities': [
                  {'id': 7990, 'name': 'Screen Magnification software (MAGic)',
                    'icon': 'icon-accessibility2'},
                  {'id': 1234, 'name': 'Screen Reading software (JAWS)',
                    'icon': 'icon-accessibility2'}
                ]
              }
            ]);
        });
    }); /* End nyplAmenities.addCategoryIcon() */

    /*
     * nyplAmenities.allAmenitiesArray(amenities)
     *  amenities is an array of amenity categories, with each category
     *  containing an 'amenities' array of individual amenities objects.
     *
     *  Returns a flatten array of all the subarrays in the categories.
     */
    describe('nyplAmenities.allAmenitiesArray()', function () {
      it('should be defined', function () {
        expect(nyplAmenities.allAmenitiesArray).toBeDefined();
      });

      it('should return undefined if no input was passed', function () {
        expect(nyplAmenities.allAmenitiesArray()).not.toBeDefined();
      });

      it('should return an array of all the amenities from each ' +
        'amenity category',
        function () {
          var amenitiesCategories = [
              {
                'name': 'Computer Services',
                'weight': 0,
                'amenities': [
                  { 'id': 7950, 'name': 'Computers for Public Use' },
                  { 'id': 7967, 'name': 'Wireless Internet Access' },
                  { 'id': 7966, 'name': 'Printing (From PC)' }
                ]
              },
              {
                'name': 'Circulation',
                'weight': 1,
                'amenities': [
                  { 'id': 234, 'name': 'Inter-Library Loan' },
                  { 'id': 1234, 'name': 'Self-service check-out' },
                  { 'id': 7972, 'name': 'Book Drop Box (24 Hour)' }
                ]
              },
              {
                'name': 'Office Services',
                'weight': 1,
                'amenities': [
                  { 'id': 234, 'name': 'Photocopiers (black/white)' },
                  { 'id': 1234, 'name': 'Photocopiers (color)' }
                ]
              },
              {
                'name': 'Facilities',
                'weight': 2,
                'amenities': [
                  { 'id': 7971, 'name': 'Bicycle Rack' }
                ]
              },
              {
                'name': 'Assitive Technologies',
                'weight': 3,
                'amenities': [
                  { 'id': 7976, 'name': 'Screen Magnification ' +
                    'software (MAGic)' }
                ]
              }
            ],
            amenities_list =
              nyplAmenities.allAmenitiesArray(amenitiesCategories);

          expect(amenities_list.length).toBe(10);
          expect(amenities_list).toEqual([
            { 'id': 7950, 'name': 'Computers for Public Use' },
            { 'id': 7967, 'name': 'Wireless Internet Access' },
            { 'id': 7966, 'name': 'Printing (From PC)' },
            { 'id': 234, 'name': 'Inter-Library Loan' },
            { 'id': 1234, 'name': 'Self-service check-out' },
            { 'id': 7972, 'name': 'Book Drop Box (24 Hour)' },
            { 'id': 234, 'name': 'Photocopiers (black/white)' },
            { 'id': 1234, 'name': 'Photocopiers (color)' },
            { 'id': 7971, 'name': 'Bicycle Rack' },
            { 'id': 7976, 'name': 'Screen Magnification software (MAGic)' }
          ]);
        });

      it('should return an array of all amenities, different input',
        function () {
          var amenitiesCategories = [
              {
                'name': 'Computer Services',
                'weight': 0,
                'amenities': [
                  { 'id': 7950, 'name': 'Computers for Public Use' },
                  { 'id': 7967, 'name': 'Wireless Internet Access' }
                ]
              },
              {
                'name': 'Circulation',
                'weight': 1,
                'amenities': [
                  { 'id': 234, 'name': 'Inter-Library Loan' }
                ]
              },
              {
                'name': 'Office Services',
                'weight': 1,
                'amenities': [
                  { 'id': 234, 'name': 'Photocopiers (black/white)' }
                ]
              }
            ],
            amenities_list =
              nyplAmenities.allAmenitiesArray(amenitiesCategories);

          expect(amenities_list.length).toBe(4);
          expect(amenities_list).toEqual([
            { 'id': 7950, 'name': 'Computers for Public Use' },
            { 'id': 7967, 'name': 'Wireless Internet Access' },
            { 'id': 234, 'name': 'Inter-Library Loan' },
            { 'id': 234, 'name': 'Photocopiers (black/white)' }
          ]);
        });
    }); /* End nyplAmenities.allAmenitiesArray() */

    /*
     * nyplAmenities.getHighlightedAmenities(amenities, rank, loc_rank)
     *  amenities is an array of amenity categories, with each category
     *  containing an 'amenities' array of individual amenities objects.
     *
     *  Returns a flatten array with 'rank' number of institution ranked
     *  amenities and 'loc_rank' number of locally ranked amenities.
     */
    describe('nyplAmenities.getHighlightedAmenities()', function () {
      // At the moment of writing this, 9/4, this is amenities data from mml:
      var amenities = [
        {
          'name': 'Computer Services',
          'weight': 0,
          'amenities': [
            { 'id': 7950, 'name': 'Computers for Public Use',
              'rank': 1, 'location_rank': 1 },
            { 'id': 7965, 'name': 'Laptops for Public Use',
              'rank': 2, 'location_rank': 5 },
            { 'id': 7966, 'name': 'Printing (From PC)',
              'rank': 3, 'location_rank': 6 },
            { 'id': 7967, 'name': 'Wireless Internet Access',
              'rank': 4, 'location_rank': 7 },
            { 'id': 7968, 'name': 'Electrical outlets available',
              'rank': 5, 'location_rank': 8 }
          ]
        },
        {
          'name': 'Circulation',
          'weight': 1,
          'amenities': [
            { 'id': 7972, 'name': 'Book Drop Box (24 Hour)',
              'rank': 8, 'location_rank': 2 },
            { 'id': 7957, 'name': 'Self-service check-out',
              'rank': 7, 'location_rank': 9 },
            { 'id': 7956, 'name': 'Inter-Library Loan',
              'rank': 6, 'location_rank': 13 }
          ]
        },
        {
          'name': 'Office Services',
          'weight': 1,
          'amenities': [
            { 'id': 234, 'name': 'Photocopiers (black/white)',
              'rank': 12, 'location_rank': 10 },
            { 'id': 7964, 'name': 'Map Photocopiers (up to 36" wide)',
              'rank': 15, 'location_rank': 11 },
            { 'id': 7965, 'name': 'Change machine',
              'rank': 16, 'location_rank': 12 }
          ]
        },
        {
          'name': 'Facilities',
          'weight': 2,
          'amenities': [
            { 'id': 7971, 'name': 'Bicycle Rack',
              'rank': 22, 'location_rank': 3 },
            { 'id': 7970, 'name': 'Lost and found',
              'rank': 21, 'location_rank': 4 },
            { 'id': 7975, 'name': 'Water fountain',
              'rank': 26, 'location_rank': 14 }
          ]
        },
        {
          'name': 'Assitive Technologies',
          'weight': 3,
          'amenities': [
            { 'id': 7976, 'name': 'Screen Magnification software (MAGic)',
              'rank': 27, 'location_rank': 15}
          ]
        }
      ];

      it('should be defined', function () {
        expect(nyplAmenities.getHighlightedAmenities).toBeDefined();
      });

      it('should return undefined if no input was passed', function () {
        expect(nyplAmenities.getHighlightedAmenities()).not.toBeDefined();
        expect(nyplAmenities.getHighlightedAmenities([])).not.toBeDefined();
        expect(nyplAmenities.getHighlightedAmenities([], 3)).not.toBeDefined();
      });

      // Gets the first x ranked amenities, then gets the first y locally ranked
      // amenities that were not already chosen.
      describe('returned highlighted amenities list', function () {
        it('should return 1 institution ranked amenity and 1 locally ranked ' +
          'amenity',
          function () {
            var highlightedAmenities =
              nyplAmenities.getHighlightedAmenities(amenities, 1, 1);

            expect(highlightedAmenities).toEqual([
              { 'id': 7950, 'name': 'Computers for Public Use',
                'rank': 1, 'location_rank': 1 },
              { 'id': 7972, 'name': 'Book Drop Box (24 Hour)',
                'rank': 8, 'location_rank': 2 }
            ]);
          });

        it('should return 3 institution ranked amenities and 2 locally ranked' +
          'amenities',
          function () {
            var highlightedAmenities =
              nyplAmenities.getHighlightedAmenities(amenities, 3, 2);

            expect(highlightedAmenities).toEqual([
              { 'id': 7950, 'name': 'Computers for Public Use',
                'rank': 1, 'location_rank': 1 },
              { 'id': 7965, 'name': 'Laptops for Public Use',
                'rank': 2, 'location_rank': 5 },
              { 'id': 7966, 'name': 'Printing (From PC)',
                'rank': 3, 'location_rank': 6 },
              { 'id': 7972, 'name': 'Book Drop Box (24 Hour)',
                'rank': 8, 'location_rank': 2 },
              { 'id': 7971, 'name': 'Bicycle Rack',
                'rank': 22, 'location_rank': 3 }
            ]);
          });

        it('should return 3 institution ranked amenities and 2 locally ranked' +
          'amenities',
          function () {
            var highlightedAmenities =
              nyplAmenities.getHighlightedAmenities(amenities, 3, 2);

            expect(highlightedAmenities).toEqual([
              { 'id': 7950, 'name': 'Computers for Public Use',
                'rank': 1, 'location_rank': 1 },
              { 'id': 7965, 'name': 'Laptops for Public Use',
                'rank': 2, 'location_rank': 5 },
              { 'id': 7966, 'name': 'Printing (From PC)',
                'rank': 3, 'location_rank': 6 },
              { 'id': 7972, 'name': 'Book Drop Box (24 Hour)',
                'rank': 8, 'location_rank': 2 },
              { 'id': 7971, 'name': 'Bicycle Rack',
                'rank': 22, 'location_rank': 3 }
            ]);
          });

        it('should return 4 institution ranked amenities and 1 locally ranked' +
          'amenities',
          function () {
            var highlightedAmenities =
              nyplAmenities.getHighlightedAmenities(amenities, 4, 1);

            expect(highlightedAmenities).toEqual([
              { 'id': 7950, 'name': 'Computers for Public Use',
                'rank': 1, 'location_rank': 1 },
              { 'id': 7965, 'name': 'Laptops for Public Use',
                'rank': 2, 'location_rank': 5 },
              { 'id': 7966, 'name': 'Printing (From PC)',
                'rank': 3, 'location_rank': 6 },
              { 'id': 7967, 'name': 'Wireless Internet Access',
                'rank': 4, 'location_rank': 7 },
              { 'id': 7972, 'name': 'Book Drop Box (24 Hour)',
                'rank': 8, 'location_rank': 2 }
            ]);
          });
      });

    }); /* End nyplAmenities.getHighlightedAmenities() */

  }); /* End nyplAmenities */
});
