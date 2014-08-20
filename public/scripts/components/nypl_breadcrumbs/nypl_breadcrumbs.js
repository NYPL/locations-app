/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */
(function (window, angular, undefined) {

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

    // Extend options from provider
    this.setOptions = function(opts) {
        angular.extend(options, opts);
    };

    this.$get = ['$state', '$stateParams', '$rootScope', function($state, $stateParams, $rootScope) {

        var $lastViewScope = $rootScope;

        // Add the state in the chain if not already in and if not abstract
        var addStateToChain = function(chain, state) {
          for(var i=0, l=chain.length; i<l; i+=1) {
            if (chain[i].name === state.name) {
              return;
            }
          }

          // Check for abstract state
          if (!state.abstract) {
	        	if(state.customUrl) {
	          	state.url = $state.href(state.name, $stateParams || {});
	          	chain.unshift(state);
	        	}
	        }
        };

        return {
        		// Adds provider custom states to chain
            getConfigChain: function() {
              var chain = []; // Initialize chain array to hold crumb elements

              if (options.secondaryState) {
              	addStateToChain(chain, options.secondaryState);
              }
              if (options.primaryState) {
              	addStateToChain(chain, options.primaryState);
              }

              return chain;
            },

            $getLastViewScope: function() {
                return $lastViewScope;
            }
        };
    }];
	}

	function nyplBreadcrumbs($interpolate, $state, $crumb) {
	  'use strict';

		return {
		  restrict: 'E',
		  templateUrl: 'scripts/components/nypl_breadcrumbs/nypl_breadcrumbs.html',
		  scope: {
		      crumbName: '@'
		  },
		  link: function(scope) {

				scope.breadcrumbs = [];

	      if ($state.$current.name !== '') {
	          initCrumbs();
	      }
	      scope.$on('$stateChangeSuccess', function() {
	          initCrumbs();
	      });

	      /**
	       * Start with the current state and traverse up the path to build the
	       * array of breadcrumbs that can be used in an ng-repeat in the template.
	       */
	      function initCrumbs() {
          var workingState, 
          displayName, 
          parentState,
          breadcrumbs = [],
          currentState = $state.$current,
          configStates = $crumb.getConfigChain();

          // Add initial configuration states if set
          if (configStates) {
          	for(var i = 0; i < configStates.length; i++) {
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

	      /**
	       * Get the state to put in the breadcrumbs array, taking into account that if the current state is abstract,
	       * we need to either substitute it with the state named in the `scope.abstractProxyProperty` property, or
	       * set it to `false` which means this breadcrumb level will be skipped entirely.
	       * @param currentState
	       * @returns {*}
	       */
	      function getWorkingState(currentState) {
	          var proxyStateName;
	          var workingState = currentState;

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

	      /**
	       * Resolve the name of the BreadCrumb of the specified state. Take the property specified by the `displayname-property`
	       * attribute and look up the corresponding property on the state's config object. The specified string can be interpolated against any resolved
	       * properties on the state config object, by using the usual {{ }} syntax.
	       * @param currentState
	       */
	      function getCrumbName(currentState) {
	          var interpolationContext;
	          var propertyReference;
	          var displayName;

	          if (!scope.crumbName) {
	              // if the displayname-property attribute was not specified, 
	              // default to the state's name
	              return currentState.name;
	          }
	          propertyReference = getObjectValue(scope.crumbName, currentState);

	          if (propertyReference === false) {
	              return false;
	          } else if (typeof propertyReference === 'undefined') {
	              return currentState.name;
	          } else {
	              // use the $interpolate service to handle any bindings in the propertyReference string.
	              interpolationContext =  (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
	              //console.log(interpolationContext);
	              displayName = $interpolate(propertyReference)(interpolationContext);

	              return displayName;
	          }
	      }

	      /**
	       * Resolve the Parent State given from the parentState property.
	       * Extract parentState names and state ui-href properties and assign to object
	       * @param currentState
	       */
	      function getParentState(currentState) {
	      		var currState = currentState,
	      		parentStateSetting = currState.data.parentState,
	      		parentStateRoute,
	      		parentStateName,
	      		parentStateObj = {},
	      		context = (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;

	      		if ( typeof context === 'object' && parentStateSetting) {
	      			if (!context.$stateParams) {
	      				return null;
	      			}
	      			else {
	      				parentStateName	 = getParentName(currentState);
								parentStateRoute = getParentRoute(context, parentStateSetting);
		      			
		      			if ( parentStateName && parentStateRoute ) {
			      			parentStateObj = {
			      				displayName: parentStateName,
			      				route: parentStateRoute
			      			}
			      			return parentStateObj;
			      		}
			      		else {
			      			console.log('Parent state name or route is not defined');
			      			return null;
			      		}
		      		}
	      		}
	      		else {
	      			return null;
	      		}
	      }

	      function getParentRoute(context, parentStateSetting) {
	      	var currentContext = context,
	      	stateSetting = parentStateSetting,
	      	parentRoute;

					if( typeof currentContext === 'object' && stateSetting) {
						Object.keys(currentContext).forEach(function(key) {
							if(key !== '$stateParams') {
								if (currentContext[key].location_slug) {
									parentRoute = currentContext[key].location_slug;
								}
								else if (currentContext[key].slug) {
									parentRoute = currentContext[key].slug;
								}
							}
						});
						return stateSetting + '({ ' + "\"" + stateSetting + "\"" + ':' + "\"" + parentRoute + "\"" + '})';
					}
					else {
						return null;
					}
				}

	      function getParentName(currentState) {
	      	var parentStateSetting = currentState.data.parentState,
	      	parentStateData = $state.get(parentStateSetting),
	      	context = (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState,
	      	parentStateName;

	      	if (parentStateData) {
	      		parentStateName = $interpolate(parentStateData.data.crumbName)(context);
	      		if (parentStateName) {
	   					return parentStateName;
	   				}
	   				// Not within the context interpolation, loop though obj
	   				else if( typeof context === 'object') {
							Object.keys(context).forEach(function(key) {
								if(key !== '$stateParams') {
									if (context[key].location_name) {
										parentStateName = context[key].location_name;
									}
									else if (context[key].name) {
										parentStateName = context[key].name;
									}
								}
							});

							return parentStateName; 
		      	}
	      	}
	      	else {
	      		return null;
	      	}
	      }

	      /**
	       * Given a string of the type 'object.property.property', 
	       * traverse the given context (eg the current $state object) 
	       * and return the value found at that path.
	       *
	       * @param objectPath
	       * @param context
	       * 
	       */
	      function getObjectValue(objectPath, context) {
	          var i;
	          var propertyArray = objectPath.split('.');
	          var propertyReference = context;

	          for (i = 0; i < propertyArray.length; i ++) {
	              if (angular.isDefined(propertyReference[propertyArray[i]])) {
	                  propertyReference = propertyReference[propertyArray[i]];
	              } else {
	                  // if the specified property was not found, default to the state's name
	                  return undefined;
	              }
	          }
	          return propertyReference;
	      }

	      /**
	       * Check whether the current `state` has already appeared in the current breadcrumbs array. This check is necessary
	       * when using abstract states that might specify a proxy that is already there in the breadcrumbs.
	       * @param state
	       * @param breadcrumbs
	       * @returns {boolean}
	       */
	      function stateAlreadyInBreadcrumbs(state, breadcrumbs) {
	          var i;
	          var alreadyUsed = false;
	          for(i = 0; i < breadcrumbs.length; i++) {
	              if (breadcrumbs[i].route === state.name) {
	                  alreadyUsed = true;
	              }
	          }
	          return alreadyUsed;
	      }
		  }
		};
	}

	angular
	  .module('nyplBreadcrumbs', [])
	  .provider('$crumb', $Crumb)
	  .directive('nyplBreadcrumbs', nyplBreadcrumbs);

})(window, window.angular);