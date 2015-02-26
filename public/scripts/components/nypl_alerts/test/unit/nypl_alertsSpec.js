/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module, afterEach, jasmine,
describe, expect, beforeEach, inject, it, angular */

describe('NYPL Alerts Component ', function () {
  'use strict';

  describe('Alerts Service', function () {
    var nyplAlertsService, alertsObject;

    // excuted before each "it" is run.
    beforeEach(function () {
      // load the module.
      module('nyplAlerts');

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
      beforeEach(function () {
        // 3 Alerts
        alertsObject = [
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
          }];
      });

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

          activeAlerts = nyplAlertsService.currentAlerts(alertsObject);
          expect(activeAlerts.length).toBe(1);
        });

      it('should filter current alerts that have started and have not ' +
        'ended. Does not account for closing alerts. Should return no ' +
        'results since all alerts are not within todays date',
        function () {
          var todaysDateMock = new Date(2015, 1, 10),
            activeAlerts;

          jasmine.clock().mockDate(todaysDateMock);

          activeAlerts = nyplAlertsService.currentAlerts(alertsObject);
          expect(activeAlerts.length).toBe(0);
        });

    }); /* End Describe Current Alerts Filter */

  }); /* End Describe Alerts Service */
});
