/*jslint nomen: true, indent: 2, maxlen: 80 */
/*globals angular, window, headerScripts */

/**
 * @ngdoc overview
 * @module nypl_locations
 * @name nypl_locations
 * @requires ngSanitize
 * @requires ui.router
 * @requires ngAnimate
 * @requires locationService
 * @requires coordinateService
 * @requires nyplFeedback
 * @requires nyplSearch
 * @requires nyplSSO
 * @requires nyplNavigation
 * @requires nyplBreadcrumbs
 * @requires nyplAlerts
 * @requires angulartics
 * @requires angulartics.google.analytics
 * @requires newrelic-timing
 * @description
 * AngularJS app for NYPL's new Locations section.
 */
var nypl_locations = angular.module('nypl_locations', [
  'ngSanitize',
  'ui.router',
  'ngAnimate',
  'locationService',
  'coordinateService',
  'nyplFeedback',
  'nyplSearch',
  'nyplSSO',
  'nyplNavigation',
  'nyplBreadcrumbs',
  'angulartics',
  'angulartics.google.analytics',
  'newrelic-timing',
  'nyplAlerts'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
  '$analyticsProvider',
  '$locationProvider',
  '$stateProvider',
  '$urlRouterProvider',
  '$crumbProvider',
  '$nyplAlertsProvider',
  '$httpProvider',
  function (
    $analyticsProvider,
    $locationProvider,
    $stateProvider,
    $urlRouterProvider,
    $crumbProvider,
    $nyplAlertsProvider,
    $httpProvider
  ) {
    'use strict';

    function LoadLocation($stateParams, config, nyplLocationsService) {
      return nyplLocationsService
        .singleLocation($stateParams.location)
        .then(function (data) {
            return data.location;
        })
        .catch(function (err) {
            throw err;
        });
    }
    LoadLocation.$inject = ['$stateParams', 'config', 'nyplLocationsService'];

    function LoadSubDivision($q, $stateParams, config, nyplLocationsService) {
      var division = nyplLocationsService
                        .singleDivision($stateParams.division),
        subdivision = nyplLocationsService
                        .singleDivision($stateParams.subdivision);

      return $q.all([division, subdivision]).then(function (data) {
        var div = data[0].division,
          subdiv = data[1].division;

        return subdiv;
      });
    }
    LoadSubDivision.$inject = ['$q', '$stateParams',
      'config', 'nyplLocationsService'];

    function LoadDivision($stateParams, config, nyplLocationsService) {
      return nyplLocationsService
        .singleDivision($stateParams.division)
        .then(function (data) {
          return data.division;
        })
        .catch(function (err) {
          throw err;
        });
    }
    LoadDivision.$inject = ['$stateParams', 'config', 'nyplLocationsService'];

    function Amenities($stateParams, config, nyplLocationsService) {
      return nyplLocationsService
        .amenities($stateParams.amenity)
        .then(function (data) {
          return data;
        })
        .catch(function (error) {
          throw error;
        });
    }
    Amenities.$inject = ['$stateParams', 'config', 'nyplLocationsService'];

    function getConfig(nyplLocationsService) {
      return nyplLocationsService.getConfig();
    }
    getConfig.$inject = ['nyplLocationsService'];

    function getQueryParams($stateParams) {
      return $stateParams;
    }
    getQueryParams.$inject = ['$stateParams'];

    // Load the interceptor for the loading image.
    $httpProvider.interceptors.push(nyplInterceptor);

    // Turn off automatic virtual pageviews for GA.
    // In $stateChangeSuccess, /locations/ is added to each page hit.
    $analyticsProvider.virtualPageviews(false);

    // uses the HTML5 History API, remove hash (need to test)
    $locationProvider.html5Mode(true);

    // nyplAlerts required config settings
    $nyplAlertsProvider.setOptions({
      api_root: locations_cfg.config.api_root,
      api_version: locations_cfg.config.api_version
    });

    // Breadcrumbs initialized states
    $crumbProvider.setOptions({
      primaryState: {name:'Home', customUrl: 'http://nypl.org' },
      secondaryState: {name:'Locations', customUrl: 'home.index' }
    });

    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.url();

      // Remove trailing slash if found
      if (path[path.length - 1] === '/') {
        return path.slice(0, -1);
      }
    });

    // Set default time zone.
    moment.tz.setDefault('America/New_York');

    // This next line breaks unit tests which doesn't make sense since
    // unit tests should not test the whole app. BUT since we are testing
    // directives and using $rootScope.$digest or $rootScope.$apply,
    // it will run the app. It may not be necessary for the app though
    // since, in the run phase, if there is an error when changing state,
    // the app will go to the 404 state.
    $urlRouterProvider.otherwise('/404');
    $stateProvider
      .state('home', {
        url: '/',
        abstract: true,
        templateUrl: 'views/locations.html',
        controller: 'LocationsCtrl',
        label: 'Locations',
        resolve: {
          config: getConfig
        }
      })
      .state('home.index', {
        templateUrl: 'views/location-list-view.html',
        url: '',
        label: 'Locations'
      })
      .state('home.list', {
        templateUrl: 'views/location-list-view.html',
        url: 'list',
        label: 'Locations'
      })
      .state('home.map', {
        templateUrl: 'views/location-map-view.html',
        url: 'map?nearme&libraries',
        reloadOnSearch: false,
        controller: 'MapCtrl',
        label: 'Locations',
        resolve: {
          params: getQueryParams
        }
      })
      .state('subdivision', {
        url: '/divisions/:division/:subdivision',
        templateUrl: 'views/division.html',
        controller: 'DivisionCtrl',
        label: 'Division',
        resolve: {
          config: getConfig,
          division: LoadSubDivision
        },
        data: {
          parentState: 'location',
          crumbName: '{{division.name}}'
        }
      })
      .state('division', {
        url: '/divisions/:division',
        templateUrl: 'views/division.html',
        controller: 'DivisionCtrl',
        label: 'Division',
        resolve: {
          config: getConfig,
          division: LoadDivision
        },
        data: {
          parentState: 'location',
          crumbName: '{{division.name}}'
        }
      })
      .state('amenities', {
        url: '/amenities',
        templateUrl: 'views/amenities.html',
        controller: 'AmenitiesCtrl',
        label: 'Amenities',
        resolve: {
          config: getConfig,
          amenities: Amenities
        },
        data: {
          crumbName: 'Amenities'
        }
      })
      .state('amenity', {
        url: '/amenities/id/:amenity',
        templateUrl: 'views/amenities.html',
        controller: 'AmenityCtrl',
        label: 'Amenities',
        resolve: {
          config: getConfig,
          amenity: Amenities
        },
        data: {
          parentState: 'amenities',
          crumbName: '{{amenity.amenity.name}}'
        }
      })
      .state('amenities-at-location', {
        url: '/amenities/loc/:location',
        templateUrl: 'views/amenitiesAtLibrary.html',
        controller: 'AmenitiesAtLibraryCtrl',
        resolve: {
          config: getConfig,
          location: LoadLocation
        },
        data: {
          parentState: 'amenities',
          crumbName: '{{location.name}}'
        }
      })
      .state('404', {
        url: '/404',
        templateUrl: 'views/404.html'
      })
      .state('location', {
        url: '/:location',
        templateUrl: 'views/location.html',
        controller: 'LocationCtrl',
        resolve: {
          config: getConfig,
          location: LoadLocation
        },
        data: {
          crumbName: '{{location.name}}'
        }
      });
  }
]);

nypl_locations.run(['$analytics', '$state', '$rootScope', '$location',
  function ($analytics, $state, $rootScope, $location) {
    $rootScope.$on('$stateChangeStart', function () {
      $rootScope.close_feedback = true;
    });
    $rootScope.$on('$viewContentLoaded', function () {
      $analytics.pageTrack('/locations' + $location.path());
      $rootScope.current_url = $location.absUrl();
    });
    $rootScope.$on('$stateChangeError', function () {
      $state.go('404');
    });
  }]);

// Declare an http interceptor that will signal
// the start and end of each request
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
function nyplInterceptor($q, $injector) {
  var $http, notificationChannel;

  return {
    request: function (config) {
      // get $http via $injector because of circular dependency problem
      $http = $http || $injector.get('$http');
      // don't send notification until all requests are complete
      if ($http.pendingRequests.length < 1) {
        // get requestNotificationChannel via $injector
        // because of circular dependency problem
        notificationChannel = notificationChannel ||
          $injector.get('requestNotificationChannel');
        // send a notification requests are complete
        notificationChannel.requestStarted();
      }
      return config;
    },
    response: function (response) {
      $http = $http || $injector.get('$http');
      // don't send notification until all requests are complete
      if ($http.pendingRequests.length < 1) {
        notificationChannel = notificationChannel ||
          $injector.get('requestNotificationChannel');
        // send a notification requests are complete
        notificationChannel.requestEnded();
      }
      return response;
    },
    responseError: function (rejection) {
      $http = $http || $injector.get('$http');
      // don't send notification until all requests are complete
      if ($http.pendingRequests.length < 1) {
        notificationChannel = notificationChannel ||
          $injector.get('requestNotificationChannel');
        // send a notification requests are complete
        notificationChannel.requestEnded();
      }
      return $q.reject(rejection);
    }
  };
}

nyplInterceptor.$inject = ['$q', '$injector'];

/**
 * @ngdoc overview
 * @module nypl_widget
 * @name nypl_widget
 * @requires ngSanitize
 * @requires ui.router
 * @requires locationService
 * @requires nyplAlerts
 * @requires coordinateService
 * @requires angulartics
 * @requires angulartics.google.analytics
 * @description
 * AngularJS widget app for About pages on nypl.org.
 */
var nypl_widget = angular.module('nypl_widget', [
  'ngSanitize',
  'ui.router',
  'locationService',
  'nyplAlerts',
  'coordinateService',
  'angulartics',
  'angulartics.google.analytics'
])
.config([
  '$locationProvider',
  '$stateProvider',
  '$urlRouterProvider',
  '$nyplAlertsProvider',
  '$httpProvider',
  function (
    $locationProvider,
    $stateProvider,
    $urlRouterProvider,
    $nyplAlertsProvider,
    $httpProvider
  ) {
    'use strict';

    function LoadLocation($stateParams, config, nyplLocationsService) {
      return nyplLocationsService
        .singleLocation($stateParams.location)
        .then(function (data) {
          return data.location;
        })
        .catch(function (err) {
          throw err;
        });
    }
    LoadLocation.$inject = ['$stateParams', 'config', 'nyplLocationsService'];

    function LoadSubDivision($q, $stateParams, config, nyplLocationsService) {
      var division  = nyplLocationsService
                        .singleDivision($stateParams.division),
        subdivision = nyplLocationsService
                        .singleDivision($stateParams.subdivision);

      return $q.all([division, subdivision]).then(function (data) {
        var div = data[0],division,
          subdiv = data[1].division;

        return subdiv;
      });
    }
    LoadSubDivision.$inject = ['$q', '$stateParams',
      'config', 'nyplLocationsService'];

    function LoadDivision($stateParams, config, nyplLocationsService) {
      return nyplLocationsService
        .singleDivision($stateParams.division)
        .then(function (data) {
          return data.division;
        })
        .catch(function (err) {
          throw err;
        });
    }
    LoadDivision.$inject = ["$stateParams", "config", "nyplLocationsService"];

    function getConfig(nyplLocationsService) {
      return nyplLocationsService.getConfig();
    }
    getConfig.$inject = ["nyplLocationsService"];
    LoadDivision.$inject = ['$stateParams', 'config', 'nyplLocationsService'];

    // Load the interceptor for the loading image.
    $httpProvider.interceptors.push(nyplInterceptor);

    // uses the HTML5 History API, remove hash (need to test)
    $locationProvider.html5Mode(true);
    // $urlRouterProvider.otherwise('/widget/sasb');

    // nyplAlerts required config settings
    $nyplAlertsProvider.setOptions({
      api_root: locations_cfg.config.api_root,
      api_version: locations_cfg.config.api_version
    });

    $stateProvider
      .state('subdivision', {
        url: '/widget/divisions/:division/:subdivision',
        templateUrl: 'views/widget.html',
        controller: 'WidgetCtrl',
        resolve: {
          config: getConfig,
          data: LoadSubDivision
        } 
      })
      .state('division', {
        url: '/widget/divisions/:division',
        templateUrl: 'views/widget.html',
        controller: 'WidgetCtrl',
        label: 'Division',
        resolve: {
          config: getConfig,
          data: LoadDivision
        }
      })
      .state('widget', {
        url: '/widget/:location',
        templateUrl: 'views/widget.html',
        controller: 'WidgetCtrl',
        resolve: {
            config: getConfig,
            data: LoadLocation
        }
      });
    }
]);

