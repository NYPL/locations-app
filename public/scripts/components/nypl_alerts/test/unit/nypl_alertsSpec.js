/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module, afterEach, jasmine,
describe, expect, beforeEach, inject, it, angular */

describe('NYPL Alerts Component', function () {
  'use strict';

  var alertsObject = {},
    todaysDateMock;

  describe('Broken Module Setup', function () {
    // DO NOT pass API URL or version.
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

    // Passed API URL and version but the API is down or
    // returning an error.
    it('should throw an error because no API version was added', function () {
      var rootScope, httpBackend, $nyplAlerts, gerror;

      module('nyplAlerts', function ($nyplAlertsProvider) {
        $nyplAlertsProvider.setOptions({
          api_root: "http://dev.locations.api.nypl.org/api",
          api_version: "v0.7"
        });
      });

      inject(function (_$rootScope_, _$httpBackend_, _$nyplAlerts_) {
        $nyplAlerts = _$nyplAlerts_;
        rootScope = _$rootScope_;
        httpBackend = _$httpBackend_;

        httpBackend
          .whenJSONP('http://dev.locations.api.nypl.org/api/v0.7/alerts' +
            '?callback=JSON_CALLBACK')
          .respond(500);
      });

      expect(httpBackend.flush)
        .toThrow('$nyplAlerts: Alerts API could not retrieve data');
    });
  }); /* End Broken Module Setup */

  describe('Alerts provider functions', function () {
    var nyplAlerts, api_url, api_version, rootScope, httpBackend,
      https_api_url = 'https://locations.api.nypl.org/api',
      no_protocal_api = 'locations.api.nypl.org/api';

    beforeEach(function () {
      api_url = 'http://locations.api.nypl.org/api';
      api_version = 'v0.7';
    });

    describe('Provider object variables', function () {
      beforeEach(function () {
        module('nyplAlerts', function ($nyplAlertsProvider) {
          $nyplAlertsProvider.setOptions({
            api_root: api_url,
            api_version: api_version
          });
        });

        inject(function (_$nyplAlerts_) {
          nyplAlerts = _$nyplAlerts_;
        });
      });

      it('should have configuration variables but no alerts', function () {
        expect(nyplAlerts.alerts).toBe(null);
        expect(nyplAlerts.api_url).toBe(api_url);
        expect(nyplAlerts.api_version).toBe(api_version);
      });
    }); /* End Provider object variables */

    describe('generateApiUrl()', function () {
      describe('Normal http API url', function () {
        it('should return undefined with no data passed', function () {
          expect(nyplAlerts.generateApiUrl()).not.toBeDefined();
        });

        it('should return undefined with no version set', function () {
          expect(nyplAlerts.generateApiUrl(api_url)).not.toBeDefined();
        });

        it('should return undefined with no version set', function () {
          expect(nyplAlerts.generateApiUrl('', api_version)).not.toBeDefined();
        });

        it('should return a correct URL', function () {
          // The function adds /alerts and the JSONP callback
          expect(nyplAlerts.generateApiUrl(api_url, api_version))
            .toEqual(
              api_url + '/' + api_version + '/alerts?callback=JSON_CALLBACK'
            );
        });
      });

      describe('https API url', function () {
        it('should return a correct URL', function () {
          expect(nyplAlerts.generateApiUrl(https_api_url, api_version))
            .toEqual(
              https_api_url + '/' +
              api_version + '/alerts?callback=JSON_CALLBACK'
            );
        });
      });

      describe('No protocol API url', function () {
        it('should return a correct URL', function () {
          // We expect 'http://' to be added to the url if there
          // is no protocol
          expect(nyplAlerts.generateApiUrl(no_protocal_api, api_version))
            .toEqual(
              api_url + '/' +
              api_version + '/alerts?callback=JSON_CALLBACK'
            );
        });
      });
    }); /* End generateApiUrl() */

    describe('getGlobalAlerts()', function () {
      describe('No API URL or version was set', function () {
        beforeEach(function () {
          module('nyplAlerts', function ($nyplAlertsProvider) {
            $nyplAlertsProvider.setOptions();
          });

          inject(function (_$nyplAlerts_, _$rootScope_) {
            nyplAlerts = _$nyplAlerts_;
            rootScope = _$rootScope_;
          });

        });

        it('should throw an error', function () {
          expect(rootScope.$apply)
            .toThrow('$nyplAlerts: API URL could not be defined');
        });
      });

      describe('API URL and version configuration was set', function () {
        beforeEach(function () {
          module('nyplAlerts', function ($nyplAlertsProvider) {
            $nyplAlertsProvider.setOptions({
              api_root: api_url,
              api_version: api_version
            });
          });

          inject(function (_$nyplAlerts_, _$rootScope_, _$httpBackend_) {
            nyplAlerts = _$nyplAlerts_;
            rootScope = _$rootScope_;
            httpBackend = _$httpBackend_;
          });
        });

        it('should return json from the API call', function () {
          var returnedAlertArray,
            mockedAlertArray = {
              alerts: [
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
                }
              ]};

          httpBackend
            .whenJSONP('http://locations.api.nypl.org/api/v0.7/alerts' +
              '?callback=JSON_CALLBACK')
            .respond(mockedAlertArray);

          nyplAlerts.getGlobalAlerts().then(function (data) {
            returnedAlertArray = data;
          });

          httpBackend.flush();

          expect(returnedAlertArray).toEqual(mockedAlertArray.alerts);
        });

        it('should throw an error because the API is down =(', function () {
          var api_error;

          httpBackend
            .whenJSONP('http://locations.api.nypl.org/api/v0.7/alerts' +
              '?callback=JSON_CALLBACK')
            .respond(500);

          nyplAlerts.getGlobalAlerts()
            .then()
            .catch(function (error) {
              api_error = error
            });

          // Hard to test this because it runs initially in the
          // module's run function...
          expect(httpBackend.flush)
            .toThrow('$nyplAlerts: Alerts API could not retrieve data');
        });
      }); /* End API and Version configuration was set */

    }); /* End getGlobalAlerts() */

  }); /* End Alerts provider functions */


  describe('Working Module Setup', function () {
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
        },
        {
          id: 287839,
          scope: "all",
          _links: { self: {href: "http://dev.www.aws.nypl.org/node/287839"} },
          closed_for: "another mocked closing",
          msg: "All locations will be closed for some reason.",
          display: {
            start: "2015-03-24T09:00:00-05:00",
            end: "2015-03-25T16:00:00-05:00"
          },
          applies: {
            start: "2015-03-25T16:00:00-05:00"
          }
        }
      ];
    });

    describe('Alerts Service', function () {
      var nyplAlertsService, activeAlerts, nyplAlerts;

      // excuted before each "it" is run.
      beforeEach(function () {
        // inject your service for testing.
        inject(function (_nyplAlertsService_, _$nyplAlerts_) {
          nyplAlertsService = _nyplAlertsService_;
          nyplAlerts = _$nyplAlerts_;
        });

        // Doesn't seem like install/uninstall are necessary for mocking dates
        // but leaving it in case it's used for setTimeout/setInterval time
        // testing and mocking.
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe('currentAlerts()', function () {
        it('should have a currentAlerts() function', function () {
          expect(angular.isFunction(nyplAlertsService.currentAlerts)).toBe(true);
          expect(nyplAlertsService.currentAlerts).toBeDefined();
        });

        it('should return an empty array if no data was passed', function () {
          expect(nyplAlertsService.currentAlerts().length).toBe(0);
        });

        it('should filter current alerts that have started and have not ended.' +
          ' Does not account for closing alerts. Should return one current ' +
          'alert based on set date as today',
            function () {
              // Today's date will be March 1st.
              // Whenever `new Date()` is called, we will replace it with
              // the mocked date. But when it's called with parameters,
              // those parameters will take priority.
              todaysDateMock = new Date(2015, 2, 3);

              jasmine.clock().mockDate(todaysDateMock);

              activeAlerts = nyplAlertsService.currentAlerts(alertsObject.alerts);
              expect(activeAlerts.length).toBe(1);
              expect(activeAlerts[0].closed_for).toEqual('Daylight closing');
          });

        it('should filter current alerts that have started and have not ' +
          'ended. Does not account for closing alerts. Should return no ' +
          'results since all alerts are not within todays date',
          function () {
            todaysDateMock = new Date(2015, 1, 10);

            // There should be no 'current' alerts on February 10th.
            jasmine.clock().mockDate(todaysDateMock);

            activeAlerts = nyplAlertsService.currentAlerts(alertsObject.alerts);
            expect(activeAlerts.length).toBe(0);
          });

        it('should filter current alerts and display one without and applies' +
          ' end date',
          function () {
            todaysDateMock = new Date(2015, 2, 25);

            jasmine.clock().mockDate(todaysDateMock);

            activeAlerts = nyplAlertsService.currentAlerts(alertsObject.alerts);
            expect(activeAlerts.length).toBe(1);
            expect(activeAlerts[0].closed_for)
              .toEqual('another mocked closing');
          });

      });  /* End Describe Current Alerts  */

      describe('currentClosingAlerts()', function () {
        it('should have a currentClosingAlerts() function', function () {
          expect(angular.isFunction(nyplAlertsService.currentClosingAlerts)).toBe(true);
          expect(nyplAlertsService.currentClosingAlerts).toBeDefined();
        });

        it('should return one closing alert object', function () {
          todaysDateMock = new Date(2015, 3, 25);
          jasmine.clock().mockDate(todaysDateMock);

          var alert = nyplAlertsService
            .currentClosingAlerts(alertsObject.alerts);

          expect(alert[0].closed_for).toEqual('another mocked closing');
          expect(alert[0].msg).toEqual('All locations will be closed for some reason.');
        });
      });

      describe('activeClosings()', function () {
        it('should have an activeClosings() function', function () {
          expect(angular.isFunction(nyplAlertsService.activeClosings)).toBe(true);
          expect(nyplAlertsService.activeClosings).toBeDefined();
        });

        it('should return false if no alerts were passed', function () {
          expect(nyplAlertsService.activeClosings()).toBe(false);
        });

        it('should return false when there are alerts, but no active closings',
          function () {
            todaysDateMock = new Date(2015, 2, 15);
            jasmine.clock().mockDate(todaysDateMock);

            expect(nyplAlertsService.activeClosings(alertsObject.alerts))
              .toBe(false);
          });

        it('should return true when there is an active closings',
          function () {
            todaysDateMock = new Date(2015, 2, 3);
            jasmine.clock().mockDate(todaysDateMock);

            expect(nyplAlertsService.activeClosings(alertsObject.alerts))
              .toBe(true);
          });
      }); /* End activeClosings() */

      describe('getHoursOrMessage()', function () {
        var hoursMessageOpts = {},
          closedBranchMessage,
          locationHours,
          closedMessage;

        beforeEach(function () {
          // Mock these functions
          closedBranchMessage = function () {
            return "Branch is temporarily closed.";
          };

          locationHours = function () {
            return "10am - 6pm";
          };

          closedMessage = 'Mocked closed alert message';
        });

        it('should have an getHoursOrMessage() function', function () {
          expect(angular.isFunction(nyplAlertsService.getHoursOrMessage))
            .toBe(true);
          expect(nyplAlertsService.getHoursOrMessage).toBeDefined();
        });

        describe('No options passed', function () {
          it('should return undefined if no options were passed', function () {
            expect(nyplAlertsService.getHoursOrMessage()).not.toBeDefined();
          });

          it('should return undefined if no closed function was passed',
            function () {
              hoursMessageOpts.hoursFn = locationHours;
              expect(nyplAlertsService.getHoursOrMessage(hoursMessageOpts))
                .not.toBeDefined();
            });
        });

        describe('The branch is closed', function () {
          it('should call the closed function',
            function () {
              hoursMessageOpts.open = false;
              hoursMessageOpts.hoursFn = locationHours;
              hoursMessageOpts.closedFn = closedBranchMessage;

              expect(nyplAlertsService.getHoursOrMessage(hoursMessageOpts))
                .toEqual('Branch is temporarily closed.')
            });
        });

        describe('The branch is open', function () {
          beforeEach(function () {
            hoursMessageOpts.open = true;
            hoursMessageOpts.hoursFn = locationHours;
            hoursMessageOpts.closedFn = closedBranchMessage;
          });

          it('should display the hours because there is no alert message',
            function () {
              expect(nyplAlertsService.getHoursOrMessage(hoursMessageOpts))
                .toEqual('10am - 6pm');
            });

          it('should display the message because there is an alert', function () {
            var closed
            hoursMessageOpts.message = closedMessage;

            expect(nyplAlertsService.getHoursOrMessage(hoursMessageOpts))
              .toEqual(closedMessage);
          });
        });
      }); /* End getHoursOrMessage() */

      describe('allClosingAlerts()', function () {
        it('should have an allClosingAlerts() function', function () {
          expect(angular.isFunction(nyplAlertsService.allClosingAlerts)).toBe(true);
          expect(nyplAlertsService.allClosingAlerts).toBeDefined();
        });

        it('should return undefined if no obj was passed', function () {
          expect(nyplAlertsService.allClosingAlerts()).not.toBeDefined();
        });

        it('should return undefined if no obj was passed', function () {
          // In alertsObject.alerts, there are three alert objects with closings 
          expect(nyplAlertsService.allClosingAlerts(alertsObject.alerts).length)
            .toBe(3);
        });
      });

      describe('currentWeekClosingAlerts()', function () {
        it('should have an currentWeekClosingAlerts() function', function () {
          expect(angular.isFunction(nyplAlertsService.currentWeekClosingAlerts)).toBe(true);
          expect(nyplAlertsService.currentWeekClosingAlerts).toBeDefined();
        });

        it('should return undefined if no obj was passed', function () {
          expect(nyplAlertsService.currentWeekClosingAlerts().length)
            .toBe(0);
        });

        it('should return a future alert within the next seven days',
          function () {
            todaysDateMock = new Date(2015, 2, 20);
            jasmine.clock().mockDate(todaysDateMock);

            expect(nyplAlertsService
                .currentWeekClosingAlerts(alertsObject.alerts).length)
              .toEqual(2);
          });
      });

      describe('sortAlertsByScope()', function () {
        it('should have an sortAlertsByScope() function', function () {
          expect(angular.isFunction(nyplAlertsService.sortAlertsByScope)).toBe(true);
          expect(nyplAlertsService.sortAlertsByScope).toBeDefined();
        });

        it('should return undefined if no parameters were passed', function () {
          expect(nyplAlertsService.sortAlertsByScope()).not.toBeDefined();
        });

        it('should sort alerts', function () {
          // Only need scope property. Not including the rest for brevity.
          var unsorted_alerts = [
              {id: 287824, scope: 'location'},
              {id: 287825, scope: 'all'},
              {id: 287826, scope: 'division'},
              {id: 287827, scope: 'all'},
              {id: 287828, scope: 'division'},
              {id: 287829, scope: 'location'},
              {id: 287830, scope: 'all'}
            ],
            sorted_alerts = [
              {id: 287825, scope: 'all'},
              {id: 287827, scope: 'all'},
              {id: 287830, scope: 'all'},
              {id: 287824, scope: 'location'},
              {id: 287829, scope: 'location'},
              {id: 287826, scope: 'division'},
              {id: 287828, scope: 'division'}
            ];

          expect(nyplAlertsService.sortAlertsByScope(unsorted_alerts))
            .toEqual(sorted_alerts);
        });
      }); /* End sortAlertsByScope */

      describe('removeDuplicates()', function () {
        var dups;

        beforeEach(function () {
          // The removeDuplicates() function differentiates on IDs
          dups = [
            {
              id: 283840,
              scope: "all",
              _links: { web: {href: "http://dev.www.aws.nypl.org/node/283840"} },
              msg: "<p>The New York Public Library will be closed from May 23 " +
                "through May 25 in observance of Memorial Day.</p>",
            },
            {
              id: 283840,
              scope: "all",
              _links: { web: {href: "http://dev.www.aws.nypl.org/node/283840"} },
              msg: "<p>The New York Public Library will be closed from May 23 " +
                "through May 25 in observance of Memorial Day.</p>",
            },
            {
              id: 287835,
              scope: "location",
              _links: { self: {href: "http://dev.www.aws.nypl.org/node/287835"} },
              msg: "Schwarzman will be closing early on Friday 2/27/2015 at 4:00PM"
            },
            {
              id: 287835,
              scope: "location",
              _links: { self: {href: "http://dev.www.aws.nypl.org/node/287835"} },
              closed_for: "early due to important event",
              msg: "Schwarzman will be closing early on Friday 2/27/2015 at 4:00PM"
            }
          ];

        });

        it('should have an removeDuplicates() function', function () {
          expect(angular.isFunction(nyplAlertsService.removeDuplicates)).toBe(true);
          expect(nyplAlertsService.removeDuplicates).toBeDefined();
        });

        it('should return undefined if no alerts were passed', function () {
          expect(nyplAlertsService.removeDuplicates()).not.toBeDefined();
        });

        it('should remove duplicates', function () {
          expect(nyplAlertsService.removeDuplicates(dups).length)
            .toBe(2);
        });
      }); /* End removeDuplicates() */

      describe('isAlertExpired()', function () {
        it('should have an isAlertExpired() function', function () {
          expect(angular.isFunction(nyplAlertsService.isAlertExpired)).toBe(true);
          expect(nyplAlertsService.isAlertExpired).toBeDefined();
        });

        it('should return undefined if no parameters were passed', function () {
          var startDate = '2015-02-21T00:00:00-05:00',
            endDate = '2015-02-22T00:00:00-05:00';

          expect(nyplAlertsService.isAlertExpired()).not.toBeDefined();
          expect(nyplAlertsService.isAlertExpired(startDate)).not.toBeDefined();
          expect(nyplAlertsService.isAlertExpired('', endDate))
            .not.toBeDefined();
        });

        it('should return false because the alert is active', function () {
          var startDate = '2015-02-21T00:00:00-05:00',
            endDate = '2015-02-24T00:00:00-05:00';

          todaysDateMock = new Date(2015, 1, 22);
          jasmine.clock().mockDate(todaysDateMock);
          expect(nyplAlertsService.isAlertExpired(startDate, endDate))
            .toBe(false);
        });

        it('should return true because the alert is not active', function () {
          var startDate = '2015-02-21T00:00:00-05:00',
            endDate = '2015-02-24T00:00:00-05:00';

          todaysDateMock = new Date(2015, 1, 25);
          jasmine.clock().mockDate(todaysDateMock);
          expect(nyplAlertsService.isAlertExpired(startDate, endDate))
            .toBe(true);
        });
      }); /* End isAlertExpired() */

      describe('getActiveMsgs()', function () {
        it('should have a getActiveMsgs() function', function () {
          expect(angular.isFunction(nyplAlertsService.getActiveMsgs)).toBe(true);
          expect(nyplAlertsService.getActiveMsgs).toBeDefined();
        });

        it('should return undefined if no alerts were passed', function () {
          expect(nyplAlertsService.getActiveMsgs())
            .not.toBeDefined();
        });

        it('should return a message with "Closed" added in the beginning ' +
          'of the string', function () {
            todaysDateMock = new Date(2015, 1, 27);
            jasmine.clock().mockDate(todaysDateMock);

            expect(nyplAlertsService.getActiveMsgs(alertsObject.alerts))
              .toEqual('Daylight closing');
          });

        it('should return an empty string if there are no active alerts',
          function () {
            todaysDateMock = new Date(2015, 2, 15);
            jasmine.clock().mockDate(todaysDateMock);

            expect(nyplAlertsService.getActiveMsgs(alertsObject.alerts))
              .toEqual('');
          });
      }); /* End getActiveMsgs() */

      describe('filterAlerts()', function () {
        it('should have a filterAlerts() function', function () {
          expect(angular.isFunction(nyplAlertsService.filterAlerts)).toBe(true);
          expect(nyplAlertsService.filterAlerts).toBeDefined();
        });

        it('should return undefined if no parameters were passed', function () {
          expect(nyplAlertsService.filterAlerts()).not.toBeDefined();
        });

        it('should return "all" closings', function () {
        });

      }); /* End filterAlerts() */

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
            .respond(alertsObject.alerts);

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
        var locationAlertDirective, ngRepeatElements;

        describe('With no returned alerts data', function () {
          it('should compile', function () {
            scope.alerts = undefined;
            template = '<nypl-location-alerts alerts="alerts">' +
              '</nypl-location-alerts>';

            locationAlertDirective = createDirective(template);
            expect(locationAlertDirective.next()).toEqual({});
            expect(locationAlertDirective.next().attr('class'))
              .not.toContain('nypl-location-alerts');
          });
        });

        describe('With returned alerts data', function () {
          beforeEach(function () {
            scope.alerts = alertsObject.alerts;
            template = '<nypl-location-alerts alerts="alerts">' +
              '</nypl-location-alerts>';

            // DO NOT compile the directive in the before each so we can
            // test out different situations below
          });

          describe('Active alerts', function () {
            it('should compile', function () {
              // The location alert appears on 2/27.
              todaysDateMock = new Date(2015, 1, 27);
              jasmine.clock().mockDate(todaysDateMock);

              locationAlertDirective = createDirective(template);

              expect(locationAlertDirective.next().attr('class'))
                .toContain('nypl-location-alerts');
            });

            // Schwarzman alert appears on 2/26 - 2/27
            it('should contain contain one alert', function () {
              todaysDateMock = new Date(2015, 1, 27);
              jasmine.clock().mockDate(todaysDateMock);

              locationAlertDirective = createDirective(template);
              ngRepeatElements = locationAlertDirective.next().find('p');

              expect(ngRepeatElements.length).toEqual(1);
            });

            it('should display a Schwarzman location text alert', function () {
              todaysDateMock = new Date(2015, 1, 27);
              jasmine.clock().mockDate(todaysDateMock);

              locationAlertDirective = createDirective(template);
              ngRepeatElements = locationAlertDirective.next().find('p');

              expect(ngRepeatElements.text()).toEqual("Schwarzman will be " +
                "closing early on Friday 2/27/2015 at 4:00PM");
            });
          });

          describe('No active alerts', function () {
            it('should not compile if there are no alerts', function () {
              // No location alert appears on 2/10.
              todaysDateMock = new Date(2015, 1, 10);
              jasmine.clock().mockDate(todaysDateMock);

              locationAlertDirective = createDirective(template);

              expect(locationAlertDirective.next()).toEqual({});
              expect(locationAlertDirective.next().attr('class'))
                .not.toBeDefined();
            });

            it('should not display any alerts', function () {
              todaysDateMock = new Date(2015, 1, 2);
              jasmine.clock().mockDate(todaysDateMock);

              locationAlertDirective = createDirective(template);
              ngRepeatElements = locationAlertDirective.next().find('p');

              // Should be an empty object - no elements to display
              expect(locationAlertDirective.next()).toEqual({});
              expect(ngRepeatElements.length).toEqual(0);
            });
          });
        }); /* End With returned alerts data */
      }); /* End Location Alerts Directive */

      describe('Global Alerts', function () {
        var globalAlertsDirective, nyplAlertsService;

        beforeEach(function () {
          // Injexting the Alerts service so we can use the filterAlerts()
          // function that is used in the initAlerts() function in the 
          // module's run initialization.
          inject(function (_nyplAlertsService_) {
            nyplAlertsService = _nyplAlertsService_;
          });

          // We don't need the Schwarzman location alert in
          // the all alerts array
          alertsObject.alerts.pop();

          template = '<nypl-global-alerts></nypl-global-alerts>';

          // DO NOT compile the directive in the before each so we can
          // test out different situations below
        });

        it('should not compile', function () {
          todaysDateMock = new Date(2015, 2, 20);
          jasmine.clock().mockDate(todaysDateMock);

          scope.alerts = nyplAlertsService.
              filterAlerts(alertsObject.alerts, {current: true});
          globalAlertsDirective = createDirective(template);

          expect(scope.alerts.length).toBe(0);
          expect(globalAlertsDirective.next().attr('class'))
            .not.toBeDefined();
        });

        it('should display Memorial Day alert', function () {
          // Mocking May 20th.
          todaysDateMock = new Date(2015, 4, 20);
          jasmine.clock().mockDate(todaysDateMock);

          scope.alerts = nyplAlertsService.
              filterAlerts(alertsObject.alerts, {current: true});
          globalAlertsDirective = createDirective(template);

          expect(globalAlertsDirective.next().attr('class'))
            .toContain('nypl-global-alerts');
          // Because the alert message is already wrapped in a p tag
          // from the API!!
          expect(globalAlertsDirective.next().find('p').find('p').text())
            .toEqual('The New York Public Library will be closed from May ' +
              '23 through May 25 in observance of Memorial Day.')
        });

        it('should display mock daylight savings alert', function () {
          // Mocking March 5th.
          todaysDateMock = new Date(2015, 2, 5);
          jasmine.clock().mockDate(todaysDateMock);

          scope.alerts = nyplAlertsService.
              filterAlerts(alertsObject.alerts, {current: true});
          globalAlertsDirective = createDirective(template);

          expect(globalAlertsDirective.next().attr('class'))
            .toContain('nypl-global-alerts');
          expect(globalAlertsDirective.next().find('p').text())
            .toEqual('Daylight Test Alert')
        });
      }); /* End Global Alerts Directive */

    }); /* End Alerts Directives */

  }); /* End working implementation */

});
