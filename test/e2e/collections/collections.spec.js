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

  it('should display the page title', function () {
    expect(collectionsPage.title.getText()).toEqual('Research Collections');
  });

  describe('Filters section', function () {
    describe('Category Filters', function () {
      it('should have three filters', function () {
        expect(collectionsPage.categoryTerms.count()).toBe(3);
      });

      it('should not have any active category terms active', function () {
        expect(subjectsFilter.getAttribute('class')).not.toContain('active');
        expect(mediaFilter.getAttribute('class')).not.toContain('active');
        expect(locationFilter.getAttribute('class')).not.toContain('active');
      });

      it('should add active class to the filter that was clicked', function () {
        subjectsFilter.click();
        expect(subjectsFilter.getAttribute('class')).toContain('active');
        expect(mediaFilter.getAttribute('class')).not.toContain('active');
        expect(locationFilter.getAttribute('class')).not.toContain('active');

        mediaFilter.click();
        expect(subjectsFilter.getAttribute('class')).not.toContain('active');
        expect(mediaFilter.getAttribute('class')).toContain('active');
        expect(locationFilter.getAttribute('class')).not.toContain('active');

        locationFilter.click();
        expect(subjectsFilter.getAttribute('class')).not.toContain('active');
        expect(mediaFilter.getAttribute('class')).not.toContain('active');
        expect(locationFilter.getAttribute('class')).toContain('active');
      });
    });

    describe('Subterm filters', function () {
      it('should have 46 subterms for the Subject filter', function () {
        subjectsFilter.click();

        expect(collectionsPage.subjectSubterms.count()).toBe(46);
      });

      it('should have 13 subterms for the Media filter', function () {
        mediaFilter.click();
        expect(collectionsPage.mediaSubterms.count()).toBe(13);
      });

      it('should have 4 subterms for the Media filter', function () {
        locationFilter.click();
        expect(collectionsPage.locationSubterms.count()).toBe(4);
      });
    });

  });

  describe('Results section', function () {
    it('should have a title', function () {
      expect(collectionsPage.divisionHeader.getText()).toEqual('DIVISIONS');
    });

    it('should initially have 26 divisions on the page', function () {
      expect(collectionsPage.filteredDivisions.count()).toBe(26);
    });

    describe('Subject filter', function () {
      it('should have 2 divisions when Anthropology is selected', function () {
        subjectsFilter.click();
        element(by.linkText('Anthropology')).click();

        expect(collectionsPage.filteredDivisions.count()).toBe(2);
      });

      it('should display all divisions when filter is selected again', function () {
        subjectsFilter.click();

        element(by.linkText('Psychology')).click();
        expect(collectionsPage.filteredDivisions.count()).toBe(1);

        element(by.linkText('Psychology')).click();
        expect(collectionsPage.filteredDivisions.count()).toBe(26);
      });
    });

    describe('Media filter', function () {
      it('should have 7 divisions when Archives is selected', function () {
        mediaFilter.click();
        element(by.linkText('Archives')).click();

        expect(collectionsPage.filteredDivisions.count()).toBe(7);
      });

      it('should display all divisions when filter is selected again', function () {
        mediaFilter.click();
        
        element(by.linkText('Rare Books')).click();
        expect(collectionsPage.filteredDivisions.count()).toBe(6);

        element(by.linkText('Rare Books')).click();
        expect(collectionsPage.filteredDivisions.count()).toBe(26);
      });
    });

    describe('Locations filter', function () {
      it('should have 5 divisions when Schomburg is selected', function () {
        locationFilter.click();
        element(by.linkText('Schomburg Center for Research in Black Culture'))
          .click();

        expect(collectionsPage.filteredDivisions.count()).toBe(5);
      });

      it('should display all divisions when filter is selected again', function () {
        locationFilter.click();
        
        element(by.linkText('Stephen A. Schwarzman Building')).click();
        expect(collectionsPage.filteredDivisions.count()).toBe(15);

        element(by.linkText('Stephen A. Schwarzman Building')).click();
        expect(collectionsPage.filteredDivisions.count()).toBe(26);
      });
    });

    describe('Intersection Filtering', function () {
      describe('Subject and Media Filters', function () {
        it('should filter a Subject filter and Media filter', function () {
          subjectsFilter.click();
          element(by.linkText('Photography')).click();

          // Selecting Photography should first give you two results.
          expect(collectionsPage.filteredDivisions.count()).toBe(2);

          mediaFilter.click();
          element(by.linkText('Prints')).click();

          // Now selecting Prints should further to one division.
          expect(collectionsPage.filteredDivisions.count()).toBe(1);
        });

        it('should not give you any results', function () {
          subjectsFilter.click();
          element(by.linkText('Music')).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(5);
          element(by.linkText('Music')).click();

          mediaFilter.click();
          element(by.linkText('Government Documents')).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(2);

          // While still having 'Government Documents' as a filter,
          // we filter again on 'Music':
          subjectsFilter.click();
          element(by.linkText('Music')).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(0);
        });
      });

      describe('Subject and Locations Filters', function () {
        it('should filter a Subject filter and Location filter', function () {
          subjectsFilter.click();
          element(by.linkText('Photography')).click();

          // Selecting Photography should first give you two results.
          expect(collectionsPage.filteredDivisions.count()).toBe(2);

          mediaFilter.click();
          element(by.linkText('Prints')).click();

          // Now selecting Prints should further to one division.
          expect(collectionsPage.filteredDivisions.count()).toBe(1);
        });

        it('should not give you any results', function () {
          subjectsFilter.click();
          element(by.linkText("Women's Studies")).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(3);
          element(by.linkText("Women's Studies")).click();

          locationFilter.click();
          element(by.linkText('Science, Industry and Business Library (SIBL)')).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(1);

          subjectsFilter.click();
          element(by.linkText("Women's Studies")).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(0);
        });
      });

      describe('Media and Locations Filters', function () {
        it('should filter a Media filter and Location filter', function () {
          mediaFilter.click();
          element(by.linkText('Film & Video')).click();

          expect(collectionsPage.filteredDivisions.count()).toBe(4);

          locationFilter.click();
          element(by.linkText('Schomburg Center for Research in Black Culture')).click();

          expect(collectionsPage.filteredDivisions.count()).toBe(1);
        });

        it('should not give you any results', function () {
          mediaFilter.click();
          element(by.linkText("Artists' Books")).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(3);
          element(by.linkText("Artists' Books")).click();

          locationFilter.click();
          element(by.linkText('New York Public Library for the Performing Arts, Dorothy and Lewis B. Cullman Center')).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(5);

          mediaFilter.click();
          element(by.linkText("Artists' Books")).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(0);
        });
      });

    });
  });

});
