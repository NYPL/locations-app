/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

/*
 * Tests for nyplSearch module.
 *   The nyplSearch module only has one directive and it's search on
 *   bibliocommons or nypl.org.
 */
describe('nyplSearch module', function () {
  'use strict';

  var element, $compile, $scope, httpBackend;

  beforeEach(module('nyplSearch'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_) {
    httpBackend = _$httpBackend_;

    httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
  }));

  /*
   * <nypl-search></nypl-search>
   *   The nypl-sso directive displays the login and donate buttons and has
   *   DOM manipulation to show and hide the login form.
   */
  describe('nypl-search', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $scope = _$rootScope_.$new();

      element = angular.element('<nypl-search></nypl-search>');
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should compile', function () {
      expect(element.attr('id')).toContain('search-top');
    });

    it('should have a search form', function () {
      expect(element.find('form').attr('id')).toContain('search-block-form');
    });

    it('should have two options to search', function () {
      expect(element.find('.search-the-catalog').text().trim())
        .toEqual('Catalog');

      expect(element.find('.search-the-website').text().trim())
        .toEqual('NYPL.org');
    });

    it('should have an input field and submit button', function () {
      expect(element.find('#search-block-form-input').attr('placeholder'))
        .toEqual('Find books, music, movies and more');

      expect(element.find('button').attr('class')).toContain('search-button');
    });

    it('should have a classic catalog link', function () {
      expect(element.find('.search-classic-catalog').text().trim())
        .toEqual('Classic Catalog');
    });

    it('should give the input element an error class is nothing was searched',
      function () {
        var input_field = element.find('#search-block-form-input');

        expect(input_field.attr('class')).not.toContain('error');

        input_field.val('');
        element.find('.search-button').click();

        expect(input_field.attr('class')).toContain('error');
      });

    it('should give the input element an error class is nothing was searched',
      function () {
        var input_field = element.find('#search-block-form-input');

        expect(input_field.attr('class')).not.toContain('error');

        input_field.val('');
        element.find('.search-button').click();

        expect(input_field.attr('class')).toContain('error');
      });

  });

});
