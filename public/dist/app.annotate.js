/*jslint nomen: true, indent: 4, maxlen: 80 */
/*globals angular, window, headerScripts */

var nypl_locations = angular.module('nypl_locations', [
    'ngSanitize',
    // 'ngCookies',
    'ui.router',
    'ngAnimate',
    'locationService',
    'coordinateService',
    'nyplSearch',
    'nyplSSO',
    'nyplNavigation',
    'nyplBreadcrumbs',
    'angulartics',
    'angulartics.google.analytics',
    'pascalprecht.translate'
]);

nypl_locations.constant('_', window._);

nypl_locations.config([
    '$locationProvider',
    '$translateProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$crumbProvider',
    function (
        $locationProvider,
        $translateProvider,
        $stateProvider,
        $urlRouterProvider,
        $crumbProvider
    ) {
        'use strict';

        // uses the HTML5 History API, remove hash (need to test)
        // $locationProvider.html5Mode(true);

        // Lazy loads static files with English being
        // the first language that gets loaded.
        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');

        function LoadLocation(nyplLocationsService, $stateParams) {
            return nyplLocationsService
                .singleLocation($stateParams.location)
                .then(function (data) {
                    return data.location;
                })
                .catch(function (err) {
                    throw err;
                });
        }
        LoadLocation.$inject = ["nyplLocationsService", "$stateParams"];

        function LoadDivision(nyplLocationsService, $stateParams) {
            return nyplLocationsService
                .singleDivision($stateParams.division)
                .then(function (data) {
                    return data.division;
                })
                .catch(function (err) {
                    throw err;
                });
        }
        LoadDivision.$inject = ["nyplLocationsService", "$stateParams"];

        function Amenities(nyplLocationsService, $stateParams) {
            return nyplLocationsService
                .amenities($stateParams.amenity)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    throw error;
                });
        }
        Amenities.$inject = ["nyplLocationsService", "$stateParams"];

        $crumbProvider.setOptions({
            primaryState: {name:'Home', customUrl: 'http://nypl.org' },
            secondaryState: {name:'Locations', customUrl: 'home.index' }
        });

        // This next line breaks unit tests which doesn't make sense since
        // unit tests should not test the whole app. BUT since we are testing
        // directives and using $rootscope.$digest or $rootscope.$apply,
        // it will run the app. It may not be necessary for the app though
        // since, in the run phase, if there is an error when changing state,
        // the app will go to the 404 state.
        // $urlRouterProvider.otherwise('/404');
        $stateProvider
            .state('home', {
                url: '/',
                abstract: true,
                templateUrl: 'views/locations.html',
                controller: 'LocationsCtrl',
                label: 'Locations'
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
            .state('division', {
                url: '/divisions/:division',
                templateUrl: 'views/division.html',
                controller: 'DivisionCtrl',
                label: 'Division',
                resolve: {
                    division: LoadDivision
                },
                data: {
                    parentState: 'location',
                    crumbName: '{{division.name}}'
                }
            })
            .state('amenities', {
                url: '/amenities',
                templateUrl: '/views/amenities.html',
                controller: 'AmenitiesCtrl',
                label: 'Amenities',
                resolve: {
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
                    location: LoadLocation
                },
                data: {
                    parentState: 'amenities',
                    crumbName: '{{location.name}}'
                }
            })
            .state('location', {
                url: '/:location',
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl',
                resolve: {
                    location: LoadLocation
                },
                data: {
                    crumbName: '{{location.name}}'
                }
            })
            .state('404', {
                url: '/404',
                templateUrl: 'views/404.html'
            });
    }
]);

