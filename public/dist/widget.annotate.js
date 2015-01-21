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
  nyplCoordinatesService.$inject = ["$q", "$window"];

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

/*jslint nomen: true, indent: 4, maxlen: 80 */
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
    'newrelic-timing'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
    '$analyticsProvider',
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$crumbProvider',
    function (
        $analyticsProvider,
        $locationProvider,
        $stateProvider,
        $urlRouterProvider,
        $crumbProvider
    ) {
        'use strict';

        // Turn off automatic virtual pageviews for GA.
        // In $stateChangeSuccess, /locations/ is added to each page hit.
        $analyticsProvider.virtualPageviews(false);

        // uses the HTML5 History API, remove hash (need to test)
        $locationProvider.html5Mode(true);

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
        LoadLocation.$inject = ["$stateParams", "config", "nyplLocationsService"];

        function LoadSubDivision($q, $stateParams, config, nyplLocationsService) {
            var division    = nyplLocationsService
                                .singleDivision($stateParams.division),
                subdivision = nyplLocationsService
                                .singleDivision($stateParams.subdivision);

            return $q.all([division, subdivision]).then(function (data) {
                var div = data[0].division,
                    subdiv = data[1].division;

                return subdiv;
            });
        }
        LoadSubDivision.$inject = ["$q", "$stateParams", "config", "nyplLocationsService"];

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
        Amenities.$inject = ["$stateParams", "config", "nyplLocationsService"];

        function getConfig(nyplLocationsService) {
            return nyplLocationsService.getConfig();
        }
        getConfig.$inject = ["nyplLocationsService"];

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
        })

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
                url: 'map',
                controller: 'MapCtrl',
                label: 'Locations'
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

