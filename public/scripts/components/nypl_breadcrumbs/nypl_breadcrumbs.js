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
      templateUrl: 'locations/scripts/components/nypl_breadcrumbs/nypl_breadcrumbs.html',
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

  angular
    .module('nyplBreadcrumbs', [])
    .provider('$crumb', $Crumb)
    .directive('nyplBreadcrumbs', nyplBreadcrumbs);

})(window, window.angular);