nypl_locations.run(["$state", "$rootScope", "$location", function ($state, $rootScope, $location) {
    $rootScope.$on('$stateChangeSuccess', function () {
        $rootScope.current_url = $location.absUrl();
    });
    $rootScope.$on('$stateChangeError', function () {
        $state.go('404');
    });
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
     * @param {obj} options object containing state data.
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

  /** @namespace nyplBreadcrumbs */
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
              return null;
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

              if (parentDivisionName && parentDivisionRoute) {
                parentStateObj.division = {
                  name: parentDivisionName,
                  route: parentDivisionRoute
                }
              } 
              return parentStateObj;
            }
            else {
              //console.log('Parent state name or route is not defined');
              return null;
            }
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
            if (parentData._embedded.parent) {
              parentRoute = parentData._embedded.parent.slug;
              return divisionState + '({ ' + "\"" + divisionState + "\"" + ':' + "\"" + parentRoute + "\"" + '})';
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
            if (parentData._embedded.parent) {
              parentName = parentData._embedded.parent.name;
              return parentName;
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
            if (parentData._embedded.location.slug) {
              parentRoute = parentData._embedded.location.slug;
              return stateSetting + '({ ' + "\"" + stateSetting + "\"" + ':' + "\"" + parentRoute + "\"" + '})';
            }
            return undefined;
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
              
              if (parentData._embedded.location.name) {
                parentStateName = parentData._embedded.location.name;
              }

              return parentStateName;
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
            breadcrumbs.push({
              displayName: parentState.displayName,
              route: parentState.route
            });

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

  angular
    .module('nyplBreadcrumbs', [])
    .provider('$crumb', $Crumb)
    .directive('nyplBreadcrumbs', nyplBreadcrumbs);

})(window, window.angular);
/*jslint indent: 2, maxlen: 80 */
/*globals nypl_locations, angular */

(function () {
  'use strict';

  /** @namespace nyplCoordinatesService */
  function nyplCoordinatesService($q, $window) {
    var geoCoords = null,
      coordinatesService = {};

    /** @function nyplCoordinatesServce.geolocationAvailable
     * @returns {boolean} True if navigator and navigator.geolocation are
     *  available in the browser, false otherwise.
     */
    coordinatesService.geolocationAvailable = function () {
      return (!$window.navigator && !$window.navigator.geolocation) ?
          false :
          true;
    };

    /** @function nyplCoordinatesServce.getBrowserCoordinates
     * @returns {object} Deferred promise. If it resolves, it will return an
     *  object with the user's current position as latitude and longitude
     *  properties. If it is rejected, it will return an error message based
     *  on what kind of error occurred.
     * @example
     *  nyplCoordinatesService.getBrowserCoordinates()
     *    .then(function (position) {
     *      var userCoords = _.pick(position, 'latitude', 'longitude');
     *    })
     *    .catch(function (error) {
     *      throw error;
     *    });
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

    /** @function nyplCoordinatesServce.getDistance
     * @param {number} lat1 Latitude of first location.
     * @param {number} lon1 Longitude of first location.
     * @param {number} lat2 Latitude of second location.
     * @param {number} lon2 Longitude of second location.
     * @returns {number} Distance in miles between two different locations.
     * @example
     *  var distance =
     *    nyplCoordinatesService.getDistance(40.1, -73.1, 41.1, -73.2);
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

  angular
    .module('coordinateService', [])
    .factory('nyplCoordinatesService', nyplCoordinatesService);

})();


/*jslint indent: 4, maxlen: 80 */
/*globals angular */

(function () {
    'use strict';

    /** @namespace nyplLocationsService */
    function nyplLocationsService($http, $q) {
        var api = 'http://locations-api-beta.nypl.org',
            apiError = "Could not reach API",
            locationsApi = {};

        /** @function nyplLocationsService.allLocations 
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of all NYPL locations. If it is rejected, an
         *  error message is returned saying that it "Could not reach API".
         * @example
         *  nyplLocationsService.allLocations()
         *    .then(function (data) {
         *      var locations = data.locations;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         */
        locationsApi.allLocations = function () {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations' + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    console.log(status);
                    defer.reject(apiError);
                });
            return defer.promise;
        };

        /** @function nyplLocationsService.singleLocation
         * @param {string} location The slug of the location to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of a specific NYPL locations. If it is rejected,
         *  an error message is returned saying that it "Could not reach API".
         * @example
         *  nyplLocationsService.singleLocation('schwarzman')
         *    .then(function (data) {
         *      var location = data.location;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         */
        locationsApi.singleLocation = function (location) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations/' + location + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    console.log(status);
                    defer.reject(apiError);
                });
            return defer.promise;
        };

        /** @function nyplLocationsService.singleDivision
         * @param {string} division The slug of the division to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of an NYPL Division. If it is rejected, an error
         *  message is returned saying that it "Could not reach API".
         * @example
         *  nyplLocationsService.singleLocation('map-division')
         *    .then(function (data) {
         *      var division = data.division;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         */
        locationsApi.singleDivision = function (division) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/divisions/' + division + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    console.log(status);
                    defer.reject(apiError);
                });
            return defer.promise;
        };

        /** @function nyplLocationsService.amenities
         * @param {string} [amenity] The id of the amenity to look up.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API. If no param was passed, it will return all the
         *  amenities at NYPL. If the param was passed, it will return a list
         *  of all the NYPL locations where the amenity passed is available.
         *  If it is rejected, an error message is returned saying that it
         *  "Could not reach API".
         * @example
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
         */
        locationsApi.amenities = function (amenity) {
            var defer = $q.defer(),
                url = !amenity ? '/amenities' : '/amenities/' + amenity;

            $http.jsonp(api + url + '?callback=JSON_CALLBACK', {cache: true})
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    console.log(status);
                    defer.reject(apiError);
                });
            return defer.promise;
        };

        /** @function nyplLocationsService.amenitiesAtLibrary
         * @param {string} location The slug of the location to look up
         *  all amenities available at that location.
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of all amenities available at the location. If it is
         *  rejected, an error message is returned saying that it
         *  "Could not reach API".
         * @example
         *  nyplLocationsService.amenitiesAtLibrary('115th-street')
         *    .then(function (data) {
         *      var location = data.location;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         */
        locationsApi.amenitiesAtLibrary = function (location) {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/locations/' + location + '/amenities' + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    console.log(status);
                    defer.reject(apiError);
                });
            return defer.promise;
        };

        /** @function nyplLocationsService.alerts
         * @returns {object} Deferred promise. If it resolves, JSON response
         *  from the API of alerts that display site-wide.
         * @example
         *  nyplLocationsService.alerts()
         *    .then(function (data) {
         *      var amenities = data.alerts;
         *    });
         *    .catch(function (error) {
         *      // error = "Could not reach API"
         *    });
         */
        locationsApi.alerts = function () {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/alerts' + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    console.log(status);
                    defer.reject(apiError);
                });
            return defer.promise;
        };

        return locationsApi;
    }
    nyplLocationsService.$inject = ["$http", "$q"];


    angular
        .module('locationService', [])
        .factory('nyplLocationsService', nyplLocationsService);

})();


