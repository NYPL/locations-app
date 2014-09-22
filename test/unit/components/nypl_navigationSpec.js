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

  describe('Directive: nyplCollapsedButtons', function () {
    var nyplCollapsedButtons, search_btn, nav_btn;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $scope = _$rootScope_.$new();

      element = angular.element('<nypl-collapsed-buttons />');
      $compile(element)($scope);
      $scope.$digest();

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

  // describe('Directive: nyplNavigation', function () {
  //   var nyplNavigation;

  //   beforeEach(inject(function (_$compile_, _$rootScope_) {
  //     $compile = _$compile_;
  //     $scope = _$rootScope_.$new();

  //     nyplNavigation = angular.element('<nypl-navigation></nypl-navigation>');
  //     $compile(nyplNavigation)($scope);
  //     $scope.$digest();

  //   }));

  //   it('should compile', function () {
  //     // console.log(nyplNavigation);
  //     // expect(element.attr('id')).toContain('main-nav');
  //   });

  // });

});
