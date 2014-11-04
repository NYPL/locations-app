/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

describe('nyplNavigation module', function () {
  'use strict';

  var element, $compile, $scope, httpBackend;

  beforeEach(module('nyplNavigation'));
  beforeEach(module('nyplSSO'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_) {
    httpBackend = _$httpBackend_;

    httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
  }));

  function createDirective(template) {
    var element;
    element = $compile(template)($scope);
    $scope.$digest();

    return element;
  }

  describe('Directive: nyplCollapsedButtons', function () {
    var nyplCollapsedButtons, search_btn, nav_btn, html;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $scope = _$rootScope_.$new();

      html = '<nypl-collapsed-buttons />';
      element = createDirective(html);

      nyplCollapsedButtons = element.find('div');
      search_btn = angular.element(nyplCollapsedButtons[0]);
      nav_btn = angular.element(nyplCollapsedButtons[1]);
    }));

    it('should compile', function () {
      expect(element.attr('class')).toContain('collapsed-buttons');
    });

    it('should have two buttons', function () {
      expect(nyplCollapsedButtons.length).toBe(2);
      expect(search_btn.attr('class')).toContain('search-open-button');
      expect(nav_btn.attr('class')).toContain('nav-open-button');
    });

    it('should toggle the open class for the nav button when clicked',
      function () {
        // Adding extra space because it gets confused with the
        // 'search-open-button' class.
        expect(nav_btn.attr('class')).not.toContain('open ');

        nav_btn.click();
        expect(nav_btn.attr('class')).toContain('open');

        nav_btn.click();
        expect(nav_btn.attr('class')).not.toContain('open ');
      });

    it('should toggle the open class for the search button when clicked',
      function () {
        // Adding extra space because it gets confused with the
        // 'search-open-button' class.
        expect(search_btn.attr('class')).not.toContain('open ');

        search_btn.click();
        expect(search_btn.attr('class')).toContain('open');

        search_btn.click();
        expect(search_btn.attr('class')).not.toContain('open ');
      });

    it('should remove the open class from the search button when toggling ' +
      'the nav button',
      function () {
        search_btn.click();

        expect(search_btn.attr('class')).toContain('open');
        expect(nav_btn.attr('class')).not.toContain('open ');

        nav_btn.click();
        expect(nav_btn.attr('class')).toContain('open');
        expect(search_btn.attr('class')).not.toContain('open ');
      });

    it('should remove the open class from the nav button when toggling ' +
      'the search button',
      function () {
        nav_btn.click();

        expect(search_btn.attr('class')).not.toContain('open ');
        expect(nav_btn.attr('class')).toContain('open');

        search_btn.click();
        expect(nav_btn.attr('class')).not.toContain('open ');
        expect(search_btn.attr('class')).toContain('open');
      });
  });

  describe('Directive: nyplNavigation', function () {
    var nyplNavigation, html;

    describe('Logged in', function () {
      beforeEach(inject(function (_$compile_, _$rootScope_, _ssoStatus_) {
        spyOn(_ssoStatus_, 'logged_in').and.callFake(function () {
          return false;
        });

        $compile = _$compile_;
        $scope = _$rootScope_.$new();

        html = angular.element('<nypl-navigation></nypl-navigation>');
        nyplNavigation = createDirective(html);
      }));

      it('should compile', function () {
        expect(nyplNavigation.attr('id')).toContain('main-nav');
      });

      it('should say say Log In for the menut button initially', function () {
        expect(nyplNavigation.find('.mobile-login').text().trim()).toEqual('Log In');
      });

      it('should test', function () {
        $scope.current_url = 'http://locations.nypl.org/schwarzman';
        $scope.$apply();
        expect($scope.current_url).toEqual('http://locations.nypl.org/schwarzman');
      });
    });

    describe('Not logged in', function () {
      beforeEach(inject(function (_$compile_, _$rootScope_, _ssoStatus_) {
        spyOn(_ssoStatus_, 'logged_in').and.callFake(function () {
          return true;
        });

        $compile = _$compile_;
        $scope = _$rootScope_.$new();

        html = '<nypl-navigation></nypl-navigation>';
        nyplNavigation = createDirective(html);
      }));

      it('should say say Log Out for the menut button when logged in', function () {
        expect(nyplNavigation.find('.mobile-login').text().trim()).toEqual('Log Out');
      });
    });

  });

});
