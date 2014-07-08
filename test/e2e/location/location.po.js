/*jslint indent: 2, maxlen: 80 */
/* globals: element, by, module */
var LocationPage = function () {
  'use strict';

  this.name = element(by.binding('location.name'));
  this.image = element(by.css('#container__image img'));

  this.street_address = element(by.binding('location.street_address'));
  this.locality = element(by.binding('location.locality'));
  this.region = element(by.binding('location.region'));
  this.postal_code = element(by.binding('location.postal_code'));

  this.manager = element(by.binding('location.contacts.manager'));
  this.social_media =
    element.all(by.repeater('social in location.social_media'));

  this.hoursToday = element(by.css('.hours-today'));
  this.hours = element.all(by.repeater('hours in location.hours.regular'));

  this.divisions_container = element(by.id('container__divisions'));
  this.divisions =
    element.all(by.repeater('division in location._embedded.divisions'));

  this.events_container = element(by.id('container__events'));
  this.events = element.all(by.repeater('event in location._embedded.events'));
  this.google = element(by.css('.google_link'));
  this.yahoo = element(by.css('.yahoo_link'));

  this.plan_your_visit = element(by.id('plan-your-visit'));
  this.secondary_image = element(by.id('location-secondary-img'));
  this.about = element(by.binding('location.about'));

  this.blogs_container = element(by.id('container__blogs'));
  this.blogs = element.all(by.repeater('blog in location._embedded.blogs'));

  this.exhibitions =
    element.all(by.repeater('exhibition in location._embedded.exhibitions'));
};

module.exports = new LocationPage();