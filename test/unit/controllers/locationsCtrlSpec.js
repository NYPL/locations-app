describe('MapCtrl', function () {
  'use strict';

  var scope, MapCtrl, httpBackend, nyplLocationsService, nyplGeocoderService;

  beforeEach(function () {
    module('nypl_locations');
    inject(function (_nyplLocationsService_, _$httpBackend_) {
      httpBackend = _$httpBackend_;
      nyplLocationsService = _nyplLocationsService_;

      httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');

      httpBackend
        .expectGET('/config')
        .respond({
          config: {
            api_root: 'http://locations-api-beta.nypl.org',
            divisions_with_appointments: ["ARN","RBK","MSS","BRG","PRN","PHG","SPN","CPS"]
          }
        });

      // TODO:
      // Find out why this is needed:
      httpBackend
        .expectGET('views/locations.html')
        .respond('public/views/locations.html');

      httpBackend
        .expectGET('views/location-list-view.html')
        .respond('public/views/location-list-view.html');

      nyplLocationsService.getConfig();
      httpBackend.flush();
    })
  });

  describe('General Research Division', function () {
    var nyplGeocoderService, $timeout;

    beforeEach(inject(function (_$rootScope_, _$controller_, _nyplGeocoderService_, _$timeout_) {
      nyplGeocoderService = _nyplGeocoderService_;
      $timeout = _$timeout_;

      spyOn(nyplGeocoderService, 'hideSearchInfowindow').and.callFake(function () {
        return this;
      });
      spyOn(nyplGeocoderService, 'panExistingMarker').and.callFake(function (test) {
        console.log(test);
        return this;
      });
      spyOn(nyplGeocoderService, 'drawMap').and.callFake(function (test) {
        console.log(test);
        return this;
      });
      spyOn(nyplGeocoderService, 'drawLegend').and.callFake(function (test) {
        console.log(test);
        return this;
      });

      scope = _$rootScope_.$new();
      MapCtrl = _$controller_('MapCtrl', {
        $scope: scope,
        nyplGeocoderService: _nyplGeocoderService_
      });
    }));

    it('should stuff', function () {
      $timeout.flush();
      // scope.panToLibrary('schwarzman');
      expect(nyplGeocoderService.drawMap).toHaveBeenCalled();
      expect(nyplGeocoderService.drawLegend).toHaveBeenCalled();

    });

  });

});