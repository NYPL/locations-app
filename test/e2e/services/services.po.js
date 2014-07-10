/*jslint indent: 2, maxlen: 80 */
/* globals: element, by, module */

var ServicesPage = function () {
  'use strict';

  this.serviceName = element(by.binding('service_name'));
  this.locationName = element(by.binding('location.name'));

  this.services = element.all(by.repeater('service in services'));
  this.locations = element.all(by.repeater('location in locations'));
};

module.exports = new ServicesPage();