/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular, _, moment */

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
      var today = moment(),
        sDate,
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
            else if (today.toDate() === sDate.toDate() &&
                eDate.toDate() === today.toDate() && eDate.valueOf()
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
        sevenDaysFromToday = moment().add(7, 'days').startOf('day'),
        sDate;

      return _.filter(obj, function (elem) {
        if (elem.applies) {
          if (elem.applies.start) {
            sDate = moment(elem.applies.start);
            if (sevenDaysFromToday.valueOf() >= sDate.valueOf() &&
                today.valueOf() <= sDate.valueOf()) {
              return elem;
            } else if (today.valueOf() >= sDate.valueOf()) {
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
        .sortBy(function (elem) {
          return elem.scope.toLowerCase() === 'all';
        })
        .sortBy(function (elem) {
          return elem.scope.toLowerCase() === 'location';
        })
        .sortBy(function (elem) {
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
      template: "<div class='nypl-global-alerts' data-ng-if='$root.alerts.length'>" +
                  "<div data-ng-repeat='alert in $root.alerts'>" +
                    "<p data-ng-bind-html='alert.msg'></p>" +
                  "</div>" +
                "</div>",
      replace: true,
      scope: false
    };
  }
  nyplGlobalAlerts.$inject = ['$rootScope'];

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
      template: "<div class='nypl-location-alerts' " +
                    "data-ng-if='locationAlerts.length'>" +
                  "<div data-ng-repeat='alert in locationAlerts'>" +
                    "<p data-ng-bind-html='alert.msg'></p>" +
                  "</div>" +
                "</div>",
      replace: false,
      scope: {
        alerts: '=alerts',
        type: '@'
      },
      link: function (scope, element, attrs) {
        var alertsOne, alertsTwo;

        if (scope.alerts && scope.type.length) {
          alertsOne = nyplAlertsService.filterAlerts(
            scope.alerts,
            {scope: scope.type, current: true}
          );
        }
        // Special Case for Division Alerts
        // --------------------------------
        // Check if there are any parent location
        // alerts and merge both arrays.
        if (scope.type === 'division') {
          alertsTwo = nyplAlertsService.filterAlerts(
            scope.alerts,
            {scope: 'location', current: true}
          );
        }

        scope.locationAlerts = (alertsTwo && alertsTwo.length) ?
          alertsTwo.concat(alertsOne) : alertsOne;
      }
    };
  }
  nyplLocationAlerts.$inject = ['nyplAlertsService'];

  // Initialize Alerts data through Provider
  function initAlerts($nyplAlerts, $rootScope, nyplAlertsService) {
    $nyplAlerts.getGlobalAlerts().then(function (data) {
      var alerts = $rootScope.alerts || data;
      $rootScope.alerts =
        nyplAlertsService.filterAlerts(alerts, {current: true});

      // Assign Raw Alerts without filter
      $nyplAlerts.alerts = data;
    }).catch(function (error) {
      throw error;
    });
  }

  initAlerts.$inject = ['$nyplAlerts', '$rootScope', 'nyplAlertsService'];

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
/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function (window, angular, undefined) {
  'use strict';
 
  /** @namespace $Crumb */
  function $Crumb() {
    var options = {
      primaryState: {
        name: null,
        customUrl: null
      },
      secondaryState: {
        name: null,
        customUrl: null
      }
    };

    /** @function $Crumb.setOptions
     * @param {obj} opts object containing state data.
     * @returns angular.extend() with set opts
     * @description Extends the destination object dst 
     *  by copying all of the properties from the src object(s) to dst
     */
    this.setOptions = function (opts) {
      angular.extend(options, opts);
    };

    /** @function $Crumb.$get
     * @description Provider Recipe - Exposes an API for application-wide
     *  configuration that must be made before the application starts. 
     *  Used for re-usable services.
     */
    this.$get = ['$state', '$stateParams',
      function ($state, $stateParams) {
        // Add the state in the chain, if found simply return
        var addStateToChain = function (chain, state) {
          var i, len;
          for (i = 0, len = chain.length; i < len; i += 1) {
            if (chain[i].name === state.name) {
              return;
            }
          }
          // Does not support abstract states
          if (!state.abstract) {
            if (state.customUrl) {
              state.url = $state.href(state.name, $stateParams || {});
              chain.unshift(state);
            }
          }
        };

        return {
          // Adds provider custom states to chain (global scope)
          getConfigChain: function () {
            var chain = [];

            if (options.secondaryState) {
              addStateToChain(chain, options.secondaryState);
            }
            if (options.primaryState) {
              addStateToChain(chain, options.primaryState);
            }
            return chain;
          }
        };
      }];
  }

  /**
   * @ngdoc directive
   * @name nyplBreadcrumbs.directive:nyplBreadcrumbs
   * @restrict E
   * @requires $interpolate
   * @requires $state
   * @requires $crumb
   * @scope
   * @description
   * Displays a custom NYPL breadcrumbs menu.
   * @example
   * <pre>
   *  <!-- data.crumbName is set in the router configurations -->
   *  <nypl-breadcrumbs crumb-name="data.crumbName"></nypl-breadcrumbs>
   * </pre>
   */
  function nyplBreadcrumbs($interpolate, $state, $crumb) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/components/nypl_breadcrumbs/nypl_breadcrumbs.html',
      scope: {
        crumbName: '@'
      },
      link: function (scope) {
        scope.breadcrumbs = [];

        /** @function nyplBreadcrumbs.getObjectValue
         * @param {string} set string variable in directive attribute
         * @param {obj} current state context object
         * @returns {string}
         * @description Given a string of the type 'object.property.property', 
         * traverse the given context (eg the current $state object) 
         * and return the value found at that path.
         * 
         */
        function getObjectValue(objectPath, context) {
          var i,
            propertyArray = objectPath.split('.'),
            propertyReference = context;

          for (i = 0; i < propertyArray.length; i += 1) {
            if (angular.isDefined(propertyReference[propertyArray[i]])) {
              propertyReference = propertyReference[propertyArray[i]];
            }
          }
          return propertyReference;
        }

        /** @function nyplBreadcrumbs.getWorkingState
        * @param {obj}
        * @returns {obj, boolean}
        * @description Get the state to put in the breadcrumbs array, 
        * taking into account that if the current state is abstract,
        * we need to either substitute it with the state named in the
        * `scope.abstractProxyProperty` property, or set it to `false`
        * which means this breadcrumb level will be skipped entirely.
        */
        function getWorkingState(currentState) {
          var proxyStateName,
            workingState = currentState;

          if (currentState.abstract === true) {
            if (typeof scope.abstractProxyProperty !== 'undefined') {
              proxyStateName = getObjectValue(scope.abstractProxyProperty, currentState);
              if (proxyStateName) {
                workingState = $state.get(proxyStateName);
              } else {
                workingState = false;
              }
            } else {
              workingState = false;
            }
          }
          return workingState;
        }

        /** @function nyplBreadcrumbs.getCrumbName
        * @param {obj}
        * @returns {string, boolean}
        * @description Resolve the name of the Breadcrumb of the specified state. 
        *  Take the property specified by the `displayname-property`
        *  attribute and look up the corresponding property 
        *  on the state's config object. The specified string can be interpolated
        */
        function getCrumbName(currentState) {
          var interpolationContext,
            propertyReference,
            displayName;

          if (!scope.crumbName) {
            // if the displayname-property attribute was not specified, 
            // default to the state's name
            return currentState.name;
          }

          propertyReference = getObjectValue(scope.crumbName, currentState);
          // use the $interpolate service to handle any bindings
          interpolationContext =  (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
            
          if (propertyReference === false) {
            return false;
          }
          else if (typeof propertyReference === 'undefined') {
            return currentState.name;
          }

          if (interpolationContext) {
            displayName = $interpolate(propertyReference)(interpolationContext);
            return displayName;
          }
        }

        /** @function nyplBreadcrumbs.getParentState
         * @param {obj}
         * @returns {obj, null}
         * @description Resolve the Parent State given from the parentState property.
         *  Extract parentState names and state ui-href properties and assign to object
         *  Utilize the currentState.parentSetting to check for validity in config
         */
        function getParentState(currentState) {
          var currState = currentState,
            parentStateSetting = currState.data.parentState,
            parentStateRoute,
            parentStateName,
            parentDivisionName,
            parentDivisionRoute,
            parentStateObj = {},
            context = (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;

          if (typeof context === 'object' && parentStateSetting) {
            if (!context.$stateParams) {
              return undefined;
            }
            // Extract Parent-state properties
            parentStateName  = getParentName(currentState);
            parentStateRoute = getParentRoute(context, parentStateSetting);   

            // Extract parent division if available
            parentDivisionName  = getParentDivisionName(context); 
            parentDivisionRoute = getParentDivisionRoute(context);

            if (parentStateName && parentStateRoute) {
              // Create parent object
              parentStateObj = {
                displayName: parentStateName,
                route: parentStateRoute
              }
            }

            if (parentDivisionName && parentDivisionRoute) {
              parentStateObj.division = {
                name: parentDivisionName,
                route: parentDivisionRoute
              }
            }

            if (parentStateObj) {
              return parentStateObj;
            }
            return undefined;
          }
          return undefined;
        }

        function getParentDivisionRoute(context) {
          var currentContext = context,
            divisionState = 'division',
            parentRoute,
            parentData;

          if (typeof currentContext === 'object') {
            // Loop through context and find parent data
            Object.keys(currentContext).forEach(function(key) {
              if (key !== '$stateParams') {
                parentData = currentContext[key];
              }
            });

            // Get the slug for the parent route
            if (parentData._embedded !== undefined) {
              if (parentData._embedded.parent) {
                if (parentData._embedded.parent.slug) {
                  parentRoute = parentData._embedded.parent.slug;
                  return divisionState + 
                          '({ ' + "\"" + divisionState +
                           "\"" + ':' + "\"" + parentRoute +
                            "\"" + '})';
                }
              }
            }
            return undefined;
          }
          return undefined;
        }

        function getParentDivisionName(context) {
          var currentContext = context,
            parentName,
            parentData;

          if (typeof currentContext === 'object') {
            // Loop through context and find parent data
            Object.keys(currentContext).forEach(function(key) {
              if (key !== '$stateParams') {
                parentData = currentContext[key];
              }
            });

            // Get the slug for the parent route
            if (parentData._embedded !== undefined) {
              if (parentData._embedded.parent) {
                if (parentData._embedded.parent.name) {
                  parentName = parentData._embedded.parent.name;
                  return parentName;
                }
              }
            }
            return undefined;
          }
          return undefined;
        }

        /** @function nyplBreadcrumbs.getParentRoute
         * @param {obj}
         * @param {string}
         * @returns {obj, undefined}
         * @description Resolve the Parent route given from the parentState property.
         *  Traverse the current state context and find matches to the parent property
         */
        function getParentRoute(context, parentStateSetting) {
          var currentContext = context,
            stateSetting = parentStateSetting,
            parentRoute,
            parentData;

          if (typeof currentContext === 'object' && stateSetting) {
            // Loop through context and find parent data
            Object.keys(currentContext).forEach(function(key) {
              if (key !== '$stateParams') {
                parentData = currentContext[key];
              }
            });

            // Get the slug for the parent route
            if (parentData.amenity) {
              if (parentData.amenity.id) {
                parentRoute = parentData.amenity.id;
              }
            }
            else if (parentData._embedded) {
              if (parentData._embedded.location) {
                if (parentData._embedded.location.slug) {
                  parentRoute = parentData._embedded.location.slug;
                }
              }
            }

            if (parentRoute) {
              return stateSetting + '({ ' + "\"" +
                     stateSetting + "\"" + ':' + "\"" +
                      parentRoute + "\"" + '})';
            }
            return stateSetting;
          }
          return undefined;
        }

        /** @function nyplBreadcrumbs.getParentName
         * @param {obj}
         * @returns {string}
         * @description Resolve the Parent name from the current state
         */
        function getParentName(currentState) {
          var parentStateSetting = currentState.data.parentState,
            parentStateData = $state.get(parentStateSetting),
            context = (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState,
            parentStateName,
            parentData;

          if (parentStateData) {
            parentStateName = $interpolate(parentStateData.data.crumbName)(context);
            if (parentStateName) {
              return parentStateName;
            }
            // Not within the context interpolation, loop though object
            else if ( typeof context === 'object') {
              // Loop through context and find parent data
              Object.keys(context).forEach(function(key) {
                if (key !== '$stateParams') {
                  parentData = context[key];
                }
              });
              

              if (parentData.amenity) {
                if (parentData.amenity.name) {
                  parentStateName = parentData.amenity.name;
                }
              }
              else if (parentData._embedded) {
                if (parentData._embedded.location) {
                  if (parentData._embedded.location.name) {
                    parentStateName = parentData._embedded.location.name;
                  }
                }
              }

              if (parentStateName) {
                return parentStateName;
              }
              return parentStateSetting;
            }
          }
          return undefined;
        }

        /** @function nyplBreadcrumbs.stateAlreadyInBreadcrumbs
         * @param {obj}
         * @param {obj}
         * @returns {boolean}
         * @description Check whether the current `state` has already appeared in the current
         *  breadcrumbs object. This check is necessary when using abstract states that might 
         *  specify a proxy that is already there in the breadcrumbs.
         */
        function stateAlreadyInBreadcrumbs(state, breadcrumbs) {
          var i,
            alreadyUsed = false;
          for(i = 0; i < breadcrumbs.length; i++) {
            if (breadcrumbs[i].route === state.name) {
              alreadyUsed = true;
            }
          }
          return alreadyUsed;
        }

        /** @function nyplBreadcrumbs.initCrumbs
        * @returns {array}
        * @description Start with the current state and traverse up the path to build the
        * array of breadcrumbs that can be used in an ng-repeat in the template.
        */
        function initCrumbs() {
          var i,
            workingState,
            displayName,
            parentState,
            breadcrumbs = [],
            currentState = $state.$current,
            configStates = $crumb.getConfigChain();

          // Add initial configuration states if set
          if (configStates) {
            for (i = 0; i < configStates.length; i += 1) {
              breadcrumbs.push({
                displayName: configStates[i].name,
                route: configStates[i].customUrl
              });
            }
          }
          // Extract parent state if available
          parentState = getParentState(currentState);
          if (parentState) {
            // Parent data
            if (parentState.displayName && parentState.route) {
              breadcrumbs.push({
                displayName: parentState.displayName,
                route: parentState.route
              });
            }
            // Division data
            if (parentState.division) {
              breadcrumbs.push({
                displayName: parentState.division.name,
                route: parentState.division.route
              });
            }
          }

          // If the current-state is active and not empty
          // Then obtain the displayName and routes to be added
          while(currentState && currentState.name !== '') {

            workingState = getWorkingState(currentState);

            if (workingState) {
              displayName = getCrumbName(workingState);

              if (displayName !== false && !stateAlreadyInBreadcrumbs(workingState, breadcrumbs)) {
                breadcrumbs.push({
                  displayName: displayName,
                  route: workingState.name
                });
              }
            }

            // Assign parent as current state if available
            if (currentState.parent) {
              currentState = currentState.parent;
            }
          }
          scope.breadcrumbs = breadcrumbs;
        }

        // Initialize Crumbs
        if ($state.$current.name !== '') {
          initCrumbs();
        }
        scope.$on('$stateChangeSuccess', function () {
          initCrumbs();
        });
      }
    };
  }
  nyplBreadcrumbs.$inject = ["$interpolate", "$state", "$crumb"];

  /**
   * @ngdoc overview
   * @module nyplBreadcrumbs
   * @name nyplBreadcrumbs
   * @description
   * AngularJS module for adding a custom NYPL breadcrumbs to all pages except
   * the homepage.
   */
  angular
    .module('nyplBreadcrumbs', [])
    .provider('$crumb', $Crumb)
    .directive('nyplBreadcrumbs', nyplBreadcrumbs);

})(window, window.angular);
/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nyplFeedback.directive:nyplFeedback
   * @restrict E
   * @requires $sce
   * @requires $rootScope
   * @scope
   * @description
   * Creates a small form component on the page that outputs an iframe to a
   * the link that's passed as an attribute. The height and width must also
   * be included when being created. The feedback button can display on the
   * right or left side of the page.
   * @example
   * <pre>
   *  <!-- Display the button on the right side and slide the feedback left -->
   *  <nypl-feedback data-url="https://www.surveymonkey.com/s/8T3CYMV"
   *    data-side="right" data-height="660" data-width="300"></nypl-feedback>
   *
   *  <!-- Display the button on the left side and slide the feedback right,
   *    different height and width -->
   *  <nypl-feedback data-url="https://www.surveymonkey.com/s/8T3CYMV"
   *    data-side="right" data-height="500" data-width="290"></nypl-feedback>
   * </pre>
   */
  function nyplFeedback($sce, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/components/nypl_feedback/nypl_feedback.html',
      replace: true,
      scope: {
        height: '@',
        width: '@',
        url: '@',
        side: '@'
      },
      link: function (scope, element, attrs) {
        var arrow_direction = 'right';

        scope.trusted_url = $sce.trustAsResourceUrl(scope.url);
        scope.feedback = 'Feedback';

        if (scope.side === 'left') {
          element.addClass('left');
          arrow_direction = 'left';
        } else {
          element.addClass('right');
        }

        $rootScope.$watch('close_feedback', function (newVal, oldVal) {
          if (newVal) {
            $rootScope.close_feedback = false;
            element.removeClass('open');
            scope.feedback = 'Feedback';
            // element.find('a').removeClass('icon-arrow-' + arrow_direction);
          }
        });

        element.find('a').click(function () {
          element.toggleClass('open');
          // element.find('a').toggleClass('icon-arrow-' + arrow_direction);
          scope.feedback = element.hasClass('open') ? 'Close' : 'Feedback';

          scope.$apply();
        });
      }
    };
  }
  nyplFeedback.$inject = ["$sce", "$rootScope"];

  /**
   * @ngdoc overview
   * @module nyplFeedback
   * @name nyplFeedback
   * @description
   * AngularJS module for adding a feedback button and iframe to the site.
   * Currently used for adding Survey Monkey as the feedback form.
   */
  angular
    .module('nyplFeedback', [])
    .directive('nyplFeedback', nyplFeedback);

})();
/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nyplNavigation.directive:nyplNavigation
   * @restrict E
   * @requires ssoStatus
   * @requires $window
   * @requires $rootScope
   * @scope
   * @description
   * Displays the NYPL navigation menu.
   * @example
   * <pre>
   *  <nypl-navigation></nypl-navigation>
   * </pre>
   */
  function nyplNavigation(ssoStatus, $window, $rootScope) {
    return {
      restrict: 'E',
      scope: {
        activenav: '@',
        menuitem: '@'
      },
      replace: true,
      templateUrl: 'scripts/components/nypl_navigation/nypl_navigation.html',
      link: function (scope, element, attrs) {
        // Open/Close Main Navigation
        $('.dropDown').hover(
          function () {
            $(this).addClass('openDropDown');
          },
          function () {
            $(this).removeClass('openDropDown');
          }
        );

        $rootScope.$watch('current_url', function () {
          scope.logout_url = "https://nypl.bibliocommons.com/user/logout" +
            "?destination=" + $rootScope.current_url;
        })

        // Toggle Mobile Login Form
        $('.mobile-login').click(function (e) {
          e.preventDefault();
          if (ssoStatus.logged_in()) {
            $window.location.href = scope.logout_url;
          } else {
            $('.sso-login').toggleClass('visible');
          }
        });

        scope.menuLabel = 'Log In';
        if (ssoStatus.logged_in()) {
          scope.menuLabel = 'Log Out';
        }

      }
    };
  }
  nyplNavigation.$inject = ['ssoStatus', '$window', '$rootScope'];

  /**
   * @ngdoc directive
   * @name nyplNavigation.directive:nyplCollapsedButtons
   * @restrict E
   * @scope
   * @description
   * Displays the mobile collapsed buttons and add click event handlers.
   * @example
   * <pre>
   *  <nypl-collapsed-buttons></nypl-collapsed-buttons>
   * </pre>
   */
  function nyplCollapsedButtons() {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      templateUrl: 'scripts/components/nypl_navigation/nypl_collapsed_buttons.html',
      link: function (scope, element, attrs) {
        // Toggle Mobile Navigation
        var navBtn = element.find('.nav-open-button'),
          searchBtn = element.find('.search-open-button');

        navBtn.click(function () {
          $(this).toggleClass('open');
          searchBtn.removeClass('open');
          $('#search-block-form-input').removeClass('open-search');
          $('.search-options-resp').removeClass('open');
          $('#search-top').removeClass('open');
          $('#main-nav').toggleClass('open-navigation');
          $('.sso-login').removeClass('visible');
          return false;
        });

        // Toggle Mobile Search
        searchBtn.click(function () {
          $(this).toggleClass('open');
          navBtn.removeClass('open');
          $('#search-block-form-input').toggleClass('open-search');
          $('#search-top').toggleClass('open');
          $('#main-nav').removeClass('open-navigation');
          $('.sso-login').removeClass('visible');
          return false;
        });

      }
    };
  }

  /**
   * @ngdoc overview
   * @module nyplNavigation
   * @name nyplNavigation
   * @description
   * AngularJS module for adding the NYPL navigation menu as a directive.
   * This module also has a directive for adding mobile collapsed buttons.
   */
  angular
    .module('nyplNavigation', [])
    .directive('nyplNavigation', nyplNavigation)
    .directive('nyplCollapsedButtons', nyplCollapsedButtons);

})();


/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nyplSearch.directive:nyplSearch
   * @restrict E
   * @requires $analytics
   * @scope
   * @description
   * Displays the NYPL search from. Design and event handlers.
   * @example
   * <pre>
   *  <nypl-search></nypl-search>
   * </pre>
   */
  function nyplSearch($analytics) {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      templateUrl: 'scripts/components/nypl_search/nypl_search.html',
      link: function (scope, element, attrs) {
        var o = {};

        // Set search box placeholder based on selected item
        function setPrompt(lmnt) {
          var item = lmnt.closest('li');
          if (item.hasClass('search-the-catalog')) {
            return o.term.attr('placeholder', o.prompt.catalog);
          }

          if (item.hasClass('search-the-website')) {
            return o.term.attr('placeholder', o.prompt.site);
          }

          return o.term.attr('placeholder', o.prompt.default_val);
        }

        // Get the search term from the input box. Returns '' if the
        // term is undefined
        function searchTerm() {
          return $.trim(o.term.val());
        }

        // Set error state in the search input box
        function setError(err) {
          if (err === undefined) {
            err = 'Please enter a search term';
          }
          return o.term.addClass('error').attr('placeholder', err);
        }

        // Clear error state in the search input box
        function clearError() {
          return o.term.removeClass('error').attr('placeholder', '');
        }

        // The element referred to by mobile_flag should be hidden by
        // a media query. Checking whether or not it is visible will tell
        // us if that mediq query is active
        function isMobile() {
          return !o.mobile_flag.is(':visible');
        }

        // Get text of the active search scope selection.
        // choice: optional element to use
        function getChoice(choice) {
          if (choice === undefined) {
            choice = o.choices.find('input[type=radio]:checked').parent();
          }
          return $.trim(choice.text()).toLowerCase();
        }

        // Execute the search
        function doSearch(scope) {
          var term = searchTerm(),
            target;

          if (scope === undefined) {
            scope = getChoice();
          }

          // Don't perform search if no term has been entered
          if (term.length === 0) {
            setError();
            $analytics.eventTrack('Empty Search',
                    { category: 'Header Search', label: '' });

            return false;
          }

          if (scope === 'nypl.org') {
            target = window.location.protocol + '//' + 'nypl.org'
              + '/search/apachesolr_search/' + term;

            $analytics.eventTrack('Submit Search',
                    { category: 'Header Search', label: term });
          } else {
            // Bibliocommons by default
            target = 'http://nypl.bibliocommons.com/search?t=smart&q='
              + term + '&commit=Search&searchOpt=catalogue';

            $analytics.eventTrack('Submit Catalog Search',
                    { category: 'Header Search', label: term });
          }
          window.location = target;
          return false;
        }

        function init() {
          angular.element('html').click(function () {
            element.find('.pseudo-select').removeClass('open');
            element.find('.error').removeClass('error');
          });

          var lmnt = element;

          o.term = lmnt.find('#search-block-form-input');
          o.search_button = lmnt.find('.search_button');
          o.choices = lmnt.find('.pseudo-select');
          o.mobile_flag = lmnt.find('.search-button');
          o.prompt = {
            default_val: o.term.attr("placeholder"),
            catalog: "Search the catalog",
            site: "Search NYPL.org"
          };

          // Don't let clicks get out of the search box
          lmnt.click(function (e) {
            e.stopPropagation();
          });

          // Override default submit, fire search button click event 
          // instead
          lmnt.find("#search-block-form").submit(function () {
            o.search_button.click();
            return false;
          });

          // Open search scope pane when you click into the
          // search input
          o.term.focus(function (e) {
            o.choices.addClass('open');
            $analytics.eventTrack('Focused',
                    { category: 'Header Search', label: 'Search Box' });
          });

          // If the error class has been set on the input box, remove it
          // when the user clicks into it
          o.term.focus(function () {
            clearError();
          });

          // Setup click action on submit button.
          lmnt.find('.search-button').click(function () {
            return doSearch();
          });

          // Setup click action on radio butons
          o.choices.find('li input').click(function () {
            setPrompt(angular.element(this));
            $analytics.eventTrack('Select',
                    { category: 'Header Search', label: getChoice() });
          });

          // Setup click action on list items (will be active when items are
          // as buttons on narrow screens
          o.choices.find('li').click(function () {
            if (isMobile()) {
              if (searchTerm().length === 0) {
                setError();
              } else {
                doSearch(getChoice(angular.element(this)));
              }
            }
          });
        }

        init();
      }
    };
  }
  nyplSearch.$inject = ['$analytics'];

  /**
   * @ngdoc overview
   * @module nyplSearch
   * @name nyplSearch
   * @description
   * AngularJS module for managing the header search form and its input.
   */
  angular
    .module('nyplSearch', [
      'angulartics',
      'angulartics.google.analytics'
    ])
    .directive('nyplSearch', nyplSearch);

})();


