/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
describe('Locations: events', function () {
  'use strict';

  var eventsPage = require('./events.po.js');

  beforeEach(function () {
    browser.get('/#/115th-street/events');
    browser.waitForAngular();
  });

  it('should display the name', function () {
    expect(eventsPage.name.getText()).toEqual('115th Street Library');
  });

  it('should display hours for today', function () {
    // Hours change everyday
    expect(eventsPage.hoursToday.getText()).not.toEqual('');
  });

  it('should display three evnets on the page', function () {
    expect(eventsPage.events.count()).toBe(3);
  });

});