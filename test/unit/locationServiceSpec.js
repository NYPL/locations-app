/*jslint indent: 2, maxlen: 80 */
/*globals element, by, google, module, window, jasmine, document,
describe, expect, beforeEach, inject, it, angular, spyOn, afterEach */

describe('NYPL Service Tests', function () {
  'use strict';  

  /*
  * nyplLocationsService is an Angularjs service that calls the
  * API and returns data.
  */
  describe('nyplLocationsService', function () {
    var nyplLocationsService, httpBackend;

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
    * nyplLocationsService.all_locations()
    *
    *   Hits the /locations endpoint in the API and returns
    *   all the locations.
    */
    it('should get all locations', function () {
      var locations,
        service_result,
        // The actual API call has 90 locations, this is a mocked version
        mocked_all_locations_API_call = {
          locations: [
            {id: "sasb", name: "Stephen A. Schwarzman", slug: "schwarzman"},
            {id: "ag", name: "Aguilar", slug: "aguilar"}
          ]
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/locations')
        .respond(mocked_all_locations_API_call);

      locations = nyplLocationsService.all_locations();
      locations.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result).toEqual(mocked_all_locations_API_call);
    });

    /*
    * nyplLocationsService.single_location(symbol)
    *   symbol: The location slug passed from Angular's route params.
    *
    *   Hits the /location/:symbol endpoint and returns the json for one
    *   specific branch. 
    */
    it('should return one specific location', function () {
      var location,
        service_result,
        // The actual API call has many properties for one location
        mocked_one_location_API_call = {
          location:
            { id: "HP", name: "Hudson Park Library", slug: "hudson-park" }
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
          'locations/hudson-park')
        .respond(mocked_one_location_API_call);

      location = nyplLocationsService.single_location('hudson-park');
      location.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result).toEqual(mocked_one_location_API_call);
    });

    /*
    * nyplLocationsService.single_division(division)
    *   division: The division slug passed from Angular's route params.
    *
    *   Hits the /division/:division endpoint and returns the json for
    *   one division.
    */
    it('should return one division', function () {
      var division,
        service_result,
        mocked_one_division_API_call = {
          division: {
            id: "MAP",
            name: "Lionel Pincus and Princess Firyal Map Division",
            slug: "map-division"
          }
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/' +
          'divisions/map-division')
        .respond(mocked_one_division_API_call);

      division = nyplLocationsService.single_division('map-division');
      division.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result).toEqual(mocked_one_division_API_call);
    });

    /*
    * nyplLocationsService.services()
    *
    *   Hits the /services endpoint and returns all the services
    *   available in the API.
    */
    it('should return a list of services', function () {
      var services,
        service_result,
        mocked_services_API_call = {
          services: [
            {id: 4, name: "Computers for Public Use", _links: {}},
            {id: 6, name: "Wireless Internet Access", _links: {}},
            {id: 7, name: "Printing (from PC)", _links: {}},
            {id: 8, name: "Wheelchair Accessible Computers", _links: {}}
          ]
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/services')
        .respond(mocked_services_API_call);

      services = nyplLocationsService.services();
      services.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result.services.length).toBe(4);
      expect(service_result).toEqual(mocked_services_API_call);
    });

    /*
    * nyplLocationsService.one_service(symbol)
    *   symbol: The service id passed from Angular's route params.
    *
    *   Hits the /service:/symbol endpoint and returns data for one
    *   specific branch.
    */
    it('should return a list of locations for one service', function () {
      var locations,
        service_result,
        // The actual API call has many properties for one service
        mocked_one_service_API_call = {
          services: {
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
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/services/36')
        .respond(mocked_one_service_API_call);

      locations = nyplLocationsService.one_service(36);
      locations.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result.services.name).toEqual('Bicycle Rack');
      expect(service_result.locations.length).toBe(4);
      expect(service_result).toEqual(mocked_one_service_API_call);
    });

    /*
    * nyplLocationsServices.services_at_library(symbol)
    *   symbol: The id of the location passed from Angular's route params.
    *
    *   Hit's the /locations/:symbol/services endpoint and returns all the 
    *   services available at a specific location.
    */
    it('should return a list of services at a specific location', function () {
      var services,
        service_result,
        // The actual API call has many properties for one location
        mocked_location_services_API_call = {
          locations: {
            name: 'Science, Industry and Business Library (SIBL)',
            _embedded: {
              services: [
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
          'locations/sibl/services')
        .respond(mocked_location_services_API_call);

      services = nyplLocationsService.services_at_library('sibl');
      services.then(function (data) {
        service_result = data;
      });

      httpBackend.flush();

      expect(service_result.locations.name)
        .toEqual('Science, Industry and Business Library (SIBL)');
      expect(service_result.locations._embedded.services.length).toBe(4);
      expect(service_result).toEqual(mocked_location_services_API_call);
    });

    /*
    * nyplLocationsService.alerts()
    *
    *   Hits the /alerts endpoint and returns a list of all the upcoming
    *   site wide alerts.
    */
    it('should return a list of alerts', function () {
      var alerts,
        alerts_result,
        mocked_alerts_API_call = {
          alerts: [{
            _id: '71579',
            scope: 'all',
            title: 'Labor Day',
            body: "The New York Public Library will be closed " +
              "August 30th through September 1st in observance of Labor Day.",
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
          }]
        };

      httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/alerts')
        .respond(mocked_alerts_API_call);

      alerts = nyplLocationsService.alerts();
      alerts.then(function (data) {
        alerts_result = data;
      });

      httpBackend.flush();

      expect(alerts_result.alerts.length).toBe(2);
      expect(alerts_result).toEqual(mocked_alerts_API_call);
    });

  }); /* End nyplLocationsService */
});