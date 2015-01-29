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

    describe('Subterms filter count', function () {
      it('should have 11 subterms for the Subject filter', function () {
        subjectsFilter.click();

        expect(collectionsPage.subjectSubterms.count()).toBe(11);
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

  describe('Current filters section', function () {
    describe('Active Subjects', function () {
      beforeEach(function () {
        subjectsFilter.click();
      });

      it('should display that Social Sciences was clicked', function () {
        element(by.linkText('Social Sciences')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Social Sciences');
      });

      it('should display that Cultural Studies was clicked', function () {
        element(by.linkText('Cultural Studies')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Cultural Studies');
      });

      it('should display that Industry was clicked', function () {
        element(by.linkText('Industry')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Industry');
      });

      it('should display that Performing Arts and then Music was clicked',
        function () {
          element(by.linkText('Performing Arts')).click();
          element(by.css('.performing-arts .collapsible-control')).click();
          element(by.linkText('Music')).click();

          expect(collectionsPage.currentSubjectFilter.getText())
            .toEqual('Music');
        });

      it('should display that Global Studies and then Latin American Studies was clicked',
        function () {
          element(by.linkText('Global Studies')).click();
          element(by.css('.global-studies .collapsible-control')).click();
          element(by.linkText('Latin American Studies')).click();

          expect(collectionsPage.currentSubjectFilter.getText())
            .toEqual('Latin American Studies');
        });

      it('should display that Humanities and then Classics was clicked',
        function () {
          element(by.linkText('Humanities')).click();
          element(by.css('.humanities .collapsible-control')).click();
          element(by.linkText('Classics')).click();

          expect(collectionsPage.currentSubjectFilter.getText())
            .toEqual('Classics');
        });
    });

    describe('Active Media', function () {
      beforeEach(function () {
        mediaFilter.click();
      });

      it('should display that Archives was clicked', function () {
        element(by.linkText('Archives')).click();

        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Archives');
      });

      it('should display that Government Documents was clicked', function () {
        element(by.linkText('Government Documents')).click();

        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Government Documents');
      });

      it('should display that Maps was clicked', function () {
        element(by.linkText('Maps')).click();

        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Maps');
      });

      it('should display that Rare Books was clicked', function () {
        element(by.linkText('Rare Books')).click();

        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Rare Books');
      });
    });

    describe('Active Locations', function () {
      beforeEach(function () {
        locationFilter.click();
      });

      it('should display that Stephen A. Schwarzman Building was clicked',
        function () {
          element(by.linkText('Stephen A. Schwarzman Building')).click();

          expect(collectionsPage.currentLocationsFilter.getText())
            .toEqual('Schwarzman');
        });

      it('should display that New York Public Library for Performing Arts, ' +
        'Dorothy and Lewis B. Cullman Center was clicked', function () {
          element(by.linkText('New York Public Library for the Performing ' +
            'Arts, Dorothy and Lewis B. Cullman Center')).click();

          expect(collectionsPage.currentLocationsFilter.getText())
            .toEqual('LPA');
        });

      it('should display that Schomburg Center for Research in Black ' +
        'Culture was clicked', function () {
          element(by.linkText('Schomburg Center for Research in Black Culture'))
            .click();

          expect(collectionsPage.currentLocationsFilter.getText())
            .toEqual('Schomburg');
        });

      it('should display that Science, Industry and Business Library (SIBL) ' +
        'was clicked', function () {
          element(by.linkText('Science, Industry and Business Library (SIBL)'))
            .click();

          expect(collectionsPage.currentLocationsFilter.getText())
            .toEqual('SIBL');
        });
    });

    describe('Multiple filters', function () {
      it('should display a Subjects and Media filter', function () {
        subjectsFilter.click();
        element(by.linkText('Black Studies')).click();

        mediaFilter.click();
        element(by.linkText('Manuscripts')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Black Studies');
        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Manuscripts');
      });

      it('should display a Subjects and Media filter', function () {
        subjectsFilter.click();
        element(by.css('.history .collapsible-control')).click();
        element(by.linkText('Genealogy')).click();

        mediaFilter.click();
        element(by.linkText('Prints')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Genealogy');
        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Prints');
      });

      it('should display a Subjects and Locations filter', function () {
        locationFilter.click();
        element(by.linkText('Science, Industry and Business Library (SIBL)'))
          .click();
        subjectsFilter.click();
        element(by.linkText('Literature')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Literature');
        expect(collectionsPage.currentLocationsFilter.getText())
          .toEqual('SIBL');
      });

      it('should display a Media and Locations filter', function () {
        locationFilter.click();
        element(by.linkText('Schomburg Center for Research in Black Culture'))
          .click();
        mediaFilter.click();
        element(by.linkText('Photographs')).click();

        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Photographs');
        expect(collectionsPage.currentLocationsFilter.getText())
          .toEqual('Schomburg');
      });

      it('should display all three filters', function () {
        subjectsFilter.click();
        element(by.linkText('Fine Arts')).click();
        locationFilter.click();
        element(by.linkText('Stephen A. Schwarzman Building')).click();
        mediaFilter.click();
        element(by.linkText('Newspapers')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Fine Arts');
        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Newspapers');
        expect(collectionsPage.currentLocationsFilter.getText())
          .toEqual('Schwarzman');
      });

      it('should display all three filters', function () {
        subjectsFilter.click();
        element(by.linkText('Black Studies')).click();
        locationFilter.click();
        element(by.linkText('Stephen A. Schwarzman Building')).click();
        mediaFilter.click();
        element(by.linkText('Scores')).click();

        expect(collectionsPage.currentSubjectFilter.getText())
          .toEqual('Black Studies');
        expect(collectionsPage.currentMediaFilter.getText())
          .toEqual('Scores');
        expect(collectionsPage.currentLocationsFilter.getText())
          .toEqual('Schwarzman');
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
      describe('Parent Terms', function () {
        beforeEach(function () {
          subjectsFilter.click();
        });

        it('should filter five divisions when Social Sciences is clicked', function () {
          element(by.linkText('Social Sciences')).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(5);
        });

        it('should filter six divisions when Cultural Studies is clicked', function () {
          element(by.linkText('Cultural Studies')).click();
          expect(collectionsPage.filteredDivisions.count()).toBe(6);
        });
      });

      it('should have 2 divisions when Anthropology is selected', function () {
        var socialSciencesCollapse;

        subjectsFilter.click();

        socialSciencesCollapse =
          element(by.css('.social-sciences .collapsible-control'))
          .click();

        element(by.linkText('Anthropology')).click();

        expect(collectionsPage.filteredDivisions.count()).toBe(2);
      });

      it('should display all divisions when filter is selected again', function () {
        var socialSciencesCollapse;

        subjectsFilter.click();

        socialSciencesCollapse =
          element(by.css('.social-sciences .collapsible-control'))
          .click();

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

    describe('Multiple Filtering', function () {
      describe('Subject and Media Filters', function () {
        it('should filter a Subject filter and Media filter', function () {
          subjectsFilter.click();
          element(by.css('.fine-arts .collapsible-control')).click();
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
          element(by.css('.performing-arts .collapsible-control')).click();
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
          element(by.css('.fine-arts .collapsible-control')).click();
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
          element(by.css('.cultural-studies .collapsible-control')).click();
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
