/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var LandingPage = function () {
  'use strict';

  this.branch_link = element(
    by.css('.locations-list-view .locations-row:first-child .p-org a')
  );

  this.searchInput = element(by.id('searchTerm'));
  this.findIt = element(by.id('find-location'));

  this.search = function (query) {
    this.searchInput.sendKeys(query);
    this.findIt.click();
  };

  this.research = element(by.css('.filters__research a'));

  this.geolocation = element(by.id('currentloc'));
};

module.exports = new LandingPage();

