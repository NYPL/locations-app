describe('Locations: division', function () {
  'use strict';

  var mapPage = require('./division.po.js');

  beforeEach(function () {
    browser.get('/#/division/photography-collection');
    browser.waitForAngular();
  });

  it('should display the name', function () {
    expect(mapPage.name.getText()).toEqual('The Miriam and Ira D. Wallach'+
      ' Division of Art, Prints and Photographs: Photography Collection');
  });

});