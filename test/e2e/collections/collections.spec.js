/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Research Collections', function () {
  'use strict';

  var collectionsPage = require('./collections.po.js'),
    subjectsFilter,
    mediaFilter;

  beforeEach(function () {
    browser.get('/research-collections');
    browser.waitForAngular();
    
    subjectsFilter = collectionsPage.subjectTerm();
    mediaFilter = collectionsPage.mediaTerm();
  });

  describe('Filters section', function () {
    it('should display the page title', function () {
      expect(collectionsPage.title.getText()).toEqual('Research Collections');
    });

    it('should have two filters', function () {
      expect(collectionsPage.terms.count()).toBe(2);
    });

    it('should add active class to the filter that was clicked', function () {
      subjectsFilter.click();
      expect(subjectsFilter.getAttribute('class')).toContain('active');

      mediaFilter.click();
      expect(mediaFilter.getAttribute('class')).toContain('active');
    });

    it('should have 9 subterms for the Subject filter', function () {
      subjectsFilter.click();

      expect(collectionsPage.subterms.count()).toBe(9);
    });

    it('should have 13 subterms for the Media filter', function () {
      mediaFilter.click();
      expect(collectionsPage.subterms.count()).toBe(13);
    });

    it('should add active class to the subterm clicked', function () {
      subjectsFilter.click();
      collectionsPage.subtermsButton(2).click();
      expect(collectionsPage.subtermsButton(2).getAttribute('class'))
        .toContain('active');

      mediaFilter.click();
      collectionsPage.subtermsButton(4).click();
      expect(collectionsPage.subtermsButton(4).getAttribute('class'))
        .toContain('active');
    });
  });

  describe('Results section', function () {
    it('should have a title', function () {
      expect(collectionsPage.divisionHeader.getText()).toEqual('DIVISIONS');
    });

    it('should initially have 25 divisions on the page', function () {
      expect(collectionsPage.filteredDivisions.count()).toBe(25);
    });

    // Stubs until the data is in
    describe('Subject filter', function () {
      it('should have X divisions when a subterm is selected', function () {
        subjectsFilter.click();
        collectionsPage.subtermsButton(0).click();

        expect(collectionsPage.filteredDivisions.count()).toBe(1);
      });


    });

    describe('Media filter', function () {
      it('should have X divisions when a subterm is selected', function () {
        mediaFilter.click();
        collectionsPage.subtermsButton(0).click();

        expect(collectionsPage.filteredDivisions.count()).toBe(1);
      });


    });
  });

});