/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  function nyplNavigation(ssoStatus, $window, $rootScope) {
    return {
      restrict: 'E',
      scope: {},
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

        var logout_url;
        $rootScope.$watch('current_url', function () {
          logout_url = "https://nypl.bibliocommons.com/user/logout" +
            "?destination=" + $rootScope.current_url;
        })

        // Toggle Mobile Login Form
        $('.mobile-login').click(function (e) {
          e.preventDefault();
          if (ssoStatus.logged_in()) {
            $window.location.href = logout_url;
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
  nyplNavigation.$inject = ["ssoStatus", "$window", "$rootScope"];

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

  angular
    .module('nyplNavigation', [])
    .directive('nyplNavigation', nyplNavigation)
    .directive('nyplCollapsedButtons', nyplCollapsedButtons);

})();


/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  function nyplSearch() {
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
            return false;
          }

          if (scope === 'nypl.org') {
            target = window.location.protocol + '//' + 'nypl.org'
              + '/search/apachesolr_search/' + term;
          } else {
            // Bibliocommons by default
            target = 'http://nypl.bibliocommons.com/search?t=smart&q='
              + term + '&commit=Search&searchOpt=catalogue';
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

  angular
    .module('nyplSearch', [])
    .directive('nyplSearch', nyplSearch);

})();


/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  function nyplSSO(ssoStatus, $window, $rootScope) {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      templateUrl: 'scripts/components/nypl_sso/nypl_sso.html',
      link: function (scope, element, attrs) {
        var ssoLoginElement = $('.sso-login'),
          ssoUserButton = $('.login-button');

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
  nyplSSO.$inject = ["ssoStatus", "$window", "$rootScope"];

  /** @namespace ssoStatus */
  function ssoStatus() {
    var ssoStatus = {};

    /** @function ssoStatus.login
     * @returns {string} User's usename from the bc_username cookie. If the
     *  user is not logged in, undefined will be returned.
     */
    ssoStatus.login = function () {
      return $.cookie('bc_username');
    };

    /** @function ssoStatus.logged_in
     * @returns {boolean} True if the user is logged in and false otherwise.
     */
    ssoStatus.logged_in = function () {
      return !!(this.login() && this.login() !== null);
    };

    /** @function ssoStatus.remember
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

    /** @function ssoStatus.remembered
     * @returns {boolean} Returns true if the user clicked on the 'Remember me'
     *  checkbox and the cookie is set, false otherwise.
     */
    ssoStatus.remembered = function () {
      var remember_me = this.remember();
      return !!(remember_me && remember_me !== null);
    };

    /** @function ssoStatus.forget
     * @returns {boolean} Delete the 'remember_me' cookie if the 'Remember me'
     *  checkbox was unselected when submitting the form. Returns true if
     *  deleting was successful, false if deleting the cookie failed.
     */
    ssoStatus.forget = function () {
      return $.removeCookie('remember_me', {path: '/'});
    };

    return ssoStatus;
  }

  angular
    .module('nyplSSO', [])
    .service('ssoStatus', ssoStatus)
    .directive('nyplSso', nyplSSO);

})();


/*jslint indent: 4, maxlen: 80 */
/*global nypl_locations, angular */

(function () {
    'use strict';

    function AmenitiesCtrl($http, $rootScope, $scope, amenities, nyplAmenities) {
        $rootScope.title = "Amenities";
        if (!amenities.length) {
            $http
                .get('json/amenitiesAtLibrary.json')
                .success(function (data) {
                    $scope.amenitiesCategories =
                        nyplAmenities.addCategoryIcon(data.amenities);
                });
        } else {
            $scope.amenitiesCategories =
                nyplAmenities.addCategoryIcon(location._embedded.amenities);
        }
    }
    AmenitiesCtrl.$inject = ["$http", "$rootScope", "$scope", "amenities", "nyplAmenities"];

    // Load an amenity and list all the locations
    // where the amenity can be found.
    function AmenityCtrl($rootScope, $scope, amenity) {
        var name = amenity.amenity.name;

        $rootScope.title = name;
        $scope.amenity = amenity.amenity;
        $scope.locations = amenity.locations;
        $scope.amenity_name = name;
    }
    AmenityCtrl.$inject = ["$rootScope", "$scope", "amenity"];

    // Load one location and list all the amenities found in that location.
    function AmenitiesAtLibraryCtrl($http, $rootScope, $scope, location, nyplAmenities) {
        // Temporary until all the locations have proper data
        if (!location._embedded.amenities.length) {
            $http
                .get('json/amenitiesAtLibrary.json')
                .success(function (data) {
                    $scope.amenitiesCategories =
                        nyplAmenities.addCategoryIcon(data.amenities);
                });
        } else {
            $scope.amenitiesCategories =
                nyplAmenities.addCategoryIcon(location._embedded.amenities);
        }

        $rootScope.title = location.name;
        $scope.location = location;
    }
    AmenitiesAtLibraryCtrl.$inject = ["$http", "$rootScope", "$scope", "location", "nyplAmenities"];

    angular
        .module('nypl_locations')
        .controller('AmenityCtrl', AmenityCtrl)
        .controller('AmenitiesCtrl', AmenitiesCtrl)
        .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
})();

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, angular */

(function () {
    'use strict';

    function DivisionCtrl($rootScope, $scope, division, nyplUtility) {
        $scope.division  = division;
        $scope.location =  division._embedded.location;

        $rootScope.title = division.name;
        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        if (division.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(division.hours);
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
            nyplUtility.divisionHasAppointment(division.id);
    }
    DivisionCtrl.$inject = ["$rootScope", "$scope", "division", "nyplUtility"];

    angular
        .module('nypl_locations')
        .controller('DivisionCtrl', DivisionCtrl);
})();

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $ */

(function () {
    'use strict';

    function LocationsCtrl(
        $rootScope,
        $scope,
        $timeout,
        $state,
        nyplCoordinatesService,
        nyplGeocoderService,
        nyplLocationsService,
        nyplUtility,
        nyplSearch,
        nyplAmenities
    ) {
        var locations,
            searchValues = nyplSearch.getSearchValues(),
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

                        // add a distance property to every location
                        // from that location to the user's coordinates
                        $scope.locations = nyplUtility
                            .calcDistance($scope.locations, user.coords);

                        // Must be within 25 miles
                        if (nyplUtility.checkDistance($scope.locations)) {
                            // The user is too far away, reset everything
                            resetPage();
                            throw (new Error('You are not within 25 ' +
                                    'miles of any NYPL library.'));
                        }

                        // Used for 'Get Address' link.
                        $scope.locationStart = user.coords.latitude + "," +
                            user.coords.longitude;
                        $scope.userMarker = true;

                        sortListBy('distance');
                        nyplGeocoderService
                            .createMarker('user', user.coords,
                                "Your Current Location");

                        if (isMapPage()) {
                            $scope.drawUserMarker();
                        }

                        return user.coords;
                    });
            },

            // convert coordinate into address
            loadReverseGeocoding = function () {
                nyplSearch.resetSearchValues();
                return nyplGeocoderService
                    .reverseGeocoding({
                        lat: user.coords.latitude,
                        lng: user.coords.longitude
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
                    sortListBy('');
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

            searchByUserGeolocation = function () {
                scrollListTop();

                if (isMapPage()) {
                    $scope.drawUserMarker();
                }

                sortListBy('distance');
            },

            showLibrariesTypeOf = function (type) {
                // undefined value for type is actually okay, 
                // as it will show all locations if that's the case
                $scope.location_type = type;
            },

            createFilterMarker = function (slug) {
                // store the filtered location marker if in the list view,
                // so it can be displayed when going to the map view.
                $scope.select_library_for_map = '';
                nyplGeocoderService.setFilterMarker(slug);
                if (isMapPage()) {
                    nyplGeocoderService.drawFilterMarker(slug);
                }
            },

            performIDsearch = function (IDfilteredLocations) {
                resetProperty($scope.locations, 'distance');
                organizeLocations($scope.locations, IDfilteredLocations,
                    'name');

                // map related work
                createFilterMarker(IDfilteredLocations[0].slug);
                $scope.scrollPage();
            },

            filterMarkerOrSearchMarker = function (filteredLocations, searchObj) {
                if (filteredLocations.length) {
                    // Map related work
                    createFilterMarker(filteredLocations[0].slug);
                } else {
                    nyplGeocoderService.clearFilteredLocation();
                    nyplGeocoderService.createSearchMarker(
                        searchObj.coords,
                        searchObj.searchTerm
                    );
                }
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
                    // geolocation so sort by distance.
                    if (!$scope.searchTerm) {
                        sortListBy('distance');
                    }
                } else {
                    $scope.loadLocations();
                }
            };

        $scope.loadLocations = function () {
            return nyplLocationsService
                .allLocations()
                .then(function (data) {
                    locations = data.locations;
                    $scope.locations = locations;

                    _.each($scope.locations, function (location) {
                        var locationAddress =
                                nyplUtility.getAddressString(location, true),
                            markerCoordinates = {
                                'latitude': location.geolocation.coordinates[1],
                                'longitude': location.geolocation.coordinates[0]
                            };

                        location.hoursToday = nyplUtility.hoursToday;
                        location.locationDest =
                            nyplUtility.getAddressString(location);

                        location.amenities_list = nyplAmenities
                            .allAmenitiesArray(location._embedded.amenities);

                        // Individual location exception data
                        location.branchException =
                            nyplUtility.branchException(location.hours);

                        // Initially, when the map is drawn and 
                        // markers are available, they will be drawn too. 
                        // No need to draw them again if they exist.
                        if (!nyplGeocoderService
                                .doesMarkerExist(location.slug)) {
                            nyplGeocoderService
                                .createMarker(location.slug,
                                    markerCoordinates,
                                    locationAddress);
                        }
                    });

                    resetPage();

                    return locations;
                })
                .catch(function (error) {
                    $state.go('404');
                    throw error;
                });
        };

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
            $state.go('home.map');

            organizeLocations($scope.locations, location, 'name');
            $scope.scrollPage();
        };

        $scope.useGeolocation = function () {
            // Remove any existing search markers on the map.
            nyplGeocoderService.removeMarker('search');
            $scope.select_library_for_map = '';
            $scope.searchTerm = '';
            $scope.searchMarker = false;

            $scope.scrollPage();

            loadUserCoordinates()
                .then(loadReverseGeocoding)
                .then(searchByUserGeolocation)
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
                .removeMarker('user')
                .clearFilteredLocation();

            if (isMapPage()) {
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

        $scope.submitAddress = function (searchTerm) {
            var IDfilteredLocations,
                filteredLocations;

            if (!searchTerm) {
                return;
            }

            $scope.geolocationAddressOrSearchQuery = '';
            $scope.searchError = '';
            showLibrariesTypeOf();
            nyplGeocoderService.showAllLibraries()
            $scope.searchTerm =  searchTerm;

            searchTerm = nyplSearch.searchWordFilter(searchTerm);
            scrollListTop();

            IDfilteredLocations =
                nyplSearch.idLocationSearch($scope.locations, searchTerm);
            // Filter the locations by the search term using Angularjs
            filteredLocations =
                nyplSearch.locationSearch($scope.locations, searchTerm);

            if (IDfilteredLocations && IDfilteredLocations.length !== 0) {
                performIDsearch(IDfilteredLocations);
                return;
            }

            // From searchTerm, return suggested coordinates and formatted
            // address from Google
            loadGeocoding(searchTerm)
                .then(function (searchObj) {
                    // Map related
                    filterMarkerOrSearchMarker(filteredLocations, searchObj);

                    return searchByCoordinates(searchObj);
                })
                .then(function (locations) {
                    $scope.scrollPage();
                    if (!filteredLocations.length) {
                        // Variable to draw a green marker on the map legend.
                        $scope.searchMarker = true;
                        nyplSearch.setSearchValue('searchMarker', true);
                        if (isMapPage()) {
                            nyplGeocoderService.drawSearchMarker();
                        }
                    }
                    
                    organizeLocations(locations, filteredLocations, 'distance');
                })
                // Catch any errors at any point
                .catch(function (error) {
                    // google maps api is down or geocoding did not return
                    // any significant results,
                    // first see if there are any angularjs filtered results.
                    // if there are, show results based on the angularjs filter.
                    // else, reset back to the start
                    nyplGeocoderService.removeMarker('search');
                    $scope.searchMarker = false;
                    nyplSearch.resetSearchValues();

                    if (filteredLocations && filteredLocations.length &&
                            error.msg !== 'query too short') {
                        resetProperty($scope.locations, 'distance');
                        $scope.searchError = '';
                        // Map related work
                        if (isMapPage()) {
                            nyplGeocoderService
                                .drawFilterMarker(filteredLocations[0].slug);
                        }
                        organizeLocations(locations, filteredLocations, 'name');
                    } else {
                        resetPage();
                    }
                });
        };

        $scope.showResearch = function () {
            nyplGeocoderService.hideInfowindow();
            scrollListTop();

            $scope.researchBranches = !$scope.researchBranches;

            if ($scope.researchBranches) {
                nyplGeocoderService.showResearchLibraries().panMap();
                showLibrariesTypeOf('research');
            } else {
                nyplGeocoderService.showAllLibraries().panMap();
                showLibrariesTypeOf();
            }
        };

        $rootScope.title = "Locations";
        $scope.$state = $state;

        loadPreviousStateOrNewState();
        geolocationAvailable();
    }
    LocationsCtrl.$inject = ["$rootScope", "$scope", "$timeout", "$state", "nyplCoordinatesService", "nyplGeocoderService", "nyplLocationsService", "nyplUtility", "nyplSearch", "nyplAmenities"];
    // End LocationsCtrl

    function MapCtrl($scope, $timeout, nyplGeocoderService) {

        var loadMapMarkers = function () {
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
                    var filteredLocation =
                        nyplGeocoderService.getFilteredLocation();

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

                    if ($scope.userMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    if ($scope.searchMarker) {
                        nyplGeocoderService.drawSearchMarker();
                    }

                    if ($scope.researchBranches) {
                        nyplGeocoderService.showResearchLibraries();
                    }

                    if ($scope.select_library_for_map) {
                        nyplGeocoderService
                            .panExistingMarker($scope.select_library_for_map);
                    } else {
                        nyplGeocoderService.drawFilterMarker(filteredLocation);
                    }

                    $scope.scrollPage();
                }, 1200);
            };

        drawMap();

        $scope.panToLibrary = function (slug) {
            nyplGeocoderService
                .hideSearchInfowindow()
                .panExistingMarker(slug);

            $scope.scrollPage();
        };
    }
    MapCtrl.$inject = ["$scope", "$timeout", "nyplGeocoderService"];

    function LocationCtrl(
        $rootScope,
        $scope,
        $timeout,
        location,
        nyplCoordinatesService,
        nyplUtility,
        nyplAmenities
    ) {
        var amenities = location._embedded.amenities,
            loadUserCoordinates = function () {
                return nyplCoordinatesService
                    .getBrowserCoordinates()
                    .then(function (position) {
                        var userCoords =
                            _.pick(position, 'latitude', 'longitude');

                        // Needed to update async var on geolocation success
                        $timeout(function () {
                            $scope.locationStart = userCoords.latitude +
                                "," + userCoords.longitude;
                        });
                    });
            };

        // Load the user's geolocation coordinates
        loadUserCoordinates();

        $scope.location = location;
        $rootScope.title = location.name;

        // Add icons to the amenities.
        location._embedded.amenities = nyplAmenities.addCategoryIcon(amenities);
        // Get three institution ranked and two location ranked amenities.
        location.amenities_list =
            nyplAmenities.getHighlightedAmenities(amenities, 3, 2);

        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

        $scope.location.social_media =
            nyplUtility.socialMediaColor($scope.location.social_media);

        if (location.hours) {
            $scope.hoursToday = nyplUtility.hoursToday(location.hours);
        }

        _.each(location._embedded.divisions, function (division) {
            division.hoursToday = nyplUtility.hoursToday(division.hours);
        });

        _.each(location._embedded.features, function (feature) {
            feature.body = nyplUtility.returnHTML(feature.body);
        });

        // Used for the Get Directions link to Google Maps
        $scope.locationDest = nyplUtility.getAddressString(location);
    }
    LocationCtrl.$inject = ["$rootScope", "$scope", "$timeout", "location", "nyplCoordinatesService", "nyplUtility", "nyplAmenities"];

    angular
        .module('nypl_locations')
        .controller('LocationsCtrl', LocationsCtrl)
        .controller('MapCtrl', MapCtrl)
        .controller('LocationCtrl', LocationCtrl);
})();

/*jslint unparam: true, indent: 4, maxlen: 80 */
/*globals nypl_locations, $window, angular */

// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
// declare the directive that will show and hide the loading widget
function loadingWidget(requestNotificationChannel) {
    'use strict';

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
            requestNotificationChannel.
                onRequestStarted(scope, startRequestHandler);
            // register for the request end notification
            requestNotificationChannel.
                onRequestEnded(scope, endRequestHandler);
        }
    };
}
loadingWidget.$inject = ["requestNotificationChannel"];

