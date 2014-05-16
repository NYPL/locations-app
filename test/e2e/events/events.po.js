/*jslint indent: 2, maxlen: 80 */
/* globals: element, by, module */
var EventsPage = function () {
  'use strict';

  this.name = element(by.binding('location.name'));

  this.hoursToday = element(by.css('.hours-today'));

  this.events = element.all(by.repeater('event in location._embedded.events'));
};

module.exports = new EventsPage();