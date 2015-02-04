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

      return provider;
    }];
  }

  function nyplAlertsService() {
    var service = {};

    service.setCurrentAlerts = function(obj) {
      return obj
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
  function nyplGlobalAlerts($rootScope, $timeout, $nyplAlerts, nyplAlertsService) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/components/nypl_alerts/nypl_global_alerts.html',
      replace: true,
      scope: false,
      link: function (scope, element, attrs, ctrl) {
        
        var alerts;
        $timeout(function () {
          $nyplAlerts.getGlobalAlerts().then(function (data) {
            alerts = nyplAlertsService.setCurrentAlerts(data);
            //$rootScope.alerts = alerts;
            console.log(alerts);
          });
        }, 200);
        
      },
      ctrl: ['$scope', function($scope) {

      }]
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
    .directive('nyplGlobalAlerts', nyplGlobalAlerts);

})(window, window.angular);