/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nyplSSO.directive:nyplSso
   * @restrict E
   * @requires ssoStatus
   * @requires $window
   * @requires $rootScope
   * @scope
   * @description
   * Displays the NYPL SSO/donate button and login forms, to sign in and the
   * Bibliocommons signed in menu.
   * @example
   * <pre>
   *  <nypl-sso></nypl-sso>
   * </pre>
   */
  function nyplSSO(ssoStatus, $window, $rootScope) {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      templateUrl: 'scripts/components/nypl_sso/nypl_sso.html',
      link: function (scope, element, attrs) {
        var ssoLoginElement = $('.sso-login'),
          ssoUserButton = $('.login-button'),
          enews_email = $('.email-input-field'),
          enews_submit = $('#header-news_signup input[type=submit]'),
          enews_container = $('.header-newsletter-signup');

        enews_email.focus(function () {
          $('.newsletter_policy').slideDown();
        });

        enews_email.blur(function () {
          $('.newsletter_policy').slideUp();
        });

        enews_submit.click(function () {
          if (enews_email.val() === '') {
            enews_email.focus();
            return false;
          }
        });

        function makeForm(username, pin, checkbox, button) {
          var current_url = '';

          if (ssoStatus.remembered()) {
            username.val(ssoStatus.remember()); // Fill in username
            checkbox.attr("checked", true); // Mark the checkbox
          }
          
          // If the checkbox is unchecked, remove the cookie
          checkbox.click(function () {
            if (!$(this).is(':checked')) {
              ssoStatus.forget();
            }
          });

          $rootScope.$watch('current_url', function () {
            current_url = $rootScope.current_url;
          });

          // Submit the login form
          button.click(function (e) {
            var url = 'https://nypl.bibliocommons.com/user/login?destination=';
            e.preventDefault();

            if (checkbox.is(':checked')) {
              ssoStatus.remember(username.val());
            }

            url += current_url.replace('#', '%23') + '&';
            url += 'name=' + username.val();
            url += '&user_pin=' + pin.val();

            $window.location.href = url;
          });
        }

        function initForm(options) {
          var defaults = {
              username: '#username',
              pin: '#pin',
              remember_checkbox: '#remember_me',
              login_button: '#login-form-submit'
            },
            settings = $.extend({}, defaults, options);

          if (ssoStatus.logged_in()) {
            ssoLoginElement.addClass('logged-in');
          }

          makeForm(
            $(settings.username),
            $(settings.pin),
            $(settings.remember_checkbox),
            $(settings.login_button)
          );
        }

        function userButton(options) {
          $rootScope.$watch('current_url', function () {
            scope.logout_url = "https://nypl.bibliocommons.com/user/logout" +
              "?destination=" + $rootScope.current_url;
          })

          // Set the button label
          scope.header_button_label = "LOG IN";

          if (ssoStatus.logged_in()) {
            scope.header_button_label = ssoStatus.login();
            ssoUserButton.addClass('logged-in');
          }

          // Toggle Desktop Login Form
          ssoUserButton.click(function () {
            ssoLoginElement.toggleClass('visible');
          });
        }

        initForm();
        userButton();

      }
    };
  }
  nyplSSO.$inject = ['ssoStatus', '$window', '$rootScope'];

  /**
   * @ngdoc service
   * @name nyplSSO.service:ssoStatus
   * @description
   * AngularJS service used to check browser cookies to verify if a user
   * is logged in or not. Sets cookie when signing in and can remove cookies.
   */
  function ssoStatus() {
    var ssoStatus = {};

    /**
     * @ngdoc function
     * @name login
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {string} User's usename from the bc_username cookie. If the
     * user is not logged in, undefined will be returned.
     */
    ssoStatus.login = function () {
      return $.cookie('bc_username');
    };

    /**
     * @ngdoc function
     * @name logged_in
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {boolean} True if the user is logged in and false otherwise.
     */
    ssoStatus.logged_in = function () {
      return !!(this.login() && this.login() !== null);
    };

    /**
     * @ngdoc function
     * @name remember
     * @methodOf nyplSSO.service:ssoStatus
     * @param {string} [name] A setter and getter. Sets the user's username
     *  if the parameter was passed. If no parameter was passed, it will return
     *  the username from the remember_me cookie.
     * @returns {string} User's usename from the bc_username cookie. If the
     *  user is not logged in, undefined will be returned.
     */
    ssoStatus.remember = function (name) {
      if (name) {
        return $.cookie('remember_me', name, {path: '/'});
      }
      return $.cookie('remember_me');
    };

    /**
     * @ngdoc function
     * @name remembered
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {boolean} Returns true if the user clicked on the 'Remember me'
     *  checkbox and the cookie is set, false otherwise.
     */
    ssoStatus.remembered = function () {
      var remember_me = this.remember();
      return !!(remember_me && remember_me !== null);
    };

    /**
     * @ngdoc function
     * @name forget
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {boolean} Delete the 'remember_me' cookie if the 'Remember me'
     *  checkbox was unselected when submitting the form. Returns true if
     *  deleting was successful, false if deleting the cookie failed.
     */
    ssoStatus.forget = function () {
      return $.removeCookie('remember_me', {path: '/'});
    };

    return ssoStatus;
  }

  /**
   * @ngdoc overview
   * @module nyplSSO
   * @name nyplSSO
   * @description
   * AngularJS module for adding the SSO header button and functionality
   * including browser cookies for verifying against Bibliocommons.
   */
  angular
    .module('nyplSSO', [])
    .service('ssoStatus', ssoStatus)
    .directive('nyplSso', nyplSSO);

})();
/*jslint indent: 2, maxlen: 80 */
/*globals nypl_locations, angular */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name coordinateService.service:nyplCoordinatesService
   * @requires $q
   * @requires $window
   * @description
   * AngularJS service to get a user's geolocation coordinates and calculate
   * the distance between two points.
   */
  function nyplCoordinatesService($q, $window) {
    var geoCoords = null,
      coordinatesService = {};

    /**
     * @ngdoc function
     * @name geolocationAvailable
     * @methodOf coordinateService.service:nyplCoordinatesService
     * @returns {boolean} True if navigator and navigator.geolocation are
     *  available in the browser, false otherwise.
     */
    coordinatesService.geolocationAvailable = function () {
      return (!$window.navigator && !$window.navigator.geolocation) ?
          false :
          true;
    };

    /**
     * @ngdoc function
     * @name getBrowserCoordinates
     * @methodOf coordinateService.service:nyplCoordinatesService
     * @returns {object} Deferred promise. If it resolves, it will return an
     *  object with the user's current position as latitude and longitude
     *  properties. If it is rejected, it will return an error message based
     *  on what kind of error occurred.
     * @example
     * <pre>
     *  nyplCoordinatesService.getBrowserCoordinates()
     *    .then(function (position) {
     *      var userCoords = _.pick(position, 'latitude', 'longitude');
     *    })
     *    .catch(function (error) {
     *      throw error;
     *    });
     * </pre>
     */
    coordinatesService.getBrowserCoordinates = function () {
      // Object containing success/failure conditions
      var defer = $q.defer();

      // Verify the browser supports Geolocation
      if (!this.geolocationAvailable()) {
        defer.reject(new Error("Your browser does not support Geolocation."));
      } else {
        // Use stored coords, FF bug fix
        // if (geoCoords) {
        //   defer.resolve(geoCoords);
        // } else {
        $window.navigator.geolocation.getCurrentPosition(
          function (position) {
            // Extract coordinates for geoPosition obj
            geoCoords = position.coords;
            defer.resolve(geoCoords);

            // Testing a user's location that is more than 
            // 25miles of any NYPL location
            // var coords = {
            //     'latitude': 42.3581,
            //     'longitude': -71.0636
            // }
            // defer.resolve(coords);
          },
          function (error) {
            switch (error.code) {
            case error.PERMISSION_DENIED:
              defer.reject(new Error("Permission denied."));
              break;

            case error.POSITION_UNAVAILABLE:
              defer.reject(new Error("The position is currently unavailable."));
              break;

            case error.TIMEOUT:
              defer.reject(new Error("The request timed out."));
              break;

            default:
              defer.reject(new Error("Unknown error."));
              break;
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 600000
          }
        );
        // }
      }

      return defer.promise; // Enables 'then' callback
    };

    /**
     * @ngdoc function
     * @name getDistance
     * @methodOf coordinateService.service:nyplCoordinatesService
     * @param {number} lat1 Latitude of first location.
     * @param {number} lon1 Longitude of first location.
     * @param {number} lat2 Latitude of second location.
     * @param {number} lon2 Longitude of second location.
     * @returns {number} Distance in miles between two different locations.
     * @example
     * <pre>
     *  var distance =
     *    nyplCoordinatesService.getDistance(40.1, -73.1, 41.1, -73.2);
     * </pre>
     */
    coordinatesService.getDistance = function (lat1, lon1, lat2, lon2) {
      if (!lat1 || !lon2 || !lat2 || !lon2) {
        return undefined;
      }

      var radlat1 = Math.PI * lat1 / 180,
        radlat2 = Math.PI * lat2 / 180,
        theta = lon1 - lon2,
        radtheta = Math.PI * theta / 180,
        distance;

      distance = Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      distance = Math.acos(distance);
      distance = distance * 180 / Math.PI;
      distance = distance * 60 * 1.1515;
      return Math.ceil(distance * 100) / 100;
    };

    return coordinatesService;
  }
  nyplCoordinatesService.$inject = ['$q', '$window'];

  /**
   * @ngdoc overview
   * @module coordinateService
   * @name coordinateService
   * @description
   * AngularJS module that provides a service to use a browser's geolocation
   * coordinates and a function to calculate distance between two points.
   */
  angular
    .module('coordinateService', [])
    .factory('nyplCoordinatesService', nyplCoordinatesService);

})();


/*jslint indent: 4, maxlen: 80 */
/*globals angular */

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name locationService.service:nyplLocationsService
     * @requires $http
     * @requires $q
     * @description
     * AngularJS service to call different API endpoints.
     */
    function nyplLocationsService($http, $q) {
        var api, config,
            jsonp_cb = '?callback=JSON_CALLBACK',
            apiError = 'Could not reach API',
            locationsApi = {};

        /**
         * @ngdoc function
         * @name getConfig
         * @methodOf locationService.service:nyplLocationsService
         * @returns {object} Deferred promise.
         * @description
         * Used to get Sinatra generated config variables.
         */
        locationsApi.getConfig = function () {
            var defer = $q.defer();

            if (config) {
               defer.resolve(config);
            } else {
                config = window.locations_cfg.config;

                if (config) {
                    api = config.api_root + '/' + config.api_version;
                    defer.resolve(config);
                } else {
                    defer.reject(apiError + ': config');
                }
            }

            return defer.promise;
        }

        /**
         * @ngdoc function
         * @name allLocations
         * @methodOf locationService.service:nyplLocationsService
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of all NYPL locations. If it is rejected, an
         *  error message is returned saying that it "Could not reach API".
         * @description Get all locations
         * @example
         * <pre>
         *  nyplLocationsService.allLocations()
         *    .then(function (data) {
         *      var locations = data.locations;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.allLocations = function () {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations' + jsonp_cb,
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': locations');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name singleLocation
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} location The slug of the location to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of a specific NYPL locations. If it is rejected,
         *  an error message is returned saying that it "Could not reach API".
         * @description Get single location.
         * @example
         * <pre>
         *  nyplLocationsService.singleLocation('schwarzman')
         *    .then(function (data) {
         *      var location = data.location;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.singleLocation = function (location) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations/' + location + jsonp_cb,
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': location');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name singleDivision
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} division The slug of the division to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of an NYPL Division. If it is rejected, an error
         *  message is returned saying that it "Could not reach API".
         * @description Get single division.
         * @example
         * <pre>
         *  nyplLocationsService.singleLocation('map-division')
         *    .then(function (data) {
         *      var division = data.division;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.singleDivision = function (division) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/divisions/' + division + jsonp_cb,
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': division');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name amenities
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} [amenity] The id of the amenity to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API. If no param was passed, it will return all the
         *  amenities at NYPL. If the param was passed, it will return a list
         *  of all the NYPL locations where the amenity passed is available.
         *  If it is rejected, an error message is returned saying that it
         *  "Could not reach API".
         * @description Get all amenities.
         * @example
         * <pre>
         *  nyplLocationsService.amenities()
         *    .then(function (data) {
         *      var amenities = data;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         *
         *  nyplLocationsService.amenities('7950')
         *    .then(function (data) {
         *      var amenity = data;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.amenities = function (amenity) {
            var defer = $q.defer(),
                url = !amenity ? '/amenities' : '/amenities/' + amenity;

            $http.jsonp(api + url + jsonp_cb, {cache: true})
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': amenities');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name amenitiesAtLibrary
         * @methodOf locationService.service:nyplLocationsService
         * @param {string} location The slug of the location to look up
         *  all amenities available at that location.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of all amenities available at the location. If it is
         *  rejected, an error message is returned saying that it
         *  "Could not reach API".
         * @description Get amenities at a library.
         * @example
         * <pre>
         *  nyplLocationsService.amenitiesAtLibrary('115th-street')
         *    .then(function (data) {
         *      var location = data.location;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.amenitiesAtLibrary = function (location) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations/' + location + '/amenities' + jsonp_cb,
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': library-amenity');
                });
            return defer.promise;
        };

        /**
         * @ngdoc function
         * @name alerts
         * @methodOf locationService.service:nyplLocationsService
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of alerts that display site-wide.
         * @description Get all alerts.
         * @example
         * <pre>
         *  nyplLocationsService.alerts()
         *    .then(function (data) {
         *      var amenities = data.alerts;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         * </pre>
         */
        locationsApi.alerts = function () {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/alerts' + jsonp_cb,
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': site-wide alerts');
                });
            return defer.promise;
        };

        return locationsApi;
    }
    nyplLocationsService.$inject = ["$http", "$q"];

    /**
     * @ngdoc overview
     * @module locationService
     * @name locationService
     * @description
     * AngularJS module that provides a service to call the API endpoints.
     */
    angular
        .module('locationService', [])
        .factory('nyplLocationsService', nyplLocationsService);

})();

/*jslint indent: 2, maxlen: 80 */
/*global nypl_locations, angular */

(function () {
  'use strict';

  function AmenitiesCtrl($rootScope, $scope, amenities, config, nyplAmenities) {
    $rootScope.title = "Amenities";

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(amenities.amenities);
  }
  AmenitiesCtrl.$inject = ["$rootScope", "$scope", "amenities",
    "config", "nyplAmenities"];

  // Load an amenity and list all the locations
  // where the amenity can be found.
  function AmenityCtrl($rootScope, $scope, amenity, config) {
    var amenityProper = amenity.amenity;
    var name = amenityProper.name;

    $rootScope.title = name;
    $scope.amenity = amenityProper;
    $scope.locations = amenityProper._embedded.locations;
    $scope.amenity_name = name;
  }
  AmenityCtrl.$inject = ["$rootScope", "$scope", "amenity", "config"];

  // Load one location and list all the amenities found in that location.
  function AmenitiesAtLibraryCtrl($rootScope, $scope, config, location, nyplAmenities) {
    var updatedAmenities =
      nyplAmenities.allAmenitiesArray(location._embedded.amenities);

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(updatedAmenities);

    $rootScope.title = location.name;
    $scope.location = location;
  }
  AmenitiesAtLibraryCtrl.$inject = ["$rootScope", "$scope", "config",
    "location", "nyplAmenities"];

  angular
    .module('nypl_locations')
    .controller('AmenityCtrl', AmenityCtrl)
    .controller('AmenitiesCtrl', AmenitiesCtrl)
    .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
})();

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, angular, _ */

(function () {
    'use strict';

    function DivisionCtrl($rootScope, $scope, config, division, nyplUtility) {
        var divisionsWithApt = config.divisions_with_appointments;

        $scope.division = division;
        $scope.location = division._embedded.location;

        $rootScope.title = division.name;
        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        nyplUtility.scrollToHash();
        $scope.createHash = function (id) {
            nyplUtility.createHash(id);
        };

        if (division.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(division.hours);

            if (division.hours.exceptions) {
                division.hours.exceptions.description =
                    nyplUtility
                        .returnHTML(division.hours.exceptions.description);
            }
        }

        // Calculate hours today for sub-divisions
        if (division._embedded.divisions) {
            _.each(division._embedded.divisions, function (division) {
                division.hoursToday = nyplUtility.hoursToday(division.hours);
            });
        }

        $scope.division.social_media =
            nyplUtility.socialMediaColor(division.social_media);

        $scope.has_appointment =
            nyplUtility.divisionHasAppointment(divisionsWithApt, division.id);
    }
    DivisionCtrl.$inject = ["$rootScope", "$scope", "config",
        "division", "nyplUtility"];

    angular
        .module('nypl_locations')
        .controller('DivisionCtrl', DivisionCtrl);
})();

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $ */

