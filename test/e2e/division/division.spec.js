/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('Locations: Division - Testing General Research Division',
  function () {
    'use strict';

    var divisionPage = require('./division.po.js'),
      // Get json for a division API call.
      APIresponse = require('../APImocks/division.js'),
      // Function that creates a module that is injected at run time,
      // overrides and mocks httpbackend to mock API call. 
      httpBackendMock = function (response) {
        angular.module('httpBackendMock', ['ngMockE2E'])
          .run(function ($httpBackend) {
            $httpBackend.when('GET', 'http://evening-mesa-7447-160' +
                '.herokuapp.com/divisions/general-research-division')
              .respond(response);

            // For everything else, don't mock
            $httpBackend.whenGET(/^\w+.*/).passThrough();
            $httpBackend.whenGET(/.*/).passThrough();
            $httpBackend.whenPOST(/^\w+.*/).passThrough();
          });
      };

    describe('Good API call', function () {
      beforeEach(function () {
        // Pass the good JSON from the API call.
        browser.addMockModule('httpBackendMock', httpBackendMock,
          APIresponse.good);
        browser.get('/#/division/general-research-division');
        browser.waitForAngular();
      });

      describe('Division top information section', function () {
        it('should display an alert message', function () {
          expect(divisionPage.alert.isPresent()).toBe(true);
          // Very long and deep way to get the alert text but it works:
          expect(divisionPage.alert.getText())
            .toEqual(APIresponse.good.division.hours.exceptions.description);
        });

        it('should display the name', function () {
          expect(divisionPage.name.getText())
            .toEqual('General Research Division');
        });

        it('should say what library it is located in', function () {
          expect(divisionPage.location.getText())
            .toEqual('Stephen A. Schwarzman Building');
        });

        it('should have an address', function () {
          expect(divisionPage.street_address.getText())
            .toEqual('Fifth Avenue at 42nd Street');
          expect(divisionPage.cross_street.isPresent()).toBe(false);
          // element(by.binding()) groups together multiple data bindings
          // if they are in the same element. That is why divisionPage.locality
          // contains the full second part of the address.
          expect(divisionPage.locality.getText()).toEqual('New York, NY 10018');
        });

        it('should have a floor and room number', function () {
          expect(divisionPage.floor.getText())
            .toEqual('Third Floor and Room 315');
          expect(divisionPage.room.getText()).toEqual('and Room 315');
        });

        it('should have a manager', function () {
          expect(divisionPage.division_manager.getText())
            .toEqual('Marie Coughlin');
        });

        it('should have a telephone number', function () {
          expect(divisionPage.telephone.getText()).toEqual('(917) 275-6975');
        });

        it('should be fully accessible', function () {
          expect(divisionPage.accessibility.getText())
            .toEqual('Fully Accessible');
          expect(divisionPage.accessibility.getAttribute('class'))
            .toContain('icon-accessibility');
          expect(divisionPage.accessibility.getAttribute('class'))
            .toContain('fully');
        })

        it('should display four social media icons', function () {
          var social_media = divisionPage.social_media;
          expect(social_media.count()).toBe(4);
          expect(divisionPage.social_media_container.isPresent()).toBe(true);
        });

        it('should display hours for today', function () {
          expect(divisionPage.hoursToday.getText()).not.toEqual('');
        });

        it('should display hours for all seven days', function () {
          expect(divisionPage.hours.count()).toBe(7);
        });

        it('should be closed on Sunday', function () {
          expect(divisionPage.hours.first().getText()).toEqual('Sun Closed');
        });
      });

      describe('About the Collection section', function () {
        it('should display an image from the colletcion', function () {

        });

        it('should have a short blurb about the division', function () {
          expect(divisionPage.about_blurb.isPresent()).toBe(true);
        });

        describe('Plan your visit section', function () {
          it('should not have a Make an Appointment link', function () {

          });

          it('should have an Email a Librarian link', function () {

          });

          it('should display three amenities', function () {

          });
        });
      });

      describe('Featured content section', function () {
        it('should display two featured pieces of content', function () {

        });
      });

      describe('Blogs section', function () {
        it('should have six blogs on the page', function () {
          var blogs = divisionPage.blogs;
          expect(blogs.count()).toBe(6);
        });
      });

      describe('Footer section', function () {
        describe('Donate Now', function () {

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
    });

    describe('Bad API call', function () {
      beforeEach(function () {
        browser.addMockModule('httpBackendMock', httpBackendMock,
          APIresponse.bad);
        browser.get('/#/division/general-research-division');
        browser.waitForAngular();
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
