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

  this.geolocation = element(by.id('currentloc'));
  this.research = element(by.css('.filters__research a'));

  this.listViewBtn = element(by.css('.list-view-btn'));
  this.mapViewBtn = element(by.css('.map-view-btn'));

};

module.exports = new LandingPage();