(function () {
    'use strict';

    function LocationsCtrl(
        $filter,
        $rootScope,
        $location,
        $scope,
        $timeout,
        $state,
        $nyplAlerts,
        config,
        nyplAlertsService,
        nyplCoordinatesService,
        nyplGeocoderService,
        nyplLocationsService,
        nyplUtility,
        nyplSearch,
        nyplAmenities
    ) {
        var locations,
            searchValues = nyplSearch.getSearchValues(),
            research_order =
                config.research_order || ['SASB', 'LPA', 'SC', 'SIBL'],
            user = { coords: {}, address: '' },
            sortListBy = function (type) {
                $scope.predicate = type;
            },

            resetProperty = function (arr, property) {
                _.each(arr, function (location) {
                    location[property] = '';
                });
            },

            resetPage = function () {
                $scope.searchMarker = false;
                $scope.researchBranches = false;
                $scope.userMarker = false;
                $scope.reverse = false;
                $scope.searchTerm = '';
                $scope.geolocationAddressOrSearchQuery = '';
                $scope.select_library_for_map = '';

                sortListBy('name');

                resetProperty($scope.locations, 'distance');
                resetProperty($scope.locations, 'highlight');
            },

            geolocationAvailable = function () {
                // After loading all locations, check if the browser supports
                // geolocation before the user tries to geolocate their
                // location. If available, the button to geolocate appears.
                if (nyplCoordinatesService.geolocationAvailable()) {
                    $scope.geolocationOn = true;
                }
            },

            isMapPage = function () {
                return $state.current.name === 'home.map';
            },

            loadUserCoordinates = function () {
                return nyplCoordinatesService
                    .getBrowserCoordinates()
                    .then(function (position) {
                        user.coords = _.pick(position, 'latitude', 'longitude');
                        return user;
                    });
            },

            checkUserDistance = function (user) {
                // add a distance property to every location
                // from that location to the user's coordinates
                $scope.locations =
                    nyplUtility.calcDistance($scope.locations, user.coords);

                // Must be within 25 miles
                if (nyplUtility.checkDistance($scope.locations)) {
                    // The user is too far away, reset everything
                    resetPage();
                    throw (new Error('You are not within 25 ' +
                        'miles of any NYPL library.'));
                }

                return user.coords;
            },

            loadUserVariables = function () {
                // Used for 'Get Address' link.
                $scope.locationStart =
                    user.coords.latitude + ',' + user.coords.longitude;
                $scope.userMarker = true;

                if (!isMapPage()) {
                    $state.go('home.map');
                }
                sortListBy('distance');
                nyplGeocoderService
                    .createMarker('user', user.coords, 'Your Current Location');

                $scope.drawUserMarker();
            },

            // convert coordinate into address
            loadReverseGeocoding = function (coords) {
                nyplSearch.resetSearchValues();
                return nyplGeocoderService
                    .reverseGeocoding({
                        lat: coords.latitude,
                        lng: coords.longitude
                    })
                    .then(function (address) {
                        $scope.geolocationAddressOrSearchQuery = address;
                        nyplSearch
                            .setSearchValue('resultsNear', address)
                            .setSearchValue('locations', $scope.locations);

                        return address;
                    });
            },

            // convert address to geographic coordinate
            loadGeocoding = function (searchTerm) {
                nyplSearch.setSearchValue('searchTerm', searchTerm);
                return nyplGeocoderService.geocodeAddress(searchTerm)
                    .then(function (coords) {
                        return {
                            coords: coords,
                            searchTerm: coords.name
                        };
                    })
                    .catch(function (error) {
                        throw error;
                    });
            },

            searchByCoordinates = function (searchObj) {
                var locationsCopy = $scope.locations,
                    coords = searchObj.coords,
                    searchterm = searchObj.searchTerm;

                locationsCopy = nyplUtility.calcDistance(locationsCopy, coords);

                // Must be within 25 miles or throws the error:
                if (nyplUtility.checkDistance(locationsCopy)) {
                    // The search query is too far
                    $scope.searchError = searchterm;
                    nyplGeocoderService.panMap();
                    throw (new Error('The search query is too far'));
                }

                $scope.userMarker = false;
                nyplGeocoderService.removeMarker('user');

                nyplSearch.setSearchValue('resultsNear', searchObj.searchTerm);
                $scope.geolocationAddressOrSearchQuery = searchterm;
                $scope.searchError = '';
                return locationsCopy;
            },

            organizeLocations =
                function (locations, filteredLocations, sortByFilter) {
                    resetProperty(locations, 'highlight');

                    _.each(filteredLocations, function (location) {
                        // To differentiate between angular matched filter
                        // results and reverse geocoding results.
                        location.highlight = 'active';
                        location.distance = '';
                    });

                    // Sort the locations array here instead of using angular
                    // orderBy filter. That way we can display the matched
                    // locations first and then display the results from
                    // the geocoder service.
                    locations = _.sortBy(locations, function (location) {
                        return location[sortByFilter];
                    });

                    // Remove the matched libraries from the filter search term.
                    locations = _.difference(locations, filteredLocations);

                    // Use union to add the matched locations in front
                    // of the rest of the locations.
                    $scope.locations = _.union(filteredLocations, locations);

                    nyplSearch.setSearchValue('locations', $scope.locations);
                    // Don't sort by distance or the matched results
                    // will not display first.
                    sortListBy(sortByFilter);
                },

            scrollListTop = function () {
                var scrollable_lists = [
                        angular.element('.locations-list-view tbody'),
                        angular.element('.locations-data-wrapper')
                    ];

                _.each(scrollable_lists, function (list) {
                    $(list).animate({scrollTop: '0px'}, 1000);
                });
            },

            showLibrariesTypeOf = function (type) {
                // undefined value for type is actually okay,
                // as it will show all locations if that's the case
                $scope.location_type = type;
            },

            loadPreviousStateOrNewState = function () {
                if (searchValues.locations) {
                    // Assigning the saved values to scope variables that
                    // should get loaded.
                    $scope.locations = searchValues.locations;
                    $scope.searchTerm = searchValues.searchTerm;
                    $scope.geolocationAddressOrSearchQuery =
                        searchValues.resultsNear;
                    $scope.searchMarker = searchValues.searchMarker;
                    if ($scope.searchMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    // If the user searched by zip code, name or address,
                    // then sort by relevancy or distance. If not, they used
                    // geolocation so sort by distance. Default is by name.
                    if ($scope.geolocationAddressOrSearchQuery) {
                        sortListBy('distance');
                    } else {
                        sortListBy('name');
                    }
                } else {
                    $scope.loadLocations();
                }
            };

        $scope.loadLocations = function () {
            return nyplLocationsService
                .allLocations()
                .then(function (data) {
                    var amenitiesCount = nyplAmenities.getAmenityConfig(config);
                    locations = data.locations;
                    $scope.locations = locations;

                    configureGlobalAlert();

                    _.each($scope.locations, function (location) {
                        var locationAddress =
                                nyplUtility.getAddressString(location, true),
                            markerCoordinates = {},
                            hoursMessageOpts,
                            alerts = location._embedded.alerts,
                            alertMsgs = nyplAlertsService.getCurrentActiveMessage(alerts);

                        if (location.geolocation &&
                                location.geolocation.coordinates) {
                            markerCoordinates = {
                                'latitude': location.geolocation.coordinates[1],
                                'longitude': location.geolocation.coordinates[0]
                            };
                        };

                        location.locationDest =
                            nyplUtility.getAddressString(location);

                        location.amenities_list =
                            nyplAmenities.getHighlightedAmenities(
                                location._embedded.amenities,
                                amenitiesCount.global,
                                amenitiesCount.local
                            );

                        location.research_order =
                            nyplUtility.researchLibraryOrder(
                                research_order,
                                location.id
                            );

                        // Initially, when the map is drawn and
                        // markers are available, they will be drawn too.
                        // No need to draw them again if they exist.
                        if (!nyplGeocoderService
                                .doesMarkerExist(location.slug) &&
                                location.geolocation) {
                            nyplGeocoderService
                                .createMarker(location.slug,
                                    markerCoordinates,
                                    locationAddress);
                        }

                        // CSS class for a closing
                        location.closingMessageClass =
                            closingMessageClass(alerts);
                        location.todaysHoursDisplay =
                            alertMsgs ? 'Today:' : 'Today\'s Hours:';

                        hoursMessageOpts = {
                            message: alertMsgs,
                            open: location.open,
                            hours: location.hours,
                            hoursFn: getlocationHours,
                            closedFn: branchClosedMessage
                        };
                        // Hours or closing message that will display
                        location.hoursOrClosingMessage =
                            nyplAlertsService
                                .getHoursOrMessage(hoursMessageOpts);
                    });

                    resetPage();
                    nyplSearch.setSearchValue('locations', $scope.locations);

                    return locations;
                })
                .catch(function (error) {
                    $state.go('404');
                    throw error;
                });
        };

        // Displaying the closing css class for the text
        function closingMessageClass(location_alerts) {
            var alerts = nyplAlertsService.activeClosings(location_alerts);

            if (alerts) {
                return true;
            }

            return false;
        }

        function getlocationHours(hours) {
            return $filter('timeFormat')(nyplUtility.hoursToday(hours));
        }

        function branchClosedMessage() {
            return '<b>Branch is temporarily closed.</b>'
        }

        // Applies if the global alert has a closing and is active
        // then display 'Closed....' instead of the hours in the column.
        function configureGlobalAlert() {
            $scope.globalClosingMessage;
            if ($nyplAlerts.alerts && $nyplAlerts.alerts.length) {
                $scope.globalClosingMessage =
                    nyplAlertsService.getCurrentActiveMessage($nyplAlerts.alerts);

                var todayDay = moment().date(),
                  todayMonth = moment().month(),
                  todayYear = moment().year();
            }
        }

        $scope.scrollPage = function () {
            var content = angular.element('.container__all-locations'),
                containerWidth = parseInt(content.css('width'), 10),
                top;

            // only scroll the page on mobile
            if (containerWidth < 601) {
                top = angular.element('.map-search__results').offset() ||
                    angular.element('.search__results').offset();
                $timeout(function () {
                    angular.element('body').animate({scrollTop: top.top}, 1000);
                }, 1000);
            }
        };

        $scope.viewMapLibrary = function (library_id) {
            var location = _.where($scope.locations, { 'slug' : library_id });
            $scope.select_library_for_map = library_id;

            $scope.searchMarker = false;

            if (!isMapPage()) {
                $state.go('home.map');
            } else {
                nyplGeocoderService
                    .hideSearchInfowindow()
                    .panExistingMarker(library_id);
            }

            organizeLocations($scope.locations, location, 'name');
            $scope.scrollPage();
        };

        $scope.useGeolocation = function () {
            // Remove any existing search markers on the map.
            nyplGeocoderService.removeMarker('search');
            resetPage();

            $scope.scrollPage();
            scrollListTop();

            loadUserCoordinates()
                .then(checkUserDistance)
                .then(loadReverseGeocoding)
                .then(loadUserVariables)
                .catch(function (error) {
                    $scope.distanceError = error.message;
                    $scope.geolocationOn = false;
                });
        };

        $scope.clearSearch = function () {
            nyplSearch.resetSearchValues();

            showLibrariesTypeOf();
            nyplGeocoderService
                .showAllLibraries()
                .removeMarker('user');

            if (isMapPage()) {
                // Remove the query params from the URL.
                $location.search('libraries', null);
                $location.search('nearme', null);
                nyplGeocoderService.removeMarker('search')
                    .hideInfowindow()
                    .panMap();
            }

            resetPage();
            scrollListTop();
        };

        $scope.drawUserMarker = function () {
            if (nyplGeocoderService.doesMarkerExist('user')) {
                nyplGeocoderService.panExistingMarker('user');
            }
        };

        $scope.geocodeAddress = function (searchTerm) {
            // What should be the minimum length of the search?
            if (!searchTerm || searchTerm.length < 3) {
                return;
            }

            $scope.geolocationAddressOrSearchQuery = '';
            $scope.searchError = '';
            showLibrariesTypeOf();
            $scope.researchBranches = false;
            nyplGeocoderService.showAllLibraries();
            $scope.searchTerm =  searchTerm;

            searchTerm = nyplSearch.searchWordFilter(searchTerm);
            scrollListTop();

            if (!isMapPage()) {
                $state.go('home.map');
            }

            loadGeocoding(searchTerm)
                .then(function (searchObj) {
                    nyplGeocoderService.createSearchMarker(
                        searchObj.coords,
                        searchObj.searchTerm
                    );

                    return searchByCoordinates(searchObj);
                })
                .then(function (locations) {
                    $scope.scrollPage();
                    // Variable to draw a green marker on the map legend.
                    $scope.searchMarker = true;
                    nyplSearch.setSearchValue('searchMarker', true);
                    nyplGeocoderService.drawSearchMarker();
                    organizeLocations(locations, [], 'distance');
                })
                // Catch any errors at any point
                .catch(function (error) {
                    nyplGeocoderService.removeMarker('search');
                    $scope.searchMarker = false;
                    nyplSearch.resetSearchValues();

                    resetPage();
                });
        };

        $scope.showResearch = function () {
            nyplGeocoderService.hideInfowindow();
            scrollListTop();

            $scope.researchBranches = !$scope.researchBranches;

            // Only add and remove the libraries query parameter
            // if the user is on the map page.
            if ($scope.researchBranches) {
                if (isMapPage()) {
                    $location.search('libraries', 'research');
                }
                nyplGeocoderService.showResearchLibraries().panMap();
                showLibrariesTypeOf('research');
                sortListBy('research_order');
            } else {
                if (isMapPage()) {
                    $location.search('libraries', null);
                }
                nyplGeocoderService.showAllLibraries().panMap();
                showLibrariesTypeOf();
                sortListBy('name');
            }
        };

        $rootScope.title = 'Locations';
        $scope.$state = $state;

        loadPreviousStateOrNewState();
        configureGlobalAlert();
        geolocationAvailable();
    }
    LocationsCtrl.$inject = ['$filter', '$rootScope', '$location', '$scope', '$timeout', '$state', '$nyplAlerts', 'config', 'nyplAlertsService', 'nyplCoordinatesService', 'nyplGeocoderService', 'nyplLocationsService', 'nyplUtility', 'nyplSearch', 'nyplAmenities'];
    // End LocationsCtrl

    function MapCtrl($scope, $timeout, nyplGeocoderService, params, nyplCoordinatesService) {
        var nearMe = params.nearme,
            libraryParam = params.libraries,
            loadMapMarkers = function () {
                $timeout(function () {
                    if ($scope.locations) {
                        nyplGeocoderService.showAllLibraries();
                        if ($scope.researchBranches) {
                            nyplGeocoderService.showResearchLibraries();
                        }
                    }
                }, 1200);
            },

            drawMap = function () {
                $timeout(function () {
                    nyplGeocoderService
                        .drawMap({
                            lat: 40.7532,
                            long: -73.9822
                        }, 12, 'all-locations-map')
                        .drawLegend('all-locations-map-legend');

                    if ($scope.locations) {
                        nyplGeocoderService.showAllLibraries();
                    }
                    loadMapMarkers();

                    $scope.drawUserMarker();

                    if ($scope.searchMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    if ($scope.researchBranches) {
                        nyplGeocoderService.showResearchLibraries();
                    }

                    if ($scope.select_library_for_map) {
                        nyplGeocoderService
                            .panExistingMarker($scope.select_library_for_map);
                    }

                    $scope.scrollPage();
                }, 1200);
            },
            geolocate = function () {
                // The value should be nearme=true.
                // Make sure geolocation is available before attempt.
                if (nearMe === 'true') {
                    if (nyplCoordinatesService.geolocationAvailable()) {
                        $scope.geolocationOn = true;
                        $scope.useGeolocation();
                    }
                }
            },
            displayLibraries = function () {
                if (libraryParam === 'research') {
                    $scope.showResearch();
                }
            };

        drawMap();

        // Load the map and data first
        setTimeout(function () {
            if (nearMe) {
                geolocate();
            }

            if (libraryParam) {
                displayLibraries();
            }
        }, 1900);


        $scope.panToLibrary = function (slug) {
            nyplGeocoderService
                .hideSearchInfowindow()
                .panExistingMarker(slug);

            $scope.scrollPage();
        };
    }
    MapCtrl.$inject = ['$scope', '$timeout', 'nyplGeocoderService', 'params', 'nyplCoordinatesService'];

    function LocationCtrl(
        $rootScope,
        $scope,
        $timeout,
        config,
        location,
        nyplCoordinatesService,
        nyplUtility,
        nyplAmenities
    ) {
        var amenities = location._embedded.amenities,
            amenitiesCount = nyplAmenities.getAmenityConfig(config),
            loadUserCoordinates = function () {
                return nyplCoordinatesService
                    .getBrowserCoordinates()
                    .then(function (position) {
                        var userCoords =
                            _.pick(position, 'latitude', 'longitude');

                        // Needed to update async var on geolocation success
                        $timeout(function () {
                            $scope.locationStart = userCoords.latitude +
                                ',' + userCoords.longitude;
                        });
                    });
            };

        // Load the user's geolocation coordinates
        loadUserCoordinates();

        nyplUtility.scrollToHash();
        $scope.createHash = function (id) {
            nyplUtility.createHash(id);
        };

        $scope.location = location;
        $rootScope.title = location.name;

        if (location.hours.exceptions) {
            location.hours.exceptions.description =
                nyplUtility.returnHTML(location.hours.exceptions.description);
        }

        // Add icons to the amenities.
        _.each(location._embedded.amenities, function (amenity) {
            amenity.amenity = nyplAmenities.addAmenitiesIcon(amenity.amenity);
        });

        // Get three institution ranked and two location ranked amenities.
        location.amenities_list =
            nyplAmenities.getHighlightedAmenities(
                amenities,
                amenitiesCount.global,
                amenitiesCount.local
            );

        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        $scope.location.social_media =
            nyplUtility.socialMediaColor($scope.location.social_media);

        if (location.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(location.hours);
        }

        // Build exhibition pretty date
        if (location._embedded.exhibitions) {
            _.each(location._embedded.exhibitions, function (exh) {
                if (exh.start) {
                    exh.prettyDate = nyplUtility.formatDate(exh.start, exh.end);
                }
            });
        }

        _.each(location._embedded.divisions, function (division) {
            division.hoursToday = nyplUtility.hoursToday(division.hours);
        });

        _.each(location._embedded.features, function (feature) {
            if (typeof feature.body === 'string') {
                feature.body = nyplUtility.returnHTML(feature.body);
            }
        });

        // Used for the Get Directions link to Google Maps
        $scope.locationDest = nyplUtility.getAddressString(location);

        // Assign closed image
        if (config.closed_img) {
            $scope.location.images.closed = config.closed_img;
        }
    }
    LocationCtrl.$inject = ['$rootScope', '$scope', '$timeout', 'config',
        'location', 'nyplCoordinatesService', 'nyplUtility', 'nyplAmenities'];

    angular
        .module('nypl_locations')
        .controller('LocationsCtrl', LocationsCtrl)
        .controller('MapCtrl', MapCtrl)
        .controller('LocationCtrl', LocationCtrl);
})();

(function () {
  'use strict';

  function WidgetCtrl(
    $location,
    $rootScope,
    $scope,
    $timeout,
    $window,
    config,
    data,
    nyplCoordinatesService,
    nyplUtility
  ) {
    // var loadUserCoordinates = function () {
    //   return nyplCoordinatesService
    //     .getBrowserCoordinates()
    //     .then(function (position) {
    //       var userCoords =
    //         _.pick(position, 'latitude', 'longitude');

    //       // Needed to update async var on geolocation success
    //       $timeout(function () {
    //         $scope.locationStart = userCoords.latitude +
    //           "," + userCoords.longitude;
    //       });
    //     });
    // };

    $rootScope.title = data.name;
    $scope.data = data;
    $scope.locinator_url = "//nypl.org/locations" +
      $location.path().substr(7);
    $scope.widget_name = data.name;

    if (data._embedded.location) {
      $scope.division = true;
      $scope.data.images.exterior = data.images.interior;
    }

    if (config.closed_img) { 
      $scope.data.images.closed = config.closed_img;
    }

    // loadUserCoordinates();

    if (data.hours) {
        $scope.hoursToday = nyplUtility.hoursToday(data.hours);
    }

    $scope.data.social_media =
      nyplUtility.socialMediaColor($scope.data.social_media);

    // Used for the Get Directions link to Google Maps
    $scope.locationDest = nyplUtility.getAddressString(data);
  }
  WidgetCtrl.$inject = ["$location", "$rootScope", "$scope", "$timeout",
    "$window", "config", "data", "nyplCoordinatesService", "nyplUtility"];

  angular
    .module('nypl_widget')
    .controller('WidgetCtrl', WidgetCtrl);
})();

/*jslint unparam: true, indent: 2, maxlen: 80, nomen: true */
/*globals nypl_locations, $window, angular, _, moment */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:loadingWidget
   * @restrict A
   * @requires requestNotificationChannel
   * @description
   * Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
   * declare the directive that will show and hide the loading widget
   */
  function loadingWidget(requestNotificationChannel) {
    return {
      restrict: "A",
      link: function (scope, element) {
        var startRequestHandler = function (event) {
            // got the request start notification, show the element
            element.addClass('show');
          },
          endRequestHandler = function (event) {
            // got the request start notification, show the element
            element.removeClass('show');
          };

        // hide the element initially
        if (element.hasClass('show')) {
          element.removeClass('show');
        }

        // register for the request start notification
        requestNotificationChannel.onRequestStarted(scope, startRequestHandler);
        // register for the request end notification
        requestNotificationChannel.onRequestEnded(scope, endRequestHandler);
      }
    };
  }
  loadingWidget.$inject = ['requestNotificationChannel'];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplTranslate
   * @restrict E
   * @description
   * Directive to display a list of languages to translate the site into.
   * Commented out until use.
   * @example
   * <pre>
   *  <nypl-translate></nypl-translate>
   * </pre>
   */
  // function nyplTranslate() {
  //   return {
  //     restrict: 'E',
  //     templateUrl: 'scripts/directives/templates/translatebuttons.html',
  //     replace: true,
  //     controller: function ($scope, $translate) {
  //       $scope.translate = function (language) {
  //         $translate.use(language);
  //       };
  //     }
  //   };
  // }

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:todayshours
   * @restrict EA
   * @scope
   * @description
   * ...
   */
  function todayshours($nyplAlerts, nyplAlertsService, nyplUtility, $filter) {
    return {
      restrict: 'EA',
      replace: false,
      templateUrl: 'scripts/directives/templates/todaysHours.html',
      scope: {
        hours: '=hours',
        alerts: '=alerts'
      },
      link: function ($scope, elem, attrs, ctrl) {
        var alerts = {},
          hours = $scope.hours || null;

        // Retrieve all current global closings
        // Utilize the Global Alerts Provider
        if ($nyplAlerts.alerts && $nyplAlerts.alerts.length) {
          alerts.current_global = nyplAlertsService.filterAlerts(
            $nyplAlerts.alerts,
            {scope: 'all', only_closings: 'current'}
          );
        }

        // Used the passed in Objects embedded alerts property
        // Does not include global alerts
        // Divisions include parent
        // Locations do not include children
        if ($scope.alerts) {
          // Retrieve all current location closings
          alerts.current_location = nyplAlertsService.filterAlerts(
            $scope.alerts,
            {scope: 'location', only_closings: 'current'}
          );

          // Retrieve all current division closings
          alerts.current_division = nyplAlertsService.filterAlerts(
            $scope.alerts,
            {scope: 'division', only_closings: 'current'}
          );

          // Retrieve all closing alerts for 7 day week
          // Used to determine tomorrow's hours message
          // First pass in the global alerts, if it is a
          // location/division closing use that as secondary
          alerts.all_closings = nyplAlertsService.filterAlerts(
            ($nyplAlerts.alerts || $scope.alerts),
            {only_closings: 'week'}
          );
        }

        // Proper string assignment for today's hours
        $scope.todaysHours = ctrl.computeHoursToday(hours, alerts);
        var todayDay = moment().date(),
          todayMonth = moment().month(),
          todayYear = moment().year();

        // Display the clock icon (optional)
        $scope.showIcon = (attrs.displayIcon === 'true') ? true : false;
      },
      controller: ['$scope', function ($scope) {

        // Obtains the first alert message from
        // the API of filtered current closing alerts.
        this.getAlertMsg = function (alertsObj) {
          return 'Today: ' + _.chain(alertsObj)
            .pluck('closed_for')
            .flatten(true)
            .first()
            .value();
        };

        // Generates the correct string representation
        // for today's hours with proper filter
        this.getLocationHours = function (hoursObj, alertsObj) {
          return $filter('hoursTodayFormat')(nyplUtility.hoursToday(hoursObj, alertsObj));
        };

        /* Generates the correct display for today's hours based
        ** on the stated priority:
        ** 1. Global closing alert
        ** 2. Location closing alert
        ** 3. Division closing alert
        ** 4. Regular hours for today/tomorrow
        */
        this.computeHoursToday = function (hoursObj, alertsObj) {
          if (!hoursObj) {
            return 'Not available';
          }
          if (!alertsObj) {
            return this.getLocationHours(hoursObj);
          }
          if (alertsObj.current_global && alertsObj.current_global.length) {
            return this.getAlertMsg(alertsObj.current_global);
          }
          if (alertsObj.current_location && alertsObj.current_location.length) {
            return this.getAlertMsg(alertsObj.current_location);
          }
          if (alertsObj.current_division && alertsObj.current_division.length) {
            return this.getAlertMsg(alertsObj.current_division);
          }
          return this.getLocationHours(hoursObj, alertsObj);
        };
      }]
    };
  }
  todayshours.$inject = ['$nyplAlerts', 'nyplAlertsService', 'nyplUtility', '$filter'];

  function hoursTable(nyplAlertsService, $filter, nyplUtility) {
    return {
      restrict: 'EA',
      templateUrl: 'scripts/directives/templates/hours-table.html',
      replace: true,
      scope: {
        hours: '=hours',
        alerts: '=alerts'
      },
      link: function ($scope, elem, attrs, ctrl) {
        var weeklyHours = angular.copy($scope.hours) || null,
          scopedAlerts,
          weekClosingAlerts;

        // Filter alerts only if available
        if ($scope.alerts) {
          weekClosingAlerts = nyplAlertsService.filterAlerts(
            $scope.alerts,
            {only_closings: 'week'}
          );
        }

        // Sort Alerts by Scope 1) all 2) location 3) division
        if (weekClosingAlerts && weekClosingAlerts.length) {
          scopedAlerts = nyplAlertsService.sortAlertsByScope(weekClosingAlerts);
        }

        // Assign dynamic week hours with closings
        $scope.dynamicWeekHours = (scopedAlerts) ?
            ctrl.findAlertsInWeek(weeklyHours, scopedAlerts) : null;
        // Assign the number of alerts for the week
        $scope.numAlertsInWeek = ($scope.dynamicWeekHours) ?
          ctrl.findNumAlertsInWeek($scope.dynamicWeekHours) : 0;

        // Call nyplUtility.mapDays for the syntax of weekday styling
        $scope.hours.map(function (item, index) {
          item.day = nyplUtility.mapDays(item.day);
          return item;
        });

        $scope.regularWeekHours = $scope.hours || null;
        $scope.buttonText = (scopedAlerts) ? 'Regular hours' : null;

        // Boolean control to display/hide dynamic week hours
        $scope.displayDynamicWeek = ($scope.dynamicWeekHours
          && $scope.numAlertsInWeek > 0) ? true : false;

        // Hide Regular hours only if dynamic hours are defined
        if ($scope.displayDynamicWeek) {
          elem.addClass('hide-regular-hours');
        }

        // Toggle Hours visible only if dynamic hours are defined
        $scope.toggleHoursTable = function () {
          if (elem.hasClass('hide-regular-hours')) {
            elem.removeClass('hide-regular-hours');
            elem.addClass('hide-dynamic-hours');
            $scope.buttonText = 'Upcoming hours';
          } else if (elem.hasClass('hide-dynamic-hours')) {
            elem.removeClass('hide-dynamic-hours');
            elem.addClass('hide-regular-hours');
            $scope.buttonText = 'Regular hours';
          }
        };
      },
      controller: ['$scope', function ($scope) {
        // Iterate through the current alerts of the week.
        // Attach the alert pertaining to the day by it's index
        // to the week object
        this.findAlertsInWeek = function (weekObj, alertsObj) {
          if (!weekObj && !alertsObj) { return null; }

          // Use moment().day() to get the current day of the week
          // based on the default timezone which was set in app.js
          var _this = this,
            today = moment().day(),
            week = _.each(weekObj, function (day, index) {
              // Assign today's day to the current week
              day.is_today = (index === today) ? true : false;
              // Assign the dynamic date for each week day
              day.date = _this.assignDynamicDate(index);
              // Assign any current closing alert to the day of the week
              // Only for day's that are open.
              if (day.open !== null && day.close !== null) {
                day.alert = _this.assignCurrentDayAlert(alertsObj, day.date);
              }
              // Assign the day to a formatted AP style
              day.day = (day.day) ? nyplUtility.mapDays(day.day) : '';
              // Assign the date object to a string so we can use it in the filter
              day.dateString = moment(day.date._d).format('MMMM DD');
            });

          return week;
        };

        // Returns the amount of alerts for a given 7 day week
        this.findNumAlertsInWeek = function (dynamicWeek) {
          if (!dynamicWeek) { return 0; }
          var count = 0;
          _.each(dynamicWeek, function (elem) {
            if (elem.alert) {
              count++;
            }
          });
          return count;
        };

        // Boolean check for same day alert based on the day of the week
        this.isSameDayAlert = function (startDay, endDay, dayOfWeek) {
          var today = moment();
          return (startDay.isSame(endDay, 'day')
            && dayOfWeek.isSame(startDay, 'day')
            && today.isBefore(endDay)) ? true : false;
        };

        this.assignDynamicDate = function (index) {
          var today = moment(),
            date;
          if (index < today.weekday()) {
            date = moment().weekday(index + 7).endOf('day');
          } else {
            date = moment().weekday(index).endOf('day');
          }
          return date;
        };

        // Finds any current matching closing alert relevant to
        // the date of the given week.
        this.assignCurrentDayAlert = function (alertsObj, dayDate) {
          var startDay,
            endDay,
            _this = this;
          return _.find(alertsObj, function (alert) {
            // A non-infinite closing
            if (alert.applies.start && alert.applies.end) {
              startDay = moment(alert.applies.start);
              endDay = moment(alert.applies.end).endOf('day');
              alert.infinite = false;
              // Handles Early/Late Closings/Openings
              if (_this.isSameDayAlert(startDay, endDay, dayDate)) {
                return alert;
              }
              // All Day Closings
              if (dayDate.isBetween(startDay, endDay)) {
                return alert;
              }
            } else if (alert.applies.start && !alert.applies.end) {
              startDay = moment(alert.applies.start);
              // Infinite closing
              alert.infinite = true;
              if (dayDate.isAfter(startDay)) {
                return alert;
              }
            }
          });
        };
      }]
    };
  }
  hoursTable.$inject = ['nyplAlertsService', '$filter', 'nyplUtility'];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:emailusbutton
   * @restrict E
   * @scope
   * @description
   * ...
   */
  function emailusbutton() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/emailus.html',
      replace: true,
      scope: {
        link: '@'
      }
    };
  }

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:librarianchatbutton
   * @restrict E
   * @requires nyplUtility
   * @description
   * ....
   */
  function librarianchatbutton(nyplUtility) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/librarianchat.html',
      replace: true,
      link: function (scope, element, attrs, $window) {
        scope.openChat = function () {
          // Utilize service in directive to fire off the new window.
          // Arguments:
          // link (req),
          // title (optional), width (optional), height (optional)
          nyplUtility.popupWindow(
            'http://www.nypl.org/ask-librarian',
            'NYPL Chat',
            210,
            450
          );
          if (!element.hasClass('active')) {
            element.addClass('active');
          }
        };
      }
    };
  }
  librarianchatbutton.$inject = ['nyplUtility'];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:scrolltop
   * @requires $window
   * @description
   * ...
   */
  function scrolltop($window) {
    return function (scope) {
      scope.$on('$stateChangeStart', function () {
        $window.scrollTo(0, 0);
      });
    };
  }
  scrolltop.$inject = ['$window'];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:eventRegistration
   * @restrict E
   * @requires $filter
   * @scope
   * @description
   * ...
   */
  function eventRegistration($filter) {
    function eventStarted(startDate) {
      var sDate = new Date(startDate),
        today   = new Date();
      return (sDate.getTime() > today.getTime()) ? true : false;
    }

    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/registration.html',
      replace: true,
      scope: {
        registration: '=',
        status: '=',
        link: '='
      },
      link: function (scope, element, attrs) {
        scope.online = false;

        if (scope.registration) {
          // Check if the event has already started
          scope.eventRegStarted = eventStarted(scope.registration.start);

          if (scope.registration.type === 'Online') {
            scope.online = true;
            scope.reg_msg = (scope.eventRegStarted) ?
                'Online, opens ' +
                  $filter('date')(scope.registration.start, 'MM/dd') :
                'Online';
          } else {
            scope.reg_msg = scope.registration.type;
          }
        }
      }
    };
  }
  eventRegistration.$inject = ['$filter'];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:collapse
   * @restrict A
   * @description
   * Show/Hide collapsible animated directive. Duration & class-name
   * are optional.
   * @example
   * <pre>
   *  <div collapse="name of var toggled" duration="time in ms"
   *          class-name="open"></div>
   * </pre>
   */
  function collapse() {
    function link($scope, element, attributes) {
      var exp = attributes.collapse,
        class_name = (attributes.className || "open"),
        duration = (attributes.duration || "fast");

      if (!$scope.$eval(exp)) {
        element.hide();
      }

      // Watch the expression in $scope context to
      // see when it changes and adjust the visibility
      $scope.$watch(
        exp,
        function (newVal, oldVal) {
          // If values are equal -- just return
          if (newVal === oldVal) {
            return;
          }
          // Show element.
          if (newVal) {
            element.stop(true, true)
              .slideDown(duration)
              .addClass(class_name);
          } else {
            element.stop(true, true)
              .slideUp(duration)
              .removeClass(class_name);
          }
        }
      );
    }

    return ({
      link: link,
      restrict: "A" // Attribute only
    });
  }

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplFundraising
   * @restrict E
   * @scope
   * @description
   * ...
   */
  function nyplFundraising($timeout, nyplLocationsService) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/fundraising.html',
      replace: true,
      scope: {
        fundraising: '=fundraising',
        // Category is for GA events
        category: '@'
      },
      link: function (scope, elem, attrs) {
        if (!scope.fundraising) {
          $timeout(function () {
            nyplLocationsService.getConfig().then(function (data) {
              var fundraising = data.fundraising;
              scope.fundraising = {
                appeal: fundraising.appeal,
                statement: fundraising.statement,
                button_label: fundraising.button_label,
                link:  fundraising.link
              };
            });
          }, 200);
        }
      }
    };
  }
  nyplFundraising.$inject = ['$timeout', 'nyplLocationsService'];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplSidebar
   * @restrict E
   * @scope
   * @description
   * Inserts optional Donate button/nyplAsk widget when 'true' is
   * passed to donate-button="" or nypl-ask="". A custom donate url
   * can be passed for the donate-button, otherwise a default is set
   * @example
   * <pre>
   *  <nypl-sidebar donate-button="" nypl-ask="" donateurl="">
   * </pre>
   */
  function nyplSidebar() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/sidebar-widgets.html',
      replace: true,
      scope: {
        donateButton: '@',
        nyplAsk: '@'
      },
      link: function (scope, elem, attrs) {
        var url = "https://secure3.convio.net/nypl/site/SPageServer?page" +
          "name=donation_form&JServSessionIdr003=dwcz55yj27.app304a&s_" +
          "src=FRQ14ZZ_SWBN";
        scope.donateUrl = (attrs.donateurl || url);
      }
    };
  }

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplFooter
   * @restrict E
   * @requires $analytics
   * @scope
   * @description
   * NYPL Footer. Changed to directive to add analytics events handler.
   * @example
   * <pre>
   *  <nypl-footer></nypl-footer>
   * </pre>
   */
  function nyplFooter($analytics) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/footer.html',
      replace: true,
      scope: {},
      link: function (scope, elem, attrs) {
        var footerLinks = elem.find('.footerlinks a'),
          linkHref;

        footerLinks.click(function () {
          linkHref = angular.element(this).attr('href');

          $analytics.eventTrack('Click',
                    { category: 'footer', label: linkHref });
        });

        // Dynamic Year
        scope.year = new Date().getFullYear();
      }
    };
  }
  nyplFooter.$inject = ['$analytics'];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplAutofill
   * @restrict AEC
   * @scope
   * @description
   * ...
   */
  function nyplAutofill($state, $analytics, nyplSearch) {
    return {
      restrict: 'AEC',
      templateUrl: 'scripts/directives/templates/autofill.html',
      scope: {
        data: '=',
        model: '=ngModel',
        mapView: '&',
        geoSearch: '&'
      },
      link: function ($scope, elem, attrs, controller) {
        $scope.focused = false;
        $scope.activated = false;
        $scope.geocodingactive = false;
        $scope.filtered = [];

        var input = angular.element(document.getElementById('searchTerm')),
          html = angular.element(document.getElementsByTagName('html')),
          searchButton = angular.element(document.getElementById('find-location'));

        input.bind('focus', function () {
          $scope.$apply(function () {
            controller.openAutofill();
          });
        });

        input.bind('click', function (e) {
          e.stopPropagation();
        });

        input.bind('keyup', function (e) {
          // Tab & Enter keys
          if (e.keyCode === 13) {
            $scope.$apply(function () {
              // User has pressed up/down arrows
              if ($scope.activated) {
                // Transition to location page
                if ($scope.active.slug) {
                  $scope.activated = false;
                  controller.closeAutofill();
                  $scope.model = $scope.active.name;
                  nyplSearch.setSearchValue('searchTerm', $scope.active.name);
                  $state.go(
                    'location',
                    { location: $scope.active.slug }
                  );
                } else {
                  //Geocoding Search
                  $scope.geoSearch({term: $scope.model});
                  $scope.geocodingactive = false;
                  $scope.activated = false;
                  if (input.blur()) {
                    controller.closeAutofill();
                  }
                }
              }
              // User has pressed enter with auto-complete
              else if (controller.setSearchText()) {
                  $scope.model = $scope.items[0].name;
                  nyplSearch.setSearchValue('searchTerm', $scope.model);
                  controller.closeAutofill();
                  $analytics.eventTrack('Accept',
                    { category: 'Locations', label: $scope.model });
                  $state.go(
                    'location',
                    { location: $scope.items[0].slug }
                  );
              }
              // No autofill, down/up arrows not pressed
              else {
                controller.handleSearch($scope.model);
                if (input.blur()) {
                  controller.closeAutofill();
                }
              }
            });
          }

          // Right Arrow
          if (e.keyCode === 39) {
            $scope.$apply(function () {
              controller.setSearchText();
            });
          }

          // Backspace
          if (e.keyCode === 8) {
            $scope.$apply(function () { $scope.lookahead = ''; });
          }
        });

        // Tab, Enter and Escape keys
        input.bind('keydown', function (e) {
          if (e.keyCode === 13 || e.keyCode === 27) {
            e.preventDefault();
          }

          // Up Arrow
          if (e.keyCode === 38) {
            e.preventDefault();
            $scope.$apply(function () {
              if (!$scope.activated) {
                controller.activateFirstItem();
              }
              else {
                controller.activatePreviousItem();
              }
            });
          }

          // Down Arrow
          if (e.keyCode === 40) {
            e.preventDefault();
            $scope.$apply(function () {
              if (!$scope.activated) {
                controller.activateFirstItem();
              }
              else {
                controller.activateNextItem();
              }
              controller.activateGeocodingItem();
            });
          }
        });

        html.bind('click', function (e) {
          $scope.$apply(function () {
            controller.closeAutofill();
          });
        });

        searchButton.bind('click', function (e) {
          e.preventDefault();
          $scope.$apply(function () {
            controller.handleSearch($scope.model);
          });
        });

        function initAutofill() {
          $scope.$watch('model', function (newValue, oldValue) {
            controller.updateSearchText($scope.data, newValue);
          });

          $scope.$on('$stateChangeSuccess', function () {
            controller.resetSearchTerms();
            controller.closeAutofill();
          });
        }
        // Initialize NYPL Autofill
        initAutofill();
      },
      controller: ['$scope', function ($scope) {
        $scope.lookahead = '';
        $scope.currentWord = '';
        $scope.completeWord = '';

        this.closeAutofill = function () {
          return $scope.focused = false;
        };

        this.openAutofill = function () {
          return $scope.focused = true;
        };

        this.activate = function (item) {
          return item;
        };

        this.activateFirstItem = function () {
          $scope.active = $scope.filtered[0];
          $scope.currentIndex = $scope.filtered.indexOf($scope.active);
          $scope.activated = true;
        };

        this.activateNextItem = function () {
          $scope.geocodingactive = false;
          if ($scope.currentIndex < $scope.filtered.length && $scope.currentIndex >= 0) {
            $scope.currentIndex = $scope.filtered.indexOf($scope.active) + 1;
            $scope.active = this.activate($scope.filtered[$scope.currentIndex]);
          }
          else {
            $scope.active = undefined;
            $scope.currentIndex = -1;
          }
        };

        this.activatePreviousItem = function () {
          $scope.geocodingactive = false;
          if ($scope.currentIndex === -1) {
            $scope.currentIndex = $scope.filtered.length - 1;
            $scope.active = this.activate($scope.filtered[$scope.currentIndex]);
          }
          else if ($scope.currentIndex <= $scope.filtered.length && $scope.currentIndex > 0) {
            $scope.currentIndex = $scope.currentIndex - 1;
            $scope.active = this.activate($scope.filtered[$scope.currentIndex]);
          }
        };

        this.activateGeocodingItem = function () {
          if(!$scope.active && $scope.activated) {
            $scope.active = this.activate($scope.model);
            $scope.geocodingactive = true;
          }
        };

        this.setSearchText = function () {
          if ($scope.completeWord === $scope.model ||
              $scope.completeWord === '' ||
              $scope.model === '') {
            return;
          }
          return $scope.model = $scope.completeWord;
        };

        this.resetSearchTerms = function () {
          $scope.lookahead   = '';
          $scope.currentWord = '';
        };

        this.filterStartsWith = function (data, searchTerm) {
          return _.filter(data, function (elem) {
            if (elem.name) {
              return elem.name.substring(0, searchTerm.length).toLowerCase()
                === searchTerm.toLowerCase();
            }
            return false;
          });
        };

        this.filterTermWithin = function(data, searchTerm, property) {
          var _this = this;
          return _.filter(data, function(elem) {
            if (property === 'name') {
              if (elem.name) {
                return _this.cleanText(elem.name)
                  .indexOf(
                    _this.cleanText(searchTerm)
                  ) >= 0;
              }
            }
            else if (property === 'id') {
              // Supports ID property matching
              if (elem.id) {
                return elem.id.toLowerCase()
                  .indexOf(
                    searchTerm
                    .substring(1, searchTerm.length)
                    .toLowerCase()
                  ) >= 0;
              }
            }
            return false;
          });
        };

        this.cleanText = function(text) {
          return text
            .replace(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g, "")
            .toLowerCase();
        };

        // Searches by ID or closest match first.
        // Then executes geoAddressSearch if no match is found
        this.handleSearch = function (term) {
          if (!term.length) { return; }
          var location,
            searchTerm = (term.charAt(0) === '!') ? term.slice(1) : term;
          // Execute search only if the term is at least two chars
          if (searchTerm.length > 1) {
            if ($scope.filtered && $scope.filtered.length) {
              location = $scope.filtered[0]; // Top match
              if (searchTerm.toLowerCase() === location.id.toLowerCase() ||
                this.cleanText(location.name)
                .indexOf(
                  this.cleanText(searchTerm)
                ) >= 0
              ) {
                nyplSearch.setSearchValue('searchTerm', term);
                $state.go('location', { location: location.slug });
              }
            } else {
              $scope.geoSearch({term: searchTerm});
            }
          }
        };

        this.updateSearchText = function (data, searchTerm) {
          if (searchTerm === '' || !searchTerm || !data) return;

          if (searchTerm.length > 0) {
            $scope.items = this.filterStartsWith(data, searchTerm);

            // Filter through id if (!) is typed
            if (searchTerm.charAt(0) === '!') {
              $scope.filtered = this.filterTermWithin(data, searchTerm, 'id');
              $scope.filterById = true;
            } else {
              $scope.filtered = this.filterTermWithin(data, searchTerm, 'name');
              $scope.filterById = false;
            }
            // Assign first match as auto-complete text
            if ($scope.items[0]) {
              $scope.lookahead   = $scope.items[0].name.substring(searchTerm.length);
              $scope.currentWord = searchTerm;
            }
            else {
              this.resetSearchTerms();
            }
            return $scope.completeWord = $scope.currentWord + $scope.lookahead;
          }
        };
      }]
    };
  }
  nyplAutofill.$inject = ["$state", "$analytics", "nyplSearch"];

  angular
    .module('nypl_locations')
    .directive('loadingWidget', loadingWidget)
    // .directive('nyplTranslate', nyplTranslate)
    .directive('todayshours', todayshours)
    .directive('hoursTable', hoursTable)
    .directive('emailusbutton', emailusbutton)
    .directive('librarianchatbutton', librarianchatbutton)
    .directive('scrolltop', scrolltop)
    .directive('eventRegistration', eventRegistration)
    .directive('nyplFundraising', nyplFundraising)
    .directive('nyplSidebar', nyplSidebar)
    .directive('nyplAutofill', nyplAutofill)
    .directive('collapse', collapse)
    .directive('nyplFooter', nyplFooter);

  angular
    .module('nypl_widget')
    .directive('todayshours', todayshours)
    .directive('nyplFundraising', nyplFundraising)
    .directive('librarianchatbutton', librarianchatbutton)
    .directive('emailusbutton', emailusbutton);
})();

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, console, _, angular */

