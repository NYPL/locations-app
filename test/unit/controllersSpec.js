'use strict';

/* jasmine specs for controllers go here */
describe('Locinator controllers', function() {
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
  window.google.maps.ControlPosition.RIGHT_BOTTOM = jasmine.createSpy('RIGHT_BOTTOM');

  /* 
  * Calling the nypl_locations_service from a controller
  */
  describe('Utility: nypl_locations_service', function(){
    var scope, locationsCtrl, nypl_locations_service, httpBackend, nypl_geocoder_service, http, nypl_geocoder_mock;

    beforeEach(module('nypl_locations'));

    beforeEach(inject(function(_nypl_locations_service_, _nypl_geocoder_service_, _$httpBackend_, _$http_, $rootScope, $controller) {

      nypl_locations_service = _nypl_locations_service_;
      nypl_geocoder_service = _nypl_geocoder_service_;
      httpBackend = _$httpBackend_;
      http = _$http_;
      scope = $rootScope.$new();

      nypl_geocoder_mock = {
        get_coords: function (address) {
          defer = $q.defer();
          return defer.promise;
        },
        draw_map: function (coords, zoom) {},
        remove_searchMarker: function () {},
        load_markers: function () {},
        check_marker: function () {},
        draw_marker: function () {},
        draw_legend: function () {},
        hide_infowindow: function () {},
        panMap: function () {},
      };

      locationsCtrl = $controller('LocationsCtrl', {
        $scope: scope,
        nypl_locations_service: nypl_locations_service,
        nypl_geocoder_service: nypl_geocoder_mock
      });

      httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
    }));

    it('Should expose nypl_locations_service functions', function () {
      expect(typeof nypl_locations_service.all_locations).toBe('function');
      expect(typeof nypl_locations_service.single_location).toBe('function');
    });

    it('Should call the branches API and successfully get data back', function () {
      var locations_reponse = '[{"id":"AG","geolocation":{"coordinates":[-73.9436,40.7943]},' +
          '"name":"Aguilar","library_type":"circulating","locationDest":"Aguilar undefined ' +
          'undefined, undefined, undefined","distance":"","highlight":""}]';
      expect(scope.locations).not.toBeDefined();

      httpBackend
        .expectGET("http://evening-mesa-7447-160.herokuapp.com/locations")
        .respond(200, '{"locations" : [{"id": "AG", "geolocation":{"coordinates":[-73.9436, 40.7943]}, "name":"Aguilar"}]}');

      httpBackend.flush();
      scope.$digest();

      expect(scope.locations).toBeDefined();
      // The controller adds extra properties to the locations model.
      // Converted to strings since it's hard to compare since some properties are objects.
      expect(JSON.stringify(scope.locations)).toEqual(locations_reponse);      
    });

    it('should call the branches api and fail', function () {
      httpBackend.expectGET("http://evening-mesa-7447-160.herokuapp.com/locations").respond(404);

      httpBackend.flush();

      expect(scope.locations).not.toBeDefined();
    });

  });
  
  /* 
  * Calling the nypl_geocoder_service from a controller
  */
  describe('Utility: nypl_geocoder_service called from controller', function () {
    var nypl_geocoder_mock, $q, rootScope, scope, defer;

    beforeEach(module('nypl_locations'));

    beforeEach(inject(function ($controller, _$rootScope_, _$q_) {
      $q = _$q_;
      scope = _$rootScope_.$new();
      nypl_geocoder_mock = {
        get_coords: function (address) {
          defer = $q.defer();
          return defer.promise;
        },
        draw_map: function (coords, zoom) {},
        remove_searchMarker: function () {},
        load_markers: function () {},
      };

      spyOn(nypl_geocoder_mock,'get_coords').and.callThrough();

      $controller('LocationsCtrl', {
        '$scope': scope,
        'nypl_geocoder_service': nypl_geocoder_mock
      });
    }));

    it('should get coordinates from a zipcode', inject(function (nypl_geocoder_service) {
      scope.submitAddress('test');

      expect(nypl_geocoder_mock.get_coords).toHaveBeenCalled();
    }));

  });
});
