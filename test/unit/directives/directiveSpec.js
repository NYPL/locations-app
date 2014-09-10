/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

/*
 * Tests for AngularJS Directives.
 */
describe('NYPL Directive Unit Tests', function () {
  'use strict';

  var httpBackend, compile, scope,
    api = 'http://evening-mesa-7447-160.herokuapp.com',
    jsonpCallback = '?callback=JSON_CALLBACK';

  beforeEach(function () {
    module('nypl_locations');
    module('directiveTemplates');
    inject(function (_$httpBackend_, _$compile_, _$rootScope_) {
      httpBackend = _$httpBackend_;
      compile = _$compile_;
      scope = _$rootScope_.$new();

      httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
    });
  });

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
      template = '<div id="loadingWidget" loading-widget>' +
        '<div class="loader-icon icon-spinner2"></div></div>';
      loadingWidget = createDirective(template);
    }));

    it('should compile', function () {
      expect(loadingWidget.attr('id')).toEqual('loadingWidget');
    });
  });

  /*
   * <nypl-translate><nypl-translate>
   *   The nyplTranslate directive displays a simple list
   *   of languages that the site can be translated into.
   */
  describe('Directive: nyplTranslate', function () {
    var nyplTranslate, template;

    beforeEach(inject(function () {
      template = '<nypl-translate></nypl-translate>';
      nyplTranslate = createDirective(template);
    }));

    it('should have a translate class', function () {
      expect(nyplTranslate.attr('class')).toContain('translate');
    });

    // At the time of writing this test, we only have two languages
    it('should have two spans elements', function () {
      expect(nyplTranslate.find('span').length).toBe(2);
    });
  });

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
    var todayshours, template, timeElement;
    beforeEach(function () {
      scope.hoursToday = {
        'today': {'open': '10:00', 'close': '18:00'},
        'tomorrow': {'open': '10:00', 'close': '18:00'}
      };
    });

    it('should tell you "Open today until ..." with short filter format',
      function () {
        // Returns 12 for 12pm when a library is open.
        Date.prototype.getHours = function () { return 12; };

        // hoursToday scope variable is initialized in the beforeEach above
        template = '<todayshours class="grid__item one-whole" ' +
          'hours="{{hoursToday | hoursTodayFormat:\'short\'}}" />';
        todayshours = createDirective(template);

        timeElement = todayshours.find('time');

        expect(todayshours.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open today until 6pm');
      });

    it('should tell you "Open today ..." with long filter format',
      function () {
        // Returns 12 for 12pm when a library is open.
        Date.prototype.getHours = function () { return 12; };

        template = '<todayshours class="grid__item one-whole" ' +
          'hours="{{hoursToday | hoursTodayFormat:\'long\'}}" />';
        todayshours = createDirective(template);

        timeElement = todayshours.find('time');

        expect(todayshours.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open today 10am-6pm');
      });

    it('should tell you "Open tomorrow ..." when checking at night',
      function () {
        // Returns 19 for 7pm after a library has closed.
        Date.prototype.getHours = function () { return 19; };

        template = '<todayshours class="grid__item one-whole" ' +
          'hours="{{hoursToday | hoursTodayFormat:\'short\'}}" />';
        todayshours = createDirective(template);

        timeElement = todayshours.find('time');

        expect(todayshours.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open tomorrow 10am-6pm');
      });

    it('should tell you "Open today ..." when checking in the morning',
      function () {
        // Returns 7 for 7am before a library has opened.
        Date.prototype.getHours = function () { return 7; };

        template = '<todayshours class="grid__item one-whole" ' +
          'hours="{{hoursToday | hoursTodayFormat:\'short\'}}" />';
        todayshours = createDirective(template);

        timeElement = todayshours.find('time');

        expect(todayshours.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open today 10am-6pm');
      });
  }); /* End todayshours */

  /*
   * <nyplbreadcrumbs></nyplbreadcrumbs>
   */
  describe('Directive: nyplbreadcrumbs', function () {
    var nyplbreadcrumbs, html;

    beforeEach(inject(function () {
      html = '<nypl-breadcrumbs crumb-name="data.crumbName"></nypl-breadcrumbs>';
      nyplbreadcrumbs = createDirective(html);
    }));

    it('should create an unordered list with class breadcrumb', function () {
      var crumbList = nyplbreadcrumbs.find('ul');
      expect(crumbList.attr('class')).toContain('breadcrumb');
    });

    it('should contain attribute "crumb-name"', function () {
      expect(nyplbreadcrumbs.attr('crumb-name')).toBeTruthy();
    });

    it('should contain attribute "crumb-name" value to be "data.crumbName"', function () {
      expect(nyplbreadcrumbs.attr('crumb-name')).toBe('data.crumbName');
    });

    it('should create an empty breadcrumbs scope array element', function () {
      var isoScope = nyplbreadcrumbs.isolateScope();
      expect(isoScope.breadcrumbs.length).toBeLessThan(1);
    });

    it('once a Crumb is inserted, it should add elements to breadcrumbs array', function () {
      var isoScope = nyplbreadcrumbs.isolateScope();

      isoScope.breadcrumbs.push({
        displayName: 'Amenities',
        route: 'amenities'
      });
      expect(isoScope.breadcrumbs.length).toBeGreaterThan(0);
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
      expect(emailusbutton.attr('class')).toContain('askemail');
    });

    it('should create a link', function () {
      expect(emailusbutton.attr('href')).toEqual(link);
      expect(emailusbutton.text()).toEqual('Email us your question');
    });
  });

  /*
   * <librarianchatbutton />
   *   Generates a link element that will create a popup for the NYPL Chat
   *   widget to talk to a librarian.
   */
  describe('Directive: librarianchatbutton', function () {
    var librarianchatbutton, template;

    beforeEach(inject(function () {
      template = '<librarianchatbutton />';
      librarianchatbutton = createDirective(template);
    }));

    it('should compile', function () {
      expect(librarianchatbutton.attr('class')).toContain('askchat');
    });

    it('should create a link', function () {
      expect(librarianchatbutton.text()).toEqual('Chat with a librarian');
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
      template = '<event-registration registration="{{registration}}" ' +
        'type="{{registration.type}}" open="{{registration.open}}" ' +
        'start="{{registation.start}}" link="{{registration.link}}">' +
        '</event-registration>';
    });

    describe('Registration type - First Come, First Served', function () {
      beforeEach(function () {
        scope.registration = {
          "type": "First Come, First Serve",
          "open": "null",
          "start": "null",
          "link": "http://www.nypl.org/events/nypl-event"
        }
        eventRegistration = createDirective(template);
      });

      it('should compile', function () {
        expect(eventRegistration.attr('class'))
          .toContain('registration-for-event');
      });

      it('should display the type of registration', function () {
        expect(eventRegistration.find('.registration_type').text())
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
            "start": "2014-07-29T17:00:00Z",
            "link": "http://www.nypl.org/events/nypl-event"
          }
          eventRegistration = createDirective(template);
        });

        it('should compile', function () {
          expect(eventRegistration.attr('class'))
            .toContain('registration-for-event');
        });

        it('should display the type of registration', function () {
          expect(eventRegistration.find('.registration_type').text().trim())
            .toEqual('Online');
        });

        it('should have a link to the event', function () {
          expect(eventRegistration.find('a').attr('href'))
            .toEqual('http://www.nypl.org/events/nypl-event');
        });

        it('should tell you when registration opens', function () {
          // Override the date function so we can test the wording
          var date = new Date(2014, 8, 7),
            MockDate = Date;
          Date = function () { return date; };

          expect(
            eventRegistration.find('.registration-available').text().trim()
          ).toEqual('Registration opens on August 29, 2014 - 7:00AM');

          Date = MockDate;
        });
      });

    describe('Registration type - Online - registration is closed',
      function () {
        beforeEach(function () {
          scope.registration = {
            "type": "Online",
            "open": "false",
            "start": "2014-07-29T17:00:00Z",
            "link": "http://www.nypl.org/events/nypl-event"
          }  
          eventRegistration = createDirective(template);
        });

        it('should compile', function () {
          expect(eventRegistration.attr('class'))
            .toContain('registration-for-event');
        });

        it('should display the type of registration', function () {
          expect(eventRegistration.find('.registration_type').text().trim())
            .toEqual('Online');
        });

        it('should have a link to the event', function () {
          expect(eventRegistration.find('a').attr('href'))
            .toEqual('http://www.nypl.org/events/nypl-event');
        });

        it('should tell you when registration opens', function () {
          // Override the date function so we can test the wording
          var date = new Date(2014, 8, 7),
            MockDate = Date;
          Date = function () { return date; };

          expect(
            eventRegistration.find('.registration-available').text().trim()
          ).toEqual('Registration for this event is closed.');

          Date = MockDate;
        });
      });
  }); /* End eventRegistration */

  /*
   * <nypl-site-alerts></nypl-site-alerts>
   *   The nyplSiteAlerts directive displays a site-wide alert by checking all
   *   the alerts in the API and checking the current date.
   */
  describe('Directive: nyplSiteAlerts', function () {
    var $httpBackend, date, template, nyplSiteAlerts;

    beforeEach(inject(function (_$httpBackend_) {
      $httpBackend = _$httpBackend_;

      $httpBackend
        .whenJSONP(api + '/alerts' + jsonpCallback)
        .respond({
          alerts: [{
            _id: "71579",
            scope: "all",
            title: "Independence Day",
            body: "All units of the NYPL are closed July 4 - July 5.",
            start: "2014-06-27T00:00:00-04:00",
            end: "2014-07-06T01:00:00-04:00"
          }]
        });

      template = "<nypl-site-alerts></nypl-site-alerts>";
      nyplSiteAlerts = createDirective(template);
    }));

    it('should display a site wide alert', function () {
      var MockDate, alert;

      // Override the date function so we can test a real alert
      // Store a copy so we can return the original one later
      date = new Date(2014, 5, 29);
      MockDate = Date;
      Date = function () { return date; };

      $httpBackend.flush();
      // scope.$digest();

      // For whatever reason, the sitewidealert doesn't get generated
      // in time for the $compile function to write it and for the data-ng-if
      // to verify that the value is there.
      // console.log(element);

      // Currently just using the value in the scope.
      alert = scope.sitewidealert;
      expect(alert)
        .toEqual('All units of the NYPL are closed July 4 - July 5.\n');

      // Use the native Date function again
      Date = MockDate;
    });
  });

  /*
   * <nypl-library-alert></nypl-library-alert>
   *   The nyplLibraryAlert directive displays an alert for a specific location.
   */
  describe('Directive: nyplLibraryAlert', function () {
    var nyplLibraryAlert, template;

    beforeEach(inject(function () {
      scope.libraryAlert = "Test library specific alert";

      template = "<nypl-library-alert></nypl-library-alert>";
      nyplLibraryAlert = createDirective(template);
    }));

    it('should display a site wide alert', function () {
      var date, MockDate;

      // Override the date function so we can test a real alert
      // Store a copy so we can return the original one later
      date = new Date(2014, 5, 29);
      MockDate = Date;
      Date = function () { return date; };

      // Not sure how to test since it requires libraryAlert variable to be in
      // the scope for the directive. Doesn't seem to work if it's assigned
      // to the $rootScope, however.
      // console.log($rootScope);

      // Use the native Date function again
      Date = MockDate;
    });
  });

  /*
   * <div class="weekly-hours" collapse="expand" duration="2500"></div>
   *   The collapse directive creates a slide toggle animation for an element.
   */
  describe('Directive: collapse', function () {
    var collapse, template;

    beforeEach(inject(function () {
      template = '<div class="weekly-hours" collapse="expand" ' +
        'duration="2500"></div>';
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
   * <nypl-sidebar donate-button="" nypl-ask="" donateurl=""><nypl-sidebar>
   * The nyplSidebar directive generates a donate button when set to `true`,
   * a askNYPL container holding chat and email links when set to `true` and
   * an optional donateurl which, will default to a convio global url if
   * not set in the params.
   */
  describe('Directive: nyplSidebar', function () {
    var template, nyplSidebar;
    // All settings configured
    describe('nyplSidebar with all settings', function (){

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

      it('should set `donate-url` to value passed in template', function (){
        var donateUrl = nyplSidebar.find('.btn--donate');
        expect(donateUrl.attr('href')).toContain('nypl.org');
        expect(donateUrl.length).toBe(1);
      });
    });
    // No settings configured
    describe('nyplSidebar NO settings', function (){

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

      it('should set NOT create `donateurl` since donate-widget is not set', function (){
        var donateUrl = nyplSidebar.find('.btn--donate');
        expect(donateUrl.length).toBe(0);
      });
    });

    // No donateUrl set
    describe('nyplSidebar donate and nyplAsk active, no donateurl', function (){

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

      it('should set `donate-url` to default convio link', function (){
        var donateUrl = nyplSidebar.find('.btn--donate');
        expect(donateUrl.attr('href')).toContain('convio');
        expect(donateUrl.length).toBe(1);
      });
    });
  });

});