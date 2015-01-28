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

// Declare an http interceptor that will signal
// the start and end of each request
// Credit: Jim Lasvin -- https://github.com/lavinjj/angularjs-spinner
function httpInterceptor($httpProvider) {
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
}
httpInterceptor.$inject = ["$httpProvider"];

nypl_locations.config(httpInterceptor);

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

/**
 * @ngdoc overview
 * @module nypl_research_collections
 * @name nypl_research_collections
 * @requires ngSanitize
 * @requires ui.router
 * @requires locationService
 * @requires coordinateService
 * @requires angulartics
 * @requires angulartics.google.analytics
 * @description
 * Research collections.
 */
angular.module('nypl_research_collections', [
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'locationService',
    'coordinateService',
    'angulartics',
    'angulartics.google.analytics',
    'nyplNavigation',
    'nyplSSO',
    'nyplSearch'
])
.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider) {
        'use strict';

        function LoadDivisions(config, nyplLocationsService) {
            return nyplLocationsService
                .allDivisions()
                .then(function (data) {
                    return data.divisions;
                })
                .catch(function (err) {
                    throw err;
                });
        }
        LoadDivisions.$inject = ["config", "nyplLocationsService"];

        function getConfig(nyplLocationsService) {
            return nyplLocationsService.getConfig();
        }
        getConfig.$inject = ["nyplLocationsService"];

        // uses the HTML5 History API
        $locationProvider.html5Mode(true);

        // $urlRouterProvider.rule(function ($injector, $location) {
        //     var path = $location.url();

        //     // Remove trailing slash if found
        //     if (path[path.length - 1] === '/') {
        //         return path.slice(0, -1);
        //     }
        // });
        var home_url = window.rq_forwarded ? '/' : '/research-collections';
        $urlRouterProvider.otherwise(home_url);
        $stateProvider
            .state('division', {
                url: home_url,
                templateUrl: 'views/research-collections.html',
                controller: 'CollectionsCtrl',
                label: 'Research Collections',
                resolve: {
                    config: getConfig,
                    divisions: LoadDivisions
                }
            });
    }
])
.config(httpInterceptor);


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

        locationsApi.allDivisions = function () {
            var defer = $q.defer();

            $http.jsonp(
                api + '/divisions/?callback=JSON_CALLBACK', {cache: true}
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

        locationsApi.terms = function () {
            var defer = $q.defer();

            $http.jsonp(
                    api + '/terms' + '?callback=JSON_CALLBACK',
                    {cache: true}
                )
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(apiError + ': terms');
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
  nyplNavigation.$inject = ["ssoStatus", "$window", "$rootScope"];

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
  nyplSearch.$inject = ["$analytics"];

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
          enews_email = $('#header-news_signup input[type=email]'),
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
  nyplSSO.$inject = ["ssoStatus", "$window", "$rootScope"];

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
/*global nypl_locations, angular */

(function () {
  'use strict';

  function AmenitiesCtrl($rootScope, $scope, amenities, config, nyplAmenities) {
    $rootScope.title = "Amenities";

    $scope.amenitiesCategories =
      nyplAmenities.createAmenitiesCategories(amenities.amenities);
  }
  AmenitiesCtrl.$inject = ["$rootScope", "$scope", "amenities", "config", "nyplAmenities"];

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
  AmenitiesAtLibraryCtrl.$inject = ["$rootScope", "$scope", "config", "location", "nyplAmenities"];

  angular
    .module('nypl_locations')
    .controller('AmenityCtrl', AmenityCtrl)
    .controller('AmenitiesCtrl', AmenitiesCtrl)
    .controller('AmenitiesAtLibraryCtrl', AmenitiesAtLibraryCtrl);
})();

/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery,
console, $location, $ */

(function () {

  function CollectionsCtrl(
    $scope,
    $rootScope,
    config,
    divisions,
    nyplLocationsService,
    nyplUtility,
    researchCollectionService
  ) {
    var rcValues = researchCollectionService.getResearchValues(),
      sibl,
      research_order = config.research_order || ['SASB', 'LPA', 'SC', 'SIBL'],
      getHoursToday = function (obj) {
        _.each(obj, function (elem) {
          if (elem.hours) {
            elem.hoursToday = nyplUtility.hoursToday(elem.hours);
          }
        });
      },
      loadTerms = function () {
        return nyplLocationsService
          .terms()
          .then(function (data) {
            var dataTerms = [];

            _.each(data.terms, function (term) {
              var newTerms = term.terms,
                subjectsSubterms = [],
                index = term.name === 'Subjects' ? 0 : 1;

                // Get the parent term if there are no children terms.
                // _.each(term.terms, function (subterm) {
                //   if (!subterm.terms) {
                //     subjectsSubterms.push({
                //       name: subterm.name,
                //       id: subterm.id
                //     });
                //   } else {
                //     _.each(subterm.terms, function  (term) {
                //       subjectsSubterms.push(term);
                //     });
                //   }
                // });

              dataTerms[index] = {
                id: term.id,
                name: term.name,
                terms: newTerms
              };
            });

            dataTerms.push({
              name: 'Locations',
              locations: $scope.divisionLocations
            });
            $scope.terms = dataTerms;
          });
          // .finally(function (data) {
          //   $scope.terms[2] = ({
          //     name: 'Locations',
          //     locations: $scope.divisionLocations
          //   });
          // });
          // .catch(function (error) {
          //     throw error;
          // });
      },
      loadSIBL = function () {
        return nyplLocationsService
          .singleLocation('sibl')
          .then(function (data) {
            getHoursToday([data.location]);
            sibl = data.location;
            sibl._embedded.location = {
              id: 'SIBL'
            };

            $scope.filteredDivisions.push(sibl);
            $scope.divisions.push(sibl);
            $scope.divisionLocations.push(sibl);
          });
      };

    $rootScope.title = "Research Collections";
    $scope.filter_results = [
      {label: 'Subjects', name: '', id: undefined, active: false, subterms: undefined},
      {label: 'Media', name: '', id: undefined, active: false},
      {label: 'Locations', name: '', id: undefined, active: false}
    ];
    
    // Assign Today's hours
    getHoursToday(divisions);
    $scope.divisions = divisions;
    $scope.terms = [];

    $scope.filteredDivisions = rcValues.filteredDivisions || _.chain(divisions)
      .sortBy(function (elem) {
        return elem.name;
      })
      .flatten()
      .value();

    $scope.divisionLocations = _.chain(divisions)
      .pluck('_embedded')
      .flatten()
      .pluck('location')
      .indexBy('id')
      .sortBy(function (elem) {
        return nyplUtility.researchLibraryOrder(
          research_order,
          elem.id
        );
      })
      .flatten()
      .value();

    loadSIBL();
    loadTerms();

    $scope.selectCategory = function (index, term) {
      if ($scope.categorySelected === index) {
        $scope.categorySelected = undefined;
        $scope.activeCategory = undefined;
        return;
      }

      $scope.activeCategory = term.name;

      // Save the filter. Need to add one for the the parent term.
      // researchCollectionService.setResearchValue('subterms', subterms);

      // For the data-ng-class for the active buttons.
      // Reset the subterm button.
      $scope.categorySelected = index;
    };

    function getSubjectFilters() {
      if ($scope.filter_results[0].active) {
        if ($scope.filter_results[0].subterms) {
          return $scope.filter_results[0].subterms;
        }
        return [{id: $scope.filter_results[0].id}];
      }
      return false;
    }

    // Only get Media and Location filters
    function getMediaLocationsFilters() {
      return _.chain($scope.filter_results)
        .filter(function (filter) {
          return (filter.active && filter.label !== 'Subjects');
        })
        .map(function (filter) {
          return filter.id;
        })
        .value();
    }

    function filterBySubject(subjectFitlers) {
      return _.chain($scope.divisions)
        .filter(function (division) {
          var found = false;
          _.each(subjectFitlers, function (subjectTerm) {
            // Search through each parent term
            _.each(division.terms, function (parentTerm) {
              // If already found, no need to keep searching;
              if (!found) {
                // Find the term where the ID matches what was selected
                found = _.find(parentTerm.terms, function (term) {
                  return term.id === subjectTerm.id;
                });
              }
            });
          });

          // Return the boolean value of found. True if there's an object,
          // false if no object was found.
          return !!found;
        })
        .sortBy(function (elem) {
          return elem.name;
        })
        .flatten()
        .value();
    }

    function filterByMediaAndLocation(idsToCheck, savedFilteredArr) {
      return _.chain(savedFilteredArr)
        .filter(function (division) {
          var foundArr = [];
          _.each(idsToCheck, function (termID) {

            var found = false;
            // Search through each parent term
            _.each(division.terms, function (parentTerm) {
              // If already found, no need to keep searching;
              if (!found) {
                // Find the term where the ID matches what was selected
                found = _.find(parentTerm.terms, function (term) {
                  return term.id === termID;
                });
                if (found) {
                  foundArr.push(true);
                }
              }
            });

            if (!found) {
              if (division._embedded.location.id === termID) {
                foundArr.push(true);
              }
            }
          });

          // Return the boolean value of found. True if there's an object,
          // false if no object was found.
          return (foundArr.length === idsToCheck.length);
        })
        .sortBy(function (elem) {
          return elem.name;
        })
        .flatten()
        .value();
    }

    function filterDivisions() {
      var idsToCheck = getMediaLocationsFilters(),
        savedFilteredArr = [],
        subjectFitlers = getSubjectFilters();

      // Display the "Current Filters:" if there are any ids to filter by
      if (idsToCheck.length || subjectFitlers.length) {
        $scope.showActiveFilters = true;
      } else {
        $scope.showActiveFilters = false;
      }

      // If there are subjects to filter through, do those first
      if (subjectFitlers.length) {
        savedFilteredArr = filterBySubject(subjectFitlers);
      } else {
        // If no subjects to filter through, use all the divisions
        savedFilteredArr = $scope.divisions;
      }

      // No Media or Locations to filter through
      if (idsToCheck.length === 0) {
        $scope.filteredDivisions = savedFilteredArr;
      } else {
        // Filter through Media or Location ids
        $scope.filteredDivisions =
          filterByMediaAndLocation(idsToCheck, savedFilteredArr);
      }
    }

    function fixTermName(label, term) {
      var name;

      if (label === "Locations") {
        if (term.id === "SIBL" || term.id === "LPA") {
          name = term.slug.toUpperCase();
        } else {
          name = (term.slug).charAt(0).toUpperCase() + (term.slug).slice(1);
        }
      } else {
        name = term.name;
      }

      return name;
    }

    function activeSubterm(term) {
      var label = $scope.activeCategory,
        name = fixTermName(label, term),
        currentSelected = _.findWhere(
          $scope.filter_results,
          {label: label, name: name}
        );

      // Selection doesn't exist so add it
      if (!currentSelected) {
        _.each($scope.filter_results, function (subterm) {
          if (subterm.label === label) {
            subterm.name = name;
            subterm.active = true;
            subterm.id = term.id;
            if (subterm.label === 'Subjects') {
              subterm.subterms = term.terms;
            }
          }
        });
        return;
      }

      // Exists so remove it
      $scope['selected' + label + 'Subterm'] = undefined;
      _.each($scope.filter_results, function (subterm) {
        if (subterm.label === label) {
          subterm.name = '';
          subterm.active = false;
          subterm.id = undefined;
          if (subterm.label === 'Subjects') {
            subterm.subterms = undefined;
          }
        }
      });
      return;
    }

    function showSubtermsForCategory(index) {
      $scope['selected' + $scope.activeCategory + 'Subterm'] = index;
    }

    $scope.filterDivisionsBy = function (index, selectedTerm) {
      // Display the correct list for the selected category
      showSubtermsForCategory(index);

      // Highlight the current selected subterm
      activeSubterm(selectedTerm);

      // // Save the filtered divisions for later.
      // researchCollectionService
      //   .setResearchValue('filteredDivisions', $scope.filteredDivisions);

      return filterDivisions();
    };

    $scope.removeFilter = function (filter) {
      $scope['selected' + filter.label + 'Subterm'] = undefined;
      filter.active = false;
      filter.name = '';
      filter.id = undefined;

      // Now go through the process of filtering again:
      filterDivisions();
    };

  }
  CollectionsCtrl.$inject = ["$scope", "$rootScope", "config", "divisions", "nyplLocationsService", "nyplUtility", "researchCollectionService"];

  angular
    .module('nypl_research_collections')
    .controller('CollectionsCtrl', CollectionsCtrl);

})();

/*jslint indent: 4, maxlen: 80, nomen: true */
/*globals nypl_locations, angular */

(function () {
    'use strict';

    function DivisionCtrl($rootScope, $scope, config, division, nyplUtility) {
        var divisionsWithApt = config.divisions_with_appointments;

        $scope.division = division;
        $scope.location = division._embedded.location;

        $rootScope.title = division.name;
        $scope.calendarLink = nyplUtility.calendarLink;
        $scope.icalLink = nyplUtility.icalLink;

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
    DivisionCtrl.$inject = ["$rootScope", "$scope", "config", "division", "nyplUtility"];

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
        config,
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
                    user.coords.latitude + "," + user.coords.longitude;
                $scope.userMarker = true;

                if (!isMapPage()) {
                    $state.go('home.map');
                }
                sortListBy('distance');
                nyplGeocoderService
                    .createMarker('user', user.coords, "Your Current Location");

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

                    _.each($scope.locations, function (location) {
                        var locationAddress =
                                nyplUtility.getAddressString(location, true),
                            markerCoordinates = {};

                        if (location.geolocation &&
                                location.geolocation.coordinates) {
                            markerCoordinates = {
                                'latitude': location.geolocation.coordinates[1],
                                'longitude': location.geolocation.coordinates[0]
                            };
                        };

                        location.hoursToday = nyplUtility.hoursToday;
                        location.locationDest =
                            nyplUtility.getAddressString(location);

                        location.amenities_list =
                            nyplAmenities.getHighlightedAmenities(
                                location._embedded.amenities,
                                amenitiesCount.global,
                                amenitiesCount.local
                            );

                        // Individual location exception data
                        location.branchException =
                            nyplUtility.branchException(location.hours);

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

            if ($scope.researchBranches) {
                nyplGeocoderService.showResearchLibraries().panMap();
                showLibrariesTypeOf('research');
                sortListBy('research_order');
            } else {
                nyplGeocoderService.showAllLibraries().panMap();
                showLibrariesTypeOf();
                sortListBy('name');
            }
        };

        $rootScope.title = "Locations";
        $scope.$state = $state;

        loadPreviousStateOrNewState();
        geolocationAvailable();
    }
    LocationsCtrl.$inject = ["$rootScope", "$scope", "$timeout", "$state", "config", "nyplCoordinatesService", "nyplGeocoderService", "nyplLocationsService", "nyplUtility", "nyplSearch", "nyplAmenities"];
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
                                "," + userCoords.longitude;
                        });
                    });
            };

        // Load the user's geolocation coordinates
        loadUserCoordinates();

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
                if (exh.start && exh.end) {
                    exh.prettyDate = nyplUtility.formatDate(exh.start, exh.end);
                }
            });
        }

        _.each(location._embedded.divisions, function (division) {
            division.hoursToday = nyplUtility.hoursToday(division.hours);
        });

        _.each(location._embedded.features, function (feature) {
            feature.body = nyplUtility.returnHTML(feature.body);
        });

        // Used for the Get Directions link to Google Maps
        $scope.locationDest = nyplUtility.getAddressString(location);

        // Assign closed image
        if (config.closed_img) {
            $scope.location.images.closed = config.closed_img;
        }
    }
    LocationCtrl.$inject = ["$rootScope", "$scope", "$timeout", "config", "location", "nyplCoordinatesService", "nyplUtility", "nyplAmenities"];

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
   * @name nypl_locations.directive:collapsibleFilters
   * @restrict AEC
   * @scope
   * @description
   * Collapsible Filters: Hides/Displays filterable data
   * @example
   * <pre>
   *  <collapsible-filters data='object'></collapsible-filters>
   * </pre>
   */
  function collapsibleFilters() {
    return {
      restrict: 'AE',
      templateUrl: 'scripts/directives/templates/collapsible-filters.html',
      replace: false,
      scope: {
        items: '=data',
        filterItem: '&',
        filteredResults: '='
      },
      link: function ($scope, elem, attrs) {
        $scope.showFilters = false;
        $scope.toggleShowFilter = function() {
          $scope.showFilters = !$scope.showFilters;
        }
        // Toggles active filter match
        $scope.checkActiveFilter = function(results, termID) {
          return $scope.activeFilter = _.findWhere(results, {id: termID});
        }
      }
    };
  }

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

  angular
    .module('nypl_research_collections')
    .directive('collapsibleFilters', collapsibleFilters)
    .directive('nyplFooter', nyplFooter)
    .directive('loadingWidget', loadingWidget);

})();

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
     * @param {string} type ...
     * @returns {string} ...
     * @description
     * ...
     */
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

     angular
        .module('nypl_research_collections')
        .filter('timeFormat', timeFormat)
        .filter('dateToISO', dateToISO)
        .filter('capitalize', capitalize)
        .filter('hoursTodayFormat', hoursTodayFormat);
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
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
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
          bounds: bounds,
          region: "US",
          componentRestrictions: {
            'country': 'US',
            'locality': 'New York'
          }
        };

      geocoder.geocode(geocodeOptions, function (result, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            // console.log(result);
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
          panControl: false,
          zoomControl: false,
          scaleControl: false,
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
   * @name nypl_locations.service:researchService
   * @description
   * ...
   */
  function researchCollectionService($filter) {
    var researchService = {},
      researchValues = {};

    /**
     * @ngdoc function
     * @name setResearchValue
     * @methodOf nypl_locations.service:researchService
     * @param {string} prop ...  
     * @param {string} val ...
     * @returns {object} ...
     * @description
     * ...
     */
    researchService.setResearchValue = function (prop, val) {
      researchValues[prop] = val;
      return this;
    };

    /**
     * @ngdoc function
     * @name getResearchValues
     * @methodOf nypl_locations.service:researchService
     * @returns {object} ...
     * @description
     * ...
     */
    researchService.getResearchValues = function () {
      return researchValues;
    };

    /**
     * @ngdoc function
     * @name resetResearchValues
     * @methodOf nypl_locations.service:researchService
     * @returns {object} ...
     * @description
     * ...
     */
    researchService.resetResearchValues = function () {
      researchValues = {};
      return this;
    };

    return researchService;
  }
  researchCollectionService.$inject = ["$filter"];

  angular
    .module('nypl_research_collections')
    .factory('researchCollectionService', researchCollectionService);

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

   angular
    .module('nypl_research_collections')
    .factory('nyplUtility', nyplUtility)
    .factory('requestNotificationChannel', requestNotificationChannel);

})();