function nyplTranslate() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/translatebuttons.html',
        replace: true,
        controller: function ($scope, $translate) {
            $scope.translate = function (language) {
                $translate.use(language);
            };
        }
    };
}

function todayshours() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/todaysHours.html',
        replace: true,
        scope: {
            hours: '@'
        }
    };
}

function emailusbutton() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/emailus.html',
        replace: true,
        scope: {
            link: '@'
        }
    };
}

function librarianchatbutton(nyplUtility) {
    'use strict';

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

function scrolltop($window) {
    'use strict';

    return function (scope) {
        scope.$on('$stateChangeStart', function () {
            $window.scrollTo(0, 0);
        });
    };
}
scrolltop.$inject = ["$window"];

function eventRegistration($filter) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/registration.html',
        replace: true,
        scope: {
            registration: '@',
            type: '@',
            open: '@',
            start: '@',
            link: '@'
        },
        link: function (scope, element, attrs) {
            scope.online = false;

            if (scope.type === 'Online') {
                scope.online = true;

                if (scope.open === 'true') {
                    scope.registration_available = "Registration opens on " +
                        $filter('date')(scope.start, 'MMMM d, y - h:mma');
                } else {
                    scope.registration_available =
                        "Registration for this event is closed.";
                }
            }
        }
    };
}
eventRegistration.$inject = ["$filter"];

