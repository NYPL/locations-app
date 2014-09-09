/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

describe('Locinator controllers', function () {
  'use strict';

  window.google = jasmine.createSpy('google');
  window.google.maps = jasmine.createSpy('maps');
  window.google.maps.InfoWindow = jasmine.createSpy('infoWindow');
  window.google.maps.Geocoder = jasmine.createSpy('Geocoder');
  window.google.maps.LatLng = jasmine.createSpy('LatLng');
  window.google.maps.LatLngBounds = jasmine.createSpy('LatLngBounds');
  window.google.maps.Map = jasmine.createSpy('Map');
  window.google.maps.Marker = jasmine.createSpy('Marker');
  window.google.maps.Animation = jasmine.createSpy('Animation');
  window.google.maps.Animation.BOUNCE = jasmine.createSpy('Bounce');
  window.google.maps.Animation.DROP = jasmine.createSpy('Drop');
  window.google.maps.event = jasmine.createSpy('event');
  window.google.maps.event.addListener = jasmine.createSpy('addListener');
  window.google.maps.prototype.controls = jasmine.createSpy('map.controls');
  window.google.maps.ControlPosition = jasmine.createSpy('ControlPosition');
  window.google.maps.ControlPosition.RIGHT_BOTTOM =
    jasmine.createSpy('RIGHT_BOTTOM');

  /* 
  * Calling the nyplLocationsService from a controller
  */
  describe('Utility: nyplLocationsService', function () {
    var scope,
      locationsCtrl,
      nyplLocationsService,
      httpBackend,
      nypl_geocoder_mock;

    beforeEach(module('nypl_locations'));

    // var interceptedPath;
    // beforeEach(module(function ($provider) {
    //   $provider.provide('$location', {
    //     path: function (p) {
    //       interceptedPath = p;
    //     }
    //   });
    // }));

    beforeEach(inject(function (
      _nyplLocationsService_,
      _$httpBackend_,
      $rootScope,
      $controller
    ) {

      nyplLocationsService = _nyplLocationsService_;
      httpBackend = _$httpBackend_;
      scope = $rootScope.$new();

      nypl_geocoder_mock = {
        get_coords: function () { return; },
        draw_map: function () { return; },
        remove_searchMarker: function () { return; },
        load_markers: function () { return; },
        check_marker: function () { return; },
        draw_marker: function () { return; },
        draw_legend: function () { return; },
        hide_infowindow: function () { return; },
        panMap: function () { return; }
      };

      locationsCtrl = $controller('LocationsCtrl', {
        $scope: scope,
        nyplLocationsService: nyplLocationsService,
        nypl_geocoder_service: nypl_geocoder_mock
      });

      httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
    }));

    it('Should expose nyplLocationsService functions', function () {
      expect(typeof nyplLocationsService.allLocations).toBe('function');
      expect(typeof nyplLocationsService.singleLocation).toBe('function');
    });

    // it('Should call the branches API and successfully get data back',
    //   function () {
    //     var locations_reponse = '[{"id":"AG","geolocation":' +
    //         '{"coordinates":[-73.9436,40.7943]},' +
    //         '"name":"Aguilar","locationDest":"Aguilar undefined ' +
    //         'undefined, undefined, undefined","distance":"","highlight":""}]';

    //     expect(scope.locations).not.toBeDefined();

    //     httpBackend
    //       .expectGET("http://evening-mesa-7447-160.herokuapp.com/locations")
    //       .respond(200, '{"locations" : [{"id": "AG", "geolocation":' +
    //         '{"coordinates":[-73.9436, 40.7943]}, "name":"Aguilar"}]}');

    //     httpBackend.flush();
    //     scope.$digest();

    //     expect(scope.locations).toBeDefined();
    //     // The controller adds extra properties to the locations model.
    //     // Converted to strings since it's easier to compare.
    //     expect(JSON.stringify(scope.locations)).toEqual(locations_reponse);
    //   });

    // it('should call the branches api and fail', function () {
    //   httpBackend
    //     .expectGET("http://evening-mesa-7447-160.herokuapp.com/locations")
    //     .respond(404);

    //   httpBackend.flush();

    //   expect(scope.locations).not.toBeDefined();
    // });
  });

  /* 
  * Calling the nypl_geocoder_service from a controller
  */
  describe('Utility: nypl_geocoder_service called from controller',
    function () {
      var nypl_geocoder_mock, $q, scope, defer, $httpBackend;

      beforeEach(module('nypl_locations'));

      beforeEach(inject(function (
        $controller,
        _$rootScope_,
        _$q_,
        _$httpBackend_
      ) {
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        scope = _$rootScope_.$new();
        nypl_geocoder_mock = {
          get_coords: function () {
            defer = $q.defer();
            return defer.promise;
          },
          draw_map: function () { return; },
          remove_searchMarker: function () { return; },
          load_markers: function () { return; },
          show_all_libraries: function () { return; }
        };

        spyOn(nypl_geocoder_mock, 'get_coords').and.callThrough();

        $controller('LocationsCtrl', {
          '$scope': scope,
          'nypl_geocoder_service': nypl_geocoder_mock
        });

        $httpBackend
          .expectGET('/languages/en.json')
          .respond('public/languages/en.json');
      }));

      // it('should get coordinates from a zipcode',
      //   inject(function () {
      //     $httpBackend
      //       .expectGET("http://evening-mesa-7447-160.herokuapp.com/locations")
      //       .respond(200, '{"locations" : [{"id": "AG", "geolocation":' +
      //         '{"coordinates":[-73.9436, 40.7943]}, "name":"Aguilar"}]}');

      //     $httpBackend.flush();
      //     scope.submitAddress('10018');

      //     expect(nypl_geocoder_mock.get_coords).toHaveBeenCalled();
      //   }));
    });
});
