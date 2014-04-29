describe('Locations: homepage', function () {
  // Check ../support/landingPage.js for code
  var landingPage = require('../support/landingPage.js');

  beforeEach(function () {
    browser.get('/');
    browser.waitForAngular();
  });

  it('should show 10 items by default', function () {
    var locations = landingPage.locations;
    expect(locations.count()).toBe(10);
    expect(landingPage.showing.getText()).toEqual('Showing 10 of 92 Locations')
  });

  it('should show the next 10 items', function () {
    var locations = landingPage.locations;
    landingPage.showMore.click()
    expect(landingPage.locations.count()).toBe(20);
    expect(landingPage.showing.getText()).toEqual('Showing 20 of 92 Locations')
  });

  it('should filter by research libraries', function () {
      var only_r = landingPage.onlyResearch;
      expect(only_r.getText()).toEqual('only research libraries');
      only_r.click();
      expect(landingPage.locations.count()).toBe(4);
      expect(only_r.getText()).toEqual('all branches');
      only_r.click();
      expect(landingPage.locations.count()).toBe(10);
  });

});


