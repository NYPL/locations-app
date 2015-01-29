/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var CollectionPage = function () {
  'use strict';

  // Heading
  this.title = element(by.css('.title'));
  this.terms = element.all(by.repeater('term in terms'));
  this.categoryTerms = element.all(by.css('.categoryTerm'));
  // this.subjectSubterms = element.all(by.repeater('term in terms[0].terms'));
  // this.mediaSubterms = element.all(by.repeater('term in terms[1].terms'));
  // this.locationSubterms = element.all(by.repeater('term in terms[2].locations'));
  this.subjectSubterms = element.all(by.css('.subjectSubterms'));
  this.mediaSubterms = element.all(by.css('.mediaSubterms'));
  this.locationSubterms = element.all(by.css('.locationSubterms'));

  // Active filters:
  this.currentSubjectFilter = element(by.css('.active-filter-Subjects'));
  this.currentMediaFilter = element(by.css('.active-filter-Media'));
  this.currentLocationsFilter = element(by.css('.active-filter-Locations'));

  this.getTerm = function (n) {
    return this.terms.get(n);
  };

  this.getSubjectSubterm = function (n) {
    return this.subjectSubterms.get(n);
  };

  this.getMediaSubterm = function (n) {
    return this.mediaSubterms.get(n);
  };

  this.getLocationSubterm = function (n) {
    return this.locationSubterms.get(n);
  };

  // Results
  this.divisionHeader = element(by.css('.filtered-divisions .hdg'));
  this.filteredDivisions =
    element.all(by.repeater('division in filteredDivisions'));

  this.nthDivision = function (n) {
    return this.filteredDivisions.get(n);
  };

  this.nthDivisionImage = function (n) {
    return this.nthDivision(n).element(by.css('.division-image'));
  };

  this.nthDivisionName = function (n) {
    return this.nthDivision(n).element(by.css('.division-name')).getText();
  };
};

module.exports = new CollectionPage();
