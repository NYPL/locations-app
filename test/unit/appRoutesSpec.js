/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

describe('Locinator State Routing', function () {
  'use strict';

  var $rootScope, $injector, $state, interceptedPath, $httpBackend, $templateCache;


  beforeEach(function () {
    module('nypl_locations');

    // module(function ($provider) {
    //   $provider.provide('$location', {
    //     path: function (p) {
    //       interceptedPath = p;
    //     }
    //   });

    // });
    inject(function (_$rootScope_, _$state_, _$injector_, _$httpBackend_, _$templateCache_) {
      $state = _$state_;
      $rootScope = _$rootScope_;
      $injector = _$injector_;
      $httpBackend = _$httpBackend_;
      $templateCache = _$templateCache_;
      $templateCache.put('views/locations.html');

      $httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');

      $httpBackend
        .expectGET('views/locations.html')
        .respond('public/views/locations.html');

      $httpBackend
        .expectGET('views/location-map-view.html')
        .respond('public/views/location-map-view.html');
    })
  });

  describe('Routing', function () {
    it('should go to the home page', function () {
      expect($state.href('home.index')).toEqual('#/');
    });

    it('should go to the map page', function () {
      expect($state.href('home.map')).toEqual('#/map');
    });

    it('should go to the list page', function () {
      expect($state.href('home.list')).toEqual('#/list');
    });

    it('should go to the all amenities page', function () {
      expect($state.href('amenities')).toEqual('#/amenities');
    });

    it('should go to a location page', function () {
      expect($state.href('location', {location: 'schwarzman'}))
        .toEqual('#/schwarzman');
    });

    it('should go to a division page', function () {
      expect($state.href('division', {division: 'map-division'}))
        .toEqual('#/divisions/map-division');
    });

    it('should go to an amenity page', function () {
      expect($state.href('amenity', {amenity: '7950'}))
        .toEqual('#/amenities/id/7950');
    });

    it('should go to an amenities at location page', function () {
      expect($state.href('amenities-at-location', {location: 'grand-central'}))
        .toEqual('#/amenities/loc/grand-central');
    });

    it('should go to a 404 page', function () {
      expect($state.href('404')).toEqual('#/404');
    });
  });

  describe('Resolved data', function () {

    it('should resolve some data', function () {
    });

  });
  
});