function nyplSiteAlerts(nyplLocationsService, nyplUtility) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/alerts.html',
        replace: true,
        // Must be global for unit test to pass. Must find better way to test.
        // scope: {},
        link: function (scope, element, attrs) {
            var alerts;
            nyplLocationsService.alerts().then(function (data) {
                alerts = data.alerts;
                scope.sitewidealert = nyplUtility.alerts(alerts);
            });
        }
    };
}
nyplSiteAlerts.$inject = ["nyplLocationsService", "nyplUtility"];

function nyplLibraryAlert(nyplUtility) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/library-alert.html',
        replace: true,
        scope: {
            exception: '='
        },
        link: function (scope, element, attrs) {
            if (scope.exception) {
                if (scope.exception.description !== '') {
                    scope.libraryAlert = scope.exception.description;
                }
            }
        }
    };
}
nyplLibraryAlert.$inject = ["nyplUtility"];

/* 
** Show/Hide collapsible animated directive
** Usage: <div collapse="name of var toggled" duration="time in ms"
**          class-name="open"></div>
** Duration & class-name are optional
*/
function collapse() {
    'use strict';

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

function nyplFundraising() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/fundraising.html',
        replace: true,
        scope: {
            fundraising: '=fundraising'
        }
    };
}

/* 
** Directive: <nypl-sidebar donate-button="" nypl-ask="" donateurl="">
** Usage: Inserts optional Donate button/nyplAsk widget when 'true' is
**        passed to donate-button="" or nypl-ask="". A custom donate url
**        can be passed for the donate-button, otherwise a default is set
*/
function nyplSidebar() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/templates/sidebar-widgets.html',
        replace: true,
        scope: {
            donateButton: '@',
            nyplAsk: '@'
        },
        link: function (scope, elem, attrs) {
            var url = "https://secure3.convio.net/nypl/site/SPageServer?pagename=donation_form&JServSessionIdr003=dwcz55yj27.app304a&s_src=FRQ14ZZ_SWBN";      
            scope.donateUrl = (attrs.donateurl || url);      
        }
    };
}

angular
    .module('nypl_locations')
    .directive('loadingWidget', loadingWidget)
    .directive('nyplTranslate', nyplTranslate)
    .directive('todayshours', todayshours)
    .directive('emailusbutton', emailusbutton)
    .directive('librarianchatbutton', librarianchatbutton)
    .directive('scrolltop', scrolltop)
    .directive('eventRegistration', eventRegistration)
    .directive('nyplSiteAlerts', nyplSiteAlerts)
    .directive('nyplLibraryAlert', nyplLibraryAlert)
    .directive('nyplFundraising', nyplFundraising)
    .directive('nyplSidebar', nyplSidebar)
    .directive('collapse', collapse);

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, console, _, angular */

