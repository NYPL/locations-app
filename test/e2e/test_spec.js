describe('Locations: homepage', function () {
  beforeEach(function () {
    browser.get('/');
    ptor = protractor.getInstance();
  });

  it('should display the homepage', function () {
    var ele = by.css('.coordinates');
    expect(ptor.isElementPresent(ele)).toBe(true);
  });

  it('should have 91 items by default', function () {
    var elems = element.all(by.repeater('location in locations'));
    expect(elems.count()).toBe(91);
  });

  it('should have one item after search', function () {
    //element(by.input('searchLocations')).sendKeys('jefferson market');
    element(by.model('searchLocations')).sendKeys('jefferson market');
    var elems = element.all(by.repeater('location in locations'));
    expect(elems.count()).toBe(1);
  });

  it('should search by zip code', function () {
    element(by.model('searchLocations')).sendKeys('10018');
    var elems = element.all(by.repeater('location in locations'));
    expect(elems.count()).toBe(1);
  });

});