(function () {
    'use strict';

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:timeFormat
     * @param {object} timeObj Object with hours for today and tomorrow.
     * @returns {string} Closed or open times for a branch with possible
     *  alert returned.
     * @description
     *  timeFormat() filter formats military time to standard time.
     *  In addition, if an alert is present, it displays
     *  the approapriate message for a relevant alert.
     *  1) all day closing 2) early/late opening/closing
     */
    function timeFormat($sce) {
        function getMilitaryHours(time) {
            var components = time.split(':'),
                hours = parseInt(components[0], 10);

            return hours;
        }

        function closingHoursDisplay(hours, alerts) {
            var sDate, eDate, allDay, regHours,
                openHour, closedHour, displayString;

            if (!alerts.length) {
                sDate = moment(alerts.applies.start);
                eDate = moment(alerts.applies.end);
                openHour = getMilitaryHours(hours.open);
                closedHour = getMilitaryHours(hours.close);
                allDay =
                    (hours.date.startOf().isAfter(sDate, 'day') && hours.date.isBefore(eDate, 'day')) ||
                    (eDate.isAfter(sDate, 'day') && hours.date.date() === eDate.date()) ||
                    (sDate.isSame(hours.date, 'day') && (eDate.isAfter(hours.date, 'day'))) &&
                    (sDate.hours() === 0 && eDate.hours() === 0)
                    ? true : false;

                if ((closedHour > eDate.hours() && openHour >= sDate.hours()) && !allDay) {
                    return displayString = 'Opening late *';
                }

                if (((openHour < sDate.hours() && closedHour <= eDate.hours()) ||
                    (hours.date.hours() >= eDate.startOf('day').hour() &&
                    hours.date.hours() <= sDate.endOf('day').hour())) && !allDay) {
                    return displayString = 'Closing early *';
                }

                if (allDay || alerts.infinite === true) {
                    return displayString = 'Closed *';
                }

                if (sDate.hours() <= openHour && eDate.hours() >= closedHour) {
                    return displayString = 'Closed *';
                }

                return displayString = 'Change in hours *';
            }
            return $sce.trustAsHtml(displayString);
        }

       function output(timeObj) {
            // The time object may have just today's hours
            // or be an object with today's and tomorrow's hours
            var alerts,
                time = timeObj !== undefined && timeObj.today !== undefined ?
                    timeObj.today :
                    timeObj;

            // Checking if thruthy needed for async calls
            if (time) {
                alerts = time.alert || null;

                if (time.open === null) {
                    return 'Closed';
                }

                if (alerts) {
                    return closingHoursDisplay(time, alerts);
                }
                return apStyle(time.open, 'time') + '–' + apStyle(time.close, 'time');
            }

            console.log('timeFormat() filter error: Argument is' +
                ' not defined or empty, verify API response for time');
            return '';
        };
        return output;
    }
    timeFormat.$inject = ["$sce"];

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:dateMonthFormat
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Converts the syntax of date and month to AP style.
     * And returns the month date time stamp
     * eg February 14 to Feb 14, September 01 to Sept 01
     */
    function dateMonthFormat() {
        return function (input) {
            if(!input) {
                return '';
            }
            var dateStringArray = input.split(' '),
                date = dateStringArray[1],
                month = apStyle(dateStringArray[0], 'month');

            return month + ' ' + date;
        }
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:dateToISO
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Converts MYSQL Datetime stamp to ISO format
     */
    function dateToISO() {
        return function (input) {
            return new Date(input).toISOString();
        };
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:eventTimeFormat
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Converts the time stamp of events' start time to NYPL AP style
     */
    function eventTimeFormat() {
        return function (input) {
            var d = moment(input),
                day = apStyle(d.format('ddd'), 'day'),
                month = apStyle(d.format('MMMM'), 'month'),
                date = apStyle(d.format('DD'), 'date'),
                year = d.format('YYYY'),
                timeFormat = apStyle((d.format('H') + ':' + d.format('mm')), 'time');

            return (day + ', ' + month + ' ' + date + ' | '+ timeFormat);
        }
    }

    function mapDays (input) {
      if (!input) {
        return null;
      }
      var dayMap = {
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday',
        'Sun': 'Sunday',
        'Mon.': 'Monday',
        'Tue.': 'Tuesday',
        'Wed.': 'Wednesday',
        'Thu.': 'Thursday',
        'Fri.': 'Friday',
        'Sat.': 'Saturday',
        'Sun.': 'Sunday',
      };

      return dayMap[input];
    }

    function mapMonths (input) {
      if (!input) {
        return null;
      }
      var monthMap = {
        'Jan': 'January',
        'Feb': 'February',
        'Mar': 'March',
        'Apr': 'April',
        'May': 'May',
        'Jun': 'June',
        'Jul': 'July',
        'Aug': 'August',
        'Sep': 'September',
        'Oct': 'October',
        'Nov': 'November',
        'Dec': 'December',
      };

      return monthMap[input];
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:apStyle
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Converts time stamps to NYPL AP style
     */
    function apStyle (input, format) {
        if (!input) {
            return '';
        }
        if (!format) {
            return input;
        }
        if (format === 'time') {
            return apTime(input);
        }
        if (format === 'date') {
            return apDate(input);
        }
        if (format === 'day') {
            return apDay(input);
        }
        if (format === 'month' ) {
            return apMonth(input);
        }

        function apTime (input) {
            var timeArray = input.split(':'),
                militaryHour = parseInt(timeArray[0], 10),
                hour = (militaryHour + 11) % 12 + 1,
                minute = (timeArray[1] === '00') ? '' : ':' + timeArray[1],
                meridiem = (militaryHour >= 12) ? ' PM' : ' AM';

            return hour + minute + meridiem;
        }

        function apDate (input) {
            var date = parseInt(input, 10).toString();

            return date;
        }

        function apDay (input) {
            var day = input.split('.')[0].slice(0, 3);
            return mapDays(day);
        }

        function apMonth (input) {
            if (input.length <= 3) {
              return mapMonths(input);
            }
            return input;
        }
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:capitalize
     * @params {string} input
     * @returns {string} ...
     * @description
     * Capitalize the first word in a phrase.
     */
    function capitalize() {
        return function (input) {
            if (typeof input === 'string') {
                return input.replace(/(^|\s)([a-z])/g, function (str) {
                    return str.toUpperCase();
                });
            }
            return input;
        };
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:hoursTodayFormat
     * @param {object} elem ...
     * @returns {string} ...
     * @description
     * ...
     */
    function hoursTodayFormat() {
        'use strict';
        function getHoursObject(time) {
            time = time.split(':');
            return _.object(
                ['hours', 'mins', 'meridian', 'military'],
                [((parseInt(time[0], 10) + 11) % 12 + 1),
                    time[1],
                    (time[0] >= 12 ? ' PM' : ' AM'),
                    parseInt(time[0], 10)]
            );
        }

        return function (elem) {
            // Not sure yet if this will suffice to get the dynamic
            // hours today
            // moment().get('hours'); or get('hour')??

            var open_time, closed_time,
                now = moment(),
                today, tomorrow,
                tomorrow_open_time, tomorrow_close_time,
                tomorrows_alert, hour_now_military = now.get('hour');

            // If truthy async check
            if (elem) {
                today = elem.today;
                tomorrow = elem.tomorrow;

                // If there are no open or closed times for today's object
                // Then default to return 'Closed Today' with proper error log
                if (!today.open || !today.close) {
                    console.log("Obj is undefined for open/close properties");
                    return 'Closed today';
                }

                // Assign open time obj
                if (today.open) {
                    open_time = getHoursObject(today.open);
                }

                // Assign closed time obj
                if (today.close) {
                    closed_time = getHoursObject(today.close);
                }

                // Assign alert msg for tomorrow if defined
                if (tomorrow.alert !== null) {
                    tomorrows_alert = tomorrow.alert.closed_for || null;
                }

                // Assign tomorrow's open time object
                if (tomorrow.open !== null) {
                    tomorrow_open_time = getHoursObject(tomorrow.open);
                }

                // Assign tomorrow's closed time object
                if (tomorrow.close !== null) {
                    tomorrow_close_time = getHoursObject(tomorrow.close);
                }

                // If the current time is past today's closing time but
                // before midnight, display that it will be open 'tomorrow',
                // if there is data for tomorrow's time.
                if (hour_now_military >= closed_time.military) {

                    // If an alert is set for tomorrow, display that first
                    // before displaying the hours for tomorrow
                    if (tomorrows_alert) {
                        return 'Tomorrow: ' + tomorrows_alert;
                    }
                    else if (tomorrow_open_time && tomorrow_close_time) {
                        return 'Open tomorrow ' + tomorrow_open_time.hours +
                            (parseInt(tomorrow_open_time.mins, 10) !== 0 ? ':' + tomorrow_open_time.mins : '')
                            + tomorrow_open_time.meridian + '–' + tomorrow_close_time.hours +
                            (parseInt(tomorrow_close_time.mins, 10) !== 0 ? ':' + tomorrow_close_time.mins : '')
                            + tomorrow_close_time.meridian;
                    }
                    return 'Closed today';
                }

                // Display a time range if the library has not opened yet
                if (hour_now_military < open_time.military) {
                    return 'Open today ' + open_time.hours +
                        (parseInt(open_time.mins, 10) !== 0 ? ':' + open_time.mins : '')
                        + open_time.meridian + '–' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ? ':' + closed_time.mins : '')
                        + closed_time.meridian;
                }
                // Displays as default once the library has opened
                return 'Open today until ' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ? ':'
                        + closed_time.mins : '')
                        + closed_time.meridian;
            }
            return 'Not available';
        };
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:truncate
     * @param {string} text ...
     * @param {number} [length] ...
     * @returns {string} [end] ...
     * @description
     * ...
     */
    function truncate() {
        return function (text, length, end) {
            if (typeof text !== 'string') {
                return text;
            }

            if (text.length < 200) {
                return text;
            }

            if (isNaN(length)) {
                length = 200; // Default length
            }
            if (end === undefined) {
                end = "..."; // Default ending characters
            }

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }

            return String(text).substring(0, length - end.length) + end;
        };
    }

    angular
        .module('nypl_locations')
        .filter('timeFormat', timeFormat)
        .filter('dateMonthFormat', dateMonthFormat)
        .filter('dateToISO', dateToISO)
        .filter('eventTimeFormat', eventTimeFormat)
        .filter('capitalize', capitalize)
        .filter('hoursTodayFormat', hoursTodayFormat)
        .filter('truncate', truncate);

    angular
        .module('nypl_widget')
        .filter('hoursTodayFormat', hoursTodayFormat)
        .filter('dateMonthFormat', dateMonthFormat)
        .filter('eventTimeFormat', eventTimeFormat);
})();

/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplAmenities
   * @description
   * AngularJS service that deals with all amenity related configuration.
   * Sets amenities categories, icons for each amenity, and highlighted
   * amenities for each branch.
   */
  function nyplAmenities() {

    var amenities = {},
      sortAmenitiesList = function (list, sortBy) {
        if (!(list instanceof Array)) {
          return;
        }

        return _.sortBy(list, function (item) {
          if (!item.amenity) {
            return;
          }
          if (!item.amenity[sortBy]) {
            return item.amenity[sortBy];
          }
          return item[sortBy];
        });
      };

    /**
     * @ngdoc function
     * @name addAmenitiesIcon
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {object} amenity An amenity object.
     * @returns {object} The amenity with an added icon property.
     * @description
     * Adds the appropriate icon to an amenity. First it checks the amenity's
     * category and adds the icon to match the category. Then it check's its
     * id to see if it's an amenity with a special icon. If so, it adds it.
     */
    amenities.addAmenitiesIcon = function (amenity) {
      if (!amenity || !amenity.category) {
        return;
      }

      amenity.icon = this.getCategoryIcon(amenity.category);
      amenity.icon = this.getAmenityIcon(amenity.id, amenity.icon);

      return amenity;
    };

    /**
     * @ngdoc function
     * @name getCategoryIcon
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {string} category The category for the amenity.
     * @param {string} [default_icon] The default icon class.
     * @returns {string} The icon class for the amenity category. 
     * @description
     * Returns a class for the correct icon class for an amenity category.
     */
    amenities.getCategoryIcon = function (category, default_icon) {
      var icon = default_icon || '';

      switch (category) {
      case 'Computer Services':
        icon = 'icon-screen2';
        break;
      case 'Circulation':
        icon = 'icon-book';
        break;
      case 'Printing and Copy Services':
        icon = 'icon-copy';
        break;
      case 'Facilities':
        icon = 'icon-library';
        break;
      case 'Assistive Technologies':
        icon = 'icon-accessibility2';
        break;
      }

      return icon;
    };

    /**
     * @ngdoc function
     * @name getAmenityIcon
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {number} id The amenity's id.
     * @param {string} [default_icon] The default icon class.
     * @returns {string} The icon class for the amenity. 
     * @description
     * Returns the icon for a few special amenities.
     */
    amenities.getAmenityIcon = function (id, default_icon) {
      var icon = default_icon || '';

      switch (id) {
      case 7967: // Wireless
      case 8123: // HotSpot Lending
        icon = 'icon-connection';
        break;
      case 7965: // Laptop
        icon = 'icon-laptop';
        break;
      case 7966: // Printing
        icon = 'icon-print';
        break;
      case 7968: // Electrical oulets
        icon = 'icon-power-cord';
        break;
      case 7971: // Book drop
      case 7972:
        icon = 'icon-box-add';
        break;
      default:
        break;
      }

      return icon;
    };

    /**
     * @ngdoc function
     * @name allAmenitiesArray
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities Array with amenities categories, each
     *  category with it's own amenities property which is an array of
     *  amenities under that category.
     * @returns {array} An array with all the amenities plucked from every
     *  category at a single top level, without any categories involved.
     * @description
     * Deprecated. Creates an flat array of all the amenities from a nested
     * array of amenity categories.
     */
    amenities.allAmenitiesArray = function (amenities) {
      if (!amenities) {
        return;
      }

      return _.chain(amenities)
              // Get the 'amenities' property from every amenity category
              .pluck('amenity')
              // Flatten every array of amenities from each category into
              // a single array.
              .flatten(true)
              // Return the result.
              .value();
    };

    /**
     * @ngdoc function
     * @name getAmenityCategories
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities An array with amenity objects.
     * @returns {array} Returns an array created with objects extracted from
     *  every amenity's category property.
     * @description
     * Used to get the categories from the flat array of amenity objects.
     */
    amenities.getAmenityCategories = function (amenities) {
      if (!amenities) {
        return;
      }

      return _.chain(amenities)
              .pluck('category')
              .flatten(true)
              .unique()
              .value();
    };

    /**
     * @ngdoc function
     * @name createAmenitiesCategories
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities ...
     * @returns {array} Returns ...
     * @description
     * ...
     */
    amenities.createAmenitiesCategories = function (amenities) {
      var default_order = ['Computer Services', 'Circulation',
          'Printing and Copy Services', 'Facilities', 'Assistive Technologies'],
        categoryNames,
        categories = [],
        categoryObj,
        self = this;

      if (!amenities) {
        return;
      }

      categoryNames = this.getAmenityCategories(amenities);

      _.each(categoryNames, function (category) {
        categoryObj = {};
        categoryObj.amenities = _.where(amenities, {'category': category});
        categoryObj.name = category;
        categoryObj.icon = self.getCategoryIcon(category);

        if (categoryObj.amenities.length) {
          categories[_.indexOf(default_order, category)] = categoryObj;
        }
      });

      return categories;
    };

    /**
     * @ngdoc function
     * @name getHighlightedAmenities
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {array} amenities Array with amenities categories, each category
     *  with it's own amenities property which is an array of amenities
     *  under that category.
     * @param {number} rank How many institution ranked amenities should be
     *  returned in the beginning of the array.
     * @param {number} loc_rank How many location ranked amenities should be
     *  returned at the end of the array.
     * @returns {array} An array containing a specific number of institution
     *  and location ranked amenities, with institution amenities listed first.
     * @description
     * ...
     * @example
     * <pre>
     *  // Get three institution and two location ranked amenities.
     *  var highlightedAmenities =
     *    nyplAmenities
     *      .getHighlightedAmenities(location._embedded.amenities, 3, 2);
     * </pre>
     */
    amenities.getHighlightedAmenities = function (amenities, rank, loc_rank) {
      var initial_list = amenities,
        amenities_list = [];

      if (!(amenities && amenities.length && rank && loc_rank)) {
        return;
      }

      // Sort the list of all amenities by institution rank.
      initial_list = sortAmenitiesList(initial_list, 'rank');
      // Retrieve the first n institution ranked amentities.
      amenities_list = initial_list.splice(0, rank);
      // The institution ranked array that we retrieved are no longer in the
      // array. Sort the remaining list of amenities by location rank.
      initial_list = sortAmenitiesList(initial_list, 'location_rank');
      // Retrieve the first n location ranked amenities and add
      initial_list = initial_list.splice(0, loc_rank);
      // Combine the two arrays, listing the institution ranked amenities first.
      amenities_list = _.union(amenities_list, initial_list);

      return amenities_list;
    };

    /**
     * @ngdoc function
     * @name getAmenityConfig
     * @methodOf nypl_locations.service:nyplAmenities
     * @param {object} config Config object from Sinatra.
     * @param {number} globalDefault How many institution wide amenities.
     * @param {number} localDefault How many local amenities to show.
     * @returns {object} Object with how many global and local amenities to
     * display.
     * @description
     * ...
     */
    amenities.getAmenityConfig =
      function (config, globalDefault, localDefault) {
        var obj = {},
          global = globalDefault || 3,
          local  = localDefault || 2;

        if (config && config.featured_amenities) {
          obj.global = config.featured_amenities.global || global;
          obj.local  = config.featured_amenities.local || local;
        } else {
          obj.global = global;
          obj.local  = local;
        }
        return obj;
      };

    return amenities;
  }

  angular
    .module('nypl_locations')
    .factory('nyplAmenities', nyplAmenities);

})();


