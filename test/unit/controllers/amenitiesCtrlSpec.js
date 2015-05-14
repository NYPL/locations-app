/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

var  mockAllAmenities = {
    amenities: [
      {
      "_links": {
      "self": {
      "href": "amenities/7995"
      }
      },
      "category": "Circulation",
      "id": 7995,
      "name": "Self-service check-out",
      "rank": null
      },
      {
      "_links": {
      "self": {
      "href": "amenities/7992"
      }
      },
      "category": "Office Services",
      "id": 7992,
      "name": "Scanners",
      "rank": null
      },
      {
      "_links": {
      "self": {
      "href": "amenities/7999"
      }
      },
      "category": "Facilities",
      "id": 7999,
      "name": "Water fountain",
      "rank": null
      },
      {
      "_links": {
      "self": {
      "href": "http://locations-api-alpha.herokuapp.com/amenities/7954"
      }
      },
      "category": "Computer Services",
      "id": 7954,
      "name": "Printing (from PC)",
      "rank": null
      },
      {
      "_links": {
      "self": {
      "href": "http://locations-api-alpha.herokuapp.com/amenities/7955"
      }
      },
      "category": "Computer Services",
      "id": 7955,
      "name": "Electric outlets available",
      "rank": null
      }
    ]
  },
  mockOneAmenity = {
    amenity: {
      _links: {
        self: {
          href: "http://locations-api-alpha.herokuapp.com/amenities/7950"
        },
        info: {
          href: null
        },
        action: {
          name: "Reserve a PC",
          href: null
        }
      },
      category: "Computer Services",
      id: 7950,
      name: "Computers for Public Use",
      rank: 1,
      _embedded: {
        locations: [
          {
            name: "Mariners Harbor Library",
            street_address: "206 South Ave",
            cross_street: "between Arlington Pl. and Brabant St.",
            locality: "Staten Island",
            region: "NY",
            access: "Fully Accessible",
            postal_code: 10303,
            type: "circulating",
            slug: "mariners-harbor"
          },
          {
            name: "Castle Hill Library",
            street_address: "947 Castle Hill Avenue",
            cross_street: "at Bruckner Blvd.",
            locality: "Bronx",
            region: "NY",
            access: "Fully Accessible",
            postal_code: 10473,
            type: "circulating",
            slug: "castle-hill"
          },
          {
            name: "Van Cortlandt Library",
            street_address: "3874 Sedgwick Avenue",
            cross_street: "south of Mosholu Parkway",
            locality: "Bronx",
            region: "NY",
            access: "Fully Accessible",
            postal_code: 10463,
            type: "circulating",
            slug: "van-cortlandt"
          }
        ]
      }
    }
  },
  mockAmenitiesAtLibrary = {
    access: "Fully Accessible",
    id: "SASB",
    name: "Stephen A. Schwarzman Building",
    _embedded: {
      amenities: [
        {
          location_rank: 1,
          accessibility_note: null,
          accessible: true,
          staff_assistance: null,
          amenity: {
          _links: {
          self: {
          href: "http://locations-api-alpha.herokuapp.com/amenities/7950"
          },
          info: {
          href: null
          },
          action: {
          name: "Reserve a PC",
          href: null
          }
          },
          category: "Computer Services",
          id: 7950,
          name: "Computers for Public Use",
          rank: 1
          }
          },
          {
          location_rank: 3,
          accessibility_note: null,
          accessible: true,
          staff_assistance: null,
          amenity: {
          _links: {
          self: {
          href: "http://locations-api-alpha.herokuapp.com/amenities/7954"
          }
          },
          category: "Computer Services",
          id: 7954,
          name: "Printing (from PC)",
          rank: 3
          }
          },
          {
          location_rank: 4,
          accessibility_note: null,
          accessible: true,
          staff_assistance: null,
          amenity: {
          _links: {
          self: {
          href: "http://locations-api-alpha.herokuapp.com/amenities/7952"
          },
          info: {
          href: null
          },
          action: {
          name: null,
          href: null
          }
          },
          category: "Computer Services",
          id: 7952,
          name: "Wireless Internet Access",
          rank: 2
          }
        }
      ]
    }
  },
  config = {
    api_root: "http://dev.refinery.aws.nypl.org/api/nypl/locations"
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
      var allAmenitiesWithIcons;

      allAmenitiesWithIcons =
        nyplAmenities.createAmenitiesCategories(mockAllAmenities.amenities);

      expect(scope.amenitiesCategories)
        .toEqual(allAmenitiesWithIcons);
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
      expect(scope.title).toEqual('Computers for Public Use');
    });

    it('should display the amenity name on the page', function () {
      expect(scope.amenity_name).toEqual('Computers for Public Use');
    });

    it('should get the amenity object', function () {
      expect(scope.amenity).toEqual(mockOneAmenity.amenity);
    });

    it('should get all the locations where the amenity is available',
      function () {
        expect(scope.locations)
          .toEqual(mockOneAmenity.amenity._embedded.locations);
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
      var updatedAmenities = nyplAmenities.
            allAmenitiesArray(mockAmenitiesAtLibrary._embedded.amenities),
        amenitiesCategories =
          nyplAmenities.createAmenitiesCategories(updatedAmenities);

      expect(scope.amenitiesCategories).toEqual(amenitiesCategories);
    });
  });

});

