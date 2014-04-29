describe('Locations: homepage', function () {
  // Check ../support/landingPage.js for code
  var landingPage = require('../support/landingPage.js');

  beforeEach(function () {
    browser.get('/');
    browser.waitForAngular();
  });

  describe('Search box', function() {
    beforeEach(function () {
      landingPage.search('aguilar');
      browser.sleep(1000); // must be a better way
    });

    it('should show what the search was', function () {
      expect(landingPage.resultsNear.getText())
        .toEqual('Showing search results near aguilar');
    });

    it('should search by location name', function () {
      expect(
        element.all(by.repeater('location in locations'))
          .first().findElement(by.css('.p-org')).getText()
        ).toEqual('Aguilar Library');
    });

    it('should have one highlighted location', function () {
      expect(element.all(by.css('.callout')).count()).toBe(1);
      expect(
        element.all(by.repeater('location in locations'))
          .first().getAttribute('class')
        ).toContain('callout');
    });

    it('should clear the input when you click the \'x\'', function () {
      expect(landingPage.searchInput.getAttribute('value')).toEqual('aguilar');
      landingPage.clearSearch.click();
      expect(landingPage.searchInput.getAttribute('value')).toEqual('');
    });

        
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