nypl_locations.run(["$analytics", "$state", "$rootScope", "$location", function ($analytics, $state, $rootScope, $location) {
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

nypl_locations.run(["$rootScope", "nyplUtility", function ($rootScope, nyplUtility) {
    $rootScope.holiday = nyplUtility.holidayClosings();
}]);

// Declare an http interceptor that will signal
// the start and end of each request
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
nypl_locations.config(['$httpProvider', function ($httpProvider) {
    'use strict';

    var $http,
        interceptor = [
            '$q',
            '$injector',
            '$location',
            function ($q, $injector, $location) {
                var notificationChannel;

                function success(response) {
                    // get $http via $injector because
                    // of circular dependency problem
                    $http = $http || $injector.get('$http');
                    // don't send notification until all requests are complete
                    if ($http.pendingRequests.length < 1) {
                        // get requestNotificationChannel via $injector
                        // because of circular dependency problem
                        notificationChannel = notificationChannel ||
                            $injector.get('requestNotificationChannel');
                        // send a notification requests are complete
                        notificationChannel.requestEnded();
                    }
                    return response;
                }

                function error(response) {
                    var status = response.status;

                    // get $http via $injector because
                    // of circular dependency problem
                    $http = $http || $injector.get('$http');
                    // don't send notification until all requests are complete
                    if ($http.pendingRequests.length < 1) {
                        // get requestNotificationChannel via $injector
                        // because of circular dependency problem
                        notificationChannel = notificationChannel ||
                            $injector.get('requestNotificationChannel');
                        // send a notification requests are complete
                        notificationChannel.requestEnded();
                    }
                    // Intercept 404 error code from server
                    if (status === 404) {
                        $location.path('/404');
                        return $q.reject(response);
                    }

                    return $q.reject(response);
                }

                return function (promise) {
                    // get requestNotificationChannel via $injector
                    // because of circular dependency problem
                    notificationChannel = notificationChannel ||
                        $injector.get('requestNotificationChannel');
                    // send a notification requests are complete
                    notificationChannel.requestStarted();
                    return promise.then(success, error);
                };
            }
        ];

    $httpProvider.responseInterceptors.push(interceptor);
}]);

/**
 * @ngdoc overview
 * @module nypl_widget
 * @name nypl_widget
 * @requires ngSanitize
 * @requires ui.router
 * @requires locationService
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
    'coordinateService',
    'angulartics',
    'angulartics.google.analytics'
])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider) {
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
        LoadLocation.$inject = ["$stateParams", "config", "nyplLocationsService"];

        function LoadSubDivision($q, $stateParams, config, nyplLocationsService) {
            var division    = nyplLocationsService
                                .singleDivision($stateParams.division),
                subdivision = nyplLocationsService
                                .singleDivision($stateParams.subdivision);

            return $q.all([division, subdivision]).then(function (data) {
                var div = data[0],division,
                    subdiv = data[1].division;

                return subdiv;
            });
        }
        LoadSubDivision.$inject = ["$q", "$stateParams", "config", "nyplLocationsService"];

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

        // uses the HTML5 History API, remove hash (need to test)
        $locationProvider.html5Mode(true);
        // $urlRouterProvider.otherwise('/widget/sasb');

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
                },
            });
    }
]);
// Add Holiday Closings
nypl_widget.run(["$rootScope", "nyplUtility", function ($rootScope, nyplUtility) {
    $rootScope.holiday = nyplUtility.holidayClosings();
}]);

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, console, _, angular */

(function () {
    'use strict';

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:timeFormat
     * @param {object} timeObj Object with hours for today and tomorrow.
     * @returns {string} Closed or open times for a branch.
     * @description
     * Filter formats military time to standard time
     */
    function timeFormat() {
        function clockTime(time) {
            var components = time.split(':'),
                hours = ((parseInt(components[0], 10) + 11) % 12 + 1),
                minutes = components[1],
                meridiem = components[0] >= 12 ? 'pm' : 'am';

            return hours + ":" + minutes + meridiem;
        }

        return function output(timeObj) {
            // The time object may have just today's hours
            // or be an object with today's and tomorrow's hours
            var time = timeObj !== undefined && timeObj.today !== undefined ?
                    timeObj.today :
                    timeObj;

            // Checking if thruthy needed for async calls
            if (time) {
                if (time.open === null) {
                    return 'Closed';
                }
                return clockTime(time.open) + ' - ' + clockTime(time.close);
            }

            console.log('timeFormat() filter function error: Argument is' +
                ' not defined or empty, verify API response for time');
            return '';
        };
    }

    /**
     * @ngdoc filter
     * @name nypl_locations.filter:dateToISO
     * @param {string} input ...
     * @returns {string} ...
     * @description
     * Coverts MYSQL Datetime stamp to ISO format
     */
    function dateToISO() {
        return function (input) {
            return new Date(input).toISOString();
        };
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
                    (time[0] >= 12 ? 'pm' : 'am'),
                    parseInt(time[0], 10)]
            );
        }

        return function (elem) {
            var open_time, closed_time,
                now = new Date(),
                today, tomorrow,
                tomorrow_open_time, tomorrow_close_time,
                hour_now_military = now.getHours();

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
                    if (tomorrow_open_time && tomorrow_close_time) {
                        return 'Open tomorrow ' + tomorrow_open_time.hours +
                            (parseInt(tomorrow_open_time.mins, 10) !== 0 ? ':' + tomorrow_open_time.mins : '')
                            + tomorrow_open_time.meridian + '-' + tomorrow_close_time.hours +
                            (parseInt(tomorrow_close_time.mins, 10) !== 0 ? ':' + tomorrow_close_time.mins : '')
                            + tomorrow_close_time.meridian;
                    }
                    return 'Closed today';
                }

                // Display a time range if the library has not opened yet
                if (hour_now_military < open_time.military) {
                    return 'Open today ' + open_time.hours +
                        (parseInt(open_time.mins, 10) !== 0 ? ':' + open_time.mins : '')
                        + open_time.meridian + '-' + closed_time.hours +
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
  WidgetCtrl.$inject = ["$location", "$rootScope", "$scope", "$timeout", "$window", "config", "data", "nyplCoordinatesService", "nyplUtility"];

  angular
    .module('nypl_widget')
    .controller('WidgetCtrl', WidgetCtrl);
})();

/*jslint unparam: true, indent: 2, maxlen: 80 */
/*globals nypl_locations, $window, angular */

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
  loadingWidget.$inject = ["requestNotificationChannel"];

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
   * @restrict E
   * @scope
   * @description
   * ...
   */
  function todayshours() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/todaysHours.html',
      replace: true,
      scope: {
        hours: '@',
        holiday:  '='
      }
    };
  }

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
  librarianchatbutton.$inject = ["nyplUtility"];

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
  scrolltop.$inject = ["$window"];

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

          if (scope.registration.type == 'Online') {
            scope.online = true;
            scope.reg_msg = (scope.eventRegStarted) ? 
                            'Online, opens ' + $filter('date')(scope.registration.start, 'MM/dd') :
                            'Online';
          }
          else {
            scope.reg_msg = scope.registration.type;
          }
        }
      }
    };
  }
  eventRegistration.$inject = ["$filter"];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplSiteAlerts
   * @restrict E
   * @requires $timeout
   * @requires nyplLocationsService
   * @requires nyplUtility
   * @description
   * ...
   */
  function nyplSiteAlerts($timeout, nyplLocationsService, nyplUtility) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/alerts.html',
      replace: true,
      // Must be global for unit test to pass. Must find better way to test.
      // scope: {},
      link: function (scope, element, attrs) {
        var alerts;
        $timeout(function () {
          nyplLocationsService.alerts().then(function (data) {
            alerts = data.alerts;
            scope.sitewidealert = nyplUtility.alerts(alerts);
          });
        }, 200);
      }
    };
  }
  nyplSiteAlerts.$inject = ["$timeout", "nyplLocationsService", "nyplUtility"];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplLibraryAlert
   * @restrict E
   * @requires nyplUtility
   * @scope
   * @description
   * ...
   */
  function nyplLibraryAlert(nyplUtility) {
    function alertExpired(startDate, endDate) {
      var sDate = new Date(startDate),
        eDate   = new Date(endDate),
        today   = new Date();
      if (sDate.getTime() <= today.getTime() && eDate.getTime() >= today.getTime()) {
        return false;
      }
      return true;
    };

    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/templates/library-alert.html',
      replace: true,
      scope: {
          exception: '='
      },
      link: function (scope, element, attrs) {
        if (scope.exception) {
          scope.alertExpired = alertExpired(scope.exception.start, scope.exception.end);
          if (scope.exception.description !== '' && scope.alertExpired === false) {
            scope.libraryAlert = scope.exception.description;
          }
        }
      }
    };
  }
  nyplLibraryAlert.$inject = ["nyplUtility"];

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
  nyplFundraising.$inject = ["$timeout", "nyplLocationsService"];

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
      }
    };
  }
  nyplFooter.$inject = ["$analytics"];

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplAutofill
   * @restrict AEC
   * @scope
   * @description
   * ...
   */
  function nyplAutofill($state, $analytics) {
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
        $scope.items;
        $scope.active;
        $scope.currentIndex;

        var input  = angular.element(document.getElementById('searchTerm')),
          html   = angular.element(document.getElementsByTagName('html'));

        input.bind('focus', function() {
          $scope.$apply( function() { 
            controller.openAutofill();
          });
        });

        input.bind('click', function(e) {
          e.stopPropagation();
        });

        input.bind('keyup', function(e) {
          // Tab & Enter keys
          if (e.keyCode === 13) {
            $scope.$apply( function() {
              // User has pressed up/down arrows
              if ($scope.activated) {
                // Transition to location page
                if ($scope.active.slug){
                  $scope.activated = false;
                  controller.closeAutofill();
                  $scope.model = $scope.active.name;
                  $state.go(
                    'location', 
                    { location: $scope.active.slug }
                  );
                }
                else {
                  //Geocoding Search
                  $scope.geoSearch({term: $scope.model});
                  $scope.geocodingactive = false;
                  $scope.activated = false;
                  if (input.blur()) {
                    controller.closeAutofill();
                  }
                }
              }
              // User has pressed enter with autofill
              else if (controller.setSearchText($scope.model)) {
                  $scope.model = $scope.items[0].name;
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
                // Geocoding Search only
                $scope.geoSearch({term: $scope.model});
                if (input.blur()) {
                  controller.closeAutofill();
                }
              }
            });
          }

          // Right Arrow
          if (e.keyCode === 39) {
            $scope.$apply( function() {
              controller.setSearchText($scope.model);
            });
          }

          // Backspace
          if (e.keyCode === 8) {
            $scope.$apply( function() { $scope.lookahead = ''; });
          }

          // Escape key
          if (e.keyCode === 27) {
            /*$scope.$apply( function() { 
               if (input.blur()) {
                controller.closeAutofill();
                $scope.activated = false;
              }
            });*/
          }
        });

        // Tab, Enter and Escape keys
        input.bind('keydown', function(e) {
          if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
            e.preventDefault();
          }

          // Up Arrow
          if (e.keyCode === 38) {
            e.preventDefault();
            $scope.$apply(function() {
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
            $scope.$apply(function() {
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

        html.bind('click', function(e) {
          $scope.$apply( function() {
            controller.closeAutofill();
          });
        });

        function initAutofill() {
          $scope.$watch('model', function(newValue, oldValue) {
            controller.updateSearchText($scope.data, newValue);
          });

          $scope.$on('$stateChangeSuccess', function() {
            controller.resetSearchTerms();
            controller.closeAutofill();
          });
        }

        initAutofill();
      },
      controller: ['$scope', function($scope) {
        $scope.lookahead = '',
        $scope.currentWord = '',
        $scope.completeWord = '';

        this.closeAutofill = function() {
          return $scope.focused = false;
        };

        this.openAutofill = function() {
          return $scope.focused = true;
        };


        this.activate = function(item) {
          return item;
        };

        this.activateFirstItem = function() {
          $scope.active = $scope.filtered[0];
          $scope.currentIndex = $scope.filtered.indexOf($scope.active);
          $scope.activated = true;
        };

        this.activateNextItem = function() {
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

        this.activatePreviousItem = function() {
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

        this.setSearchText = function(model) {
          if ( $scope.completeWord === $scope.model || 
            $scope.completeWord === '' || 
            $scope.model === '') return;
          return $scope.model = $scope.completeWord;
        };

        this.resetSearchTerms = function() {
          $scope.lookahead   = '';
          $scope.currentWord = '';
        };

        this.filterStartsWith = function(data, searchTerm) {
          return _.filter(data, function(elem) {
            if (elem.name) {
              return elem.name.substring(0, searchTerm.length).toLowerCase() 
                === searchTerm.toLowerCase();
            }
            return false;
          });
        };

        this.filterTermWithin = function(data, searchTerm) {
          return _.filter(data, function(elem) {
            if (elem.name) {
              return elem.name.toLowerCase().
                indexOf(searchTerm.toLowerCase()) >= 0;
            }
            return false;
          });
        };

        this.updateSearchText = function(data, searchTerm) {
          if (searchTerm === '' || !searchTerm || !data) return;

          if (searchTerm.length > 1) {
            $scope.items    = this.filterStartsWith(data, searchTerm);
            $scope.filtered = this.filterTermWithin(data, searchTerm);

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
  nyplAutofill.$inject = ["$state", "$analytics"];

  angular
    .module('nypl_locations')
    .directive('loadingWidget', loadingWidget)
    // .directive('nyplTranslate', nyplTranslate)
    .directive('todayshours', todayshours)
    .directive('emailusbutton', emailusbutton)
    .directive('librarianchatbutton', librarianchatbutton)
    .directive('scrolltop', scrolltop)
    .directive('eventRegistration', eventRegistration)
    .directive('nyplSiteAlerts', nyplSiteAlerts)
    .directive('nyplLibraryAlert', nyplLibraryAlert)
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
  requestNotificationChannel.$inject = ["$rootScope"];

  /**
   * @ngdoc service
   * @name nypl_locations.service:nyplUtility
   * @requires $sce
   * @requires $window
   * @requires nyplCoordinatesService
   * @description
   * AngularJS service with utility functions.
   */
  function nyplUtility($sce, $window, nyplCoordinatesService) {
    var utility = {};

    /**
     * @ngdoc function
     * @name hoursToday
     * @methodOf nypl_locations.service:nyplUtility
     * @param {object} hours Object with a regular property that is an
     *  array with the open and close times for every day.
     * @returns {object} An object with the open and close times for
     *  the current and tomorrow days.
     * @description ...
     */
    utility.hoursToday = function (hours) {
      var date = new Date(),
        today = date.getDay(),
        tomorrow = today + 1,
        hoursToday;

      if (hours) {
        hoursToday = {
          'today': {
            'day': hours.regular[today].day,
            'open': hours.regular[today].open,
            'close': hours.regular[today].close
          },
          'tomorrow': {
            'day': hours.regular[tomorrow % 7].day,
            'open': hours.regular[tomorrow % 7].open,
            'close': hours.regular[tomorrow % 7].close
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
          months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

      this.numDaysFromToday = function(date, today) {
        return Math.round(((date.valueOf()-today.valueOf()) / 1000 / 86400) - 0.5);
      };

      if (startDate && endDate) {
        var sDate = new Date(startDate),
          eDate   = new Date(endDate),
          today   = new Date(),
          nDays   = this.numDaysFromToday(eDate, today);

        if (!nDays) return;
        // First check if input is within 365 days
        if (nDays <= 365) {
          // Millisecond comparison between date.time property
          if (sDate.getTime() <= today.getTime() && eDate.getTime() >= today.getTime()) {
            // Current Event
            formattedDate = "Now through " + months[eDate.getUTCMonth()] + " " +
                            eDate.getUTCDate() + ", " + eDate.getUTCFullYear();
          }
          else if (sDate.getTime() > today.getTime() && eDate.getTime() >= today.getTime()) {
            // Upcoming Event
            formattedDate = "Opening " + months[sDate.getUTCMonth()] + " " +
                            sDate.getUTCDate() + ", " + sDate.getUTCFullYear();
          }
          else {
            // Past Event
            formattedDate = months[sDate.getUTCMonth()] + " " + sDate.getUTCDate() + ", " + 
                            sDate.getUTCFullYear() + " through " + months[eDate.getUTCMonth()] +
                            " " + eDate.getUTCDate() + ", " + eDate.getUTCFullYear();
          }
        }
        else {
          formattedDate = "Ongoing";
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

      var addressBreak = " ",
        linkedName = location.name;

      if (nicePrint) {
        addressBreak = "<br />";
        linkedName = "<a href='/locations/" + location.slug +
          "'>" + location.name + "</a>";
      }

      return linkedName + addressBreak +
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
     * @name alerts
     * @methodOf nypl_locations.service:nyplUtility
     * @param {array} alerts ...
     * @description ...
     */
    utility.alerts = function (alerts) {
      var today = new Date(),
        todaysAlert = [],
        alert_start,
        alert_end;

      if (!alerts) {
        return null;
      }

      if (Array.isArray(alerts) && alerts.length > 0) {
        _.each(alerts, function (alert) {
          alert_start = new Date(alert.start);
          alert_end = new Date(alert.end);

          if (alert_start <= today && today <= alert_end) {
            todaysAlert.push(alert.body);
          }
        });

        if (!angular.isUndefined(todaysAlert)) {
          return _.uniq(todaysAlert);
        }
      }
      return null;
    };


    /**
     * @ngdoc function
     * @name holidayClosings
     * @methodOf nypl_locations.service:nyplUtility
     * @param {obj} date ...
     * @description ...
     */
    utility.holidayClosings = function (date) {

      function sameDay (day1, day2) {
        return day1.getFullYear() === day2.getFullYear()
          && day1.getDate() === day2.getDate()
          && day1.getMonth() === day2.getMonth();
      }

      var holiday,
          today = date || new Date(),
          holidays = [
            {
              day: new Date(2014, 11, 31),
              title: "The Library will close at 3 p.m. today"
            },
            {
              day: new Date(2015, 0, 1),
              title: "Closed for New Year's Day"
            },
            {
              day: new Date(2015, 0, 19),
              title: "Closed for Martin Luther King, Jr. Day"
            },
            {
              day: new Date(2015, 1, 16),
              title: "Closed for Presidents' Day"
            },
            {
              day: new Date(2015, 3, 5),
              title: "Closed for Easter"
            },
            {
              day: new Date(2015, 4, 23),
              title: "Closed for Memorial Day weekend"
            },
            {
              day: new Date(2015, 4, 24),
              title: "Closed for Memorial Day weekend"
            },
            {
              day: new Date(2015, 4, 25),
              title: "Closed for Memorial Day weekend"
            },
            {
              day: new Date(2015, 6, 4),
              title: "Closed for Independence Day"
            }
          ];

      holiday = _.filter(holidays, function(item) {
                  if ( sameDay(item.day, today) ) {
                    return item;
                  }
                });
      if (holiday.length > 0) {
        return {
          day: holiday[0].day,
          title: holiday[0].title
        };
      }
      return undefined;
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

    return utility;
  }
  nyplUtility.$inject = ["$sce", "$window", "nyplCoordinatesService"];

  angular
    .module('nypl_locations')
    .factory('nyplUtility', nyplUtility)
    .factory('requestNotificationChannel', requestNotificationChannel);

  angular
    .module('nypl_widget')
    .factory('nyplUtility', nyplUtility)
    .factory('requestNotificationChannel', requestNotificationChannel);
})();

