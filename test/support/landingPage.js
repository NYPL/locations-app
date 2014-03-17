var LandingPage = function () {
  this.searchInput = element(by.input('searchLocations'));
  this.locations = element.all(by.repeater('location in locations'));

  this.search = function (query) {
    this.searchInput.sendKeys(query);
  };

};

module.exports = new LandingPage();