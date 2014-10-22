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
              { 'id': 234, 'name': 'Photocopiers (black/white)', 'category': 'Printing and Copy Services' },
              { 'id': 1234, 'name': 'Photocopiers (color)', 'category': 'Printing and Copy Services' },
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
              { 'id': 7967, 'name': 'Wireless Internet Access', 'category': 'Computer Services' },
              { 'id': 7965, 'name': 'Laptops for Public Use', 'category': 'Computer Services' },
              { 'id': 7968, 'name': 'Electrical outlets available', 'category': '' },
              { 'id': 7966, 'name': 'Printing (From PC)', 'category': '' },
              { 'id': 7971, 'name': 'Book Drop Box (24 Hour)', 'category': '' }
            ];

          expect(nyplAmenities.getAmenityIcon(amenities[0].id))
            .toEqual('icon-connection');

          expect(nyplAmenities.getAmenityIcon(amenities[1].id))
            .toEqual('icon-laptop');

          expect(nyplAmenities.getAmenityIcon(amenities[2].id))
            .toEqual('icon-power-cord');

          expect(nyplAmenities.getAmenityIcon(amenities[3].id))
            .toEqual('icon-print');

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
                  'category': 'Printing and Copy Services', 'rank': 1
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
              'category': 'Printing and Copy Services', 'rank': 1 },
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
                  'category': 'Printing and Copy Services', 'rank': 1
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
              'category': 'Printing and Copy Services', 'rank': 1 }
          ]);
        });
    }); /* End nyplAmenities.allAmenitiesArray() */


    describe('nyplAmenities.getAmenityCategories()', function () {
      var amenities = [
        { 'id': 7950, 'name': 'Computers for Public Use', 'category': 'Computer Services' },
        { 'id': 7967, 'name': 'Wireless Internet Access', 'category': 'Computer Services' },
        { 'id': 234, 'name': 'Inter-Library Loan', 'category': 'Circulation' },
        { 'id': 1234, 'name': 'Self-service check-out', 'category': 'Circulation' },
        { 'id': 234, 'name': 'Photocopiers (black/white)', 'category': 'Printing and Copy Services' },
        { 'id': 1234, 'name': 'Photocopiers (color)', 'category': 'Printing and Copy Services' },
        { 'id': 7980, 'name': 'Public Restrooms', 'category': 'Facilities' },
        {'id': 7990, 'name': 'Screen Magnification software (MAGic)', 'category': 'Assistive Technologies'},
        {'id': 1234, 'name': 'Screen Reading software (JAWS)', 'category': 'Assistive Technologies'}
      ];

      it('should return undefined if no input was given', function () {
        expect(nyplAmenities.getAmenityCategories()).not.toBeDefined();
      });

      it('should return an array of categories from each amenity "category" ' +
        'property',
        function () {
          expect(nyplAmenities.getAmenityCategories(amenities))
            .toEqual(['Computer Services', 'Circulation',
              'Printing and Copy Services', 'Facilities', 'Assistive Technologies']);
        });
    }); /* End nyplAmenities.getAmenityCategories() */

    describe('nyplAmenities.createAmenitiesCategories()', function () {
      var amenities = [
        { 'id': 7950, 'name': 'Computers for Public Use', 'category': 'Computer Services' },
        { 'id': 7967, 'name': 'Wireless Internet Access', 'category': 'Computer Services' },
        { 'id': 234, 'name': 'Inter-Library Loan', 'category': 'Circulation' },
        { 'id': 1234, 'name': 'Self-service check-out', 'category': 'Circulation' },
        { 'id': 234, 'name': 'Photocopiers (black/white)', 'category': 'Printing and Copy Services' },
        { 'id': 1234, 'name': 'Photocopiers (color)', 'category': 'Printing and Copy Services' },
        { 'id': 7980, 'name': 'Public Restrooms', 'category': 'Facilities' },
        {'id': 7990, 'name': 'Screen Magnification software (MAGic)', 'category': 'Assistive Technologies'},
        {'id': 1234, 'name': 'Screen Reading software (JAWS)', 'category': 'Assistive Technologies'}
      ];

      it('should return undefined if no input was given', function () {
        expect(nyplAmenities.createAmenitiesCategories()).not.toBeDefined();
      });

      it('should generate an array of amenity categories', function () {
        expect(nyplAmenities.createAmenitiesCategories(amenities))
          .toEqual([
            {
              amenities: [
                {id : 7950, name : 'Computers for Public Use', category : 'Computer Services' },
                { id : 7967, name : 'Wireless Internet Access', category : 'Computer Services' }
              ],
              name: 'Computer Services',
              icon: 'icon-screen2'
            },
            {
              amenities: [
                { id : 234, name : 'Inter-Library Loan', category : 'Circulation' },
                { id : 1234, name : 'Self-service check-out', category : 'Circulation' }
              ],
              name: 'Circulation',
              icon : 'icon-book'
            },
            {
              amenities : [
                { id : 234, name : 'Photocopiers (black/white)', category : 'Printing and Copy Services' },
                { id : 1234, name : 'Photocopiers (color)', category : 'Printing and Copy Services' }
              ],
              name : 'Printing and Copy Services',
              icon : 'icon-copy'
            },
            {
              amenities : [ { id : 7980, name : 'Public Restrooms', category : 'Facilities' } ],
              name : 'Facilities',
              icon : 'icon-library'
            },
            {
              amenities : [
                { id : 7990, name : 'Screen Magnification software (MAGic)', category : 'Assistive Technologies' },
                { id : 1234, name : 'Screen Reading software (JAWS)', category : 'Assistive Technologies' }
              ],
              name : 'Assistive Technologies',
              icon : 'icon-accessibility2'
            }
          ]);
      });
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
            'category': 'Printing and Copy Services', 'rank': 4
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
                  'category': 'Printing and Copy Services', 'rank': 4
                }
              }
            ]);
          });

      });

    }); /* End nyplAmenities.getHighlightedAmenities() */

    describe('nyplAmenities.getAmenityConfig()', function () {
      var config = { featured_amenities: {} };

      it('should return the default values of 3 and 2 for global and local ' +
        'amenities respectively, when no input was given',
        function () {
          expect(nyplAmenities.getAmenityConfig())
            .toEqual({ global: 3, local: 2 });
        });

      it('should set the values from the config object', function () {
        config.featured_amenities.global = 4;
        config.featured_amenities.local = 3;

        expect(nyplAmenities.getAmenityConfig(config))
          .toEqual({ global: 4, local: 3 });
      });

      it('should override the defaults when values are given and no values ' +
        'are set in the config',
        function () {
          config.featured_amenities.global = undefined;
          config.featured_amenities.local = undefined;

          expect(nyplAmenities.getAmenityConfig(config, 5, 5))
            .toEqual({ global: 5, local: 5 });
        });

     it('should use the config defaults even if values are given', function () {
          config.featured_amenities.global = 3;
          config.featured_amenities.local = 2;

          expect(nyplAmenities.getAmenityConfig(config, 5, 5))
            .toEqual({ global: 3, local: 2 });
        });

      

    }); /* End nyplAmenities.getAmenityConfig() */

  }); /* End nyplAmenities */
});
