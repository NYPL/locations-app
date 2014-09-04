/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

/* 
 * locationService is an NYPL AngularJS Module that calls the diffrent
 * endpoints from the API and returns a deferred object with data or an
 * error.
 */
describe('NYPL locationService Module', function () {
  'use strict';

  /*
   * nyplLocationsService is an Angularjs service that calls and returns 
   * data from different API endpoints.
   */
  describe('nyplLocationsService', function () {
    var error_message = 'Could not reach API',
      nyplLocationsService,
      httpBackend;

    beforeEach(function () {
      // load the module.
      module('locationService');

      // inject your service for testing.
      // The _underscores_ are a convenience thing
      // so you can have your variable name be the
      // same as your injected service.
      inject(function (_nyplLocationsService_, _$httpBackend_) {
        nyplLocationsService = _nyplLocationsService_;
        httpBackend = _$httpBackend_;
      });
    });

    /*
     * nyplLocationsService.allLocations()
     *
     *   Hits the /locations endpoint in the API and returns an object with
     *   all the locations.
     */
    describe('nyplLocationsService.allLocations()', function () {
      it('should get all locations', function () {
        var returned_JSON,
          // The actual API call has 92 locations, this is a mocked version
          mockedAllLocationsAPICall = {
            locations: [
              {id: "sasb", name: "Stephen A. Schwarzman", slug: "schwarzman"},
              {id: "ag", name: "Aguilar", slug: "aguilar"}
            ]
          };

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/locations')
          .respond(mockedAllLocationsAPICall);

        nyplLocationsService.allLocations()
          .then(function (data) {
            returned_JSON = data;
          });
        httpBackend.flush();

        expect(returned_JSON.locations.length).toBe(2);
        expect(returned_JSON).toEqual(mockedAllLocationsAPICall);
      });

      // Simulate server error
      it('should return an error', function () {
        var returned_error_message;

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/locations')
          .respond(500);

        nyplLocationsService.allLocations()
          .then()
          .catch(function (error) {
            returned_error_message = error;
          });
        httpBackend.flush();

        expect(returned_error_message).toEqual(error_message);
      });
    }); /* End nyplLocationsService.allLocations() */

    /*
     * nyplLocationsService.singleLocation(location)
     *   location: The location slug passed from Angular's route params.
     *
     *   Hits the /locations/:location endpoint and returns an object with data
     *   for one location.
     */
    describe('nyplLocationsService.singleLocation(location)', function () {
      it('should return one specific location', function () {
        var returned_JSON,
          // The actual API call has many properties for one location
          mockedOneLocationAPICall = {
            location:
              { id: "HP", name: "Hudson Park Library", slug: "hudson-park" }
          };

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
            'locations/hudson-park')
          .respond(mockedOneLocationAPICall);

        nyplLocationsService.singleLocation('hudson-park')
          .then(function (data) {
            returned_JSON = data;
          });
        httpBackend.flush();

        expect(returned_JSON).toEqual(mockedOneLocationAPICall);
      });

      // Similate server error
      it('should return an error', function () {
        var returned_error_message;

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
            'locations/hudson-park')
          .respond(500);

        nyplLocationsService.singleLocation('hudson-park')
          .catch(function (error) {
            returned_error_message = error;
          });
        httpBackend.flush();

        expect(returned_error_message).toEqual(error_message);
      });
    }); /* End nyplLocationsService.singleLocation(location) */

    /*
    * nyplLocationsService.singleDivision(division)
    *   division: The division slug passed from Angular's route params.
    *
    *   Hits the /division/:division endpoint and returns the json for
    *   one division.
    */
    describe('nyplLocationsService.singleDivision(division)', function () {
      it('should return one division', function () {
        var returned_JSON,
          mockedOneDivisionAPICall = {
            division: {
              id: "MAP",
              name: "Lionel Pincus and Princess Firyal Map Division",
              slug: "map-division"
            }
          };

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
            'divisions/map-division')
          .respond(mockedOneDivisionAPICall);

        nyplLocationsService.singleDivision('map-division')
          .then(function (data) {
            returned_JSON = data;
          });
        httpBackend.flush();

        expect(returned_JSON).toEqual(mockedOneDivisionAPICall);
      });

      // Simulate server error
      it('should return an error', function () {
        var returned_error_message;

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
            'divisions/map-division')
          .respond(500);

        nyplLocationsService.singleDivision('map-division')
          .catch(function (error) {
            returned_error_message = error;
          });
        httpBackend.flush();

        expect(returned_error_message).toEqual(error_message);
      });
    }); /* End nyplLocationsService.singleDivision(division) */

    /*
    * nyplLocationsService.amenities(amenity)
    *   amenity: optional parameter, if it exists it will hit the endpoint
    *   for that specific amenity
    *
    *   If the amenity parameter exists, it will return a list
    *   of locations where the amenity can be found. Otherwise, it will call
    *   the /amenities endpoint and return all the amenities available
    *   in the API. 
    */
    describe('nyplLocationsService.amenities(amenity)', function () {
      // First test is for all amenities
      describe('nyplLocationsService.amenities()', function () {
        it('should return a list of all amenities', function () {
          var amenities_result,
            mockedAmenitiesAPICall = {
              amenities: [
                {id: 4, name: "Computers for Public Use", _links: {}},
                {id: 6, name: "Wireless Internet Access", _links: {}},
                {id: 7, name: "Printing (from PC)", _links: {}},
                {id: 8, name: "Wheelchair Accessible Computers", _links: {}}
              ]
            };

          httpBackend
            .expectGET('http://evening-mesa-7447-160.herokuapp.com/amenities')
            .respond(mockedAmenitiesAPICall);

          nyplLocationsService.amenities().then(function (data) {
            amenities_result = data;
          });

          httpBackend.flush();

          expect(amenities_result.amenities.length).toBe(4);
          expect(amenities_result).toEqual(mockedAmenitiesAPICall);
        });
        // Simulate server error
        it('should return an error', function () {
          var returned_error_message;

          httpBackend
            .expectGET('http://evening-mesa-7447-160.herokuapp.com/amenities')
            .respond(500);

          nyplLocationsService.amenities()
            .catch(function (error) {
              returned_error_message = error;
            });
          httpBackend.flush();

          expect(returned_error_message).toEqual(error_message);
        });
      }); /* End lookup for all amenities */

      // Look up all locations where one amenity can be found
      describe('nyplLocationsService.amenities(amenity)', function () {
        it('should return a list of locations for one amenity', function () {
          var amenity_result,
            // The actual API call has many properties for one service
            mockedAmenityAPICall = {
              amenity: {
                id: 36,
                name: "Bicycle Rack"
              },
              locations: [
                {id: "BAR", name: "Baychester Library", _links: {}},
                {id: "CHR", name: "Chatham Square Library", _links: {}},
                {id: "CI", name: "City Island Library", _links: {}},
                {id: "DH", name: "Dongan Hills Library", _links: {}}
              ]
            };

          httpBackend
            .expectGET('http://evening-mesa-7447-160.herokuapp.com' +
              '/amenities/36')
            .respond(mockedAmenityAPICall);

          nyplLocationsService.amenities(36).then(function (data) {
            amenity_result = data;
          });
          httpBackend.flush();

          expect(amenity_result.amenity.name).toEqual('Bicycle Rack');
          expect(amenity_result.amenity.id).toEqual(36);
          expect(amenity_result.locations.length).toBe(4);
          expect(amenity_result).toEqual(mockedAmenityAPICall);
        });

        // Simulate server error
        it('should return an error', function () {
          var returned_error_message;

          httpBackend
            .expectGET('http://evening-mesa-7447-160.herokuapp.com' +
              '/amenities/36')
            .respond(500);

          nyplLocationsService.amenities(36)
            .catch(function (error) {
              returned_error_message = error;
            });
          httpBackend.flush();

          expect(returned_error_message).toEqual(error_message);
        });
      }); /* End lookup for one amenity */
    }); /* End nyplLocationsService.amenities(amenity) */

    /*
    * nyplLocationsServices.amenitiesAtLibrary(location)
    *   location: The id or slug of the location passed from
    *   Angular's route params.
    *
    *   Hit's the /locations/:location/services API endpoint and returns all
    *   the services available at that specific location.
    */
    describe('nyplLocationsServices.amenitiesAtLibrary(location)', function () {
      it('should return a list of amenities at a location', function () {
        var amenities_result,
          // The actual API call has many properties for one location
          mockedLocationAmenitiesAPICall = {
            locations: {
              name: 'Science, Industry and Business Library (SIBL)',
              _embedded: {
                amenities: [
                  {id: 4, name: "Computers for Public Use", _links: {}},
                  {id: 6, name: "Wireless Internet Access", _links: {}},
                  {id: 7, name: "Printing (from PC)", _links: {}},
                  {id: 8, name: "Wheelchair Accessible Computers", _links: {}}
                ]
              }
            }
          };

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
            'locations/sibl')
          // .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
          //   'locations/sibl/amenities')
          .respond(mockedLocationAmenitiesAPICall);

        nyplLocationsService.amenitiesAtLibrary('sibl').then(function (data) {
          amenities_result = data;
        });
        httpBackend.flush();

        expect(amenities_result.locations.name)
          .toEqual('Science, Industry and Business Library (SIBL)');
        expect(amenities_result.locations._embedded.amenities.length).toBe(4);
        expect(amenities_result).toEqual(mockedLocationAmenitiesAPICall);
      });

      // Simulate server error
      it('should return an error', function () {
        var returned_error_message;

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
            'locations/sibl')
          .respond(500);

        nyplLocationsService.amenitiesAtLibrary('sibl')
          .catch(function (error) {
            returned_error_message = error;
          });
        httpBackend.flush();

        expect(returned_error_message).toEqual(error_message);
      });
    }); /* nyplLocationsServices.amenitiesAtLibrary(location) */

    /*
    * nyplLocationsService.alerts()
    *
    *   Hits the /alerts endpoint and returns a list of all the upcoming
    *   site wide alerts.
    */
    describe('nyplLocationsService.alerts()', function () {
      it('should return a list of alerts', function () {
        var alerts_result,
          mocked_alerts_API_call = {
            alerts: [
              {
                _id: '71579',
                scope: 'all',
                title: 'Labor Day',
                body: "The New York Public Library will be closed August " +
                  "30th through September 1st in observance of Labor Day.",
                start: "2014-08-23T00:00:00-04:00",
                end: "2014-09-02T01:00:00-04:00"
              },
              {
                _id: '71581',
                scope: 'all',
                title: 'Columbus Day',
                body: "The New York Public Library will be closed on Monday, " +
                  "October 13 in observance of Columbus Day.",
                start: "2014-10-06T00:00:00-04:00",
                end: "2014-10-14T01:00:00-04:00"
              }
            ]
          };

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/alerts')
          .respond(mocked_alerts_API_call);

        nyplLocationsService.alerts().then(function (data) {
          alerts_result = data;
        });
        httpBackend.flush();

        expect(alerts_result.alerts.length).toBe(2);
        expect(alerts_result).toEqual(mocked_alerts_API_call);
      });

      // Simulate server error
      it('should return an error', function () {
        var returned_error_message;

        httpBackend
          .expectGET('http://evening-mesa-7447-160.herokuapp.com/alerts')
          .respond(500);

        nyplLocationsService.alerts()
          .catch(function (error) {
            returned_error_message = error;
          });
        httpBackend.flush();

        expect(returned_error_message).toEqual(error_message);
      });
    }); /* nyplLocationsService.alerts() */

  }); /* End nyplLocationsService */
});
