/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var LocationPage = function () {
  'use strict';

  this.alert = element(by.binding('libraryAlert'));

  this.name = element(by.binding('location.name'));
  this.image = element(by.css('#container__image img'));

  this.street_address = element(by.binding('location.street_address'));
  this.locality = element(by.binding('location.locality'));
  this.region = element(by.binding('location.region'));
  this.postal_code = element(by.binding('location.postal_code'));

  this.manager = element(by.binding('location.contacts.manager'));

  this.accessibility = element(by.css('#accessibility__container div'));
  this.directions_link = element(by.css('.map-directions a'));
  this.catalog_link = element(by.id('catalog-link'));

  this.social_media_container = element(by.id('social_media'));
  this.social_media =
    element.all(by.repeater('social in location.social_media'));

  this.hoursToday = element(by.css('.hours-today'));
  this.hours = element.all(by.repeater('hours in location.hours.regular'));

  this.allAmenities = element(by.css('#all_amenities'));

  this.divisions_container = element(by.id('container__divisions'));
  this.divisions =
    element.all(by.repeater('division in location._embedded.divisions'));

  this.featured_container = element(by.id('container__features'));
  this.features =
    element.all(by.repeater('feature in location._embedded.features'));


  this.events_container = element(by.id('container__events'));
  this.events = element.all(by.repeater('event in location._embedded.events'));
  this.events_more_link = element(by.css('.events-more'));

  this.google = element.all(by.css('.google_link'));
  this.yahoo = element.all(by.css('.yahoo_link'));

  this.plan_your_visit = element(by.id('plan-your-visit'));
  this.secondary_image = element(by.id('location-secondary-img'));
  this.about = element(by.binding('location.about'));
  this.about_learn_more = element(by.id('about')).element('.read-more');
  this.email_librarian = element(by.id('ask-librarian'));

  this.blogs_container = element(by.id('container__blogs'));
  this.blogs = element.all(by.repeater('blog in location._embedded.blogs'));
  this.blogs_more_link = element(by.css('.blogs-more'));

  this.exhibitions =
    element.all(by.repeater('exhibition in location._embedded.exhibitions'));

  this.askNYPL = element(by.css('.askchat'));
  this.email_us = element(by.css('.askemail'));
};

module.exports = new LocationPage();
