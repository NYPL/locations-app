/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Locations: division - Testing General Research Division',
  function () {
    'use strict';

    var divisionPage = require('./division.po.js'),
      httpBackendMock = function () {
        var bad_response = {
          location: {
            "_id": "GRD",
            "_links": {},
            "about": "",
            "access": "Fully Accessible",
            "contacts": {
              "phone": "(212) 275-6975",
              "email": "grdref@nypl.org"
            },
            "cross_street": null,
            "floor": null,
            "geolocation": {
              "type": "Point",
              "coordinates": [
                -73.9822,
                40.7532
              ]
            },
            "hours": {
              "regular": [
                { "day": "Sun", "open": null, "close": null },
                { "day": "Mon", "open": null, "close": null },
                { "day": "Tue", "open": null, "close": null },
                { "day": "Wed", "open": null, "close": null },
                { "day": "Thu", "open": null, "close": null },
                { "day": "Fri", "open": null, "close": null },
                { "day": "Sat", "open": null, "close": null }
              ],
              "exceptions": {}
            },
            "id": "GRD",
            "image": "/sites/default/files/images/stacks.jpg",
            "locality": "New York",
            "location_id": "SASB",
            "location_name": "Stephen A. Schwarzman Building",
            "location_slug": "schwarzman",
            "name": "General Research Division",
            "postal_code": 10018,
            "region": "NY",
            "room": 315,
            "slug": "general-research-division",
            "social_media": [],
            "street_address": "135 East 46th Street",
            "type": "circulating",
            "_embedded": {
              "services": [],
              "events": [],
              "exhibitions": null,
              "blogs": [],
              "alerts": [],
              "divisions": []
            }
          }
        };

        angular.module('httpBackendMock', ['ngMockE2E'])
          .run(function ($httpBackend) {
            $httpBackend.when('GET', 'http://evening-mesa-7447-160' +
                '.herokuapp.com/divisions/general-research-division')
              .respond(bad_response);

            // For everything else, don't mock
            $httpBackend.whenGET(/^\w+.*/).passThrough();
            $httpBackend.whenGET(/.*/).passThrough();
            $httpBackend.whenPOST(/^\w+.*/).passThrough();
          });

        // angular.module('nypl_locations').requires.push('httpBackendMock');
      };

    describe('Good API call', function () {
      // These tests are specific to a division
      beforeEach(function () {
        browser.get('/#/division/general-research-division');
        browser.waitForAngular();
      });

      it('should display the name', function () {
        expect(divisionPage.name.getText())
          .toEqual('General Research Division');
      });

      it('should say what library it is located in', function () {
        expect(divisionPage.location.getText())
          .toEqual('Stephen A. Schwarzman Building');
      });

      it('should have a floor and room number', function () {
        // Seemds like element(by.binding()) gets the text between tags,
        // even if there are two different {{bindings}} between those tags.
        expect(divisionPage.floor.getText())
          .toEqual('Third Floor and Room #315');
        expect(divisionPage.room.getText()).toEqual('and Room #315');
      });

      it('should display two social media icons', function () {
        var social_media = divisionPage.social_media;
        expect(social_media.count()).toBe(4);
        expect(divisionPage.social_media_container.isPresent()).toBe(true);
      });

      it('should have a manager', function () {
        expect(divisionPage.division_manager.getText())
          .toEqual('Marie Coughlin');
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

    describe('Bad API call', function () {
      beforeEach(function () {
        browser.addMockModule('httpBackendMock', httpBackendMock);
        browser.get('/#/division/general-research-division');
        browser.waitForAngular();
      });

      it('should displayed closed hours', function () {
        expect(divisionPage.hoursToday.getText()).toEqual('Closed Today');
      });

      it('should not display any social media icons', function () {
        expect(divisionPage.social_media_container.isPresent()).toBe(false);
        expect(divisionPage.social_media.count()).toBe(0);
      });

      it('should not display the division manager', function () {
        expect(divisionPage.division_manager.isPresent()).toBe(false);
      });

      it('should not have any events', function () {
        expect(divisionPage.events_container.isPresent()).toBe(false);
        expect(divisionPage.events.count()).toBe(0);
      });

      it('should not have any blogs', function () {
        expect(divisionPage.blogs_container.isPresent()).toBe(false);
        expect(divisionPage.blogs.count()).toBe(0);
      });

    });

  });
