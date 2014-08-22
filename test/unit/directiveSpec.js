/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

/*
 * Tests for AngularJS Directives.
 */
describe('NYPL Directive Tests', function () {
  'use strict';

  var element, $compile, $rootScope, timeElement, httpBackend;

  beforeEach(module('nypl_locations'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_) {
    httpBackend = _$httpBackend_;

    httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
  }));

  /*
   * <div loading-widget></div>
   *   The loadingWidget directive is markup that displays before
   *   an http request is fulfilled, in this case showing a spinner.
   */
  describe('loadingWidget', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should compile', function () {
      element = angular.element('<div id="loadingWidget" loading-widget>' +
        '<div class="loader-icon icon-spinner2"></div></div>');
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(element.attr('id')).toEqual('loadingWidget');
    });
  });

  /*
   * <nypl-translate><nypl-translate>
   *   The nyplTranslate directive displays a simple list
   *   of languages that the site can be translated into.
   */
  describe('nyplTranslate', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<nypl-translate></nypl-translate>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should have a translate class', function () {
      expect(element.attr('class')).toContain('translate');
    });

    // At the time of writing this test, we only have two languages
    it('should have two spans elements', function () {
      expect(element.find('span').length).toBe(2);
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
  describe('todayshours', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should tell you "Open today until ..." with short filter format',
      function () {
        // Returns 12 for 12pm when a library is open.
        Date.prototype.getHours = function () { return 12; };

        element = angular.element('<todayshours class="' +
          'grid__item one-whole " hours="{{{\'today\':' +
          '{\'open\': \'10:00\', \'close\': \'18:00\'},' +
          '\'tomorrow\':{\'open\': \'10:00\', \'close\': \'18:00\'} }' +
          '| hoursTodayFormat:\'short\'}}" />');
        $compile(element)($rootScope);
        $rootScope.$digest();

        timeElement = element.find('time');

        expect(element.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open today until 6pm');
      });

    it('should tell you "Open today ..." with long filter format',
      function () {
        // Returns 12 for 12pm when a library is open.
        Date.prototype.getHours = function () { return 12; };

        element = angular.element('<todayshours class="' +
          'grid__item one-whole " hours="{{{\'today\':' +
          '{\'open\': \'10:00\', \'close\': \'18:00\'},' +
          '\'tomorrow\':{\'open\': \'10:00\', \'close\': \'18:00\'} }' +
          '| hoursTodayFormat:\'long\'}}" />');
        $compile(element)($rootScope);
        $rootScope.$digest();

        timeElement = element.find('time');

        expect(element.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open today 10am-6pm');
      });

    it('should tell you "Open tomorrow ..." when checking at night',
      function () {
        // Returns 19 for 7pm after a library has closed.
        Date.prototype.getHours = function () { return 19; };

        element = angular.element('<todayshours class="' +
          'grid__item one-whole " hours="{{{\'today\':' +
          '{\'open\': \'10:00\', \'close\': \'18:00\'},' +
          '\'tomorrow\':{\'open\': \'10:00\', \'close\': \'18:00\'} }' +
          '| hoursTodayFormat:\'short\'}}" />');
        $compile(element)($rootScope);
        $rootScope.$digest();

        timeElement = element.find('time');

        expect(element.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open tomorrow 10am-6pm');
      });

    it('should tell you "Open today ..." when checking in the morning',
      function () {
        // Returns 7 for 7am before a library has opened.
        Date.prototype.getHours = function () { return 7; };

        element = angular.element('<todayshours class="' +
          'grid__item one-whole " hours="{{{\'today\':' +
          '{\'open\': \'10:00\', \'close\': \'18:00\'},' +
          '\'tomorrow\':{\'open\': \'10:00\', \'close\': \'18:00\'} }' +
          '| hoursTodayFormat:\'short\'}}" />');
        $compile(element)($rootScope);
        $rootScope.$digest();

        timeElement = element.find('time');

        expect(element.attr('id')).toBe('hours-today');
        // The time element can have many classes but these are important
        expect(timeElement.attr('class')).toContain('hours-today');
        expect(timeElement.attr('class')).toContain('icon-clock');

        expect(timeElement.text()).toBe('Open today 10am-6pm');
      });
  }); /* End todayshours */

  /*
   * <nyplbreadcrumbs></nyplbreadcrumbs>
   */
  describe('nyplbreadcrumbs', function () {

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      var scope,
      html = '<nypl-breadcrumbs crumb-name="data.crumbName"></nypl-breadcrumbs>';
    
      inject(function($compile, $rootScope) {

        scope = $rootScope.$new();

        //get the jqLite or jQuery element
        element = angular.element(html);
        
        //compile the element into a function to 
        // process the view.
        $compile(element)(scope);
        scope.$digest();
      });
    }));

    it('should create an unordered list with class breadcrumb', function (){
      var crumbList = element.find('ul');
      expect(crumbList.attr('class')).toContain('breadcrumb');
    });
  });

  /*
   * <emailusbutton link="" />
   *   Generates a link to email a librarian.
   */
  describe('emailusbutton', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<emailusbutton link="nypl.org" />');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should compile', function () {
      expect(element.attr('class')).toContain('askemail');
    });

    it('should create a link', function () {
      expect(element.attr('href')).toContain('nypl.org');
      expect(element.text()).toEqual('Email us your question');
    });
  });

  /*
   * <librarianchatbutton />
   *   Generates a link element that will create a popup for the NYPL Chat
   *   widget to talk to a librarian.
   */
  describe('librarianchatbutton', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<librarianchatbutton />');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should compile', function () {
      expect(element.attr('class')).toContain('askchat');
    });

    it('should create a link', function () {
      expect(element.text()).toEqual('Chat with a librarian');
    });
  });

  /*
   * <event-registration how="" link="" registrationopen="" />
   *   Generates a link element that will create a popup for the NYPL Chat
   *   widget to talk to a librarian.
   */
  describe('eventRegistration', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    describe('Registration type - First Come, First Served', function () {
      beforeEach(function () {
        element = angular.element('<event-registration ' +
          'type="First Come, First Serve" open="false" start="null"' +
          'link="events/nypl-event" registration="{}"></event-registration>');
        $compile(element)($rootScope);
        $rootScope.$digest();
      });

      it('should compile', function () {
        expect(element.attr('class')).toContain('registration-for-event');
      });

      it('should display the type of registration', function () {
        expect(element.find('.registration_type').text())
          .toEqual('First Come, First Serve');
      });

      it('should not have an anchor tag', function () {
        expect(element.find('a').length).toBe(0);
      });

      it('should not have any type of registration message', function () {
        expect(element.find('.registration-available').text()).toEqual('');
      });
    });

    describe('Registration type - Online - event will open in the future',
      function () {
        beforeEach(function () {
          element = angular.element('<event-registration type="Online" ' +
            'open="true" start="2014-08-29T17:00:00Z"' +
            'link="events/nypl-event" registration="{}"></event-registration>');
          $compile(element)($rootScope);
          $rootScope.$digest();
        });

        it('should compile', function () {
          expect(element.attr('class')).toContain('registration-for-event');
        });

        it('should display the type of registration', function () {
          expect(element.find('.registration_type').text().trim())
            .toEqual('Online');
        });

        it('should have a link to the event', function () {
          expect(element.find('a').attr('href'))
            .toEqual('http://nypl.org/events/nypl-event');
        });

        it('should tell you when registration opens', function () {
          // Override the date function so we can test the wording
          var date = new Date(2014, 8, 7),
            MockDate = Date;
          Date = function () { return date; };

          expect(element.find('.registration-available').text().trim())
            .toEqual('Registration opens on August 29, 2014 - 7:00AM');

          Date = MockDate;
        });
      });

    describe('Registration type - Online - registration is closed',
      function () {
        beforeEach(function () {
          element = angular.element('<event-registration type="Online" ' +
            'open="false" start="2014-07-29T17:00:00Z"' +
            'link="events/nypl-event" registration="{}"></event-registration>');
          $compile(element)($rootScope);
          $rootScope.$digest();
        });

        it('should compile', function () {
          expect(element.attr('class')).toContain('registration-for-event');
        });

        it('should display the type of registration', function () {
          expect(element.find('.registration_type').text().trim())
            .toEqual('Online');
        });

        it('should have a link to the event', function () {
          expect(element.find('a').attr('href'))
            .toEqual('http://nypl.org/events/nypl-event');
        });

        it('should tell you when registration opens', function () {
          // Override the date function so we can test the wording
          var date = new Date(2014, 8, 7),
            MockDate = Date;
          Date = function () { return date; };

          expect(element.find('.registration-available').text().trim())
            .toEqual('Registration for this event is closed.');

          Date = MockDate;
        });
      });
  }); /* End eventRegistration */

  /*
   * <nypl-site-alerts></nypl-site-alerts>
   *   The nyplSiteAlerts directive displays a site-wide alert by checking all
   *   the alerts in the API and checking the current date.
   */
  describe('nyplSiteAlerts', function () {
    var $httpBackend,
      date;

    beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;

      $httpBackend
        .expectGET('http://evening-mesa-7447-160.herokuapp.com/alerts')
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
    }));

    it('should display a site wide alert', function () {
      var MockDate, alert;

      // Override the date function so we can test a real alert
      // Store a copy so we can return the original one later
      date = new Date(2014, 5, 29);
      MockDate = Date;
      Date = function () { return date; };

      element = angular.element("<nypl-site-alerts></nypl-site-alerts>");
      $compile(element)($rootScope);
      $httpBackend.flush();
      $rootScope.$digest();

      // For whatever reason, the sitewidealert doesn't get generated
      // in time for the $compile function to write it and for the data-ng-if
      // to verify that the value is there.
      // console.log(element);

      // Currently just using the value in the $rootScope.
      alert = $rootScope.sitewidealert;
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
  describe('nyplLibraryAlert', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $rootScope.libraryAlert = "Test library specific alert";
    }));

    it('should display a site wide alert', function () {
      var date, MockDate;

      // Override the date function so we can test a real alert
      // Store a copy so we can return the original one later
      date = new Date(2014, 5, 29);
      MockDate = Date;
      Date = function () { return date; };

      element = angular.element("<nypl-library-alert></nypl-library-alert>");
      $compile(element)($rootScope);
      $rootScope.$digest();

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
  describe('collapse', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should open and close the element by hiding it', function () {
      element = angular.element('<div class="weekly-hours" collapse="expand" ' +
        'duration="2500"></div>');
      $compile(element)($rootScope);

      // Initially on load it is false and hidden.
      $rootScope.expand = false;
      $rootScope.$digest();

      expect(element.attr('class')).not.toContain('open');
      expect(element.attr('style')).toEqual('display: none;');

      // When clicked, it slides down.
      $rootScope.expand = true;
      $rootScope.$digest();

      expect(element.attr('class')).toContain('open');
      expect(element.attr('style')).toContain('display: block;');
    });
  });

});