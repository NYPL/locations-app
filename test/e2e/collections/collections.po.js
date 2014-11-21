/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var CollectionPage = function () {
  'use strict';

  // Heading
  this.title = element(by.css('.title'));
  this.terms = element.all(by.repeater('term in terms'));
  this.subterms = element.all(by.repeater('term in subterms'));


  this.getTerm = function (n) {
    return this.terms.get(n);
  };

  this.subjectTerm = function () {
    return this.getTerm(0);
  };

  this.mediaTerm = function () {
    return this.getTerm(1);
  };

  this.subtermsButton = function (n) {
    return this.subterms.get(n).element(by.css('button'));
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
