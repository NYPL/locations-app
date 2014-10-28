/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var WidgetPage = function () {
  'use strict';

  // Location/Division
  this.image = element(by.css('#container__image img'));

  this.street_address = element(by.css('.p-street-address'));
  this.locality = element(by.css('.p-locality'));
  this.region = element(by.css('.p-region'));
  this.postal_code = element(by.css('.p-postal-code'));
  this.telephone = element(by.css('.p-tel'));
  this.manager = element(by.css('.p-manager'));

  this.accessibility = element(by.css('#accessibility__container div'));
  this.directions_link = element(by.css('.map-directions a'));
  this.catalog_link = element(by.id('catalog-link'));

  this.social_media_container = element(by.id('social_media'));
  this.social_media =
    element.all(by.repeater('social in data.social_media'));

  this.hours_container = element(by.id('container__hours'));
  this.hoursToday = element(by.css('.hours-today'));
  this.hours = element.all(by.repeater('hours in location.hours.regular'));
  this.hours_closed = element(by.css('.branch-closed'));

  this.locinator_url = element(by.css('.learn-more a'));

  this.appeal = element(by.css('.appeal'));
  this.donate_btn = element(by.css('.btn--donate'));

  this.askNYPL = element(by.css('.askchat'));
  this.email_us = element(by.css('.askemail'));

  // Division specific
  this.location_name = element(by.css('.location-name'));

  this.floor = element(by.binding('data.floor'));
  this.room = element(by.binding('data.room'));
};

module.exports = new WidgetPage();
