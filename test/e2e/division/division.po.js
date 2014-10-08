/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var DivisionPage = function () {
  'use strict';

  // Top Information section
  this.alert = element(by.binding('libraryAlert'));

  this.name = element(by.binding('division.name'));
  this.main_image = element(by.css('.main_division_image'));

  this.location = element(by.binding('division.location_name'));
  this.street_address = element(by.binding('division.street_address'));
  this.cross_street = element(by.binding('division.cross_street'));
  this.floor = element(by.binding('division.floor'));
  this.room = element(by.binding('division.room'));
  this.locality = element(by.binding('division.locality'));
  this.region = element(by.binding('division.region'));
  this.postal_code = element(by.binding('division.postal_code'));

  this.division_manager = element(by.binding('division.contacts.manager'));
  this.telephone = element(by.binding('division.contacts.phone'));
  this.accessibility = element(by.css('#accessibility__container div'));

  this.social_media_container = element(by.id('social_media'));
  this.social_media =
    element.all(by.repeater('social in division.social_media'));

  this.hoursToday = element(by.css('.hours-today'));
  this.hours = element.all(by.repeater('hours in division.hours.regular'));

  // About the Collection section
  this.about_container = element(by.css('.container__about'));
  this.second_image = element(by.css('.division_second_image'));
  this.about_blurb = element(by.binding('division.about'));
  this.learn_more_link = element(by.css('.collection-more'));

  // Plan Your Visit section
  this.make_appointment = element(by.binding('division._links.concierge.href'));
  this.email_librarian = element(by.css('#ask-librarian'));
  this.division_amenities = element.all(by.css('.division_amenities li'));

  // Featured Content section
  this.features_container = element(by.css('#container__features'));

  // Events section
  this.events_container = element(by.css('.container__events'));
  this.events = element.all(by.repeater('event in division._embedded.events'));

  // Blogs section
  this.blogs_container = element(by.css('#container__blogs'));
  this.blogs = element.all(by.repeater('blog in division._embedded.blogs'));
  this.blogs_more_link = element(by.css('.blogs-more'));

  // Footer section
  this.ask_donate = element(by.css('.ask-donate'));
  this.ask_librarian = element(by.css('#ask-librarian'));

  this.askNYPL = element(by.css('.askchat'));
  this.email_us = element(by.css('.askemail'));
};

module.exports = new DivisionPage();
