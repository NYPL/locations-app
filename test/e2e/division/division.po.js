/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var DivisionPage = function () {
  'use strict';

  this.alert = element(by.binding('libraryAlert.desc'));
  this.name = element(by.binding('division.name'));

  this.location = element(by.binding('division.location_name'));
  this.floor = element(by.binding('division.floor'));
  this.room = element(by.binding('division.room'));

  this.street_address = element(by.binding('division.street_address'));
  this.cross_street = element(by.binding('division.cross_street'));
  this.locality = element(by.binding('division.locality'));
  this.region = element(by.binding('division.region'));
  this.postal_code = element(by.binding('division.postal_code'));

  this.division_manager = element(by.binding('division.contacts.manager'));
  this.telephone = element(by.binding('division.contacts.phone'));

  this.accessibility = element(by.css('.accessible'));

  this.social_media_container = element(by.id('social_media'));
  this.social_media =
    element.all(by.repeater('social in division.social_media'));

  this.hoursToday = element(by.css('.hours-today'));
  this.hours = element.all(by.repeater('hours in division.hours.regular'));

  this.about_blurb = element(by.binding('division.about'));

  this.events_container = element(by.css('.container__events'));
  this.events = element.all(by.repeater('event in division._embedded.events'));

  this.blogs_container = element(by.css('.container__blogs'));
  this.blogs = element.all(by.repeater('blog in division._embedded.blogs'));

  this.ask_librarian = element(by.css('#ask-librarian'));
  this.email_us = element(by.css('.askemail'));
};

module.exports = new DivisionPage();
