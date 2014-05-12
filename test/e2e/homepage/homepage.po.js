var LandingPage = function () {
  // Search Box
  this.searchInput = element(by.id('searchTerm'));
  // Submit search button
  this.findIt = element(by.id('findit'));
  // Showing results near message
  this.resultsNear = element(by.id('resultsnear'));
  // Clear search link
  this.clearSearch = element(by.id('clearsearch'));
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
  this.distanceError = element(by.id('distanceerror'));

  this.mapMarkers = element.all(by.css('#all-locations-map-legend span'));

  this.search = function (query) {
    this.searchInput.sendKeys(query);
    this.findIt.click();
  };

};

module.exports = new LandingPage();
