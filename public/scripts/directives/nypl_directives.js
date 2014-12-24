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

  /**
   * @ngdoc directive
   * @name nypl_locations.directive:nyplTranslate
   * @restrict E
   * @description
   * Directive to display a list of languages to translate the site into.
   * @example
   * <pre>
   *  <nypl-translate></nypl-translate>
   * </pre>
   */
  function nyplTranslate() {
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
              var fundraising = data.config.fundraising;
              scope.fundraising = {
                appeal: fundraising.appeal,
                statement: fundraising.statement,
                button_label: fundraising.button_label,
                link:  fundraising.link
              }
            });
          }, 200);
        }
      }
    };
  }

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
