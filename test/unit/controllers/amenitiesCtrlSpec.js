/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

var  mockAllAmenities = {
    amenities: [
      {
        name: "Computer Services",
        amenities: [
          {
            _id: 7950,
            _links: {
              self: {href: "amenities/7950"},
              info: {href: "help/computers-internet-and-wireless-access/reserving-computer"},
              action: {name: "Reserve a PC", href: "http://pcreserve.nypl.org/"}
            },
            accessibility_note: null,
            accessible: null,
            category: "Computer Services",
            id: 7950,
            name: "Computers for Public Use",
            rank: 1,
            staff_assistance: null
          },
          {
            _id: 7952,
            _links: {
              self: { href: "amenities/7952" },
              info: { href: "help/computers-internet-and-wireless-access/wireless-internet-access"},
              action: { name: null, href: null }
            },
            accessibility_note: null,
            accessible: null,
            category: "Computer Services",
            id: 7952,
            name: "Wireless Internet Access",
            rank: 2,
            staff_assistance: null
          }
        ]
      },
      {
        name: "Circulation",
        amenities: [
          {
            _id: 7957,
            _links: {
              self: { href: "amenities/7957" },
              info: { href: "help/borrowing-materials" },
              action: { name: null, href: null }
            },
            accessibility_note: null,
            accessible: null,
            category: "Circulation",
            id: 7957,
            name: "Self-service check-out",
            rank: 4,
            staff_assistance: null
          },
          {
            _id: 7951,
            _links: {
              self: { href: "amenities/7951" },
              info: { href: "help/borrowing-materials/book-drops" },
              action: { name: null, href: null }
            },
            accessibility_note: null,
            accessible: null,
            category: "Circulation",
            id: 7951,
            name: "Book drop box (24 hour)",
            rank: 3,
            staff_assistance: null
          }
        ]
      },
      {
        name: "Office Services",
        amenities: [
          {
            _id: 7961,
            _links: {
              self: { href: "amenities/7961" }
            },
            accessibility_note: null,
            accessible: null,
            category: "Office Services",
            id: 7961,
            name: "Photocopiers (black/white)",
            rank: 5,
            staff_assistance: null
          },
          {
            _id: 7962,
            _links: {
              self: { href: "amenities/7962" }
            },
            accessibility_note: null,
            accessible: null,
            category: "Office Services",
            id: 7962,
            name: "Photocopiers (color)",
            rank: 6,
            staff_assistance: null
          }
        ]
      },
      {
        name: "Facilities",
        amenities: [
          {
            _id: 7967,
            _links: {
              self: { href: "amenities/7967" }
            },
            accessibility_note: null,
            accessible: null,
            category: "Facilities",
            id: 7967,
            name: "Children's Only Restrooms",
            rank: 8,
            staff_assistance: null
          },
          {
            _id: 7971,
            _links: {
              self: { href: "amenities/7971" }
            },
            accessibility_note: null,
            accessible: null,
            category: "Facilities",
            id: 7971,
            name: "Bicycle Rack",
            rank: 10,
            staff_assistance: null
          }
        ]
      },
      {
        name: "Assistive Technologies",
        amenities: [
          {
            _id: 7976,
            _links: {
              self: { href: "amenities/7976" }
            },
            accessibility_note: null,
            accessible: null,
            category: "Assistive Technologies",
            id: 7976,
            name: "Screen magnification software (MAGic)",
            rank: null,
            staff_assistance: null
          },
          {
            _id: 7977,
            _links: {
              self: { href: "amenities/7977" }
            },
            accessibility_note: null,
            accessible: null,
            category: "Assistive Technologies",
            id: 7977,
            name: "Screen reading software (JAWS)",
            rank: null,
            staff_assistance: null
          }
        ]
      }
    ]
  },
  mockOneAmenity = {
    amenity: {
      _id: 7987,
      accessibility_note: null,
      accessible: true,
      category: "Facilities",
      id: 7987,
      location_rank: 5,
      name: "Payphones",
      rank: 5,
      staff_assistance: null
    },
    locations: [
      {
        _id: "GD",
        name: "Grand Concourse Library",
        slug: "grand-concourse"
      },
      {
        _id: "SASB",
        name: "Stephen A. Schwarzman Building",
        slug: "schwarzman"
      },
      {
        _id: "MML",
        name: "Mid-Manhattan Library",
        slug: "mid-manhattan-library"
      }
    ]
  },
  mockAmenitiesAtLibrary = {
    access: "Fully Accessible",
    id: "SASB",
    name: "Stephen A. Schwarzman Building",
    _embedded: {
      amenities: [
        {
          name: "Computer Services",
          amenities: [
            {
              _id: 7950,
              _links: {
                self: {href: "amenities/7950"},
                info: {href: "help/computers-internet-and-wireless-access/reserving-computer"},
                action: {name: "Reserve a PC", href: "http://pcreserve.nypl.org/"}
              },
              accessibility_note: null,
              accessible: null,
              category: "Computer Services",
              id: 7950,
              name: "Computers for Public Use",
              rank: 1,
              staff_assistance: null
            },
            {
              _id: 7952,
              _links: {
                self: { href: "amenities/7952" },
                info: { href: "help/computers-internet-and-wireless-access/wireless-internet-access"},
                action: { name: null, href: null }
              },
              accessibility_note: null,
              accessible: null,
              category: "Computer Services",
              id: 7952,
              name: "Wireless Internet Access",
              rank: 2,
              staff_assistance: null
            }
          ]
        },
        {
          name: "Office Services",
          amenities: [
            {
              _id: 7961,
              _links: {
                self: { href: "amenities/7961" }
              },
              accessibility_note: null,
              accessible: null,
              category: "Office Services",
              id: 7961,
              name: "Photocopiers (black/white)",
              rank: 5,
              staff_assistance: null
            },
            {
              _id: 7962,
              _links: {
                self: { href: "amenities/7962" }
              },
              accessibility_note: null,
              accessible: null,
              category: "Office Services",
              id: 7962,
              name: "Photocopiers (color)",
              rank: 6,
              staff_assistance: null
            }
          ]
        },
      ]
    }
  },
  config = {
    api_root: "http://locations-api-beta.nypl.org"
  };


