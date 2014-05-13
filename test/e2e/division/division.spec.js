/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
describe('Locations: division', function () {
  'use strict';

  var divisionPage = require('./division.po.js');

  // These tests are specific to a division
  beforeEach(function () {
    browser.get('/#/division/manuscripts-division');
    browser.waitForAngular();
  });

  it('should display the name', function () {
    expect(divisionPage.name.getText())
      .toEqual('Manuscripts and Archives Division');
  });

  it('should say what library it is located in', function () {
    expect(divisionPage.location.getText())
      .toEqual('SASB');
  });

  it('should have a floor and room number', function () {
    // Seemds like element(by.binding()) gets the text between tags,
    // even if there are two different {{bindings}} between those tags.
    expect(divisionPage.floor.getText()).toEqual('Third Floor and Room #328');
    expect(divisionPage.room.getText()).toEqual('Third Floor and Room #328');
  });

  it('should display two social media icons', function () {
    var social_media = divisionPage.social_media;
    expect(social_media.count()).toBe(2);
  });

  it('should have a manager', function () {
    expect(divisionPage.division_manager.getText())
      .not.toBe('');
  });

  it('should display hours for today', function () {
    expect(divisionPage.hoursToday.getText()).not.toEqual('');
  });

  it('should display hours for all seven days', function () {
    var hours = divisionPage.hours;
    expect(hours.count()).toBe(7);
  });

  it('should have a short blurb about the division', function () {
    expect(divisionPage.about_blurb.isPresent()).toBe(true);
  });

  it('should have three blogs on the page', function () {
    var blogs = divisionPage.blogs;
    expect(blogs.count()).toBe(3);
  });

});
