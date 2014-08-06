/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

describe('NYPL Directive Tests', function () {
  'use strict';

  var element,
    $compile,
    $rootScope,
    timeElement,
    httpBackend;

  beforeEach(module('nypl_locations'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_) {
    httpBackend = _$httpBackend_;

    httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
  }));

  /*
  * The loadingWidget directive is markup that displays before
  * an http request is fulfilled, in this case showing a spinner.
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
  *
  */
  describe('nyplbreadcrumbs', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should compile', function () {
      element = angular.element('<nyplbreadcrumbs></nyplbreadcrumbs>');
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(element.attr('class')).toContain('breadcrumb');
    });
  });

  /*
  * The translatebutton directive displays a simple list
  * of languages that the site can be translated into.
  */
  describe('translatebuttons', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<translatebuttons></translatebuttons>');
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
  * The todayshours directive returns text that should be displayed 
  * based on what time is currently is and what the library time is.
  * It will display either closed, open today until, or not available
  * if the API is down.
  *
  * Note that testing directives means also testing the 'hoursTodayformat'
  * since the output text depends on that filter and the data being passed
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
  });

  /*
  * The askdonatefooter directive is simple markup right above the footer
  * that displays a donation link and ways to contact the library.
  */
  // describe('askdonatefooter', function () {
  //   beforeEach(inject(function (_$compile_, _$rootScope_) {
  //     $compile = _$compile_;
  //     $rootScope = _$rootScope_;

  //     element = angular
  //       .element('<askdonatefooter chatHref="" emailHref="" donateHref="" />');
  //     $compile(element)($rootScope);
  //     $rootScope.$digest();
  //   }));

  //   it('should have the ask-donate class in the outer wrapper', function () {
  //     expect(element.attr('class')).toContain('ask-donate');
  //   });

  //   it('should generate the donate section', function () {
  //     // Get the first div in the markup
  //     expect(element.find('p').text())
  //       .toEqual('Help us keep this library open 6 days a week!');
  //     expect(element.find('button').text()).toBe('Donate now');
  //   });

  //   it('should generate the askNYPL section', function () {
  //     var asknyplList = element.find('ul');
  //     expect(asknyplList.find('li').length).toEqual(3);
  //   });
  // });

  /*
  * The nyplalerts directive displays a site-wide alert by checking all the
  * alerts in the API and checking the current date.
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

});