(function () {
    'use strict';

    // Filter formats military time to standard time
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

    // Coverts MYSQL Datetime stamp to ISO format
    function dateToISO() {
        return function (input) {
            return new Date(input).toISOString();
        };
    }

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

    function hoursTodayFormat() {
        function getHoursObject(time) {
            time = time.split(':');
            return _.object(
                ['hours', 'mins', 'meridian', 'military'],
                [((parseInt(time[0], 10) + 11) % 12 + 1),
                    time[1],
                    (time[0] >= 12 ? 'pm' : 'am'),
                    time[0]]
            );
        }

        return function (elem, type) {
            var open_time, closed_time, formatted_time,
                now = new Date(),
                today, tomorrow,
                tomorrow_open_time, tomorrow_close_time,
                hour_now_military = now.getHours();

            // If truthy async check
            if (elem) {
                today = elem.today;
                tomorrow = elem.tomorrow;

                // Assign open time obj
                if (today.open) {
                    open_time = getHoursObject(today.open);
                }
                // Assign closed time obj
                if (today.close) {
                    closed_time = getHoursObject(today.close);
                }

                // If there are no open or close times, then it's closed today
                if (!today.open || !today.close) {
                    console.log(
                        "Returned object is undefined for open/closed elems"
                    );
                    return 'Closed today';
                }

                if (tomorrow.open !== null) {
                    tomorrow_open_time = getHoursObject(tomorrow.open);
                }
                if (tomorrow.close !== null) {
                    tomorrow_close_time = getHoursObject(tomorrow.close);
                }

                if (hour_now_military >= closed_time.military) {
                    // If the current time is past today's closing time but
                    // before midnight, display that it will be open 'tomorrow',
                    // if there is data for tomorrow's time.
                    if (tomorrow_open_time || tomorrow_close_time) {
                        return 'Open tomorrow ' + tomorrow_open_time.hours +
                            (parseInt(tomorrow_open_time.mins, 10) !== 0 ?
                                    ':' + tomorrow_open_time.mins : '') +
                            tomorrow_open_time.meridian +
                            '-' + tomorrow_close_time.hours +
                            (parseInt(tomorrow_close_time.mins, 10) !== 0 ?
                                    ':' + tomorrow_close_time.mins : '') +
                            tomorrow_close_time.meridian;
                    }
                    return "Closed today";
                }

                // If the current time is after midnight but before
                // the library's open time, display both the start and
                // end time for today
                if (tomorrow_open_time &&
                        hour_now_military >= 0 &&
                        hour_now_military < tomorrow_open_time.military) {
                    type = 'long';
                }

                // The default is checking when the library is currently open.
                // It will display 'Open today until ...'

                // Multiple cases for args w/ default
                switch (type) {
                case 'short':
                    formatted_time = 'Open today until ' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins : '')
                        + closed_time.meridian;
                    break;

                case 'long':
                    formatted_time = 'Open today ' + open_time.hours +
                        (parseInt(open_time.mins, 10) !== 0 ?
                                ':' + open_time.mins : '') +
                        open_time.meridian + '-' + closed_time.hours +
                        (parseInt(closed_time.mins, 10) !== 0 ?
                                ':' + closed_time.mins : '')
                        + closed_time.meridian;
                    break;

                default:
                    formatted_time = open_time.hours + ':' + open_time.mins +
                        open_time.meridian + '-' + closed_time.hours +
                        ':' + closed_time.mins + closed_time.meridian;
                    break;
                }

                return formatted_time;
            }

            return 'Not available';
        };
    }

    /* Truncates string text with proper arguments
        [length (number), end(string)] */
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

})();

/*jslint nomen: true, indent: 2, maxlen: 80, browser: true */
/*globals nypl_locations, angular, console, $window, _ */

