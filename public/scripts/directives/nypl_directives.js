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

        // Call apWeekday for the syntax of weekday styling
        $scope.hours.map(function (item, index) {
          item.day = ctrl.apWeekday(item.day);
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
              day.day = (day.day) ? $filter('dayFormatUppercase')(day.day) : '';
              // Assign the date object to a string so we can use it in the filter
              day.dateString = day.date._d.toDateString();
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

        // Call the filer dayFormatUppercase to convert the name of weekdays to AP style
        this.apWeekday = function (day) {
          var day = (day) ? $filter('dayFormatUppercase')(day) : '';
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
          // console.log(date);
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
