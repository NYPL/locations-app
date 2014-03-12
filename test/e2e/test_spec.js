describe('Locations: homepage', function () {
  // Check ../support/landingPage.js for code
  var landingPage = require('../support/landingPage.js');

  beforeEach(function () {
    browser.get('/');
    browser.waitForAngular();
  });

  // better tests are needed for coordinates
  it('should display the coordinates', function () {
    var ele = by.css('.coordinates');
    expect(element(ele).isPresent()).toBe(true);
  });

  it('should have 91 items by default', function () {
    var locations = landingPage.locations;
    expect(locations.count()).toBe(91);
  });

  it('should have one item after searching', function () {
    landingPage.search('jefferson market');
    var locations = landingPage.locations;
    expect(locations.count()).toBe(1);
  });

  it('should search by zip code', function () {
    landingPage.search('10018');
    var locations = landingPage.locations;
    expect(locations.count()).toBe(1);
  });

});


// describe('Location Service', function () {
//   beforeEach(module('locationService'));


// });