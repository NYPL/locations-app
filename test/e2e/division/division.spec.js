/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Locations: Division - Testing General Research Division',
  function () {
    'use strict';

    var divisionPage = require('./division.po.js');

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
          .toEqual('Third Floor and Room 315');
        expect(divisionPage.room.getText()).toEqual('and Room 315');
      });

      it('should display four social media icons', function () {
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

      it('should have six blogs on the page', function () {
        var blogs = divisionPage.blogs;
        expect(blogs.count()).toBe(6);
      });

      describe('Email a librarian link', function () {
        it('should have a link', function () {
          expect(divisionPage.ask_librarian.getAttribute('href'))
            .toEqual('http://www.questionpoint.org/crs/servlet/org.oclc.admin' +
              '.BuildForm?institution=13306&type=1&language=1');
        });

        it('should be the same as the Email Us button', function () {
          expect(divisionPage.ask_librarian.getAttribute('href'))
            .toEqual(divisionPage.email_us.getAttribute('href'));
        });
      });
    });

    describe('Bad API call', function () {
      var bad_response = require('../responses/bad_division.js');
      var httpBackendMock = function () {
        var bad_response = arguments[0];
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
      beforeEach(function () {
        browser.addMockModule('httpBackendMock', httpBackendMock, bad_response);
        browser.get('/#/division/general-research-division');
        browser.waitForAngular();
        browser.sleep(4000);
      });

      // it('should displayed closed hours', function () {
      //   expect(divisionPage.hoursToday.getText()).toEqual('Closed Today');
      // });

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