(function () {
  'use strict';

  /** @namespace nyplAmenities */
  function nyplAmenities() {

    var amenities = {},
      sortAmenitiesList = function (list, sortBy) {
        return _.sortBy(list, function (item) {
          return item[sortBy];
        });
      };

    /** @function nyplAmenities.addIcon
     * @param {array} amenities Array with amenities objects.
     * @param {string} default_icon The default icon for an amenity.
     * @returns {array} 
     * @description Adds an icon class to an amenity category.
     */
    amenities.addIcon = function (amenities, default_icon) {
      var icon = default_icon || '';
      _.each(amenities, function (amenity) {
        switch (amenity.id) {
        case 7967: // Wireless
          amenity.icon = 'icon-connection';
          break;
        case 7965: // Laptop
          amenity.icon = 'icon-laptop';
          break;
        case 7966: // Printing
          amenity.icon = 'icon-print';
          break;
        case 7968: // Electrical oulets
          amenity.icon = 'icon-power-cord';
          break;
        case 7972: // Book drop
        case 7971:
          amenity.icon = 'icon-box-add';
          break;
        default:
          amenity.icon = icon;
          break;
        }
      });

      return amenities;
    };

    amenities.addCategoryIcon = function (amenities) {
      var self = this;
      _.each(amenities, function (amenityCategory) {
        var icon = '';
        switch (amenityCategory.name) {
        case 'Computer Services':
          icon = 'icon-screen2';
          break;
        case 'Circulation':
          icon = 'icon-book';
          break;
        case 'Office Services':
          icon = 'icon-copy';
          break;
        case 'Facilities':
          icon = 'icon-library';
          break;
        case 'Assistive Technologies':
          icon = 'icon-accessibility2';
          break;
        }

        amenityCategory.icon = icon;
        amenityCategory.amenities =
          self.addIcon(amenityCategory.amenities, icon);
      });

      return amenities;
    };

    /** @function nyplAmenities.allAmenitiesArray
     * @param {array} amenitiesCategories Array with amenities categories, each
     *  category with it's own amenities property which is an array of
     *  amenities under that category.
     * @returns {array} An array with all the amenities plucked from every
     *  category at a single top level, without any categories involved.
     */
    amenities.allAmenitiesArray = function (amenitiesCategories) {
      if (!amenitiesCategories) {
        return;
      }

      return _.chain(amenitiesCategories)
              // Get the 'amenities' property from every amenity category
              .pluck('amenities')
              // Flatten every array of amenities from each category into
              // a single array.
              .flatten(true)
              // Return the result.
              .value();
    };

    /** @function nyplAmenities.getHighlightedAmenities
     * @param {array} amenities Array with amenities categories, each category
     *  with it's own amenities property which is an array of amenities
     *  under that category.
     * @param {number} rank How many institution ranked amenities should be
     *  returned in the beginning of the array.
     * @param {number} loc_rank How many location ranked amenities should be
     *  returned at the end of the array.
     * @returns {array} An array containing a specific number of institution
     *  and location ranked amenities, with institution amenities listed first.
     * @example
     *  // Get three institution and two location ranked amenities.
     *  var highlightedAmenities =
     *    nyplAmenities
     *      .getHighlightedAmenities(location._embedded.amenities, 3, 2);
     */
    amenities.getHighlightedAmenities = function (amenities, rank, loc_rank) {
      var initial_list = this.allAmenitiesArray(amenities),
        amenities_list = [];

      if (!(amenities && rank && loc_rank)) {
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

  /** @namespace nyplGeocoderService */
  function nyplGeocoderService($q) {

    var map,
      markers = [],
      filteredLocation,
      searchMarker = new google.maps.Marker({
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }),
      searchInfoWindow = new google.maps.InfoWindow(),
      infowindow = new google.maps.InfoWindow(),
      geocoderService = {},

      /** @function getMarkerFromList
       * @param {string} id The location's slug used for the marker id.
       * @returns {object} The marker object that has the id that was passed,
       *  else an empty object.
       * @private
       * @memberof nyplGeocoderService
       */
      getMarkerFromList = function (id) {
        return _.findWhere(markers, {id: id});
      },

      /** @function showInfowindow
       * @param {object} marker Google Maps Marker object.
       * @param {string} text Text that will appear in the Google Maps marker's
       *  infowindow.
       * @private
       * @memberof nyplGeocoderService
       * @description Hides any previous infowindow displaying on the map and
       *  will display the infowindow for the marker passed with the text.
       * @example
       *  var marker = new google.maps.Marker({...}),
       *    text = "Address of marker";
       *  showInfowindow(marker, text);
       */
      showInfowindow =  function (marker, text) {
        geocoderService.hideInfowindow();
        infowindow.setContent(text);
        infowindow.open(map, marker);
      },

      /** @function removeMarkerFromMap
       * @param {string} id The id for the marker that should be removed.
       * @private
       * @memberof nyplGeocoderService
       * @description Removes the specified marker from the map.
       * @example
       *  removeMarkerFromMap('baychester');
       */
      removeMarkerFromMap = function (id) {
        var markerObj = getMarkerFromList(id);
        if (geocoderService.doesMarkerExist(id)) {
          markerObj.marker.setMap(null);
        }
      },

      /** @function addMarkerToMap
       * @param {string} id The id for the marker to add to the map.
       * @private
       * @memberof nyplGeocoderService
       * @description Add the specified marker to the map.
       * @example
       *  addMarkerToMap('parkester');
       */
      addMarkerToMap = function (id) {
        var markerObj = getMarkerFromList(id);
        if (markerObj) {
          markerObj.marker.setMap(map);
        }
      };

    /** @function nyplGeocoderService.geocodeAddress
     * @param {string} address Address or location to search for.
     * @returns {object} Deferred promise. If it resolves, an object is returned
     *  with coordinates and formatted address, or an error if rejected.
     * @example
     *  nyplGeocoderService.geocodeAddress('Bryant Park')
     *    .then(function (coords) {
     *      // coords.lat, coords.long, coords.name
     *    });
     *    .catch(function (error) {
     *      // "Query too short" or Google error status
     *    });
     */
    geocoderService.geocodeAddress = function (address) {
      var defer = $q.defer(),
        coords = {},
        geocoder = new google.maps.Geocoder(),
        sw_bound = new google.maps.LatLng(40.49, -74.26),
        ne_bound = new google.maps.LatLng(40.91, -73.77),
        bounds = new google.maps.LatLngBounds(sw_bound, ne_bound);

      if (address.length < 3) {
        defer.reject({msg: "Query too short"});
      } else {
        geocoder.geocode({address: address, bounds: bounds, region: "US"},
          function (result, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              coords.lat  = result[0].geometry.location.k;
              coords.long = result[0].geometry.location.B ||
                 result[0].geometry.location.A;
              coords.name = result[0].formatted_address;

              defer.resolve(coords);
            } else {
              defer.reject(new Error(status));
            }
          });
      }

      return defer.promise;
    };

    /** @function nyplGeocoderService.reverseGeocoding 
     * @param {object} coords Object with lat and long properties.
     * @returns {object} Deferred promise. If it resolves, a string of Google's
     *  best attempt to reverse geocode coordinates into a formatted address. 
     * @example
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

    /** @function nyplGeocoderService.drawMap
     * @param {object} coords Object with lat and long properties.
     * @param {number} zoom The Google Map zoom distance.
     * @param {string} id The id of the element to draw the map on.
     * @description Draw a Google Maps map on a specific element on the page.
     * @example
     *  nyplGeocoderService.drawMap({
     *    lat: 40.7532,
     *    long: -73.9822
     *  }, 12, 'all-locations-map');
     */
    geocoderService.drawMap = function (coords, zoom, id) {
      var locationCoords = new google.maps.LatLng(coords.lat, coords.long),
        mapOptions = {
          zoom: zoom,
          center: locationCoords,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          scaleControl: false,
          streetViewControl: false
        };

      map = new google.maps.Map(document.getElementById(id), mapOptions);
      return this;
    };

    /** @function nyplGeocoderService.drawLegend
     * @param {string} id The id of the element to draw the map legend on.
     * @description Draw an element on the page designated to be the legend on
     *  the Google Maps map. It will be drawn on the bottom right corner.
     * @example
     *  nyplGeocoderService.drawLegend('all-locations-map-legend');
     */
    geocoderService.drawLegend = function (id) {
      var mapLegend = document.getElementById(id);

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapLegend);
      mapLegend.className = "show-legend";

      return this;
    };

    /** @function nyplGeocoderService.panMap
     * @param {object} [marker] A Google Maps marker object.
     * @description If a marker object is passed, it will pan to that marker on
     *  the page. Otherwise it will pan to SASB.
     * @todo Find the default location and zoom level for the map.
     * @example
     *  nyplGeocoderService.drawLegend('all-locations-map-legend');
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

    /** @function nyplGeocoderService.showResearchLibraries
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

    /** @function nyplGeocoderService.showAllLibraries
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

    /** @function nyplGeocoderService.createMarker
     * @param {string} id The location's slug.
     * @param {object} location The location's coordinates as an object with
     *  latitude and longitude properties.
     * @param {string} text The location's address for the marker's infowindow,
     *  with markup since the infowindow allows markup.
     * @description This will create a Google Maps Marker and add it to the
     *  global markers array. If the marker is the user's marker, it will have
     *  a different icon, zIndex, and animation.
     * @example
     *  nyplGeocoderService.createMarker('sibl', {
     *    latitude: 40.24,
     *    longitude: -73.24
     *  }, 'Science, Industry and Business Library (SIBL) 188 Madison Avenue ' +
     *   '@ 34th Street New York, NY, 10016');
     */
    geocoderService.createMarker = function (id, location, text) {
      var marker,
        position =
          new google.maps.LatLng(location.latitude, location.longitude),
        markerOptions = {
          position: position,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        };

      if (id === 'user') {
        markerOptions.icon =
          "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        markerOptions.zIndex = 1000;
        markerOptions.animation = google.maps.Animation.DROP;
      }

      marker = new google.maps.Marker(markerOptions);
      markers.push({id: id, marker: marker, text: text});

      google.maps.event.addListener(marker, 'click', function () {
        showInfowindow(marker, text);
      });
    };

    /** @function nyplGeocoderService.hideInfowindow
     * @description Hides the infowindow if the current infowindow is opened.
     * @example
     *  // ... Do some map related interaction
     *  nyplGeocoderService.hideInfowindow();
     */
    geocoderService.hideInfowindow = function () {
      infowindow.close();
      return this;
    };

    /** @function nyplGeocoderService.doesMarkerExist
     * @param {string} id A marker's id.
     * @returns {boolean} True if the marker exists, false otherwise.
     * @description Checks the markers array for the marker with the id passed.
     * @example
     *  if (nyplGeocoderService.doesMarkerExist('schwarzman')) {
     *    // Do something with the marker.
     *    nyplGeocoderService.panExistingMarker('schwarzman');
     *  }
     */
    geocoderService.doesMarkerExist = function (id) {
      return !!getMarkerFromList(id);
    };

    /** @function nyplGeocoderService.createSearchMarker
     * @param {object} coords Object with lat and long properties.
     * @param {string} text The text that should appear in the marker's
     *  infowindow.
     * @example
     *  nyplGeocoderService.createSearchMarker({
     *    lat: 40.49, long: -74.26
     *  }, 'Infowindow description of the marker');
     });
     */
    geocoderService.createSearchMarker = function (coords, text) {
      var searchTerm = text.replace(',', ' <br>').replace(',', ' <br>'),
        panCoords = new google.maps.LatLng(coords.lat, coords.long);

      searchMarker.setPosition(panCoords);
      searchInfoWindow.setContent(searchTerm);
    };

    /** @function nyplGeocoderService.drawSearchMarker
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

    /** @function nyplGeocoderService.hideSearchInfowindow
     * @description Public wrapper to close the search marker's infowindow.
     */
    geocoderService.hideSearchInfowindow = function () {
      searchInfoWindow.close();
      return this;
    };

    /** @function nyplGeocoderService.removeMarker
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

    /** @function nyplGeocoderService.panExistingMarker
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

    /** @function nyplGeocoderService.setFilterMarker
     * @param {string} id A location's slug.
     * @Description Set the filtered marker's id. It is used when switching from
     *  the list view to the map view so that the matched filtered marker
     *  can display on the map.
     */
    geocoderService.setFilterMarker = function (location_slug) {
      filteredLocation = location_slug;
      return this;
    };

    /** @function nyplGeocoderService.drawFilterMarker
     * @param {string} id A location's slug.
     * @description Draws the filter matched marker if it exists.
     */
    geocoderService.drawFilterMarker = function (location_slug) {
      if (this.doesMarkerExist(location_slug)) {
        this.panExistingMarker(location_slug);
      }
      return this;
    };

    /** @function nyplGeocoderService.clearFilteredLocation
     * @description Removes the filtered match marker id.
     */
    geocoderService.clearFilteredLocation = function () {
      filteredLocation = undefined;
      return this;
    };

    /** @function nyplGeocoderService.getFilteredLocation
     * @returns {string} The filtered match marker's stored id.
     */
    geocoderService.getFilteredLocation = function () {
      return filteredLocation;
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

  /** @namespace nyplSearch */
  function nyplSearch($filter) {
    var search = {},
      searchValues = {};

    search.setSearchValue = function (prop, val) {
      searchValues[prop] = val;
      return this;
    };

    search.getSearchValues = function () {
      return searchValues;
    };

    search.resetSearchValues = function () {
      searchValues = {};
      return this;
    };

    /** @function nyplSearch.idLocationSearch
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

    /** @function nyplSearch.locationSearch
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

      if (strictFilter !== undefined && strictFilter.length !== 0) {
        // Rarely occurs but just in case there are results for
        // both filters, the strict match should appear first
        return _.union(strictFilter, lazyFilter);
      }

      return lazyFilter;
    };

    /** @function nyplSearch.searchWordFilter
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

  // Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
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

  /** @namespace nyplUtility */
  function nyplUtility($window, $sce, nyplCoordinatesService) {
    var utility = {};

    /** @function nyplUtility.hoursToday
     * @param {object} hours Object with a regular property that is an
     *  array with the open and close times for every day.
     * @returns {object} An object with the open and close times for
     *  the current and tomorrow days.
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

    // Parse exception data and return as string
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

    /** @function nyplUtility.getAddressString
     * @param {object} location The full location object.
     * @param {boolean} [nicePrint] False by default. If true is passed,
     *  the returned string will have HTML so it displays nicely in a
     *  Google Maps marker infowindow.
     * @returns {string} The formatted address of the location passed.
     *  Will contain HTML if true is passed as the second parameter,
     *  with the location name linked
     */
    utility.getAddressString = function (location, nicePrint) {
      if (!location) {
        return '';
      }

      var addressBreak = " ",
        linkedName = location.name;

      if (nicePrint) {
        addressBreak = "<br />";
        linkedName = "<a href='/#/" + location.slug +
          "'>" + location.name + "</a>";
      }

      return linkedName + addressBreak +
        location.street_address + addressBreak +
        location.locality + ", " +
        location.region + ", " +
        location.postal_code;
    };

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

    utility.alerts = function (alerts) {
      var today = new Date(),
        todaysAlert = '',
        alert_start,
        alert_end;

      if (!alerts) {
        return null;
      }

      if (Array.isArray(alerts)) {
        _.each(alerts, function (alert) {
          alert_start = new Date(alert.start);
          alert_end = new Date(alert.end);

          if (alert_start <= today && today <= alert_end) {
            todaysAlert += alert.body + "\n";
          }
        });

        if (!angular.isUndefined(todaysAlert)) {
          return todaysAlert;
        }
      }
      return null;
    };

    /*
    * Desc: Utility service function that opens a new window given a URL
    * Arguments:
    * link (URL), title (String), 
    * width (Int or String), height (Int or String)
    */
    utility.popupWindow = function (link, title, width, height) {
      var w, h, popUp, popUp_h, popUp_w;
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
      } else {
        console.log('No link set, cannot initialize the popup window');
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

    // Iterate through lon/lat and calculate distance
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

    /** @function nyplUtility.checkDistance
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

    /** @function nyplUtility.returnHTML
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

    /** @function nyplUtility.divisionHasAppointment
     * @param {string} id The id of a division.
     * @returns {boolean} True if the division is in the set that should have
     *  appointments, false otherwise.
     * @description Only a few divisions should have a link to make
     *  an appointment.
     */
    utility.divisionHasAppointment = function (id) {
      switch (id) {
      case "ARN":
      case "RBK":
      case "MSS":
      case "BRG":
      case "PRN":
      case "PHG":
      case "SPN":
      case "CPS":
        return true;
      default:
        return false;
      }
    };

    return utility;
  }
  nyplUtility.$inject = ["$window", "$sce", "nyplCoordinatesService"];

  angular
    .module('nypl_locations')
    .factory('nyplUtility', nyplUtility)
    .factory('requestNotificationChannel', requestNotificationChannel);

})();