/*jslint indent: 2, maxlen: 80, nomen: true, todo: true */
/*globals nypl_locations, google, document, _, angular */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplGeocoderService
   * @requires $q
   * @description
   * AngularJS service that deals with all Google Maps related functions.
   * Can add a map to a page and add markers to the map.
   */
  function nyplGeocoderService($q) {
    var map,
      markers = [],
      filteredLocation,
      searchMarker = new google.maps.Marker({
        icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }),
      searchInfoWindow = new google.maps.InfoWindow(),
      infowindow = new google.maps.InfoWindow(),
      geocoderService = {},

      /*
       * @ngdoc function
       * @name getMarkerFromList
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {string} id The location's slug used for the marker id.
       * @returns {object} The marker object that has the id that was passed,
       *  else an empty object.
       * @private
       */
      getMarkerFromList = function (id) {
        return _.findWhere(markers, {id: id});
      },

      /*
       * @ngdoc function
       * @name showInfowindow
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {object} marker Google Maps Marker object.
       * @param {string} text Text that will appear in the Google Maps marker's
       *  infowindow.
       * @private
       * @description Hides any previous infowindow displaying on the map and
       *  will display the infowindow for the marker passed with the text.
       * @example
       * <pre>
       *  var marker = new google.maps.Marker({...}),
       *    text = "Address of marker";
       *  showInfowindow(marker, text);
       * </pre>
       */
      showInfowindow =  function (marker, text) {
        geocoderService.hideInfowindow();
        infowindow.setContent(text);
        infowindow.open(map, marker);
      },

      /*
       * @ngdoc function
       * @name removeMarkerFromMap
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {string} id The id for the marker that should be removed.
       * @private
       * @description Removes the specified marker from the map.
       * @example
       * <pre>
       *  removeMarkerFromMap('baychester');
       * </pre>
       */
      removeMarkerFromMap = function (id) {
        var markerObj = getMarkerFromList(id);
        if (geocoderService.doesMarkerExist(id)) {
          markerObj.marker.setMap(null);
        }
      },

      /*
       * @ngdoc function
       * @name addMarkerToMap
       * @methodOf nypl_locations.service:nyplGeocoderService
       * @param {string} id The id for the marker to add to the map.
       * @private
       * @description Add the specified marker to the map.
       * @example
       * <pre>
       *  addMarkerToMap('parkester');
       * </pre>
       */
      addMarkerToMap = function (id) {
        var markerObj = getMarkerFromList(id);
        if (markerObj) {
          markerObj.marker.setMap(map);
        }
      };

    /**
     * @ngdoc function
     * @name geocodeAddress
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} address Address or location to search for.
     * @returns {object} Deferred promise. If it resolves, an object is returned
     *  with coordinates and formatted address, or an error if rejected.
     * @example
     * <pre>
     *  nyplGeocoderService.geocodeAddress('Bryant Park')
     *    .then(function (coords) {
     *      // coords.lat, coords.long, coords.name
     *    });
     *    .catch(function (error) {
     *      // "Query too short" or Google error status
     *    });
     * </pre>
     */
    geocoderService.geocodeAddress = function (address) {
      var defer = $q.defer(),
        coords = {},
        geocoder = new google.maps.Geocoder(),
        sw_bound = new google.maps.LatLng(40.49, -74.26),
        ne_bound = new google.maps.LatLng(40.91, -73.77),
        bounds = new google.maps.LatLngBounds(sw_bound, ne_bound),
        geocodeOptions = {
          address: address,
          // bounds: bounds,
          region: "US",
          // componentRestrictions: {
          //   'country': 'US',
          //   'locality': 'New York'
          // }
        };

      geocoder.geocode(geocodeOptions, function (result, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            coords.lat  = result[0].geometry.location.lat();
            coords.long = result[0].geometry.location.lng();
            coords.name = result[0].formatted_address;

            defer.resolve(coords);
          } else {
            defer.reject(new Error(status));
          }
        });

      return defer.promise;
    };

    /**
     * @ngdoc function
     * @name reverseGeocoding
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} coords Object with lat and long properties.
     * @returns {object} Deferred promise. If it resolves, a string of Google's
     *  best attempt to reverse geocode coordinates into a formatted address.
     * @example
     * <pre>
     *  nyplGeocoderService.reverseGeocoding({
     *    lat: 40.7532,
     *    long: -73.9822
     *  })
     *  .then(function (address) {
     *    $scope.address = address;
     *  });
     *  .catch(function (error) {
     *    // Google error status
     *  });
     * </pre>
     */
    geocoderService.reverseGeocoding = function (coords) {
      var address,
        defer = $q.defer(),
        geocoder = new google.maps.Geocoder(),
        latlng = new google.maps.LatLng(coords.lat, coords.lng);

      geocoder.geocode({latLng: latlng}, function (result, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          address = result[0].formatted_address;
          defer.resolve(address);
        } else {
          defer.reject(new Error(status));
        }
      });

      return defer.promise;
    };

    /*
     * @ngdoc function
     * @name drawMap
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} coords Object with lat and long properties.
     * @param {number} zoom The Google Map zoom distance.
     * @param {string} id The id of the element to draw the map on.
     * @description Draw a Google Maps map on a specific element on the page.
     * @example
     * <pre>
     *  nyplGeocoderService.drawMap({
     *    lat: 40.7532,
     *    long: -73.9822
     *  }, 12, 'all-locations-map');
     * </pre>
     */
    geocoderService.drawMap = function (coords, zoom, id) {
      var locationCoords = new google.maps.LatLng(coords.lat, coords.long),
        mapOptions = {
          zoom: zoom,
          center: locationCoords,
          mapTypeControl: false,
          panControl: true,
          zoomControl: true,
          scaleControl: true,
          streetViewControl: false
        };

      map = new google.maps.Map(document.getElementById(id), mapOptions);
      return this;
    };

    /**
     * @ngdoc function
     * @name drawLegend
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id The id of the element to draw the map legend on.
     * @description Draw an element on the page designated to be the legend on
     *  the Google Maps map. It will be drawn on the bottom right corner.
     * @example
     * <pre>
     *  nyplGeocoderService.drawLegend('all-locations-map-legend');
     * </pre>
     */
    geocoderService.drawLegend = function (id) {
      var mapLegend = document.getElementById(id);

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapLegend);
      mapLegend.className = "show-legend";

      return this;
    };

    /**
     * @ngdoc function
     * @name panMap
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} [marker] A Google Maps marker object.
     * @description If a marker object is passed, it will pan to that marker on
     *  the page. Otherwise it will pan to SASB.
     * @todo Find the default location and zoom level for the map.
     * @example
     * <pre>
     *  nyplGeocoderService.drawLegend('all-locations-map-legend');
     * </pre>
     */
    geocoderService.panMap = function (marker) {
      var sasbLocation = new google.maps.LatLng(40.7632, -73.9822),
        position,
        zoom;

      if (!map) {
        return;
      }

      if (!marker) {
        position = sasbLocation;
        zoom = 12;
      } else {
        position = marker.getPosition();
        zoom = 14;
      }
      map.panTo(position);
      map.setZoom(zoom);

      return this;
    };

    /**
     * @ngdoc function
     * @name showResearchLibraries
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description Calling this function will remove all the markers from
     *  the map except for research branches markers and the user marker.
     */
    geocoderService.showResearchLibraries = function () {
      // Add the 'user' marker. If it's available,
      // we do not want to remove it at all. Use slug names.
      var list = ['schwarzman', 'lpa', 'sibl', 'schomburg', 'user'];

      _.each(markers, function (marker) {
        if (!_.contains(list, marker.id)) {
          removeMarkerFromMap(marker.id);
        }
      });

      return this;
    };

    /**
     * @ngdoc function
     * @name showAllLibraries
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description This will add all the markers available on the map.
     */
    geocoderService.showAllLibraries = function () {
      if (markers) {
        _.each(markers, function (marker) {
          addMarkerToMap(marker.id);
        });
      }

      return this;
    };

    /**
     * @ngdoc function
     * @name createMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id The location's slug.
     * @param {object} location The location's coordinates as an object with
     *  latitude and longitude properties.
     * @param {string} text The location's address for the marker's infowindow,
     *  with markup since the infowindow allows markup.
     * @description This will create a Google Maps Marker and add it to the
     *  global markers array. If the marker is the user's marker, it will have
     *  a different icon, zIndex, and animation.
     * @example
     * <pre>
     *  nyplGeocoderService.createMarker('sibl', {
     *    latitude: 40.24,
     *    longitude: -73.24
     *  }, 'Science, Industry and Business Library (SIBL) 188 Madison Avenue ' +
     *   '@ 34th Street New York, NY, 10016');
     * </pre>
     */
    geocoderService.createMarker = function (id, location, text) {
      var marker,
        position =
          new google.maps.LatLng(location.latitude, location.longitude),
        markerOptions = {
          position: position,
          icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
        };

      if (id === 'user') {
        markerOptions.icon =
          "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        markerOptions.zIndex = 1000;
        markerOptions.animation = google.maps.Animation.DROP;
      }

      marker = new google.maps.Marker(markerOptions);
      markers.push({id: id, marker: marker, text: text});

      google.maps.event.addListener(marker, 'click', function () {
        showInfowindow(marker, text);
      });
    };

    /**
     * @ngdoc function
     * @name hideInfowindow
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description Hides the infowindow if the current infowindow is opened.
     * @example
     * <pre>
     *  // ... Do some map related interaction
     *  nyplGeocoderService.hideInfowindow();
     * </pre>
     */
    geocoderService.hideInfowindow = function () {
      infowindow.close();
      return this;
    };

    /**
     * @ngdoc function
     * @name doesMarkerExist
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id A marker's id.
     * @returns {boolean} True if the marker exists, false otherwise.
     * @description Checks the markers array for the marker with the id passed.
     * @example
     * <pre>
     *  if (nyplGeocoderService.doesMarkerExist('schwarzman')) {
     *    // Do something with the marker.
     *    nyplGeocoderService.panExistingMarker('schwarzman');
     *  }
     * </pre>
     */
    geocoderService.doesMarkerExist = function (id) {
      return !!getMarkerFromList(id);
    };

    /**
     * @ngdoc function
     * @name createSearchMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {object} coords Object with lat and long properties.
     * @param {string} text The text that should appear in the marker's
     *  infowindow.
     * @example
     * <pre>
     *  nyplGeocoderService.createSearchMarker({
     *    lat: 40.49, long: -74.26
     *  }, 'Infowindow description of the marker');
     * </pre>
     */
    geocoderService.createSearchMarker = function (coords, text) {
      var searchTerm = text.replace(',', ' <br>').replace(',', ' <br>'),
        panCoords = new google.maps.LatLng(coords.lat, coords.long);

      searchMarker.setPosition(panCoords);
      searchInfoWindow.setContent(searchTerm);
    };

    /**
     * @ngdoc function
     * @name drawSearchMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description If there are no filtered location to add to the map, and if
     *  the search marker is not already on the map, then add it to the map and
     *  pan to the marker. Also display the infowindow for that marker.
     */
    geocoderService.drawSearchMarker = function () {
      if (!filteredLocation) {
        searchMarker.setMap(map);
        this.panMap(searchMarker);

        searchInfoWindow.open(map, searchMarker);
        this.hideInfowindow();
        google.maps.event.addListener(searchMarker, 'click', function () {
          searchInfoWindow.open(map, searchMarker);
        });
      }

      return this;
    };

    /**
     * @ngdoc function
     * @name hideSearchInfowindow
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @description Public wrapper to close the search marker's infowindow.
     */
    geocoderService.hideSearchInfowindow = function () {
      searchInfoWindow.close();
      return this;
    };

    /**
     * @ngdoc function
     * @name removeMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id A Google Maps marker's id.
     * @description Public function to remove a specific marker from the
     *  initialized map.
     */
    geocoderService.removeMarker = function (id) {
      if (!id) {
        return this;
      }

      if (id === 'search') {
        searchMarker.setMap(null);
      } else {
        removeMarkerFromMap(id);
      }
      return this;
    };

    /**
     * @ngdoc function
     * @name panExistingMarker
     * @methodOf nypl_locations.service:nyplGeocoderService
     * @param {string} id A location's slug.
     * @description Using the location's slug, pan to that marker on the map.
     *  Also display the infowindow.
     */
    geocoderService.panExistingMarker = function (id) {
      var markerObj = getMarkerFromList(id),
        marker = markerObj.marker;

      if (marker.getMap() === undefined || marker.getMap() === null) {
        addMarkerToMap(id);
      }

      this.panMap(marker);
      showInfowindow(markerObj.marker, markerObj.text);

      return this;
    };

    return geocoderService;
  }
  nyplGeocoderService.$inject = ["$q"];

  angular
    .module('nypl_locations')
    .factory('nyplGeocoderService', nyplGeocoderService);

})();

