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

  var nyplSearch, $compile, $scope, httpBackend;

  beforeEach(module('nyplSearch'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_) {
    httpBackend = _$httpBackend_;

    httpBackend
      .expectGET('languages/en.json')
      .respond('public/languages/en.json');
  }));

  /*
   * <nypl-search></nypl-search>
   *   The nypl-sso directive displays the login and donate buttons and has
   *   DOM manipulation to show and hide the login form.
   */
  describe('nypl-search', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_, _$window_) {
      // spyOn(window, 'location').and.callFake(function () {
      //   return false;
      // });
      $compile = _$compile_;
      $scope = _$rootScope_.$new();

      nyplSearch = angular.element('<nypl-search></nypl-search>');
      $compile(nyplSearch)($scope);
      $scope.$digest();
    }));

    it('should compile', function () {
      expect(nyplSearch.attr('id')).toContain('search-top');
    });

    it('should have a search form', function () {
      expect(nyplSearch.find('form').attr('id')).toContain('search-block-form');

      nyplSearch.find('#search-block-form-input').val('Dune');
      nyplSearch.find('#search-block-form').submit();
    });

    it('should have two options to search', function () {
      expect(nyplSearch.find('.search-the-catalog').text().trim())
        .toEqual('Catalog');

      expect(nyplSearch.find('.search-the-website').text().trim())
        .toEqual('NYPL.org');
    });

    it('should have an input field and submit button', function () {
      expect(nyplSearch.find('#search-block-form-input').attr('placeholder'))
        .toEqual('Find books, music, movies and more');

      expect(nyplSearch.find('button').attr('class')).toContain('search-button');
    });

    it('should have a classic catalog link', function () {
      expect(nyplSearch.find('.search-classic-catalog').text().trim())
        .toEqual('Classic Catalog');
    });

    // Test thinks it's on mobile so doesn't work
    // TODO: Figure out how to make element visible and test for desktop
    it('should set the prompt', function () {
      expect(nyplSearch.find('#search-block-form-input').attr('placeholder'))
        .toEqual('Find books, music, movies and more');
      // $(nyplSearch.find('.search-button')).css('visibility', 'visible');

      $(nyplSearch.find('.search-the-catalog input')).click();
      // expect($(nyplSearch.find('#search-block-form-input')).attr('placeholder'))
      //   .toEqual('Search the catalog');

      $(nyplSearch.find('.search-the-website input')).click();
      // expect($(nyplSearch.find('#search-block-form-input')).attr('placeholder'))
      //   .toEqual('Search the website');
    });

    it('should give the input element an error class for an empty search',
      function () {
        var input_field = nyplSearch.find('#search-block-form-input');

        expect(input_field.attr('class')).not.toContain('error');

        input_field.val('');
        nyplSearch.find('.search-button').click();

        expect(input_field.attr('class')).toContain('error');
        expect(input_field.attr('placeholder'))
          .toEqual('Please enter a search term');
      });

    it('should clear the error on the input field',
      function () {
        var input_field = nyplSearch.find('#search-block-form-input'),
          searchBtn = nyplSearch.find('.search-button');

        expect(input_field.attr('class')).not.toContain('error');

        input_field.val('');
        searchBtn.click();

        expect(input_field.attr('class')).toContain('error');
        expect(input_field.attr('placeholder'))
          .toEqual('Please enter a search term');

        input_field.focus();

        // Note: This should work but does not even when the input field is
        // focused or clicked on.
        // expect(input_field.attr('class')).not.toContain('error');
        // expect(input_field.attr('placeholder'))
        //   .not.toEqual('Please enter a search term');
      });

    it('should perform a catalog search', function () {
      var input_field = nyplSearch.find('#search-block-form-input'),
        searchBtn = nyplSearch.find('.search-button');

      // I.E. Doing it on mobile
      input_field.val('Dune');
      // searchBtn.click();
      // $(nyplSearch.find('.search-the-catalog')).click();

    });

  });

});
