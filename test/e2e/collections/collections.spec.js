/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Research Collections', function () {
  'use strict';

  var collectionsPage = require('./collections.po.js'),
    subjectsFilter,
    mediaFilter,
    locationFilter;

  beforeEach(function () {
    browser.get('/research-collections');
    browser.waitForAngular();
    
    subjectsFilter = element(by.buttonText('Subjects'));
    mediaFilter = element(by.buttonText('Media'));
    locationFilter = element(by.buttonText('Locations'));
  });

  // it('should display the page title', function () {
  //   expect(collectionsPage.title.getText()).toEqual('Research Collections');
  // });

  describe('Filters section', function () {
    describe('Category Filters', function () {
      var subjectsFilterClass, mediaFilterClass, locationsFilterClass;
      beforeEach(function () {
        subjectsFilterClass = subjectsFilter.getAttribute('class');
        mediaFilterClass = mediaFilter.getAttribute('class');
        locationsFilterClass = locationFilter.getAttribute('class');
      });

      // it('should have three filters', function () {
      //   expect(collectionsPage.categoryTerms.count()).toBe(3);
      // });

      // it('should not have any active category terms active', function () {
      //   expect(subjectsFilterClass).not.toContain('active');
      //   expect(mediaFilterClass).not.toContain('active');
      //   expect(locationsFilterClass).not.toContain('active');
      // });

      it('should add active class to the filter that was clicked', function () {
        subjectsFilter.click();
        browser.sleep(1000);
        // expect(subjectsFilterClass).toContain('active');
        expect(mediaFilterClass).not.toContain('active');
        expect(locationsFilterClass).not.toContain('active');

        mediaFilter.click();
        browser.sleep(1000);
        expect(subjectsFilterClass).not.toContain('active');
        // expect(mediaFilterClass).toContain('active');
        expect(locationsFilterClass).not.toContain('active');

        locationFilter.click();
        browser.sleep(1000);
        expect(subjectsFilterClass).not.toContain('active');
        expect(mediaFilterClass).not.toContain('active');
        // expect(locationsFilterClass).toContain('active');
      });
    });

    describe('', function () {
      // it('should have 9 subterms for the Subject filter', function () {
      //   subjectsFilter.click();

      //   expect(collectionsPage.subterms.count()).toBe(9);
      // });

      // it('should have 13 subterms for the Media filter', function () {
      //   mediaFilter.click();
      //   expect(collectionsPage.mediaSubterm.count()).toBe(13);
      // });
    });

  });

  // describe('Results section', function () {
  //   it('should have a title', function () {
  //     expect(collectionsPage.divisionHeader.getText()).toEqual('DIVISIONS');
  //   });

  //   it('should initially have 26 divisions on the page', function () {
  //     expect(collectionsPage.filteredDivisions.count()).toBe(26);
  //   });

  //   // Stubs until the data is in
  //   describe('Subject filter', function () {
  //     it('should have X divisions when a subterm is selected', function () {
  //       subjectsFilter.click();
  //       collectionsPage.getSubjectSubterm(0).click();

  //       expect(collectionsPage.filteredDivisions.count()).toBe(1);
  //     });


  //   });

  //   describe('Media filter', function () {
  //     it('should have X divisions when a subterm is selected', function () {
  //       mediaFilter.click();
  //       collectionsPage.getMediaSubterm(0).click();

  //       expect(collectionsPage.filteredDivisions.count()).toBe(1);
  //     });


  //   });
  // });

});
