/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module, afterEach, jasmine,
describe, expect, beforeEach, inject, it, angular */

describe('NYPL Alerts Component', function () {
  'use strict';

  var alertsObject = {};

  describe('Broken Implementations', function () {
    describe('Broken module setup', function () {
      it('should throw an error because no URL was added', function () {
        var rootScope;

        // Note that no settings were passed in the provider
        module('nyplAlerts');
        inject(function (_$rootScope_) {
          rootScope = _$rootScope_;
        });

        expect(rootScope.$apply)
          .toThrow('$nyplAlerts: API URL could not be defined');
      });

      // it('should throw an error because no API version was added', function () {
      //   var rootScope, httpBackend;

      //   module('nyplAlerts', function ($nyplAlertsProvider) {
      //     $nyplAlertsProvider.setOptions({
      //       api_root: "http://dev.locations.api.nypl.org/api",
      //       api_version: "v0.7"
      //     });
      //   });

      //   inject(function (_$rootScope_, _$httpBackend_) {
      //     rootScope = _$rootScope_;
      //     httpBackend = _$httpBackend_;

      //     httpBackend
      //       .whenJSONP('http://dev.locations.api.nypl.org/api/v0.7/alerts' +
      //         '?callback=JSON_CALLBACK')
      //       .respond(500);

      //     httpBackend.flush();
      //   });

      //   // rootScope.$apply();
      //   expect(rootScope)
      //     .toThrow('$nyplAlerts: API URL could not be defined');
      // });
    });

  }); /* End Broken Implementation */

  describe('Working module setup', function () {
    beforeEach(function () {
      // Load the module for all tests.
      module('nyplAlerts', function ($nyplAlertsProvider) {
        $nyplAlertsProvider.setOptions({
          api_root: 'http://dev.locations.api.nypl.org/api',
          api_version: 'v0.7'
        });
      });

      //Alerts
      alertsObject.alerts = [
        {
          id: 287824,
          scope: "all",
          _links: { web: {href: "http://dev.www.aws.nypl.org/node/287824"} },
          closed_for: "Daylight closing",
          msg: "Daylight Test Alert",
          display: {
            start: "2015-02-21T00:00:00-05:00",
            end: "2015-03-10T00:00:00-04:00"
          },
          applies: {
            start: "2015-02-21T00:00:00-05:00",
            end: "2015-03-10T00:00:00-04:00"
          }
        },
        {
          id: 283839,
          scope: "all",
          _links: { web: {href: "http://dev.www.aws.nypl.org/node/283839"} },
          msg: "<p>The New York Public Library will be closed on Sunday, " +
            "April 5.</p>",
          display: {
            start: "2015-04-01T00:00:00-04:00",
            end: "2015-04-06T00:00:00-04:00"
          }
        },
        {
          id: 283840,
          scope: "all",
          _links: { web: {href: "http://dev.www.aws.nypl.org/node/283840"} },
          msg: "<p>The New York Public Library will be closed from May 23 " +
            "through May 25 in observance of Memorial Day.</p>",
          display: {
            start: "2015-05-17T00:00:00-04:00",
            end: "2015-05-26T00:00:00-04:00"
          }
        },
        {
          id: 287835,
          scope: "location",
          _links: { self: {href: "http://dev.www.aws.nypl.org/node/287835"} },
          closed_for: "early due to important event",
          msg: "Schwarzman will be closing early on Friday 2/27/2015 at 4:00PM",
          display: {
            start: "2015-02-26T09:00:00-05:00",
            end: "2015-02-27T18:00:00-05:00"
          },
          applies: {
            start: "2015-02-27T16:00:00-05:00",
            end: "2015-02-27T18:00:00-05:00"
          }
        }    
      ];
    });

    describe('Alerts Service', function () {
      var nyplAlertsService;

      // excuted before each "it" is run.
      beforeEach(function () {
        // inject your service for testing.
        inject(function (_nyplAlertsService_) {
          nyplAlertsService = _nyplAlertsService_;
        });

        // Doesn't seem like install/uninstall are necessary for mocking dates
        // but leaving it in case it's used for setTimeout/setInterval time
        // testing and mocking.
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe('Current Alerts Filter', function () {
        it('should have a currentAlerts() function', function () {
          expect(angular.isFunction(nyplAlertsService.currentAlerts)).toBe(true);
          expect(nyplAlertsService.currentAlerts).toBeDefined();
        });

        it('should filter current alerts that have started and have not ended.' +
          ' Does not account for closing alerts. Should return one current ' +
          'alert based on set date as today',
            function () {
            // Today's date will be March 1st.
            // Whenever `new Date()` is called, we will replace it with
            // the mocked date. But when it's called with parameters,
            // those parameters will take priority.
            var todaysDateMock = new Date(2015, 2, 1),
              activeAlerts;

            jasmine.clock().mockDate(todaysDateMock);

            activeAlerts = nyplAlertsService.currentAlerts(alertsObject.alerts);
            expect(activeAlerts.length).toBe(1);
          });

        it('should filter current alerts that have started and have not ' +
          'ended. Does not account for closing alerts. Should return no ' +
          'results since all alerts are not within todays date',
          function () {
            var todaysDateMock = new Date(2015, 1, 10),
              activeAlerts;

            // There should be no 'current' alerts on February 10th.
            jasmine.clock().mockDate(todaysDateMock);

            activeAlerts = nyplAlertsService.currentAlerts(alertsObject.alerts);
            expect(activeAlerts.length).toBe(0);
          });

      });  /* End Describe Current Alerts Filter */
    }); /* End Describe Alerts Service */

    describe('Alerts Directives', function () {
      var template, compile, scope, httpBackend;

      beforeEach(function () {
        inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
          compile = _$compile_;
          scope = _$rootScope_;
          httpBackend = _$httpBackend_;

          httpBackend
            .whenJSONP('http://dev.locations.api.nypl.org/api/v0.7/alerts' +
              '?callback=JSON_CALLBACK')
            .respond(alertsObject);

          httpBackend.flush();
        });

        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      function createDirective(template) {
        var element;
        element = compile(template)(scope);
        scope.$digest();

        return element;
      }

      describe('Location Alerts Directive', function () {
        var locationAlertDirective;

        beforeEach(function () {
          scope.alerts = alertsObject;
          template = '<nypl-location-alerts alerts="alerts">' +
            '</nypl-location-alerts>';

          // DO NOT compile the directive in the before each so we can
          // test out different situations below
        });

        describe('Active alerts', function () {
          beforeEach(function () {
            locationAlertDirective = createDirective(template);
          });

          it('should compile', function () {
            // The location alert appears on 2/27.
            var todaysDateMock = new Date(2015, 1, 27);

            jasmine.clock().mockDate(todaysDateMock);

            expect(locationAlertDirective.next().attr('class'))
              .toContain('nypl-location-alerts');
          });

          // Schwarzman alert appears on 2/26 - 2/27
          it('should contain contain one alert', function () {
            var todaysDateMock = new Date(2015, 1, 27),
              ngRepeatElements;

            jasmine.clock().mockDate(todaysDateMock);
            ngRepeatElements = locationAlertDirective.next().find('p');

            expect(ngRepeatElements.length).toEqual(1);
          });

          it('should display a Schwarzman location text alert', function () {
            var todaysDateMock = new Date(2015, 1, 27),
              ngRepeatElements;

            jasmine.clock().mockDate(todaysDateMock);
            ngRepeatElements = locationAlertDirective.next().find('p');

            expect(ngRepeatElements.text()).toEqual("Schwarzman will be " +
              "closing early on Friday 2/27/2015 at 4:00PM");
          });
        });

        describe('No active alerts', function () {
          it('should not compile if there are no alerts', function () {
            // No location alert appears on 2/10.
            var todaysDateMock = new Date(2015, 1, 10);

            jasmine.clock().mockDate(todaysDateMock);

            locationAlertDirective = createDirective(template);
            expect(locationAlertDirective.next()).toEqual({});
            expect(locationAlertDirective.next().attr('class'))
              .not.toBeDefined();
          });

          it('should not display any alerts', function () {
            var todaysDateMock = new Date(2015, 1, 2),
              ngRepeatElements;

            jasmine.clock().mockDate(todaysDateMock);

            locationAlertDirective = createDirective(template);
            ngRepeatElements = locationAlertDirective.next().find('p');

            // Should be an empty object - no elements to display
            expect(locationAlertDirective.next()).toEqual({});
            expect(ngRepeatElements.length).toEqual(0);
          });

        });

      }); /* End Location Alerts Directive */

      describe('Global Alerts', function () {
        var globalAlertsDirective;

        beforeEach(function () {
          template = '<nypl-global-alerts></nypl-global-alerts>';

          // DO NOT compile the directive in the before each so we can
          // test out different situations below
        });

        it('should compile', function () {
          var todaysDateMock = new Date(2015, 2, 28);

          jasmine.clock().mockDate(todaysDateMock);

          globalAlertsDirective = createDirective(template);
          expect(globalAlertsDirective.next().attr('class'))
            .toContain('nypl-global-alerts');
        });

      }); /* End Global Alerts Directive */

    }); /* End Alerts Directives */

  }); /* End working implementation */

});
