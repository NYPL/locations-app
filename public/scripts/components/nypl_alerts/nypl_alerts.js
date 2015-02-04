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

        // Fetches API response for Alerts, returns a promise
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

        provider['api_url'] = options.api_root;;
        provider['api_version'] = options.api_version;

      return provider;
    }];
  }

  function nyplAlertsService() {
    var service = {};

    service.activeAlerts = function(obj) {
      var today = new Date(),
          sDate,
          eDate;
      
      return _.filter(obj, function(elem) {
                if (elem.display) {
                  if (elem.display.start && elem.display.end) {
                    sDate = new Date(elem.display.start);
                    eDate = new Date(elem.display.end);
                    if (sDate.getTime() <= today.getTime() && eDate.getTime() >= today.getTime()) {
                      return elem;
                    }
                  }
                }
              });
    };

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

    service.isAlertExpired = function(startDate, endDate) {
      var sDate = new Date(startDate),
        eDate   = new Date(endDate),
        today   = new Date();
      return (sDate.getTime() <= today.getTime() &&
        eDate.getTime() >= today.getTime()) ? false : true;
    };

    service.setAlerts = function(obj , scope) {
      var uniqueAlerts = this.removeDuplicates(obj);

      if (scope) {
        uniqueAlerts = _.where(uniqueAlerts, {scope: scope});
      }

      // API will handle displaying active alerts?
      //var activeAlerts = this.isAlertActive(uniqueAlerts);
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
  function nyplGlobalAlerts($rootScope, $nyplAlerts, nyplAlertsService) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/components/nypl_alerts/nypl_global_alerts.html',
      replace: true,
      scope: false,
      link: function (scope, element, attrs, ctrl) {
        var alerts;
        $nyplAlerts.getGlobalAlerts().then(function (data) {
          alerts = nyplAlertsService.setAlerts(data);
          $rootScope.alerts = alerts;
        });
        
      }
    };
  }

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
          scope.activeAlerts = nyplAlertsService.setAlerts(scope.alerts, 'location');
        }
      }
    };
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
    .directive('nyplLocationAlerts', nyplLocationAlerts)
    .directive('nyplGlobalAlerts', nyplGlobalAlerts);
})(window, window.angular);