describe('Amenities Controllers', function () {
  'use strict';

  var scope, AmenitiesCtrl, nyplAmenities, AmenityCtrl, AmenitiesAtLibraryCtrl;

  beforeEach(function () {
    module('nypl_locations');
  });

  describe('Controller: AmenitiesCtrl', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_, _nyplAmenities_) {
      scope = _$rootScope_.$new();
      nyplAmenities = _nyplAmenities_;
      AmenitiesCtrl = _$controller_('AmenitiesCtrl', {
        $scope: scope,
        amenities: mockAllAmenities,
        config: config
      });
    }));

    it('should have Amenities as the title', function () {
      expect(scope.title).toEqual('Amenities');
    });

    it('should get the mocked data with icons', function () {
      var allAmenitiesWithIcons = mockAllAmenities;
      allAmenitiesWithIcons =
        nyplAmenities.addCategoryIcon(allAmenitiesWithIcons);

      expect(scope.amenitiesCategories)
        .toEqual(allAmenitiesWithIcons.amenities);
    });
  });

  describe('Controller: AmenityCtrl', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_) {
      scope = _$rootScope_.$new();
      AmenityCtrl = _$controller_('AmenityCtrl', {
        $scope: scope,
        amenity: mockOneAmenity,
        config: config
      });
    }));

    it('should have the amenity name as the title', function () {
      expect(scope.title).toEqual('Payphones');
    });

    it('should display the amenity name on the page', function () {
      expect(scope.amenity_name).toEqual('Payphones')
    });

    it('should get the amenity object', function () {
      expect(scope.amenity).toEqual(mockOneAmenity.amenity);
    });

    it('should get all the locations where the amenity is available',
      function () {
        expect(scope.locations).toEqual(mockOneAmenity.locations);
      });
  });

  describe('Controller: AmenitiesAtLibraryCtrl', function () {
    beforeEach(inject(function (_$rootScope_, _$controller_, _nyplAmenities_) {
      scope = _$rootScope_.$new();
      nyplAmenities = _nyplAmenities_;
      AmenitiesAtLibraryCtrl = _$controller_('AmenitiesAtLibraryCtrl', {
        $scope: scope,
        config: config,
        location: mockAmenitiesAtLibrary
      });
    }));

    it('should have the location name as the title', function () {
      expect(scope.title).toEqual('Stephen A. Schwarzman Building');
    });

    it('should get the location object in the scope', function () {
      expect(scope.location).toEqual(mockAmenitiesAtLibrary);
    });

    it('should add icons to the amenities', function () {
      var amenitiesWithIcons = mockAmenitiesAtLibrary;
      amenitiesWithIcons = 
        nyplAmenities.addCategoryIcon(amenitiesWithIcons._embedded.amenities);

      expect(scope.amenitiesCategories).toEqual(amenitiesWithIcons);
    });
  });

});

