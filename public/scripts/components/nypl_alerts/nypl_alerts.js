/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular, _ */

(function (window, angular, undefined) {
  'use strict';

  /** @namespace $nyplAlertsProvider */
  function $nyplAlertsProvider() {
    var errors = {
        url_undefined: '$nyplAlerts: API URL could not be defined',
        api: '$nyplAlerts: Alerts API could not retrieve data'
      },
      options = {
        api_root: null,
        api_version: null
      };

    // Sets Provider options for use
    this.setOptions = function (opts) {
      angular.extend(options, opts);
    };

    this.$get = ['$http', '$q',
      function ($http, $q) {
        var provider = {};

        // Generates a correct Alerts API URL
        provider.generateApiUrl = function (host, version) {
          if (!host || !version) { return undefined; }

          var jsonCb = '?callback=JSON_CALLBACK',
            url = host + '/' + version + '/alerts' + jsonCb;

          return (host.indexOf("http://") === 0 ||
            host.indexOf("https://") === 0) ?
              url : 'http://' + url;
        };

        // Fetches API response for Alerts
        provider.getGlobalAlerts = function () {
          var defer = $q.defer(),
            url = this.generateApiUrl(options.api_root, options.api_version);

          if (!url) {
            defer.reject(errors.url_undefined);
          } else {
            $http.jsonp(url, {cache: true})
              .success(function (data) {
                defer.resolve(data.alerts);
              })
              .error(function (status) {
                defer.reject(errors.api);
              });
          }
          return defer.promise;
        };

        provider.alerts = null;
        provider.api_url = options.api_root || null;
        provider.api_version = options.api_version || null;

        return provider;
      }];
  }

  function nyplAlertsService() {
    var service = {};

    // Filters all current Alerts that are 
    // within the display range
    service.currentAlerts = function (obj) {
      var today = moment();
      var sDate,
        eDate;

      return _.filter(obj, function (elem) {
        if (elem.display) {
          if (elem.display.start && elem.display.end) {
            sDate = new Date(elem.display.start);
            eDate = new Date(elem.display.end);
            if (sDate.getTime() <= today.valueOf() &&
                eDate.getTime() >= today.valueOf()) {
              return elem;
            } else if (today.day() === sDate.getDay() &&
              eDate.getDay() === today.day() && eDate.getTime() 
              >= today.valueOf()) {
              return elem;
            }
          }
        }
      });
    };

    // Filters Closing Alerts that have started within
    // the applies.start & applies.end dates
    service.currentClosingAlerts = function (obj) {
      var today = moment(),
        sDate,
        eDate;

      return _.filter(obj, function (elem) {
        if (elem.applies) {
          if (elem.applies.start && elem.applies.end) {
            sDate = new Date(elem.applies.start);
            eDate = new Date(elem.applies.end);
            // Covers alert within today
            if (sDate.getTime() <= today.valueOf() &&
                eDate.getTime() >= today.valueOf()) {
              return elem;
            }
            // Covers early openings
            else if (today.day() === sDate.getDay() &&
              eDate.getDay() === today.day() && eDate.getTime() 
              >= today.valueOf()) {
              return elem;
            }
          } else if (elem.applies.start) {
            sDate = new Date(elem.applies.start);
            if (sDate.getTime() <= today.valueOf()) {
              return elem;
            }
          }
        }
      });
    };

    // Filters Closing Alerts that are within the next 7 days
    service.currentWeekClosingAlerts = function (obj) {
      var today = moment(),
        sevenDaysFromToday = moment().add(7, 'days'),
        sDate;

      return _.filter(obj, function (elem) {
        if (elem.applies) {
          if (elem.applies.start) {
            sDate = new Date(elem.applies.start);
            // Covers alert within today's 7 day week
            if ((sevenDaysFromToday.valueOf() >= sDate.getTime()) &&
              (today.getTime() <= sDate.getTime())) {
              return elem;
            }
          }
        }
      });
    };

    // Filters All Closing Alerts only
    service.allClosingAlerts = function (obj) {
      if (!obj) {
        return;
      }

      return _.filter(obj, function (elem) {
        if (elem.applies && elem.applies.start) {
          return elem;
        }
      });
    };

    // Sort Alerts by scope order
    // 1) all 2) location 3) division
    service.sortAlertsByScope = function (obj) {
      if (!obj) { return; }

      return _.chain(obj)
      .sortBy(function(elem) {
        return elem.scope.toLowerCase() === 'all';
      })
      .sortBy(function(elem) {
        return elem.scope.toLowerCase() === 'location';
      })
      .sortBy(function(elem) {
        return elem.scope.toLowerCase() === 'division';
      })
      .value();
    };

    // Removes Alerts with duplicate id's and msg
    service.removeDuplicates = function (obj) {
      if (!obj) {
        return;
      }

      return _.chain(obj)
        .indexBy('id')
        .flatten()
        .uniq(function (elem) {
          if (elem.msg) {
            return elem.msg.toLowerCase();
          }
        })
        .value();
    };

    // Boolean check if an alert has expired
    service.isAlertExpired = function (startDate, endDate) {
      if (!startDate || !endDate) {
        return;
      }

      var sDate = new Date(startDate),
        eDate   = new Date(endDate),
        today   = moment();

      return (sDate.getTime() <= today.valueOf() &&
        eDate.getTime() >= today.valueOf()) ? false : true;
    };

    // Assigns proper alerts based on scope (optional)
    service.filterAlerts = function (obj, opts) {
      if (!obj) { return; }

      var uniqueAlerts = this.removeDuplicates(obj),
        defaults = {
          scope: opts ? (opts.scope || null) : null,
          current: opts ? (opts.current || false) : false,
          only_closings: opts ? (opts.only_closings || false) : false
        };

      // Optional scope filter
      if (defaults.scope) {
        uniqueAlerts = _.where(uniqueAlerts, {scope: defaults.scope});
      }

      // Optional filter for filtering only closings by two
      // factors 1) all 2) current
      // If enabled, should return immediately, no need to
      // filter by current
      if (defaults.only_closings === 'all') {
        uniqueAlerts = this.allClosingAlerts(uniqueAlerts);
        return uniqueAlerts;
      } else if (defaults.only_closings === 'current') {
        uniqueAlerts = this.currentClosingAlerts(uniqueAlerts);
        return uniqueAlerts;
      } else if (defaults.only_closings === 'week') {
        uniqueAlerts = this.currentWeekClosingAlerts(uniqueAlerts);
        return uniqueAlerts;
      }

      // Optional filter for current alerts that are in range
      if (defaults.current === true) {
        uniqueAlerts = this.currentAlerts(uniqueAlerts);
      }

      return uniqueAlerts;
    };

    service.getHoursOrMessage = function (opts) {
      if (!opts || !opts.closedFn) {
        return;
      }

      var message = opts.message || '',
        open = opts.open || false,
        hours = opts.hours || undefined,
        hoursFn = opts.hoursFn,
        closedFn = opts.closedFn;

      // Open or closed
      if (open) {
        // Now is there an alert message?
        if (message) {
          return message;
        }

        return hoursFn(hours);
      }
      return closedFn();
    };

    service.activeClosings = function (alerts) {
      var activeAlerts = this.filterAlerts(alerts, {only_closings: 'current'});
      return (activeAlerts && activeAlerts.length) ?
          true : false;
    };

    service.getActiveMsgs = function (alertsArr) {
      if (!alertsArr) {
        return;
      }

      var alerts = this.filterAlerts(alertsArr, {only_closings: 'current'}),
        message = '';

      if (alerts.length) {
        message = 'Closed ' + alerts[0].closed_for;
      }

      return message;
    };

    return service;
  }

  /**
   * @ngdoc directive
   * @name nyplGlobalAlerts.directive:nyplGlobalAlerts
   * @restrict E
   * @scope
   * @description 
   */
  function nyplGlobalAlerts($rootScope) {
    return {
      restrict: 'E',
      template: "<div class='nypl-global-alerts' data-ng-if='$root.alerts'>" +
                  "<div data-ng-repeat='alert in $root.alerts'>" +
                    "<p data-ng-bind-html='alert.msg'></p>" +
                  "</div>" +
                "</div>",
      replace: true,
      scope: false
    };
  }

  /**
   * @ngdoc directive
   * @name nyplLocationAlerts.directive:nyplLocationAlerts
   * @restrict E
   * @scope
   * @description 
   */
  function nyplLocationAlerts(nyplAlertsService) {
    return {
      restrict: 'E',
      template: "<div class='nypl-location-alerts'" +
                    "data-ng-if='locationAlerts'>" +
                  "<div data-ng-repeat='alert in locationAlerts'>" +
                    "<p data-ng-bind-html='alert.msg'></p>" +
                  "</div>" +
                "</div>",
      replace: true,
      scope: {
        alerts: '=alerts'
      },
      link: function (scope, element, attrs) {
        if (scope.alerts) {
          scope.locationAlerts = nyplAlertsService.filterAlerts(
            scope.alerts,
            {scope: 'location', current: true}
          );
        }
      }
    };
  }

  // Initialize Alerts data through Provider
  function initAlerts($nyplAlerts, $rootScope, nyplAlertsService) {
    $nyplAlerts.getGlobalAlerts().then(function (data) {
      var alerts = $rootScope.alerts || data;
      $rootScope.alerts =
        nyplAlertsService.filterAlerts(alerts, {current: true});
      $nyplAlerts.alerts = $rootScope.alerts || data;
    }).catch(function (error) {
      throw error;
    });
  }


  /**
   * @ngdoc overview
   * @module nyplAlerts
   * @name nyplGlobalAlerts
   * @description
   */
  angular
    .module('nyplAlerts', ['ngSanitize'])
    .provider('$nyplAlerts', $nyplAlertsProvider)
    .service('nyplAlertsService', nyplAlertsService)
    .run(initAlerts)
    .directive('nyplLocationAlerts', nyplLocationAlerts)
    .directive('nyplGlobalAlerts', nyplGlobalAlerts);

})(window, window.angular);
