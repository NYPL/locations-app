'use strict';

describe('NYPL Directive Tests', function() {
  var element,
      $compile,
      $rootScope,
      timeElement,
      donateBlock,
      askNYPLBlock,
      siteWideAlert,
      libraryAlert;

  beforeEach(module('nypl_locations'));
  beforeEach(module('directiveTemplates'));

  // Not that testing directives means also testing the 'hoursTodayformat'
  // since the output text depends on that filter and the data being passed
  describe('todayshours', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should tell you "Open today until ..." with short filter format', function () {
      element = angular.element('<todayshours class="' +
        'grid__item one-whole " hours="{{{\'open\': \'10:00\', \'close\': \'18:00\'} ' +
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

    it('should tell you "Open today ..." with long filter format', function () {
      element = angular.element('<todayshours class="' +
        'grid__item one-whole " hours="{{{\'open\': \'10:00\', \'close\': \'18:00\'} ' +
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
  });

  describe('askdonatefooter', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<askdonatefooter chatHref="" emailHref="" donateHref="" />');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should have the ask-donate class in the outer wrapper', function () {
      expect(element.attr('class')).toContain('ask-donate');
    });

    it('should generate the donate section', function () {
      // Get the first div in the markup
      expect(element.find('p').text()).toBe('Help us keep this library open 6 days a week!');
      expect(element.find('button').text()).toBe('Donate now');
    });

    it('should generate the askNYPL section', function () {
      var asknyplList = element.find('ul');
      expect(asknyplList.find('li').length).toEqual(3);
    });
  });

  describe('nyplalerts', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should display a site wide alert', function () {
      siteWideAlert = "This is a site wide alert and just a test.";
      element = angular.element('<nyplalerts sitewidealert=\'' + siteWideAlert + '\' ' +
        'libraryalert=\'{{libraryAlert}}\'></nyplalerts>');
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(element.attr('class')).toContain('callout');
      expect(element.find('p').text()).toBe('This is a site wide alert and just a test.');
    });

    it('should display a site wide alert', function () {
      libraryAlert = "This is an alert for just one library.";
      element = angular.element('<nyplalerts sitewidealert=\'{{siteWideAlert}}\' ' +
        'libraryalert=\'' + libraryAlert + '\'></nyplalerts>');
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(element.attr('class')).toContain('callout');
      expect(element.find('p').text()).toBe('This is an alert for just one library.');
    });

  });

});