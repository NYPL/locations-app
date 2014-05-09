describe('Locations: map', function () {
  'use strict';

  var mapPage = require('./map.po.js');

  beforeEach(function () {
    browser.get('/#/115-street/map');
    browser.waitForAngular();
  });

  it('should display the name', function () {
    expect(mapPage.name.getText()).toEqual('Directions to 115th Street Library');
  });

});