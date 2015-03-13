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

  /**
   * @ngdoc service
   * @name nyplAlerts.service:nyplAlertsService
   * @requires moment
   * @description
   * NYPL Alerts Service helper methods to assist with
   * filtering, sorting, retrieving specific key->values
   * from an Alerts array of objects.
   */
  function nyplAlertsService() {
    var service = {};

    /**
     * @ngdoc function
     * @name currentAlerts
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} obj Alerts Array Objects
     * @returns {object} An array of filtered alert objects
     * @description
     *  currentAlerts filters an array of alert objects that
     *  are within the range of today's date based of the
     *  display.start/display.end properties.
     */
    service.currentAlerts = function (obj) {
      var today = moment();
      var sDate,
        eDate;

      return _.filter(obj, function (elem) {
        if (elem.display) {
          if (elem.display.start && elem.display.end) {
            sDate = moment(elem.display.start);
            eDate = moment(elem.display.end);
            if (sDate.valueOf() <= today.valueOf() &&
                eDate.valueOf() >= today.valueOf()) {
              return elem;
            }
          }
        }
      });
    };

    /**
     * @ngdoc function
     * @name currentClosingAlerts
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} obj Alerts Array Objects
     * @returns {object} An array of filtered alert objects
     * @description
     *  currentClosingAlerts filters an array of alert objects that
     *  are within the range of today's date based of the
     *  applies.start/applies.end properties (optional).
     */
    service.currentClosingAlerts = function (obj) {
      var today = moment(),
        sDate,
        eDate;

      return _.filter(obj, function (elem) {
        if (elem.applies) {
          if (elem.applies.start && elem.applies.end) {
            sDate = moment(elem.applies.start);
            eDate = moment(elem.applies.end);
            // Covers alert within today
            if (sDate.valueOf() <= today.valueOf() &&
                eDate.valueOf() >= today.valueOf()) {
              return elem;
            }
            // Covers early openings
            else if (today.day() === sDate.day() &&
              eDate.day() === today.day() && eDate.valueOf() 
              >= today.valueOf()) {
              return elem;
            }
          } else if (elem.applies.start) {
            sDate = moment(elem.applies.start);
            if (sDate.valueOf() <= today.valueOf()) {
              return elem;
            }
          }
        }
      });
    };

    /**
     * @ngdoc function
     * @name currentWeekClosingAlerts
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} obj Alerts Array Objects
     * @returns {object} An array of filtered alert objects
     * @description
     *  currentWeekClosingAlerts filters an array of alert objects
     *  that include seven days from today's date based of the
     *  applies.start property.
     */
    service.currentWeekClosingAlerts = function (obj) {
      // Get the start of the day for today.
      // If you're checking today at 12pm, but there's already an alert that
      // started at 11am, the current time won't catch it.
      // If you start from the start of the day, you'll catch it.
      var today = moment().startOf('day'),
        sevenDaysFromToday = moment().add(7, 'days').endOf('day'),
        sDate;

      return _.filter(obj, function (elem) {
        if (elem.applies) {
          if (elem.applies.start) {
            sDate = moment(elem.applies.start);
            if (sevenDaysFromToday.valueOf() >= sDate.valueOf() &&
              today.valueOf() <= sDate.valueOf()) {
              return elem;
            }
          }
        }
      });
    };

    /**
     * @ngdoc function
     * @name allClosingAlerts
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} obj Alerts Array Objects
     * @returns {object} An array of filtered alert objects
     * @description
     *  allClosingAlerts filters an array of alert objects
     *  that have an applies.start property only. Date is 
     *  not taken into consideration for this filter.
     */
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

    /**
     * @ngdoc function
     * @name sortAlertsByScope
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} Alerts Array Objects
     * @returns {object} An array of alert objects
     * @description
     *  sortAlertsByScope sorts an array of alert objects
     *  by the following order 1) all 2) location 3) division.
     */
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

    /**
     * @ngdoc function
     * @name removeDuplicates
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} Alerts Array Objects
     * @returns {object} An array of filtered alert objects
     * @description
     *  removeDuplicates filters an array of alert objects
     *  to remove any duplicate alerts by checking for
     *  unique alert id's and unique alert messages.
     */
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

    /**
     * @ngdoc function
     * @name isAlertExpired
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} Alert Start Date
     * @param {object} Alert End Date
     * @returns {boolean} True or False
     * @description
     *  isAlertExpired checks whether an alert has expired
     *  based on today's date and ensuring that it is within
     *  the range of the start and end alert dates.
     */
    service.isAlertExpired = function (startDate, endDate) {
      if (!startDate || !endDate) {
        return;
      }

      var sDate = moment(startDate),
        eDate   = moment(endDate),
        today   = moment();

      return (sDate.valueOf() <= today.valueOf() &&
        eDate.valueOf() >= today.valueOf()) ? false : true;
    };

    /**
     * @ngdoc function
     * @name filterAlerts
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} Alerts Array Objects
     * @param {object} Multiple filtering parameters
     * @returns {object} An array of filtered alert objects
     * @description
     *  filterAlerts filters an array of alert objects
     *  primarily by uniqueness. The optional parameters
     *  continue to filter the Alerts array based on the
     *  desired result
     */
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

    /**
     * @ngdoc function
     * @name getHoursOrMessage
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} opts Options object
     * @returns {string} String representation of hours/message
     * @description
     *  getHoursOrMessage Checks if a branch is open, then verifies
     *  if an alert message exists. If it does, it returns the message.
     *  If no alert message exists, it returns the hours as a string.
     *  desired result
     */
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

    /**
     * @ngdoc function
     * @name activeClosings
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} Alerts Array Object
     * @returns {boolean} True/False dependent on any current alerts
     * @description
     *  activeClosings is a boolean check that returns true if any
     *  current alerts are returned from the filter. If no alerts
     *  are returned then, false is the return value.
     */
    service.activeClosings = function (alerts) {
      var activeAlerts = this.filterAlerts(alerts, {only_closings: 'current'});
      return (activeAlerts && activeAlerts.length) ?
        true : false;
    };

    /**
     * @ngdoc function
     * @name getCurrentActiveMessage
     * @methodOf nyplAlerts.service:nyplAlertsService
     * @param {object} Alerts Array of objects
     * @returns {string} Closed for message as String
     * @description
     *  getCurrentActiveMessage obtains the first closed_for key->value
     *  of filtered current closing alerts. If no alerts are
     *  found, an empty string is returned.
     */
    service.getCurrentActiveMessage = function (alertsArr) {
      if (!alertsArr) {
        return;
      }

      var alerts = this.filterAlerts(alertsArr, {only_closings: 'current'}),
        message = _.chain(alerts)
          .pluck('closed_for')
          .first()
          .value();

      return message;
    };

    return service;
  }

  /**
   * @ngdoc directive
   * @name nyplAlerts.directive:nyplGlobalAlerts
   * @restrict E
   * @scope
   * @description
   * Global alert directive.
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
   * @name nyplAlerts.directive:nyplLocationAlerts
   * @restrict E
   * @scope
   * @description
   * Alert directive for individual locations and divisions.
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
   * @name nyplAlerts
   * @description
   * NYPL Alerts module
   */
  angular
    .module('nyplAlerts', ['ngSanitize'])
    .provider('$nyplAlerts', $nyplAlertsProvider)
    .service('nyplAlertsService', nyplAlertsService)
    .run(initAlerts)
    .directive('nyplLocationAlerts', nyplLocationAlerts)
    .directive('nyplGlobalAlerts', nyplGlobalAlerts);

})(window, window.angular);