/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplSearch
   * @description
   * AngularJS service that deals preserving data across the app, specifically
   * used for saving the home state.
   */
  function nyplSearch($filter) {
    var search = {},
      searchValues = {};

    /**
     * @ngdoc function
     * @name setSearchValue
     * @methodOf nypl_locations.service:nyplSearch
     * @param {string} prop ...  
     * @param {string} val ...
     * @returns {object} ...
     * @description
     * ...
     */
    search.setSearchValue = function (prop, val) {
      searchValues[prop] = val;
      return this;
    };

    /**
     * @ngdoc function
     * @name getSearchValues
     * @methodOf nypl_locations.service:nyplSearch
     * @returns {object} ...
     * @description
     * ...
     */
    search.getSearchValues = function () {
      return searchValues;
    };

    /**
     * @ngdoc function
     * @name resetSearchValues
     * @methodOf nypl_locations.service:nyplSearch
     * @returns {object} ...
     * @description
     * ...
     */
    search.resetSearchValues = function () {
      searchValues = {};
      return this;
    };

    /**
     * @ngdoc function
     * @name idLocationSearch
     * @methodOf nypl_locations.service:nyplSearch
     * @param {array} locations Array containing a list of all the
     *  locations objects.
     * @param {string} searchTerm The id to search for in all the locations.
     * @returns {array} An array containing the location object with the
     *  searched id. An empty array if there is no match.
     * @description All the locations are being searched with a specific ID in
     *  mind. If there is a location object where the 'id' property matches the
     *  id that was being searched, then it is returned in an array.
     */
    search.idLocationSearch = function (locations, searchTerm) {
      var IDFilter = [];

      if (!locations || !searchTerm) {
        return;
      }

      if (searchTerm.length >= 2 && searchTerm.length <= 4) {
        IDFilter = _.where(locations, { 'id' : searchTerm.toUpperCase() });
      }

      return IDFilter;
    };

    /**
     * @ngdoc function
     * @name locationSearch
     * @methodOf nypl_locations.service:nyplSearch
     * @param {array} locations An array with all the location objects.
     * @param {string} searchTerm The search word or phrased to look for in the
     *  locations objects.
     * @returns {array} An array that returns filtered locations based on what
     *  was queried and what AngularJS' filter returns.
     * @description Using the native AngularJS filter, we do a lazy and strict
     *  filter through the locations array. The strict filter has a higher
     *  priority since it's a better match. The 'lazy' filter matches anything,
     *  even part of a word. For example, 'sibl' would match with 'accesSIBLe'
     *  which is undesirable.
     */
    search.locationSearch = function (locations, searchTerm) {
      // how to search the object?
      // name, address, zipcode, locality, synonyms (amenities and divisions?)

      var lazyFilter, strictFilter;

      if (!locations || !searchTerm || searchTerm.length < 3) {
        return;
      }

      lazyFilter = $filter('filter')(locations, searchTerm);
      strictFilter = $filter('filter')(locations, searchTerm, true);

      return lazyFilter;
    };

    /**
     * @ngdoc function
     * @name searchWordFilter
     * @methodOf nypl_locations.service:nyplSearch
     * @param {string} query The search word or phrase.
     * @returns {string} The same search phrase but with stop words removed.
     * @description Some words should be removed from a user's search query.
     *  Those words are removed before doing any filtering or searching using 
     *  Google's service.
     */
    search.searchWordFilter = function (query) {
      var words = ['branch'];

      if (!query) {
        return;
      }

      _.each(words, function (word) {
        query = query.replace(word, '');
      });

      return query;
    };

    return search;
  }
  nyplSearch.$inject = ["$filter"];

  angular
    .module('nypl_locations')
    .factory('nyplSearch', nyplSearch);

})();

