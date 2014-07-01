/*jslint indent: 2, maxlen: 80 */
/* globals: element, by, module */
var LandingPage = function () {
  'use strict';

  // Search Box
  this.searchInput = element(by.id('searchTerm'));
  // Submit search button
  this.findIt = element(by.id('find-location'));
  // Showing results near message
  this.resultsNear = element(by.id('results'));
  // Showing no resutls near search query
  this.searchError = element(by.id('searchError'));
  // Clear search link
  this.clearSearch = element(by.id('clear-search'));
  // Current Location button
  this.currLoc = element(by.id('currentloc'));


  // Results list
  this.locations = element.all(by.repeater('location in locations'));

  // Show only research button
  this.onlyResearch = element(by.id('onlyresearch'));

  // Show More results button
  this.showMore = element(by.id('showmore'));
  // Results list showing X of Y message
  this.showing = element(by.id('showing'));
  // Problem with Geolocation error
  this.distanceError = element(by.id('distance-error'));

  this.mapMarkers = element.all(by.css('#all-locations-map-legend div'));

  this.listViewBtn = element(by.css('.list-view-btn'));
  this.mapViewBtn = element(by.css('.map-view-btn'));

  this.clickShowMore = function (n) {
    for (var i = 0; i < n; i++) {
      this.showMore.click();
    }
  };

  this.clear = function () {
    this.searchInput.clear();
  };

  this.search = function (query) {
    this.searchInput.sendKeys(query);
    this.findIt.click();
  };

  this.firstLocName = function () {
    return this.nthLocName(0);
  };

  this.nthLoc = function (n) {
    return this.locations.get(n);
  };

  this.nthLocName = function (n) {
    return this.nthLoc(n).findElement(by.css('.p-org')).getText();
  };

  this.nthLocDist = function (n) {
    return this.nthLoc(n).findElement(by.css('.distance')).getText();
  };

  this.firstLocDist = function (n) {
    return this.nthLocDist(0);
  };
      
};

module.exports = new LandingPage();
