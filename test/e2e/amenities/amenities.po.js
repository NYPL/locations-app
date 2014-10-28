/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var AmenitiesPage = function () {
  'use strict';

  // /amenities
  this.title = element(by.css('#amenities__title'));

  this.amenities_categories =
    element.all(by.repeater('category in amenitiesCategories'));
  this.getNthCategory = function (n) {
    return this.amenities_categories.get(n);
  };

  // /amenities/:id
  this.amenity_name = element(by.binding('amenity_name'));
  this.locations = element.all(by.repeater('location in locations'));
  this.action_link = element(by.css('.amenities__reserve'));
  this.learn_more = element(by.css('.read-more'));

  // /amenities/location/:location-slug
  this.location_name = element(by.css('#location_name'));

  // Services callout
  this.services_callout = element(by.css('.services-callout'));
};

module.exports = new AmenitiesPage();