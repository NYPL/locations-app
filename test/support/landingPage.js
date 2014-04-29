var LandingPage = function () {
  this.searchInput = element(by.input('searchLocations'));

  // Results list
  this.locations = element.all(by.repeater('location in locations'));

  // Show only research button
  this.onlyResearch = element(by.id('onlyresearch'));

  // Show More results button
  this.showMore = element(by.id('showmore'));
  // Results list showing X of Y message
  this.showing = element(by.id('showing'));


  this.search = function (query) {
    this.searchInput.sendKeys(query);
  };

};

module.exports = new LandingPage();
