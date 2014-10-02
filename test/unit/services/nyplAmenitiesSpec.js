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
     * nyplAmenities.addAmenitiesIcon(amenity)
     */
    describe('nyplAmenities.addAmenitiesIcon()', function () {
      it('should be defined', function () {
        expect(nyplAmenities.addAmenitiesIcon).toBeDefined();
      });

      it('should return undefined if no amenity was passed', function () {
        expect(nyplAmenities.addAmenitiesIcon()).not.toBeDefined();
      });

      it('should return undefined if no amenity with category was passed',
        function () {
          var amenity = { 'id': 7950, 'name': 'Computers for Public Use' };
          expect(nyplAmenities.addAmenitiesIcon(amenity)).not.toBeDefined();
        });

      it('should add the correct icon class name to the amenity', function () {
        var amenity = { 'id': 7950, 'name': 'Computers for Public Use', 'category': 'Computer Services' };

        expect(nyplAmenities.addAmenitiesIcon(amenity)).toEqual({
          'id': 7950, 'name': 'Computers for Public Use', 'category': 'Computer Services',
          'icon': 'icon-screen2'
        });
      });

      it('should give the amenity a default category icon class', function () {
        var amenity = { 'id': 7950, 'name': 'Computers for Public Use', 'category': 'Computer Services' };

        expect(nyplAmenities.addAmenitiesIcon(amenity)).toEqual({
          'id': 7950, 'name': 'Computers for Public Use', 'category': 'Computer Services',
          'icon': 'icon-screen2'
        });
      });
    }); /* End nyplAmenities.addAmenitiesIcon() */

    /*
     * nyplAmenities.getCategoryIcon(category, default_icon)
     */
    describe('nyplAmenities.getCategoryIcon()', function () {
      it('should be defined', function () {
        expect(nyplAmenities.getCategoryIcon).toBeDefined();
      });

      it('should add icon class names to every amenity category and to ' +
        'every amenity in each category',
        function () {
          var amenities = [
              { 'id': 7950, 'name': 'Computers for Public Use', 'category': 'Computer Services' },
              { 'id': 7967, 'name': 'Wireless Internet Access', 'category': 'Computer Services' },
              { 'id': 234, 'name': 'Inter-Library Loan', 'category': 'Circulation' },
              { 'id': 1234, 'name': 'Self-service check-out', 'category': 'Circulation' },
              { 'id': 234, 'name': 'Photocopiers (black/white)', 'category': 'Office Services' },
              { 'id': 1234, 'name': 'Photocopiers (color)', 'category': 'Office Services' },
              { 'id': 7980, 'name': 'Public Restrooms', 'category': 'Facilities' },
              {'id': 7990, 'name': 'Screen Magnification software (MAGic)', 'category': 'Assistive Technologies'},
              {'id': 1234, 'name': 'Screen Reading software (JAWS)', 'category': 'Assistive Technologies'}
            ];

          expect(nyplAmenities.getCategoryIcon(amenities[0].category))
            .toEqual('icon-screen2');

          expect(nyplAmenities.getCategoryIcon(amenities[4].category))
            .toEqual('icon-copy');

          expect(nyplAmenities.getCategoryIcon(amenities[7].category))
            .toEqual('icon-accessibility2');
        });
    }); /* End nyplAmenities.getCategoryIcon() */

    /*
     * nyplAmenities.getAmenityIcon(id, default_icon)
     */
    describe('nyplAmenities.getAmenityIcon()', function () {
      it('should be defined', function () {
        expect(nyplAmenities.getAmenityIcon).toBeDefined();
      });

      it('should add special icon class names to the amenity', function () {
          var amenities = [
              { 'id': 7952, 'name': 'Wireless Internet Access', 'category': 'Computer Services' },
              { 'id': 7965, 'name': 'Laptops for Public Use', 'category': 'Computer Services' },
              { 'id': 7955, 'name': 'Electrical outlets available', 'category': '' },
              { 'id': 7954, 'name': 'Printing (From PC)', 'category': '' },
              { 'id': 7958, 'name': 'Book Drop Box (24 Hour)', 'category': '' }
            ];

          expect(nyplAmenities.getAmenityIcon(amenities[0].id))
            .toEqual('icon-connection');

          expect(nyplAmenities.getAmenityIcon(amenities[2].id))
            .toEqual('icon-power-cord');

          expect(nyplAmenities.getAmenityIcon(amenities[4].id))
            .toEqual('icon-box-add');
        });

      it('should add a default class to the amenity', function () {

      });
    }); /* End nyplAmenities.getAmenityIcon() */

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
          var amenities = [
              {
                location_rank: 2,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7950, 'name': 'Computers for Public Use',
                  'category': 'Computer Services',
                  'rank': 1
                }
              },
              {
                location_rank: 3,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7967, 'name': 'Wireless Internet Access',
                  'category': 'Computer Services', 'rank': 1
                }
              },
              {
                location_rank: 4,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7966, 'name': 'Printing (From PC)',
                  'category': 'Computer Services', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 234, 'name': 'Inter-Library Loan',
                  'category': 'Circulation', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 1234, 'name': 'Self-service check-out',
                  'category': 'Circulation', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7972, 'name': 'Book Drop Box (24 Hour)',
                  'category': 'Circulation', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 234, 'name': 'Photocopiers (black/white)',
                  'category': 'Office Services', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7971, 'name': 'Bicycle Rack',
                  'category': 'Facilities', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7976, 'name': 'Screen Magnification ' +
                    'software (MAGic)',
                  'category': 'Assitive Technologies', 'rank': 1
                }
              }
            ],
            amenities_list =
              nyplAmenities.allAmenitiesArray(amenities);

          expect(amenities_list.length).toBe(9);
          expect(amenities_list).toEqual([
            { 'id': 7950, 'name': 'Computers for Public Use',
              'category': 'Computer Services', 'rank': 1 },
            { 'id': 7967, 'name': 'Wireless Internet Access',
              'category': 'Computer Services', 'rank': 1 },
            { 'id': 7966, 'name': 'Printing (From PC)',
              'category': 'Computer Services', 'rank': 1 },
            { 'id': 234, 'name': 'Inter-Library Loan',
              'category': 'Circulation', 'rank': 1 },
            { 'id': 1234, 'name': 'Self-service check-out',
              'category': 'Circulation', 'rank': 1 },
            { 'id': 7972, 'name': 'Book Drop Box (24 Hour)',
              'category': 'Circulation', 'rank': 1 },
            { 'id': 234, 'name': 'Photocopiers (black/white)',
              'category': 'Office Services', 'rank': 1 },
            { 'id': 7971, 'name': 'Bicycle Rack',
              'category': 'Facilities', 'rank': 1 },
            { 'id': 7976, 'name': 'Screen Magnification software (MAGic)',
              'category': 'Assitive Technologies', 'rank': 1}
          ]);
        });

      it('should return an array of all amenities, different input',
        function () {
          var amenities = [
              {
                location_rank: 2,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7950, 'name': 'Computers for Public Use',
                  'category': 'Computer Services',
                  'rank': 1
                }
              },
              {
                location_rank: 3,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7967, 'name': 'Wireless Internet Access',
                  'category': 'Computer Services', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 234, 'name': 'Inter-Library Loan',
                  'category': 'Circulation', 'rank': 1
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 234, 'name': 'Photocopiers (black/white)',
                  'category': 'Office Services', 'rank': 1
                }
              },
            ],
            amenities_list =
              nyplAmenities.allAmenitiesArray(amenities);

          expect(amenities_list.length).toBe(4);
          expect(amenities_list).toEqual([
            { 'id': 7950, 'name': 'Computers for Public Use',
              'category': 'Computer Services', 'rank': 1 },
            { 'id': 7967, 'name': 'Wireless Internet Access',
              'category': 'Computer Services', 'rank': 1 },
            { 'id': 234, 'name': 'Inter-Library Loan',
              'category': 'Circulation', 'rank': 1 },
            { 'id': 234, 'name': 'Photocopiers (black/white)',
              'category': 'Office Services', 'rank': 1 }
          ]);
        });
    }); /* End nyplAmenities.allAmenitiesArray() */

    describe('nyplAmenities.createAmenitiesCategories()', function () {

    }); /* End nyplAmenities.createAmenitiesCategories() */

    /*
     * nyplAmenities.getHighlightedAmenities(amenities, rank, loc_rank)
     *  amenities is an array of amenity categories, with each category
     *  containing an 'amenities' array of individual amenities objects.
     *
     *  Returns a flatten array with 'rank' number of institution ranked
     *  amenities and 'loc_rank' number of locally ranked amenities.
     */
    describe('nyplAmenities.getHighlightedAmenities()', function () {
      var amenities = [
        {
          location_rank: 2,
          accessibility_note: null,
          accessible: true,
          staff_assistance: null,
          amenity: {
            'id': 7950, 'name': 'Computers for Public Use',
            'category': 'Computer Services',
            'rank': 1
          }
        },
        {
          location_rank: 3,
          accessibility_note: null,
          accessible: true,
          staff_assistance: null,
          amenity: {
            'id': 7967, 'name': 'Wireless Internet Access',
            'category': 'Computer Services', 'rank': 2
          }
        },
        {
          location_rank: 4,
          accessibility_note: null,
          accessible: true,
          staff_assistance: null,
          amenity: {
            'id': 234, 'name': 'Inter-Library Loan',
            'category': 'Circulation', 'rank': 3
          }
        },
        {
          location_rank: 5,
          accessibility_note: null,
          accessible: true,
          staff_assistance: null,
          amenity: {
            'id': 234, 'name': 'Photocopiers (black/white)',
            'category': 'Office Services', 'rank': 4
          }
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
              {
                location_rank: 2,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7950, 'name': 'Computers for Public Use',
                  'category': 'Computer Services',
                  'rank': 1
                }
              },
              {
                location_rank: 3,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7967, 'name': 'Wireless Internet Access',
                  'category': 'Computer Services', 'rank': 2
                }
              }
            ]);
          });

        it('should return 3 institution ranked amenities and 2 locally ranked' +
          'amenities',
          function () {
            var highlightedAmenities =
              nyplAmenities.getHighlightedAmenities(amenities, 3, 1);

            expect(highlightedAmenities).toEqual([
              {
                location_rank: 2,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7950, 'name': 'Computers for Public Use',
                  'category': 'Computer Services',
                  'rank': 1
                }
              },
              {
                location_rank: 3,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 7967, 'name': 'Wireless Internet Access',
                  'category': 'Computer Services', 'rank': 2
                }
              },
              {
                location_rank: 4,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 234, 'name': 'Inter-Library Loan',
                  'category': 'Circulation', 'rank': 3
                }
              },
              {
                location_rank: 5,
                accessibility_note: null,
                accessible: true,
                staff_assistance: null,
                amenity: {
                  'id': 234, 'name': 'Photocopiers (black/white)',
                  'category': 'Office Services', 'rank': 4
                }
              }
            ]);
          });

      });

    }); /* End nyplAmenities.getHighlightedAmenities() */

    describe('nyplAmenities.getAmenityConfig()', function () {

    }); /* End nyplAmenities.getAmenityConfig() */

  }); /* End nyplAmenities */
});