/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name nypl_locations.service:requestNotificationChannel
   * @requires $rootScope
   * @description
   * Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
   */
  function requestNotificationChannel($rootScope) {
    // private notification messages
    var _START_REQUEST_ = '_START_REQUEST_',
      _END_REQUEST_ = '_END_REQUEST_',
      notificationChannel = {};

    // publish start request notification
    notificationChannel.requestStarted = function () {
      $rootScope.$broadcast(_START_REQUEST_);
    };

    // publish end request notification
    notificationChannel.requestEnded = function () {
      $rootScope.$broadcast(_END_REQUEST_);
    };

    // subscribe to start request notification
    notificationChannel.onRequestStarted = function ($scope, handler) {
      $scope.$on(_START_REQUEST_, function (event) {
        handler(event);
      });
    };

    // subscribe to end request notification
    notificationChannel.onRequestEnded = function ($scope, handler) {
      $scope.$on(_END_REQUEST_, function (event) {
        handler(event);
      });
    };

    return notificationChannel;
  }
  requestNotificationChannel.$inject = ['$rootScope'];

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplUtility
   * @requires $sce
   * @requires $window
   * @requires nyplCoordinatesService
   * @requires $anchorScroll
   * @description
   * AngularJS service with utility functions.
   */
  function nyplUtility(
    $anchorScroll,
    $location,
    $sce,
    $timeout,
    $window,
    nyplCoordinatesService
  ) {
    var utility = {};

    /**
     * @ngdoc function
     * @name hoursToday
     * @methodOf nypl_locations.service:nyplUtility
     * @param {object} hours Object with a regular property that is an
     *  array with the open and close times for every day.
     * @param {object} alerts Object with an array of alerts pertaining
     *  to each location/division api endpoint.
     * @returns {object} An object with the open/close times for
     *  the today/tomorrow and an alert property for tomorrow's
     *  potential alert.
     * @description ...
     */
    utility.hoursToday = function (hours, alertsObj) {
      var today = moment().day(),
        tomorrow = moment().add(1, 'days').startOf('day'),
        hoursToday,
        alerts,
        alertStartDate,
        tomorrowsAlert;

      if(alertsObj) {
        // Retrieve only global closing alerts
        // Order is established by API
        if (alertsObj.all_closings && alertsObj.all_closings.length) {
          alerts = alertsObj.all_closings;
        }
      }

      if (hours) {
        // Obtain tomorrow's alert
        if (alerts && alerts.length) {
          tomorrowsAlert = _.find(alerts, function(alert){
            if (alert.applies) {
              alertStartDate = moment(alert.applies.start);
              // Priority: 1) Global 2) Location 3) Division
              if (alert.scope === 'all' && alertStartDate.isSame(tomorrow, 'day')) {
                return alert;
              } else if (alert.scope === 'location' && alertStartDate.isSame(tomorrow, 'day')) {
                return alert;
              }
              return alert.scope === 'division' && alertStartDate.isSame(tomorrow, 'day');
            }
          });
        }

        hoursToday = {
          'today': {
            'day': hours.regular[today].day,
            'open': hours.regular[today].open,
            'close': hours.regular[today].close
          },
          'tomorrow': {
            'day': hours.regular[tomorrow.day() % 7].day,
            'open': hours.regular[tomorrow.day() % 7].open,
            'close': hours.regular[tomorrow.day() % 7].close,
            'alert' : tomorrowsAlert || null
          }
        };
      }
      return hoursToday;
    };

    /**
     * @ngdoc function
     * @name formatDate
     * @methodOf nypl_locations.service:nyplUtility
     * @param {string} startDate ...
     * @param {string} endDate ...
     * @returns {string} ...
     * @description ...
     */
    utility.formatDate = function(startDate, endDate) {
      var formattedDate,
        sDate = (startDate) ? new Date(startDate) : null,
        eDate = (endDate) ? new Date(endDate) : null,
        today = new Date(),
        happeningSoon = (sDate && sDate.getTime() <= today.getTime()) ? true : false,
        daysBetweenStartEnd = (startDate && endDate) ?
          moment(eDate).diff(moment(sDate), 'days') : null,
        rangeLimit = 365,
        months = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];

      if (!sDate || daysBetweenStartEnd < 0) {
        return;
      }

      if (!eDate || daysBetweenStartEnd > rangeLimit) {
        if (happeningSoon) {
          formattedDate = 'Open now. Ongoing.';
        } else {
          formattedDate = 'Opening soon. ' + months[sDate.getUTCMonth()] +
            ' ' + sDate.getUTCDate() + ', ' + sDate.getUTCFullYear() + '.';
        }
      } else {
        if (happeningSoon) {
          formattedDate = 'Open now. Ends ' + months[eDate.getUTCMonth()] +
            ' ' + eDate.getUTCDate() + ', ' + eDate.getUTCFullYear() + '.';
        } else {
          formattedDate = 'Opening soon. ' + months[sDate.getUTCMonth()] +
            ' ' + sDate.getUTCDate() + ', ' + sDate.getUTCFullYear() +
            '–' + months[eDate.getUTCMonth()] + ' ' + eDate.getUTCDate() +
            ', ' + eDate.getUTCFullYear() + '.';
        }
      }
      return formattedDate;
    }

    /**
     * @ngdoc function
     * @name branchException
     * @methodOf nypl_locations.service:nyplUtility
     * @param {object} hours ...
     * @returns {object} ...
     * @description Parse exception data and return as string
     */
    utility.branchException = function (hours) {
      var exception = {};

      if (hours) {
        // If truthy, data exist for existing location
        if (!hours.exceptions) {
          return null;
        }
        if (hours.exceptions.description.trim() !== '') {
          exception.desc = hours.exceptions.description;
          // Optional set
          if (hours.exceptions.start) {
            exception.start = hours.exceptions.start;
          }
          if (hours.exceptions.end) {
            exception.end = hours.exceptions.end;
          }
          return exception;
        }
      }

      return null;
    };

    /**
     * @ngdoc function
     * @name getAddressString
     * @methodOf nypl_locations.service:nyplUtility
     * @param {object} location The full location object.
     * @param {boolean} [nicePrint] False by default. If true is passed,
     *  the returned string will have HTML so it displays nicely in a
     *  Google Maps marker infowindow.
     * @returns {string} The formatted address of the location passed.
     *  Will contain HTML if true is passed as the second parameter,
     *  with the location name linked.
     * @description ...
     */
    utility.getAddressString = function (location, nicePrint) {
      if (!location) {
        return '';
      }

      var addressBreak = ' ',
        linkedName = '';

      if (nicePrint) {
        linkedName = "<a href='/locations/" + location.slug +
          "'>" + location.name + "</a><br />";
        addressBreak = "<br />";
      }

      return linkedName +
        location.street_address + addressBreak +
        location.locality + ", " +
        location.region + ", " +
        location.postal_code;
    };

    /**
     * @ngdoc function
     * @name socialMediaColor
     * @methodOf nypl_locations.service:nyplUtility
     * @param {object} social_media ...
     * @description ...
     */
    utility.socialMediaColor = function (social_media) {
      _.each(social_media, function (sc) {
        sc.classes = 'icon-';
        switch (sc.site) {
        case 'facebook':
          sc.classes += sc.site + ' blueDarkerText';
          break;
        case 'foursquare':
          sc.classes += sc.site + ' blueText';
          break;
        case 'instagram':
          sc.classes += sc.site + ' blackText';
          break;
        // Twitter and Tumblr have a 2 in their icon class
        // name: icon-twitter2, icon-tumblr2
        case 'twitter':
          sc.classes += sc.site + '2 blueText';
          break;
        case 'tumblr':
          sc.classes += sc.site + '2 indigoText';
          break;
        case 'youtube':
        case 'pinterest':
          sc.classes += sc.site + ' redText';
          break;
        default:
          sc.classes += sc.site;
          break;
        }
      });

      return social_media;
    };

    /**
     * @ngdoc function
     * @name popupWindow
     * @methodOf nypl_locations.service:nyplUtility
     * @param {string} link ...
     * @param {string} title ...
     * @param {string} width ...
     * @param {string} height ...
     * @description
     * Utility service function that opens a new window given a URL.
     * width (Int or String), height (Int or String)
     */
    utility.popupWindow = function (link, title, width, height) {
      var w, h, popUp, popUp_h, popUp_w;

      if (!link) {
        return;
      }

      // Set width from args, defaults 300px
      if (width === undefined) {
        w = '300';
      } else if (typeof width === 'string' || width instanceof String) {
        w = width;
      } else {
        w = width.toString(); // convert to string
      }

      // Set height from args, default 500px;
      if (height === undefined) {
        h = '500';
      } else if (typeof width === 'string' || width instanceof String) {
        h = height;
      } else {
        h = height.toString(); // convert to string
      }

      // Check if link and title are set and assign attributes
      if (link && title) {
        popUp = $window.open(
          link,
          title,
          "menubar=1,resizable=1,width=" + w + ",height=" + h
        );
      } else if (link) {
        // Only if link is set, default title: ''
        popUp = $window.open(
          link,
          "",
          "menubar=1,resizable=1,width=" + w + ",height=" + h
        );
      }

      // Once the popup is set, center window
      if (popUp) {
        popUp_w = parseInt(w, 10);
        popUp_h = parseInt(h, 10);

        popUp.moveTo(
          screen.width / 2 - popUp_w / 2,
          screen.height / 2 - popUp_h / 2
        );
      }
    };

    /**
     * @ngdoc function
     * @name calendarLink
     * @methodOf nypl_locations.service:nyplUtility
     * @param {string} type ...
     * @param {object} event ...
     * @param {object} location ...
     * @description ...
     */
    utility.calendarLink = function (type, event, location) {
      if (!type || !event || !location) {
        return '';
      }
      var title = event.title,
        start_date = event.start.replace(/[\-:]/g, ''),
        end_date = event.end.replace(/[\-:]/g, ''),
        body = event.body,
        url = event._links.self.href,
        address = location.name + " - " +
          location.street_address + " " +
          location.locality + ", " + location.region +
          " " + location.postal_code,
        calendar_link = '';

      switch (type) {
      case 'google':
        calendar_link = "https://www.google.com/calendar" +
          "/render?action=template" +
          "&text=" + title +
          "&dates=" + start_date + "/" + end_date +
          "&details=" + body +
          "&location=" + address +
          "&pli=1&uid=&sf=true&output=xml";
        break;
      case 'yahoo':
        calendar_link = "https://calendar.yahoo.com/?v=60" +
          "&TITLE=" + title +
          "&ST=" + start_date +
          "&in_loc=" + address +
          "&in_st=" + address +
          "&DESC=" + body +
          "&URL=" + url;
        break;
      default:
        break;
      }

      return calendar_link;
    };

    /**
     * @ngdoc function
     * @name icalLink
     * @methodOf nypl_locations.service:nyplUtility
     * @param {object} event ...
     * @param {object} address ...
     * @description ...
     */
    utility.icalLink = function (event, address) {
      if (!event || !address) {
        return '';
      }
      var currentTime = new Date().toJSON().toString().replace(/[\-.:]/g, ''),
        url = "http://nypl.org/" + event._links.self.href,
        icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NYPL//" +
          "NONSGML v1.0//EN\n" +
          "METHOD:PUBLISH\n" +
          "BEGIN:VEVENT\n" +
          "UID:" + new Date().getTime() +
          "\nDTSTAMP:" + currentTime + "\nATTENDEE;CN=My Self ;" +
          "\nORGANIZER;CN=NYPL:" +
          "\nDTSTART:" + event.start.replace(/[\-:]/g, '') +
          "\nDTEND:" + event.end.replace(/[\-:]/g, '') +
          "\nLOCATION:" + address +
          "\nDESCRIPTION:" + event.body +
          "\nURL;VALUE=URI:" + url +
          "\nSUMMARY:" + event.title +
          "\nEND:VEVENT\nEND:VCALENDAR",
        icalLink = 'data:text/calendar;chartset=utf-8,' + encodeURI(icsMSG);

      $window.open(icalLink);
      return icalLink;
    };

    /**
     * @ngdoc function
     * @name calcDistance
     * @methodOf nypl_locations.service:nyplUtility
     * @param {object} locations ...
     * @param {object} coords ...
     * @description
     * Iterate through lon/lat and calculate distance
     */
    utility.calcDistance = function (locations, coords) {
      if (!locations) {
        return [];
      }

      var searchCoordinates = {
        latitude: coords.latitude || coords.lat,
        longitude: coords.longitude || coords.long
      };

      _.each(locations, function (location) {
        var locCoords = [], locationLat, locationLong;

        if (location.geolocation && location.geolocation.coordinates) {
          locCoords = location.geolocation.coordinates;
        }

        locationLat = location.lat || locCoords[1];
        locationLong = location.long || locCoords[0];

        location.distance = nyplCoordinatesService.getDistance(
          searchCoordinates.latitude,
          searchCoordinates.longitude,
          locationLat,
          locationLong
        );
      });

      return locations;
    };

    /**
     * @ngdoc function
     * @name checkDistance
     * @methodOf nypl_locations.service:nyplUtility
     * @param {array} locations An array with all the locations objects.
     * @returns {boolean} True if the minimum distance property from each
     *  location is more than 25 (miles). False otherwise.
     * @description An array of distance values is created from the distance
     *  property of each location. If the minimum distance is more than 25 miles
     *  we return true; used when we want to check if we want to continue
     *  searching or manipulating the locations.
     */
    utility.checkDistance = function (locations) {
      var distanceArray = _.pluck(locations, 'distance');

      if (_.min(distanceArray) > 25) {
        return true;
      }
      return false;
    };

    /**
     * @ngdoc function
     * @name returnHTML
     * @methodOf nypl_locations.service:nyplUtility
     * @param {string} html A string containing HTML that should be rendered.
     * @returns {string} A trusted string with renderable HTML used in
     *  AngularJS' markup binding.
     * @description Using the ngSanitize module to allow markup in a string.
     *  The second step is to use ng-bind-html="..." to display the
     *  trusted HTMl.
     */
    utility.returnHTML = function (html) {
      return $sce.trustAsHtml(html);
    };

    /**
     * @ngdoc function
     * @name divisionHasAppointment
     * @methodOf nypl_locations.service:nyplUtility
     * @param {string} id The id of a division.
     * @returns {boolean} True if the division is in the set that should have
     *  appointments, false otherwise.
     * @description Only a few divisions should have a link to make
     *  an appointment.
     */
    utility.divisionHasAppointment = function (divisionsWithApts, id) {
      return _.contains(divisionsWithApts, id);
    };

    /**
     * @ngdoc function
     * @name researchLibraryOrder
     * @methodOf nypl_locations.service:nyplUtility
     * @param {array} research_order ...
     * @param {string} id The id of a branch.
     * @returns {number} ...
     * @description ..
     */
    utility.researchLibraryOrder = function (research_order, id) {
      return _.indexOf(research_order, id);
    };

    utility.scrollToHash = function () {
      if ($location.hash()) {
        $timeout(function () {
          $anchorScroll();
        }, 900);
      }
    };

    utility.createHash = function (id) {
      $location.hash(id);
      this.scrollToHash();
    };

    utility.mapDays = function (input) {
      if (!input) {
        return null;
      }
      var dayMap = {
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday',
        'Sun': 'Sunday',
        'Mon.': 'Monday',
        'Tue.': 'Tuesday',
        'Wed.': 'Wednesday',
        'Thu.': 'Thursday',
        'Fri.': 'Friday',
        'Sat.': 'Saturday',
        'Sun.': 'Sunday',
      };

      return dayMap[input];
    };

    return utility;
  }
  nyplUtility.$inject = ['$anchorScroll', '$location', '$sce',
    '$timeout', '$window', 'nyplCoordinatesService'];

  angular
    .module('nypl_locations')
    .factory('nyplUtility', nyplUtility)
    .factory('requestNotificationChannel', requestNotificationChannel);

  angular
    .module('nypl_widget')
    .factory('nyplUtility', nyplUtility)
    .factory('requestNotificationChannel', requestNotificationChannel);
})();
