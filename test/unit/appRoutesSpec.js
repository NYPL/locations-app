/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

describe('Locinator State Routing', function () {
  'use strict';

  var $rootScope, $injector, $state, $httpBackend, $templateCache, nyplLocationsService;
  var configObj = { api_root: 'dev.locations.api.nypl.org',
    featured_amenities: { global: 3, local: 2 }};

  beforeEach(function () {
    module('nypl_locations', function ($provide) {
      $provide.value('config', config = {});
      $provide.value('nyplLocationsService', nyplLocationsService = {});
      nyplLocationsService.getConfig = jasmine.createSpy('getConfig')
        .and.returnValue(configObj);
      nyplLocationsService.singleDivision = jasmine.createSpy('singleDivision')
        .and.returnValue({division: 'Map Division'});
      nyplLocationsService.amenities = jasmine.createSpy('amenities')
        .and.returnValue({amenities: 'amenities'});
    });

    inject(function (_$rootScope_, _$state_, _$injector_, _$httpBackend_, _$templateCache_) {
      $state = _$state_;
      $rootScope = _$rootScope_.$new();
      $injector = _$injector_;
      $httpBackend = _$httpBackend_;
      // $templateCache = _$templateCache_;
      // $templateCache.put('views/locations.html');

      $httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');

      $httpBackend
        .expectGET('/config')
        .respond({
          config: {
            api_root: 'http://locations-api-beta.nypl.org',
            divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN","PHG","SPN","CPS"]
          }
        });

      // $httpBackend.expectGET(/views.*/).respond(200, '');

      $httpBackend
        .expectGET('views/amenities.html')
        .respond('public/views/amenities.html');

      $httpBackend
        .expectGET('views/division.html')
        .respond('public/views/division.html');

      $httpBackend
        // .expectGET('views/location-list-view.html')
        // .respond('public/views/location-list-view.html');

    })
  });
  
  function testStateConfig(stateConfig, expectedConfig) {
    expect(stateConfig.url).toEqual(expectedConfig.url);
    expect(stateConfig.abstract).toBe(expectedConfig.abstract);
    expect(stateConfig.templateUrl).toEqual(expectedConfig.templateUrl);
    expect(stateConfig.controller).toEqual(expectedConfig.controller);
    expect(stateConfig.label).toEqual(expectedConfig.label);
  };

  describe('Routing', function () {
    var state, stateConfig, expectedConfig;

    it('should return the homepage state', function () {
      state = 'home';
      stateConfig = $state.get(state);
      expectedConfig = {
        url: '/',
        abstract: true,
        templateUrl: 'views/locations.html',
        controller: 'LocationsCtrl',
        label: 'Locations'
      };
      
      testStateConfig(stateConfig, expectedConfig);
      expect($injector.invoke(stateConfig.resolve.config)).toEqual(configObj);
    });

    it('should return the list state', function () {
      state = 'home.list';
      stateConfig = $state.get(state);
      expectedConfig = {
        url: 'list',
        abstract: undefined,
        templateUrl: 'views/location-list-view.html',
        controller: undefined,
        label: 'Locations'
      };
      
      testStateConfig(stateConfig, expectedConfig);
    });

    it('should return the map state', function () {
      state = 'home.map';
      stateConfig = $state.get(state);
      expectedConfig = {
        url: 'map',
        abstract: undefined,
        templateUrl: 'views/location-map-view.html',
        controller: 'MapCtrl',
        label: 'Locations'
      };
      
      testStateConfig(stateConfig, expectedConfig);
    });

    it('should return the subdivision state', function () {
      state = 'subdivision';
      stateConfig = $state.get(state);
      expectedConfig = {
        url: '/divisions/:division/:subdivision',
        abstract: undefined,
        templateUrl: 'views/division.html',
        controller: 'DivisionCtrl',
        label: 'Division'
      };
      
      testStateConfig(stateConfig, expectedConfig);
      expect($injector.invoke(stateConfig.resolve.config)).toEqual(configObj);
      expect($injector.invoke(stateConfig.resolve.division)).toBe('function');
    });

    it('should return the division state', function () {
      state = 'division';
      stateConfig = $state.get(state);
      expectedConfig = {
        url: '/divisions/:division',
        abstract: undefined,
        templateUrl: 'views/division.html',
        controller: 'DivisionCtrl',
        label: 'Division'
      };
      
      testStateConfig(stateConfig, expectedConfig);
      expect($injector.invoke(stateConfig.resolve.config)).toEqual(configObj);
      expect($injector.invoke(stateConfig.resolve.division)).toBe({division: 'Map Division'});
    });

    it('should return amenities state', function () {
      state = 'amenities';
      stateConfig = $state.get(state);
      expectedConfig = {
        url: '/amenities',
        abstract: undefined,
        templateUrl: 'views/amenities.html',
        controller: 'AmenitiesCtrl',
        label: 'Amenities'
      };
      
      testStateConfig(stateConfig, expectedConfig);
      expect($injector.invoke(stateConfig.resolve.config)).toEqual(configObj);
      expect($injector.invoke(stateConfig.resolve.amenities)).toBe({division: 'Map Division'});
    });

    it('should go to a division page', function () {
      $state.go('division', {division: 'map-division'});
        // .toEqual('/divisions/map-division');
      $rootScope.$digest();
      expectedConfig($state.current.name).toBe(state);
    });

    it('should go to an amenity page', function () {
      expect($state.href('amenity', {amenity: '7950'}))
        .toEqual('/amenities/id/7950');
    });

    it('should go to an amenities at location page', function () {
      expect($state.href('amenities-at-location', {location: 'grand-central'}))
        .toEqual('/amenities/loc/grand-central');
    });

    it('should go to a 404 page', function () {
      expect($state.href('404')).toEqual('/404');
    });
  });

  // describe('Resolved data', function () {

  //   it('should resolve some data', function () {
  //     // var myServiceMock;
  //     // myServiceMock.findAll = jasmine.createSpy('findAll');

  //     $state.transitionTo('amenities');
  //     $rootScope.$apply();
  //     console.log($state.current.name);
  //     expect($state.current.name).toBe('amenities');

  //     // Call invoke to inject dependencies and run function
  //     // expect($injector.invoke($state.current.resolve.data)).toBe('findAll');
  //   });

  // });
  
});
