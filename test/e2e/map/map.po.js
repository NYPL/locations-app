/*jslint indent: 2, maxlen: 80 */
/* globals: element, by, module */
var MapPage = function () {
  'use strict';

  this.name = element(by.binding('location.name'));

  this.hoursToday = element(by.css('.hours-today'));

  this.street_address = element(by.binding('location.street_address'));
  this.locality = element(by.binding('location.locality'));
  this.region = element(by.binding('location.region'));
  this.postal_code = element(by.binding('location.postal_code'));

  // The element that holds the Google map
  this.map = element(by.css('.gm-style'));
};

module.exports = new MapPage();