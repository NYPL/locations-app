/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function (window, angular, undefined) {
  'use strict';

  /** @namespace $nyplAlertsProvider */
  function $nyplAlertsProvider() {
    var options = {
          api_root: null,
          api_version: null
        };

    this.setOptions = function (opts) {
      angular.extend(options, opts);
    };

    this.$get = ['$http', '$q',
      function ($http, $q) {
        var provider = {};

        // Generates a correct Alerts API URL
        provider.generateApiUrl = function(host, version) {
          var jsonCb = '?callback=JSON_CALLBACK',
              url = host + '/' + version + '/alerts' + jsonCb;
          
          return (host.indexOf("http://") == 0 || host.indexOf("https://") == 0) ?
            url : 'http://' + url;
        };

        // Fetches API response for Alerts
        provider.getGlobalAlerts = function() {
          var defer = $q.defer(),
              url = this.generateApiUrl(options.api_root, options.api_version);

          $http.jsonp(
            url,
            {cache: true}
          )
          .success(function (data) {
            defer.resolve(data.alerts);
          })
          .error(function (data, status) {
            defer.reject(status,'Alerts API could not retrieve data, verify API');
          });

          return defer.promise;
        };

        provider['alerts'] = null;
        provider['api_url'] = options.api_root;
        provider['api_version'] = options.api_version;

      return provider;
    }];
  }

  function nyplAlertsService() {
    var service = {};

    // Filters Alerts that are within the display range
    service.activeAlerts = function(obj) {
      var today = new Date(),
          sDate,
          eDate;
      
      return _.filter(obj, function(elem) {
                if (elem.display) {
                  if (elem.display.start && elem.display.end) {
                    sDate = new Date(elem.display.start);
                    eDate = new Date(elem.display.end);
                    if (sDate.getTime() <= today.getTime() &&
                      eDate.getTime() >= today.getTime()) {
                      return elem;
                    }
                  }
                }
              });
    };

    // Removes Alerts with duplicate id's and msg
    service.removeDuplicates = function(obj) {
      return _.chain(obj)
              .indexBy('id')
              .flatten()
              .uniq(function(elem) {
                if (elem.msg) {
                  return elem.msg.toLowerCase();
                }
              })
              .value();
    };

    // Boolean check if an alert has expired
    service.isAlertExpired = function(startDate, endDate) {
      var sDate = new Date(startDate),
        eDate   = new Date(endDate),
        today   = new Date();
      return (sDate.getTime() <= today.getTime() &&
        eDate.getTime() >= today.getTime()) ? false : true;
    };

    // Assigns proper alerts based on scope (optional)
    service.setAlerts = function(obj , opts) {
      if (!obj) return;

      var uniqueAlerts = this.removeDuplicates(obj),
          defaults = {
            scope: (opts) ? ((opts.scope) ? opts.scope : null) : null,
            active: (opts) ? ((opts.active) ? opts.active : false) : false
          };

      if (defaults.scope) {
        uniqueAlerts = _.where(uniqueAlerts, {scope: defaults.scope});
      }

      if (defaults.active === true) {
        uniqueAlerts = this.activeAlerts(uniqueAlerts);
      }

      return uniqueAlerts;
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
      templateUrl: 'scripts/components/nypl_alerts/nypl_global_alerts.html',
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
      templateUrl: 'scripts/components/nypl_alerts/nypl_location_alerts.html',
      replace: true,
      scope: {
          alerts: '=alerts'
      },
      link: function (scope, element, attrs) {
        if (scope.alerts) {
          scope.locationAlerts = nyplAlertsService.setAlerts(scope.alerts, {scope:'location', active:true});
        }
      }
    };
  }

  // Initialize Alerts data through Provider
  function initAlerts($nyplAlerts, $rootScope, nyplAlertsService) {

    $nyplAlerts.getGlobalAlerts().then(function (data) {
      var alerts = $rootScope.alerts || data;
      $rootScope.alerts = nyplAlertsService.setAlerts(alerts);
      $nyplAlerts.alerts = $rootScope.alerts || data;
    });
  }


  /**
   * @ngdoc overview
   * @module nyplAlerts
   * @name nyplGlobalAlerts
   * @description
   */
  angular
    .module('nyplAlerts', [])
    .provider('$nyplAlerts', $nyplAlertsProvider)
    .service('nyplAlertsService', nyplAlertsService)
    .run(initAlerts)
    .directive('nyplLocationAlerts', nyplLocationAlerts)
    .directive('nyplGlobalAlerts', nyplGlobalAlerts)
})(window, window.angular);