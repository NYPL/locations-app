/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular */

/*
 * Tests for AngularJS Directives.
 */
describe('NYPL Directive Unit Tests', function () {
  'use strict';

  var httpBackend, compile, scope,
    api = 'http://dev.locations.api.nypl.org/api',
    api_version = 'v0.7.1',
    jsonpCallback = '?callback=JSON_CALLBACK';

  beforeEach(function () {
    module('nypl_locations');
    module('directiveTemplates');

    window.locations_cfg = {
      config: {
        api_root: api,
        api_version: api_version,
        fundraising: {
          statement: "Become a Member",
          appeal: "Friends of the Library can support their favorite " +
            "library and receive great benefits!",
          button_label: "Join or Renew",
          link: "https://secure3.convio.net/nypl/site/SPageServer?page" +
            "name=branch_friend_form&s_src=FRQ15ZZ_CADN"
        }
      }
    };

    inject(function (_$httpBackend_, _$compile_, _$rootScope_) {
      httpBackend = _$httpBackend_;
      compile = _$compile_;
      scope = _$rootScope_;

      httpBackend
        .whenJSONP('http://dev.locations.api.nypl.org/api/' + api_version + '/alerts' +
          '?callback=JSON_CALLBACK')
        .respond({});

      httpBackend
        .expectGET('views/locations.html')
        .respond('public/views/locations.html');

      httpBackend
        .expectGET('views/location-list-view.html')
        .respond('public/views/location-list-view.html');

      // httpBackend.flush();
    });
  });

  // afterEach(function() {
  //   httpBackend.verifyNoOutstandingExpectation();
  //   httpBackend.verifyNoOutstandingRequest();
  // });

  function createDirective(template) {
    var element;
    element = compile(template)(scope);
    scope.$digest();

    return element;
  }

  /*
   * <div loading-widget></div>
   *   The loadingWidget directive is markup that displays before
   *   an http request is fulfilled, in this case showing a spinner.
   */
  describe('Directive: loadingWidget', function () {
    var loadingWidget, template;

    beforeEach(inject(function () {
      template = '<div id="loadingWidget" loading-widget class="show">' +
        '<div class="loader-icon icon-spinner2"></div></div>';
      loadingWidget = createDirective(template);
    }));

    it('should compile', function () {
      expect(loadingWidget.attr('id')).toEqual('loadingWidget');
    });

    // Currently fails
    it('should remove the show class initially', function () {
      //console.log(loadingWidget);
      //expect(loadingWidget.attr('class')).not.toContain('show');
    });
  });

  /*
   * <nypl-translate><nypl-translate>
   *   The nyplTranslate directive displays a simple list
   *   of languages that the site can be translated into.
   */
  // NOTE: TEMPORARILY NOT BEING USED
  // describe('Directive: nyplTranslate', function () {
  //   var nyplTranslate, template, $translate, englishLink, spanishLink;

  //   beforeEach(inject(function (_$translate_) {
  //     $translate = _$translate_;
  //     $translate.use = jasmine.createSpy('$translate.use');

  //     template = '<nypl-translate></nypl-translate>';
  //     nyplTranslate = createDirective(template);

  //     englishLink = nyplTranslate.find('a')[0];
  //     spanishLink = nyplTranslate.find('a')[1];
  //   }));

  //   it('should have a translate class', function () {
  //     expect(nyplTranslate.attr('class')).toContain('translate');
  //   });

  //   // At the time of writing this test, we only have two languages
  //   it('should have two spans elements', function () {
  //     expect(nyplTranslate.find('span').length).toBe(2);
  //   });

  //   it('should display the Spanish translation', function () {
  //     spanishLink.click();

  //     expect($translate.use).toHaveBeenCalledWith('es');
  //   });

  //   it('should display the English translation', function () {
  //     englishLink.click();

  //     expect($translate.use).toHaveBeenCalledWith('en');
  //   });
  // });

  /*
   * <todayshours hours=""></todayshours>
   *   The todayshours directive returns text that should be displayed 
   *   based on what time is currently is and what the library time is.
   *   It will display either closed, open today until, or not available
   *   if the API is down.
   *
   *   Note that testing directives means also testing the 'hoursTodayformat'
   *   since the output text depends on that filter and the data being passed
   */
  describe('Directive: todayshours', function () {
    var todayshours, element, ctrl, $scope;

    describe('Controller methods:', function () {

      beforeEach(inject(function ($rootScope, $compile) {
        $scope = $rootScope.$new();
        element = angular.element("<todayshours hours='location.hours' display-icon='true' />");

        todayshours = $compile(element)($scope);
        $rootScope.$digest();
        ctrl = todayshours.controller("todayshours");
        $scope = element.isolateScope() || element.scope();
      }));

      it('computeHoursToday() method should be defined', function() {
        expect(ctrl.computeHoursToday).toBeDefined();
      });

      it('getLocationHours() method should be defined', function() {
        expect(ctrl.getLocationHours).toBeDefined();
      });

      it('getAlertMsg() method should be defined', function() {
        expect(ctrl.getAlertMsg).toBeDefined();
      });
    });

    describe('Directive with no scope data', function () {
      var msg;

      beforeEach(inject(function ($rootScope, $compile) {
        $scope = $rootScope.$new();
        element = angular.element("<todayshours hours='location.hours' />");

        todayshours = $compile(element)($scope);
        $rootScope.$digest();
        ctrl = todayshours.controller("todayshours");
        $scope = element.isolateScope() || element.scope();
      }));

      it('should compile with minimum assets', function() {
        expect(todayshours.find('.todays-hours')).toBeTruthy();
      });

      it('should not display a clock icon', function() {
        expect($scope.showIcon).toBeFalsy();
      });

      it('should display a clock icon', function() {
        $scope.showIcon = true;
        expect($scope.showIcon).toBeTruthy();
      });    

      it('should display hours today message as "Not available"', function() {
        msg = todayshours.find('.msg');
        expect(msg.text()).toBe('Not available');
      });
    });

    describe('Directive with/without location/alert data', function () {
      var hoursToday, nyplAlertsService;

      beforeEach(function () {
        inject(function ($rootScope, $compile, _nyplAlertsService_) {
          nyplAlertsService = _nyplAlertsService_;
          $scope = $rootScope.$new();
          element = angular.element("<todayshours hours='location.hours' />");

          todayshours = $compile(element)($scope);
          $rootScope.$digest();
          ctrl = todayshours.controller("todayshours");
          $scope = element.isolateScope() || element.scope();

          $scope.hours = {
            regular: [
              {
                day: "Sun",
                open: "13:00",
                close: "17:00"
              },
              {
                day: "Mon",
                open: "10:00",
                close: "18:00"
              },
              {
                day: "Tue",
                open: "10:00",
                close: "20:00"
              },
              {
                day: "Wed",
                open: "10:00",
                close: "20:00"
              },
              {
                day: "Thu",
                open: "10:00",
                close: "18:00"
              },
              {
                day: "Fri",
                open: "10:00",
                close: "18:00"
              },
              {
                day: "Sat",
                open: "10:00",
                close: "18:00"
              }
            ]
          };
        });
      });

      it('should display hours today if no alert data is defined ' +
      'and the branch has opened already', function() {
        // Mock time to 12noon
        var todaysDateMock = new Date(2015, 2, 16, 12);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.alerts = null;
        hoursToday = ctrl.computeHoursToday($scope.hours, $scope.alerts);
        expect(hoursToday).toBe('Open today until 6pm');
      });

      it('should display hours today if no alert data is defined ' +
      'and the branch is about to open', function() {
        // Mock time to 9AM
        var todaysDateMock = new Date(2015, 2, 16, 9);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.alerts = null;
        hoursToday = ctrl.computeHoursToday($scope.hours, $scope.alerts);
        expect(hoursToday).toBe('Open today 10am-6pm');
      });

      it('should display hours for tomorrow if no alert data is defined ' +
      'and the branch just closed', function() {
        // Mock time to 8pm
        var todaysDateMock = new Date(2015, 2, 16, 20);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.alerts = null;
        hoursToday = ctrl.computeHoursToday($scope.hours, $scope.alerts);
        expect(hoursToday).toBe('Open tomorrow 10am-8pm');
      });


      it('should display the alert closed_for field if an alert is defined ' +
      'and the branch has opened already (all day)', function() {
        var alerts = {},
          todaysDateMock = new Date(2015, 2, 19, 9);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.alerts = [
          {
            id: 287859,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287859"
            }
            },
            closed_for: "Closed for a special event",
            msg: "<p>The Schomburg Center will be closed Thursday, March 19 for a special event. </p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-19T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            }
          },
          {
            id: 287860,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287860"
            }
            },
            closed_for: "Opening late due to building improvements",
            msg: "<p>The Schomburg Center will open at noon on Friday, March 20 due to building improvements.</p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-21T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-20T10:00:00-04:00",
            end: "2015-03-20T12:00:00-04:00"
            }
          }
        ];

        // Assuming Alerts module has filtered these alerts.
        alerts.current_location = nyplAlertsService.filterAlerts(
          $scope.alerts,
          {scope: 'location', only_closings: 'current'}
        );

        hoursToday = ctrl.computeHoursToday($scope.hours, alerts);
        expect(hoursToday).toBe('Today: Closed for a special event');
      });

      it('should display the alert closed_for field if an alert is defined ' +
      'and the branch has opened already (open late)', function() {
        var alerts = {},
          todaysDateMock = new Date(2015, 2, 20, 10);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.alerts = [
          {
            id: 287859,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287859"
            }
            },
            closed_for: "Closed for a special event",
            msg: "<p>The Schomburg Center will be closed Thursday, March 19 for a special event. </p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-19T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            }
          },
          {
            id: 287860,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287860"
            }
            },
            closed_for: "Opening late due to building improvements",
            msg: "<p>The Schomburg Center will open at noon on Friday, March 20 due to building improvements.</p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-21T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-20T10:00:00-04:00",
            end: "2015-03-20T12:00:00-04:00"
            }
          }
        ];

        // Assuming Alerts module has filtered these alerts.
        alerts.current_location = nyplAlertsService.filterAlerts(
          $scope.alerts,
          {scope: 'location', only_closings: 'current'}
        );
        hoursToday = ctrl.computeHoursToday($scope.hours, alerts);

        expect(hoursToday).toBe('Today: Opening late due to building improvements');
      });

      it('should display the alert closed_for field if an alert is defined ' +
      'and the branch has opened already (early closing)', function() {
        var alerts = {},
          todaysDateMock = new Date(2015, 2, 20, 10);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.alerts = [
          {
            id: 287859,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287859"
            }
            },
            closed_for: "Closed for a special event",
            msg: "<p>The Schomburg Center will be closed Thursday, March 19 for a special event. </p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-19T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            }
          },
          {
            id: 287860,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287860"
            }
            },
            closed_for: "Closing early due to hazardous weather",
            msg: "<p>The Schomburg Center will open at noon on Friday, March 20 due to building improvements.</p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-21T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-20T15:00:00-04:00",
            end: "2015-03-20T18:00:00-04:00"
            }
          }
        ];

        // Assuming Alerts module has filtered these alerts.
        alerts.current_location = nyplAlertsService.filterAlerts(
          $scope.alerts,
          {scope: 'location', only_closings: 'current'}
        );
        hoursToday = ctrl.computeHoursToday($scope.hours, alerts);
        
        expect(hoursToday).toBe('Today: Closing early due to hazardous weather');
      });

      it('should display tomrrow\s alert once the branch has closed ',
      function() {
        var alerts = {},
          todaysDateMock = new Date(2015, 2, 18, 20);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.alerts = [
          {
            id: 287859,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287859"
            }
            },
            closed_for: "Closed for a special event",
            msg: "<p>The Schomburg Center will be closed Thursday, March 19 for a special event. </p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-19T00:00:00-04:00",
            end: "2015-03-20T00:00:00-04:00"
            }
          },
          {
            id: 287860,
            scope: "location",
            _links: {
            self: {
            href: "http://dev.www.aws.nypl.org/node/287860"
            }
            },
            closed_for: "Closing early due to hazardous weather",
            msg: "<p>The Schomburg Center will open at noon on Friday, March 20 due to building improvements.</p>",
            display: {
            start: "2015-03-16T00:00:00-04:00",
            end: "2015-03-21T00:00:00-04:00"
            },
            applies: {
            start: "2015-03-20T15:00:00-04:00",
            end: "2015-03-20T18:00:00-04:00"
            }
          }
        ];

        // Assuming Alerts module has filtered these alerts.
        alerts.all_closings = nyplAlertsService.filterAlerts(
          $scope.alerts,
          {only_closings: 'all'}
        );
        hoursToday = ctrl.computeHoursToday($scope.hours, alerts);

        expect(hoursToday).toBe('Tomorrow: Closed for a special event');
      });
    });
  }) /* End todayshours */

  /*
   * <hours-table hours="" alerts="" location-type=""></hours-table>
   *
   */
  describe('Directive: hoursTable', function () {
    var hoursTable, element, ctrl, $scope;

    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope.$new();

      $scope.hours = [
        {
          day: "Sun",
          open: null,
          close: null
        },
        {
          day: "Mon",
          open: "10:00",
          close: "18:00"
        },
        {
          day: "Tue",
          open: "10:00",
          close: "20:00"
        },
        {
          day: "Wed",
          open: "10:00",
          close: "20:00"
        },
        {
          day: "Thu",
          open: "10:00",
          close: "18:00"
        },
        {
          day: "Fri",
          open: "10:00",
          close: "18:00"
        },
        {
          day: "Sat",
          open: "10:00",
          close: "18:00"
        }
      ];

      $scope.alerts = [
        {
          id: 287859,
          scope: "location",
          _links: {
          self: {
          href: "http://dev.www.aws.nypl.org/node/287859"
          }
          },
          closed_for: "Closed for a special event",
          msg: "<p>The Schomburg Center will be closed Thursday, March 19 for a special event. </p>",
          display: {
          start: "2015-03-16T00:00:00-04:00",
          end: "2015-03-20T00:00:00-04:00"
          },
          applies: {
          start: "2015-03-19T00:00:00-04:00",
          end: "2015-03-20T00:00:00-04:00"
          }
        },
        {
          id: 287860,
          scope: "location",
          _links: {
          self: {
          href: "http://dev.www.aws.nypl.org/node/287860"
          }
          },
          closed_for: "Closing early due to hazardous weather",
          msg: "<p>The Schomburg Center will open at noon on Friday, March 20 due to building improvements.</p>",
          display: {
          start: "2015-03-16T00:00:00-04:00",
          end: "2015-03-21T00:00:00-04:00"
          },
          applies: {
          start: "2015-03-20T15:00:00-04:00",
          end: "2015-03-20T18:00:00-04:00"
          }
        }
      ];

      element = angular.element("<hours-table hours='hours' alerts='alerts' location-type=''></hours-table>");

      hoursTable = $compile(element)($scope);
      $rootScope.$digest();
      ctrl = hoursTable.controller("hoursTable");
      $scope = element.isolateScope() || element.scope();
    }));

    describe('Methods:', function () {
      it('findAlertsInWeek method should be defined', function() {
        expect(ctrl.findAlertsInWeek).toBeDefined();
      });

      it('findAlertsInWeek method should return an new week object ' +
        'with an alert property in each day item where ' +
        'the open and close times are defined.', function() {

        $scope.weekObj = ctrl.findAlertsInWeek($scope.hours, {});
        expect($scope.weekObj[0].alert).not.toBeDefined();
        expect($scope.weekObj[1].alert).toBe(undefined)
      });

      it('findNumAlertsInWeek method should be defined', function() {
        expect(ctrl.findNumAlertsInWeek).toBeDefined();
      });

      it('findNumAlertsInWeek method should be return 0 ' +
        'if no alerts are found during the given week.', function() {
          $scope.weekObj = ctrl.findAlertsInWeek($scope.hours, {});
          $scope.numAlerts = ctrl.findNumAlertsInWeek($scope.weekObj);
          expect($scope.numAlerts).toEqual(0);
      });

      it('findNumAlertsInWeek method should be return a number ' +
        'greater than 0 if alerts are found during the given week.', function() {
          var todaysDateMock = new Date(2015, 2, 18, 20); // March 18th, 2015
            jasmine.clock().mockDate(todaysDateMock);
          $scope.weekObj = ctrl.findAlertsInWeek($scope.hours, $scope.alerts);
          $scope.numAlerts = ctrl.findNumAlertsInWeek($scope.weekObj);
          expect($scope.numAlerts).toBeGreaterThan(0);
      });

      it('isSameDayAlert method should be defined', function() {
        expect(ctrl.isSameDayAlert).toBeDefined();
      });

      it('isSameDayAlert method should return FALSE if the startDay ' +
        'of an alert is not the same as the endDay and if the weekday ' +
        'date is not the same as the startDay and if the current day/time ' +
        'is past the endDay time.', function() {
        var startDay = moment('2015-04-10T10:00:00-04:00'),
          endDay = moment('2015-04-10T15:00:00-04:00'),
          dayOfWeek = moment('2015-04-10'),
          todaysDateMock = new Date(2015, 3, 10, 20); // April 10, 2015 8pm

        //console.log(startDay.format(), endDay.format(), dayOfWeek.format(), todaysDateMock);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.isSameDayAlert = ctrl.isSameDayAlert(startDay, endDay, dayOfWeek);
        expect($scope.isSameDayAlert).toBe(false);
      });

      it('isSameDayAlert method should return TRUE if the startDay ' +
        'of an alert is the same as the endDay and if the weekday ' +
        'date is the same as the startDay and if the current day/time ' +
        'is before the endDay time.', function() {
        var startDay = moment('2015-04-10T10:00:00-04:00'),
          endDay = moment('2015-04-10T15:00:00-04:00'),
          dayOfWeek = moment('2015-04-10'),
          todaysDateMock = new Date(2015, 3, 10, 11); // April 10, 2015 11AM

        //console.log(startDay.format(), endDay.format(), dayOfWeek.format(), todaysDateMock);
        jasmine.clock().mockDate(todaysDateMock);

        $scope.isSameDayAlert = ctrl.isSameDayAlert(startDay, endDay, dayOfWeek);
        expect($scope.isSameDayAlert).toBe(true);
      });

      it('assignDynamicDate method should be defined', function() {
        expect(ctrl.assignDynamicDate).toBeDefined();
      });

      it('assignDynamicDate method should return a date object that ' +
        'matches the day of the week using [0-7] as it\'s index', function() {
        var date,
          date_2,
          index = 1, // 1 represents Monday since Sunday is at index 0
          index_2 = 6; // 6 represents Saturday since Sunday is at index 0

        date = ctrl.assignDynamicDate(index);
        date_2 = ctrl.assignDynamicDate(index_2);
        // First index test
        expect(date).toBeDefined();
        expect(date.day()).toEqual(1);
        expect(date.format('dddd')).toEqual('Monday');
        // Second index test
        expect(date_2).toBeDefined();
        expect(date_2.day()).toEqual(6);
        expect(date_2.format('dddd')).toEqual('Saturday');
      });

      it('assignCurrentDayAlert method should be defined', function() {
        expect(ctrl.assignCurrentDayAlert).toBeDefined();
      });

      it('assignCurrentDayAlert method should return the first matched alert ' +
        'object that is a full-day alert which matches the ' +
        'current day/date of the week', function() {
        var alertDate,
          todaysDateMock = new Date(2015, 2, 19, 20), // March 19th, 2015
          todaysMomentMock = moment(new Date(2015, 2, 19, 11));

        jasmine.clock().mockDate(todaysDateMock);
        $scope.alert = ctrl.assignCurrentDayAlert($scope.alerts, todaysMomentMock);
        alertDate = moment($scope.alert.applies.start);

        expect($scope.alert).toBeDefined();
        expect(alertDate.date()).toEqual(todaysMomentMock.date());
      });

      it('assignCurrentDayAlert method should return the first matched alert ' +
        'object that is a same day alert which matches the ' +
        'current day/date of the week', function() {
        var alertDateStart,
          alertDateEnd,
          todaysDateMock = new Date(2015, 3, 10), // April 10th, 2015
          todaysMomentMock = moment(new Date(2015, 3, 10, 11)),
          alerts = [
            {
              id: 296994,
              scope: "location",
              _links: {
                self: {
                  href: "http://www.nypl.org/node/296994"
                }
              },
              closed_for: "Opening late due to staff training.",
              msg: "<p>All Staten Island locations will open at 3 pm on Friday, April 10 due to a borough-wide staff development and training event.</p>",
              display: {
                start: "2015-04-07T10:00:00-04:00",
                end: "2015-04-10T15:00:00-04:00"
              },
              applies: {
                start: "2015-04-10T10:00:00-04:00",
                end: "2015-04-10T15:00:00-04:00"
              }
            },
            {
              id: 297220,
              scope: "location",
              _links: {
                self: {
                  href: "http://www.nypl.org/node/297220"
                }
              },
              closed_for: "Due to a borough-wide staff event, the library will be open from 3 pm to 5 pm on",
              msg: "<p>Due to a borough-wide staff event, the library will be open from 3 pm to 5 pm on Friday, April 10th. </p>",
              display: {
                start: "2015-04-10T00:00:00-04:00",
                end: "2015-04-11T00:00:00-04:00"
              },
              applies: {
                start: "2015-04-10T00:00:00-04:00",
                end: "2015-04-11T00:00:00-04:00"
              }
            }
          ];

        jasmine.clock().mockDate(todaysDateMock);
        $scope.alert = ctrl.assignCurrentDayAlert(alerts, todaysMomentMock);
        alertDateStart = moment($scope.alert.applies.start);
        alertDateEnd = moment($scope.alert.applies.end);

        expect($scope.alert).toBeDefined();
        expect(alertDateStart.date()).toEqual(todaysMomentMock.date());
        expect(alertDateEnd.date()).toEqual(todaysMomentMock.date());
      });

      it('toggleHoursTable method should be defined', function() {
        expect($scope.toggleHoursTable).toBeDefined();
      });
    });

    describe('Directive with Regular hours, without any closing ' + 
      'alerts for the week',function () {

      it('should compile', function() {
        $scope.hours = {};
        expect(hoursTable.find('.hours-table-wrapper')).toBeTruthy();
        expect(hoursTable.find('.closing-link')).toBeTruthy();
      });
    });
  });

  /*
   * <emailusbutton link="" />
   *   Generates a link to email a librarian.
   */
  describe('Directive: emailusbutton', function () {
    var emailusbutton, template,
      link = 'http://www.questionpoint.org/crs/servlet/org.oclc.' +
      'admin.BuildForm?&institution=10208&type=1&language=1';

    beforeEach(inject(function () {
      scope.link = link;
      template = '<emailusbutton link="{{link}}" />';
      emailusbutton = createDirective(template);
    }));

    it('should compile', function () {
      expect(emailusbutton.find('a').attr('class')).toContain('askemail');
    });

    it('should create a link', function () {
      expect(emailusbutton.find('a').attr('href')).toEqual(link);
      expect(emailusbutton.text().trim()).toEqual('Email us your question');
    });
  });

  /*
   * <librarianchatbutton />
   *   Generates a link element that will create a popup for the NYPL Chat
   *   widget to talk to a librarian.
   */
  describe('Directive: librarianchatbutton', function () {
    var librarianchatbutton, template, nyplUtility;

    beforeEach(inject(function (_nyplUtility_) {
      nyplUtility = _nyplUtility_;
      nyplUtility.popupWindow = jasmine.createSpy('popupWindow');

      template = '<librarianchatbutton />';
      librarianchatbutton = createDirective(template);
    }));

    it('should compile', function () {
      expect(librarianchatbutton.attr('class')).toContain('askchat');
    });

    it('should create a link', function () {
      expect(librarianchatbutton.text().trim())
        .toEqual('Chat with a librarian');
    });

    it('should call the nyplUtility service to open a new window', function () {
      librarianchatbutton.click();

      expect(nyplUtility.popupWindow).toHaveBeenCalledWith(
        'http://www.nypl.org/ask-librarian',
        'NYPL Chat',
        210,
        450
      );
    });

    it('should add an active class when clicked', function () {
      expect(librarianchatbutton.attr('class')).not.toContain('active');

      librarianchatbutton.click();

      expect(librarianchatbutton.attr('class')).toContain('active');
    });
  });

  /*
   * <div scrolltop></div>
   */
  describe('Directive: scrolltop', function () {
    var scrolltop, template, $state;

    beforeEach(inject(function (_$state_) {
      $state = _$state_;
      window.scrollTo = jasmine.createSpy('window.scrollTo');

      template = '<div scrolltop></div>';
      scrolltop = createDirective(template);
    }));

    it('should scroll to the top on state change', function () {
      $state.go('home.map');

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  /*
   * <event-registration how="" link="" registrationopen="" />
   *   Generates a link element that will create a popup for the NYPL Chat
   *   widget to talk to a librarian.
   */
  describe('Directive: eventRegistration', function () {
    var eventRegistration, template;
    beforeEach(function () {
      template = '<event-registration registration="registration" ' +
        'status="status" link="link"></event-registration>';
    });

    describe('No registration object - should not display', function () {
      beforeEach(function () {
        scope.registration = undefined;
        scope.status = undefined;
        scope.link = undefined;
        eventRegistration = createDirective(template);
      });

      it('should not display anything', function () {
        expect(eventRegistration.find('.registration-type').text())
          .toEqual('');
        expect(eventRegistration.find('a').length).toBe(0);
        expect(eventRegistration.find('.event-cancel').text().trim())
            .toEqual('');
      });
    });

    describe('Registration type - First Come, First Served', function () {
      beforeEach(function () {
        scope.registration = {
          "type": "First Come, First Serve",
          "open": "null",
          "start": "null"
        };
        scope.status = {
          "status": true,
          "label": null
        };
        scope.link = "http://www.nypl.org/events/nypl-event";
        eventRegistration = createDirective(template);
      });

      it('should compile', function () {
        expect(eventRegistration.attr('class'))
          .toContain('registration-for-event');
      });

      it('should display the type of registration', function () {
        expect(eventRegistration.find('.registration-type').text())
          .toEqual('First Come, First Serve');
      });

      it('should not have an anchor tag', function () {
        expect(eventRegistration.find('a').length).toBe(0);
      });

      it('should not have any type of registration message', function () {
        expect(eventRegistration.find('.registration-available').text())
          .toEqual('');
      });
    });

    describe('Registration type - Online - event will open in the future',
      function () {
        beforeEach(function () {
          scope.registration = {
            "type": "Online",
            "open": "true",
            "start": "2017-07-29T17:00:00Z"
          };
          scope.status = {
            "status": true,
            "label": null
          };
          scope.link = "http://www.nypl.org/events/nypl-event";
          eventRegistration = createDirective(template);
        });

        it('should compile', function () {
          expect(eventRegistration.attr('class'))
            .toContain('registration-for-event');
        });

        it('should display online registration and open in the future',
          function () {
            expect(eventRegistration.find('.registration-type').text().trim())
              .toEqual('Online, opens 07/29');
          });

        it('should have a link to the event', function () {
          expect(eventRegistration.find('a').attr('href'))
            .toEqual('http://www.nypl.org/events/nypl-event#register');
        });
      });

    describe('Registration type - Online - Canceled',
      function () {
        beforeEach(function () {
          scope.registration = {
            "type": "Online",
            "open": "false",
            "start": "2014-07-29T17:00:00Z",
            "link": "http://www.nypl.org/events/nypl-event"
          };
          scope.status = {
            "status": false,
            "label": "Canceled"
          };
          scope.link = "http://www.nypl.org/events/nypl-event";
          eventRegistration = createDirective(template);
        });

        it('should compile', function () {
          expect(eventRegistration.attr('class'))
            .toContain('registration-for-event');
        });

        it('should not display the type of registration', function () {
          expect(eventRegistration.find('.registration-type').length).toBe(0);
        });

        it('should not have a link to the event', function () {
          expect(eventRegistration.find('a').length).toBe(0);
        });

        it('should display "Canceled"', function () {
          expect(eventRegistration.find('.event-cancel').text().trim())
            .toEqual('CANCELED');
        });
      });
  }); /* End eventRegistration */

  /*
   * <nypl-site-alerts></nypl-site-alerts>
   *   The nyplSiteAlerts directive displays a site-wide alert by checking all
   *   the alerts in the API and checking the current date.
   */
  // describe('Directive: nyplSiteAlerts', function () {
  //   var $httpBackend, date, template, nyplSiteAlerts, $timeout, MockDate, alert;

  //   beforeEach(inject(function (_$httpBackend_, _$timeout_) {
  //     $timeout = _$timeout_;
  //     $httpBackend = _$httpBackend_;
  //   }));

  //   it('should display a current site wide alert', function () {
  //     // Override the date function so we can test a real alert
  //     // Store a copy so we can return the original one later
  //     date = new Date(2014, 5, 29);
  //     MockDate = Date;
  //     Date = function () { return date; };

  //     $httpBackend
  //       .whenJSONP(api + '/' + api_version + '/alerts' + jsonpCallback)
  //       .respond({
  //         alerts: [{
  //           _id: "71579",
  //           scope: "all",
  //           title: "Independence Day",
  //           body: "All units of the NYPL are closed July 4 - July 5.",
  //           start: "2014-06-27T00:00:00-04:00",
  //           end: "2014-07-06T01:00:00-04:00"
  //         }]
  //       });

  //     template = "<nypl-site-alerts></nypl-site-alerts>";
  //     nyplSiteAlerts = createDirective(template);

  //     $timeout.flush();
  //     $httpBackend.flush();

  //     // Currently just using the value in the scope.
  //     alert = scope.sitewidealert;
  //     expect(alert)
  //       .toEqual(['All units of the NYPL are closed July 4 - July 5.']);

  //     // Use the native Date function again
  //     Date = MockDate;
  //   });

  //   it('should not display a site wide alert - future alert', function () {
  //     $httpBackend
  //       .whenJSONP(api + '/' + api_version + '/alerts' + jsonpCallback)
  //       .respond({
  //         alerts: [{
  //           _id: "71579",
  //           scope: "all",
  //           title: "Independence Day",
  //           body: "All units of the NYPL are closed July 4 - July 5.",
  //           start: "2016-06-27T00:00:00-04:00",
  //           end: "2016-07-06T01:00:00-04:00"
  //         }]
  //       });

  //     template = "<nypl-site-alerts></nypl-site-alerts>";
  //     nyplSiteAlerts = createDirective(template);

  //     $timeout.flush();
  //     $httpBackend.flush();

  //     // Currently just using the value in the scope.
  //     alert = scope.sitewidealert;
  //     expect(alert).toEqual([]);
  //   });
  // });

  // /*
  //  * <nypl-library-alert></nypl-library-alert>
  //  *   The nyplLibraryAlert directive displays an alert for a specific location.
  //  */
  // describe('Directive: nyplLibraryAlert', function () {
  //   var nyplLibraryAlert,
  //     template = "<nypl-library-alert exception='exception'>" +
  //         "</nypl-library-alert>";

  //   describe('No alert to display', function () {
  //     it('should not display when there is no alert', function () {
  //       scope.exception = undefined;
  //       nyplLibraryAlert = createDirective(template);

  //       expect(scope.libraryAlert).not.toBeDefined();
  //       expect(nyplLibraryAlert.find('grid').length).toBe(0);
  //       expect(nyplLibraryAlert.find('location-alerts').length).toBe(0);
  //     });

  //     it('should not display an old alert', function () {
  //       scope.exception = {
  //         start: '2014-10-01T00:00:00-04:00',
  //         end: '2014-10-20T16:15:41-04:00',
  //         description: "Test library specific alert"
  //       };
  //       nyplLibraryAlert = createDirective(template);

  //       expect(nyplLibraryAlert.find('grid').length).toBe(0);
  //       expect(nyplLibraryAlert.find('location-alerts').length).toBe(0);
  //     });
  //   });

  //   describe('Alert available', function () {
  //     beforeEach(function () {
  //       scope.exception = {
  //         start: '2014-10-01T00:00:00-04:00',
  //         end: '2016-10-20T16:15:41-04:00',
  //         description: "Test library specific alert"
  //       };
  //       template = "<nypl-library-alert exception='exception'>" +
  //         "</nypl-library-alert>";
  //       nyplLibraryAlert = createDirective(template);
  //     });

  //     // it('should display an alert', function () {
  //     //   Doesn't work because I'm not testing correctly but not sure how.
  //     //   expect(scope.libraryAlert).toEqual("Test library specific alert");
  //     // });
  //   });
  // });

  /*
   * <div class="weekly-hours" collapse="expand" duration="2500"></div>
   *   The collapse directive creates a slide toggle animation for an element.
   */
  describe('Directive: collapse', function () {
    var collapse, template;

    beforeEach(inject(function () {
      template = '<div class="weekly-hours" collapse="expand"></div>';
      collapse = createDirective(template);
    }));

    it('should open and close the element by hiding it', function () {
      // Initially on load it is false and hidden.

      scope.expand = false;
      scope.$digest();

      expect(collapse.attr('class')).not.toContain('open');
      expect(collapse.attr('style')).toEqual('display: none;');

      // When clicked, it slides down.
      scope.expand = true;
      scope.$digest();

      expect(collapse.attr('class')).toContain('open');
      expect(collapse.attr('style')).toContain('display: block;');
    });
  });

  /*
   * <nypl-fundraising fundraising="location.fundraising"></nypl-fundraising>
   */
  describe('Directive: nyplFundraising', function () {
    var nyplFundraising, template, $timeout, nyplLocationsService, $httpBackend;

    beforeEach(
      inject(function (_$timeout_, _nyplLocationsService_, _$httpBackend_, $q) {
        nyplLocationsService = _nyplLocationsService_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;

        spyOn(_nyplLocationsService_, 'getConfig').and.callFake(function () {
          var deferred = $q.defer();
          deferred.resolve({config: {fundraising: {
            appeal: 'Friends of the Library can support their favorite ' +
              'library and receive great benefits!',
            statement: 'Become a Member',
            button_label: 'Join or Renew',
          }}});
          return deferred.promise;
        });
      })
    );

    describe('Add appeal object', function () {
      beforeEach(function () {
        scope.fundraising = {
          appeal: 'Added appeal',
          statement: 'Added statement',
          button_label: 'Added button label',
        };

        template = '<nypl-fundraising fundraising="fundraising">' +
          '</nypl-fundraising>';
        nyplFundraising = createDirective(template);
        // $timeout.flush();
      });

      it('should get fundraising object from the config', function () {
        expect(scope.fundraising.appeal).toEqual('Added appeal');
        expect(scope.fundraising.statement).toEqual('Added statement');
        expect(scope.fundraising.button_label).toEqual('Added button label');
      });
    });

    describe('Use default appeal', function () {
      beforeEach(function () {
        scope.fundraising = undefined;

        template = '<nypl-fundraising fundraising="fundraising">' +
          '</nypl-fundraising>';
        nyplFundraising = createDirective(template);
      });

      // it('should get fundraising object from the config', function () {
      //   $timeout.flush();
      //   expect(scope.fundraising.appeal).toEqual('Friends of the Library ' +
      //     'can support their favorite library and receive great benefits!');
      //   expect(scope.fundraising.statement).toEqual('Become a Member');
      //   expect(scope.fundraising.button_label).toEqual('Join or Renew');
      // });
    });

  });

  /*
   * <nypl-sidebar donate-button="" nypl-ask="" donateurl=""><nypl-sidebar>
   * The nyplSidebar directive generates a donate button when set to `true`,
   * a askNYPL container holding chat and email links when set to `true` and
   * an optional donateurl which, will default to a convio global url if
   * not set in the params.
   */
  describe('Directive: nyplSidebar', function () {
    var template, nyplSidebar;
    // All settings configured
    describe('nyplSidebar with all settings', function () {

      beforeEach(inject(function () {
        template = '<nypl-sidebar donate-button="true" ' +
          'nypl-ask="true" donateurl="http://nypl.org">' +
          '</nypl-sidebar>';
        nyplSidebar = createDirective(template);
      }));

      it('should compile', function () {
        expect(nyplSidebar.attr('class'))
          .toContain('nypl-sidebar');
      });

      it('should compile a donate-widget', function () {
        expect(nyplSidebar.find('.donate-widget')).toBeTruthy();
        expect(nyplSidebar.find('.donate-widget').length).toBe(1);
      });
      it('should compile a nyplAsk-widget', function () {
        expect(nyplSidebar.find('.nypl-ask-widget')).toBeTruthy();
        expect(nyplSidebar.find('.nypl-ask-widget').length).toBe(1);
      });

      it('should set `donate-url` to value passed in template', function () {
        var donateUrl = nyplSidebar.find('.btn--donate');
        expect(donateUrl.attr('href')).toContain('nypl.org');
        expect(donateUrl.length).toBe(1);
      });
    });
    // No settings configured
    describe('nyplSidebar NO settings', function () {

      beforeEach(inject(function () {
        template = '<nypl-sidebar></nypl-sidebar>';
        nyplSidebar = createDirective(template);
      }));

      it('should compile', function () {
        expect(nyplSidebar.attr('class'))
          .toContain('nypl-sidebar');
      });

      it('should NOT compile donate-widget', function () {
        expect(nyplSidebar.find('.donate-widget').length).toBe(0);
      });

      it('should NOT compile nyplAsk-widget', function () {
        expect(nyplSidebar.find('.nypl-ask-widget').length).toBe(0);
      });

      it('should set NOT create `donateurl` since donate-widget is not set',
        function () {
          var donateUrl = nyplSidebar.find('.btn--donate');
          expect(donateUrl.length).toBe(0);
        });
    });

    // No donateUrl set
    describe('nyplSidebar donate and nyplAsk active, no donateurl',
      function () {
        beforeEach(inject(function () {
          template = '<nypl-sidebar donate-button="true" ' +
            'nypl-ask="true"></nypl-sidebar>';
          nyplSidebar = createDirective(template);
        }));

        it('should compile a donate-widget', function () {
          expect(nyplSidebar.find('.donate-widget')).toBeTruthy();
          expect(nyplSidebar.find('.donate-widget').length).toBe(1);
        });

        it('should compile a nyplAsk-widget', function () {
          expect(nyplSidebar.find('.nypl-ask-widget')).toBeTruthy();
          expect(nyplSidebar.find('.nypl-ask-widget').length).toBe(1);
        });

        it('should set `donate-url` to default convio link', function () {
          var donateUrl = nyplSidebar.find('.btn--donate');
          expect(donateUrl.attr('href')).toContain('convio');
          expect(donateUrl.length).toBe(1);
        });
      });
  });

  /*
   * <nypl-foot></nypl-footer>
   */
  describe('Directive: nyplFooter', function () {
    var nyplFooter, template, $httpBackend;

    beforeEach(inject(function (_$httpBackend_) {
      $httpBackend = _$httpBackend_;

      template = '<nypl-footer></nypl-footer>';
      nyplFooter = createDirective(template);
    }));

    it('should compile', function () {
      expect(nyplFooter.find('.copyright').length).toBe(1);
      expect(nyplFooter.find('.footerlinks ul').length).toBe(4);
    });

    it('should trigger click', function () {
      nyplFooter.find('.footerlinks a').click();
    });
  });


  /*
   * <nypl-autofill></nypl-autofill>
   */
  describe('Directive: nyplAutofill', function () {
    var autofill, element, ctrl, $scope;

    beforeEach(inject(function ($rootScope, $compile) {
      $scope = $rootScope.$new();
      element = angular.element("<nypl-autofill data='locations'" +
        " data-ng-model='searchTerm'" +
        " map-view='viewMapLibrary(slug)'" +
        " geo-search='geocodeAddress(term)'>" +
        "</nypl-autofill>");

      autofill = $compile(element)($scope);
      $rootScope.$digest();
      ctrl = autofill.controller("nyplAutofill");
      $scope = element.isolateScope() || element.scope();
    }));

    it('should compile lookahead and autofill containers', function () {
      expect(autofill.find('.lookahead')).toBeTruthy();
      expect(autofill.find('.autofill-container')).toBeTruthy();
    });

    describe('Controller Methods: ', function () {

      it('openAutofill() method should be defined', function () {
        expect(ctrl.openAutofill).toBeDefined();
      });

      it('openAutofill() method should set $scope.focused to be true',
        function () {
          $scope.focused = false;
          ctrl.openAutofill();
          expect($scope.focused).toBeTruthy();
        });

      it('closeAutofill() method should be defined', function () {
        expect(ctrl.closeAutofill).toBeDefined();
      });

      it('closeAutofill() method should set $scope.focused to be false',
        function () {
          $scope.focused = true;
          ctrl.closeAutofill();
          expect($scope.focused).toBeFalsy();
        });

      it('resetSearchTerms() method should be defined', function () {
        expect(ctrl.resetSearchTerms).toBeDefined();
      });

      it('resetSearchTerms() method should set $scope.lookahead' +
        ' and $scope.currentWord to empty strings', function () {
          $scope.lookahead = 'lookahead string';
          $scope.currentWord = 'currentWord string';
          ctrl.resetSearchTerms();
          expect($scope.lookahead).toEqual('');
          expect($scope.lookahead).toBeDefined();
          expect($scope.currentWord).toEqual('');
          expect($scope.currentWord).toBeDefined();
        });

      it('activate() method should be defined', function () {
        expect(ctrl.activate).toBeDefined();
      });

      it('activate() method should return the active item passed', function () {
        $scope.active = undefined;
        var item = {
          id: "HG",
          name: "Hamilton Grange Library",
          open: true,
          postal_code: 10031,
          region: "NY",
          slug: "hamilton-grange"
        };
        $scope.active = ctrl.activate(item);
        expect($scope.active).toEqual(item);
      });

      it('activateFirstItem() method should be defined', function () {
        expect(ctrl.activateFirstItem).toBeDefined();
      });

      it('activateFirstItem() method should assign the first item as ' +
        'the active item and set $scope.activated to be true', function () {
          $scope.activated = false;
          $scope.active = undefined;
          $scope.currentIndex = undefined;
          $scope.filtered = [
            {id: "BAR", name: "Baychester Library", _links: {}},
            {id: "CHR", name: "Chatham Square Library", _links: {}},
            {id: "CI", name: "City Island Library", _links: {}},
            {id: "DH", name: "Dongan Hills Library", _links: {}}
          ];

          ctrl.activateFirstItem();
          expect($scope.activated).toBeTruthy();
          expect($scope.active).toEqual($scope.filtered[0]);
          expect($scope.currentIndex)
            .toEqual($scope.filtered.indexOf($scope.active));
        });

      it('activateGeocodingItem() method should be defined', function () {
        expect(ctrl.activateGeocodingItem).toBeDefined();
      });

      it('activateGeocodingItem() method should assign the current ' +
        'scope.model value as the active item within the drop-down list; ' +
        'only if the user has activated the drop-down via up/down arrow keys',
        function () {
          $scope.activated = true; // User initialized via key press
          $scope.active = undefined; // No active item past the location list
          $scope.geocodingactive = false;
          $scope.model = 'Grand Central';

          ctrl.activateGeocodingItem();
          expect($scope.geocodingactive).toBeTruthy();
          expect($scope.active).toEqual($scope.model);
        });

      it('activateNextItem() method should be defined', function () {
        expect(ctrl.activateNextItem).toBeDefined();
      });

      it('activateNextItem() method should check if the geocodingactive ' +
        'boolean item is active and sets it to false', function () {
          $scope.geocodingactive = true;
          ctrl.activateNextItem();
          expect($scope.geocodingactive).toBeFalsy();
        });

      it('activateNextItem() method should increase the current index of ' +
        'the locations array and activates the next item in the list. Once ' +
        'outside of the length of the list the active.item is assigned ' +
        'as undefined',
        function () {
          $scope.currentIndex = 0;
          $scope.filtered = [
            {id: "BAR", name: "Baychester Library", _links: {}},
            {id: "CHR", name: "Chatham Square Library", _links: {}},
            {id: "CI", name: "City Island Library", _links: {}},
            {id: "DH", name: "Dongan Hills Library", _links: {}}
          ];
          $scope.active = $scope.filtered[0];

          ctrl.activateNextItem(); // Increase from initial element in array
          expect($scope.currentIndex).toEqual(1);
          expect($scope.active).toEqual($scope.filtered[1]);
          ctrl.activateNextItem(); // Second increase by arrow-down key
          expect($scope.currentIndex).toEqual(2);
          expect($scope.active).toEqual($scope.filtered[2]);
        });

      it('activateNextItem() method should set the active element to ' +
        'undefined if the index of the array of locations goes out of bounds',
        function () {
          $scope.currentIndex = 4; //Current length of list
          $scope.filtered = [
            {id: "BAR", name: "Baychester Library", _links: {}},
            {id: "CHR", name: "Chatham Square Library", _links: {}},
            {id: "CI", name: "City Island Library", _links: {}},
            {id: "DH", name: "Dongan Hills Library", _links: {}}
          ];
          $scope.active = $scope.filtered[3];

          ctrl.activateNextItem();
          expect($scope.currentIndex).toEqual(-1);
          expect($scope.active).toBeUndefined();
        });

      it('activatePreviousItem() method should be defined', function () {
        expect(ctrl.activatePreviousItem).toBeDefined();
      });

      it('activatePreviousItem() method should decrease the currentIndex ' +
        'value by 1 and assign the active item to that index value in the ' +
        'locations array', function () {
          $scope.currentIndex = 3;
          $scope.filtered = [
            {id: "BAR", name: "Baychester Library", _links: {}},
            {id: "CHR", name: "Chatham Square Library", _links: {}},
            {id: "CI", name: "City Island Library", _links: {}},
            {id: "DH", name: "Dongan Hills Library", _links: {}}
          ];
          $scope.active = $scope.filtered[3];

          ctrl.activatePreviousItem();
          expect($scope.currentIndex).toEqual(2);
          expect($scope.active).toEqual($scope.filtered[2]);
        });

      it('activatePreviousItem() method should decrease the currentIndex ' +
        'value by 1 and assign the active item to that index value in the ' +
        'locations array', function () {
          $scope.currentIndex = 3;
          $scope.filtered = [
            {id: "BAR", name: "Baychester Library", _links: {}},
            {id: "CHR", name: "Chatham Square Library", _links: {}},
            {id: "CI", name: "City Island Library", _links: {}},
            {id: "DH", name: "Dongan Hills Library", _links: {}}
          ];
          $scope.active = $scope.filtered[3];

          ctrl.activatePreviousItem();
          expect($scope.currentIndex).toEqual(2);
          expect($scope.active).toEqual($scope.filtered[2]);
          ctrl.activatePreviousItem();
          expect($scope.currentIndex).toEqual(1);
          expect($scope.active).toEqual($scope.filtered[1]);
        });

      it('setSearchText() method should be defined', function () {
        expect(ctrl.setSearchText).toBeDefined();
      });

      it('setSearchText() method should update the scope.model ' +
        'variable if a match is found within the location data.' +
        ' The scope.model and matched word must not be equal.', function () {
          expect(ctrl.setSearchText).toBeDefined();
          $scope.model = 'Grand';
          $scope.completeWord = 'Grand Central Library';

          ctrl.setSearchText($scope.model);
          expect($scope.model).toEqual($scope.completeWord);
        });

      it('setSearchText() method should not update the scope.model if the ' +
        'currentWord is empty', function () {
          $scope.model = 'Grand Central';
          $scope.completeWord = '';

          ctrl.setSearchText($scope.model);
          expect($scope.model).not.toEqual($scope.completeWord);
        });

      it('setSearchText() method should return if the ' +
        'scope.model is empty', function () {
          $scope.model = '';
          $scope.completeWord = 'Grand Central';

          ctrl.setSearchText($scope.model);
          expect($scope.model).not.toEqual($scope.completeWord);
          expect($scope.model).toBe('');
        });

      it('updateSearchText() method should be defined', function () {
        expect(ctrl.updateSearchText).toBeDefined();
      });

      it('updateSearchText() method should not assign items to both ' +
        'scope.filtered and scope.items if invalid/empty data is passed',
        function () {
          var data, searchTerm = null;
          $scope.items = undefined;
          $scope.filtered = undefined;

          ctrl.updateSearchText(data, searchTerm);
          expect($scope.items).toBeUndefined();
          expect($scope.filtered).toBeUndefined();
        });

      it('updateSearchText() method should assign items to both ' +
        'scope.filtered and scope.items if valid data is passed', function () {
          $scope.items = undefined;
          $scope.filtered = undefined;

          var searchTerm = 'Baychester',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}},
              {id: "CHR", name: "Chatham Square Library", _links: {}},
              {id: "CI", name: "City Island Library", _links: {}},
              {id: "DH", name: "Dongan Hills Library", _links: {}}
            ];

          ctrl.updateSearchText(data, searchTerm);
          expect($scope.items).toBeDefined();
          expect($scope.filtered).toBeDefined();
        });

      it('updateSearchText() method should assign items to both ' +
        'scope.filtered and scope.items if valid data is passed and the ' +
        'searchTerm length is greater than 1', function () {
          $scope.items = undefined;
          $scope.filtered = undefined;

          var searchTerm = 'Ba',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}},
              {id: "CHR", name: "Chatham Square Library", _links: {}},
              {id: "CI", name: "City Island Library", _links: {}},
              {id: "DH", name: "Dongan Hills Library", _links: {}}
            ];

          ctrl.updateSearchText(data, searchTerm);
          expect($scope.items).toBeDefined();
          expect($scope.filtered).toBeDefined();
        });

      it('updateSearchText() method should match Baychester Library and ' +
        'assign it as the scope.completeWord', function () {
          var searchTerm = 'Ba',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}},
              {id: "CHR", name: "Chatham Square Library", _links: {}},
              {id: "CI", name: "City Island Library", _links: {}},
              {id: "DH", name: "Dongan Hills Library", _links: {}}
            ];
          $scope.completeWord = undefined;

          ctrl.updateSearchText(data, searchTerm);
          expect($scope.completeWord).toBe('Baychester Library');
        });

      it('updateSearchText() method should find no match for searchTerm ' +
        'Grand and therefore scope.lookahead, scope.currentWord and ' +
        'scope.completeWord will return empty', function () {
          var searchTerm = 'Grand',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}},
              {id: "CHR", name: "Chatham Square Library", _links: {}},
              {id: "CI", name: "City Island Library", _links: {}},
              {id: "DH", name: "Dongan Hills Library", _links: {}}
            ];
          $scope.completeWord = undefined;
          $scope.currentWord = undefined;
          $scope.lookahead = undefined;

          ctrl.updateSearchText(data, searchTerm);
          expect($scope.completeWord).toBe('');
          expect($scope.currentWord).toBe('');
          expect($scope.lookahead).toBe('');
        });

      it('filterStartsWith() method should be defined', function () {
        expect(ctrl.filterStartsWith).toBeDefined();
      });

      it('filterStartsWith() method return a list of matches' +
        'based on the beginning of the string', function () {
          var searchTerm = 'Bay',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}},
              {id: "CHR", name: "Chatham Square Library", _links: {}},
              {id: "CI", name: "City Island Library", _links: {}},
              {id: "DH", name: "Dongan Hills Library", _links: {}}
            ];

          $scope.items = ctrl.filterStartsWith(data, searchTerm);

          expect($scope.items).toBeDefined();
          expect($scope.items[0].name).toBe('Baychester Library');
        });

      it('filterStartsWith() method return empty if no match is found. ' +
        'Matching is based on the beginning of the string', function () {
          var searchTerm = 'Grand',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}},
              {id: "CHR", name: "Chatham Square Library", _links: {}},
              {id: "CI", name: "City Island Library", _links: {}},
              {id: "DH", name: "Dongan Hills Library", _links: {}}
            ];

          $scope.items = ctrl.filterStartsWith(data, searchTerm);

          expect($scope.items).toBeDefined();
          expect($scope.items.length).toBe(0);
          expect($scope.items[0]).toBeUndefined();
        });

      it('filterStartsWith() method should return if the NAME property ' +
        'is not defined within the data object', function () {
          var searchTerm = 'Lib',
            data = [
              {id: "BAR", _links: {}},
              {id: "CHR", _links: {}},
              {id: "CI", _links: {}},
              {id: "DH", _links: {}}
            ];

          $scope.items = ctrl.filterStartsWith(data, searchTerm);
          expect($scope.items).toBeDefined();
          expect($scope.items).toEqual([]);
        });

      it('filterTermWitin() method should be defined', function () {
        expect(ctrl.filterTermWithin).toBeDefined();
      });

      it('filterTermWitin() method should return a list of matches based ' +
        'on matching the searchTerm anywhere within the string ' +
        'with the name property set as the property param.', function () {
          var searchTerm = 'Lib',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}},
              {id: "CHR", name: "Chatham Square Library", _links: {}},
              {id: "CI", name: "City Island Library", _links: {}},
              {id: "DH", name: "Dongan Hills Library", _links: {}}
            ];

          $scope.filtered = ctrl.filterTermWithin(data, searchTerm, 'name');
          expect($scope.filtered).toBeDefined();
          expect($scope.filtered).toEqual(data);
        });

      it('filterTermWitin() method should return a list of matches based ' +
        'on matching the searchTerm anywhere within the string ' +
        'with the id property set as the property param.', function () {
          var searchTerm = '!bar',
            data = [
              {id: "BAR", name: "Baychester Library", _links: {}}
            ];

          $scope.filtered = ctrl.filterTermWithin(data, searchTerm, 'id');
          expect($scope.filtered).toBeDefined();
          expect($scope.filtered).toEqual(data);
        });

      it('filterTermWitin() method should return if the NAME property ' +
        'is not defined within the data object', function () {
          var searchTerm = 'Lib',
            data = [
              {id: "BAR", _links: {}},
              {id: "CHR", _links: {}},
              {id: "CI", _links: {}},
              {id: "DH", _links: {}}
            ];

          $scope.filtered = ctrl.filterTermWithin(data, searchTerm);
          expect($scope.filtered).toBeDefined();
          expect($scope.filtered).toEqual([]);
        });

    });

  });

});