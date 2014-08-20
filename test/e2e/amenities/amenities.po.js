/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var ServicesPage = function () {
  'use strict';

  this.title = element(by.css('#amenities__title'));

  // Either amenity or location name
  this.amenity_name = element(by.binding('amenity_name'));
  this.location_name = element(by.binding('location.name'));


  this.locations = element.all(by.repeater('location in locations'));

  this.amenities_categories =
    element.all(by.repeater('category in amenitiesCategories'));

  this.amenities = element.all(by.repeater('amenity in category.amenities'));

  // Services callout
  this.services_callout = element(by.css('.services-callout'));
};

module.exports = new ServicesPage();