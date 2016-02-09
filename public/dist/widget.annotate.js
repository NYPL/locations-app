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
     * @name nypl_locations.filter:dayFormat
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Convert the syntax of week day to AP style.
     * eg Sun. to SUN, Tue. to TUES
     */
    function dayFormat() {
        return function (input) {
            var day = (input) ? apStyle(input, 'day') : '',
                days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
                formattedDay = (days.includes(day)) ? day.toUpperCase() : '';

            return formattedDay;
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
     * @name nypl_locations.filter:apStyle
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Coverts time stamps of to NYPL AP style
     */
    function apStyle (input, format) {
        if (!format) {
            return input;
        }
        if (format === 'time') {
            return convertTime(input);
        }
        if (format === 'date') {
            return convertDate(input);
        }
        if (format === 'day') {
            return convertDay(input);
        }
        if (format === 'month' ) {
            return convertMonth(input);
        }

        function convertTime (input) {
            var timeArray = input.split(':'),
                militaryHour = parseInt(timeArray[0], 10),
                hour = (militaryHour + 11) % 12 + 1,
                minute = (timeArray[1] === '00') ? '' : ':' + timeArray[1],
                meridiem = (militaryHour > 12) ? ' PM' : ' AM';

            return hour + minute + meridiem;
        }

        function convertDate (input) {
            var date = parseInt(input, 10).toString();

            return date;
        }

        function convertDay (input) {
            var day = input.split('.')[0].slice(0, 3);

            if (day === 'Tue') {
                return 'Tues';
            }
            if (day ==='Thu') {
                return 'Thurs';
            }
            return day;
        }

        function convertMonth (input) {
            var month = input.slice(0, 3);

            if (month === 'Jun') {
                return 'June';
            }
            if (month === 'Jul') {
                return 'July';
            }
            if (month === 'Sep') {
                return 'Sept';
            }
            return month;
        }
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:capitalize
     * @params {string} input
     * @returns {string} ...
     * @description
     * Capitalize all the words in a phrase.
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
        .filter('dayFormat', dayFormat)
        .filter('dateToISO', dateToISO)
        .filter('capitalize', capitalize)
        .filter('hoursTodayFormat', hoursTodayFormat)
        .filter('truncate', truncate);

    angular
        .module('nypl_widget')
        .filter('hoursTodayFormat', hoursTodayFormat);
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
    $scope.locinator_url = "http://www.nypl.org/locations" +
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

  function hoursTable(nyplAlertsService, $filter) {
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

        // Call convertApWeekday for the syntax of weekday styling
        $scope.hours.map(function (item, index) {
          item.day = ctrl.convertApWeekday(item.day);
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

        // Call the filer dayFormat to convert the name of weekdays to AP style
        this.convertApWeekday = function (day) {
          day = (day) ? $filter('dayFormat')(day) : '';
          return day;
        }

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
  hoursTable.$inject = ['nyplAlertsService', '$filter'];

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
          if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
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

