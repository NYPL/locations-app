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
        var API_URL = 'http://dev.locations.api.nypl.org/api/v0.6';

        angular.module('httpBackendMock', ['ngMockE2E'])
          .run(function ($httpBackend) {
            // $httpBackend.whenGET('languages/en.json').passThrough();

            $httpBackend
              .whenJSONP(API_URL +
                '/divisions/general-research-division?callback=JSON_CALLBACK')
              .respond(response);

            $httpBackend
              .whenJSONP(API_URL + '/alerts?callback=JSON_CALLBACK')
              .respond({});

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
        browser.get('/divisions/general-research-division');
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

        it('should display the divisions image', function () {
          expect(divisionPage.main_image.isPresent()).toBe(true);
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
          expect(divisionPage.floor.getText()).toEqual('Third Floor');
          expect(divisionPage.room.getText()).toEqual(', Room 315');
        });

        it('should have a manager', function () {
          expect(divisionPage.division_manager.getText())
            .toEqual('Marie Coughlin');
        });

        it('should have a telephone number', function () {
          expect(divisionPage.telephone.getText()).toEqual('(917) 275-6975');
        });

        it('should be fully accessible and display appropriate icon',
          function () {
            expect(divisionPage.accessibility.getText())
              .toEqual('Fully Accessible');
            expect(divisionPage.accessibility.getAttribute('class'))
              .toContain('accessible');
          });

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
        it('should display the container', function () {
          expect(divisionPage.about_container.isPresent()).toBe(true);
        });

        it('should display an image from the collection', function () {
          expect(divisionPage.second_image.isPresent()).toBe(true);
        });

        it('should have a short blurb about the division', function () {
          expect(divisionPage.about_blurb.isPresent()).toBe(true);
        });

        it('should have a \'Learn More\' link going to nypl.org', function () {
          expect(divisionPage.learn_more_link.getAttribute('href'))
            .toEqual('http://nypl.org/about/divisions/' +
              'general-research-division');
        });

        describe('Plan your visit section', function () {
          it('should not have a \'Make an Appointment\' link', function () {
            expect(divisionPage.make_appointment.isPresent()).toBe(false);
          });

          it('should have an Email a Librarian link', function () {
            expect(divisionPage.email_librarian.getAttribute('href'))
              .toEqual('http://www.questionpoint.org/crs/servlet/org.' +
                'oclc.admin.BuildForm?institution=13306&type=1&language=1');
          });

          it('should display three amenities', function () {
            var amenities = [
              'Reserve a Computer',
              'Interlibrary Loan',
              'Meeting Rooms'
            ];
            divisionPage.division_amenities.each(function (element, index) {
              expect(element.getText()).toEqual(amenities[index]);
            });
          });
        });
      });

      describe('Featured content section', function () {
        it('should display the section', function () {
          expect(divisionPage.features_container.isPresent()).toBe(false);
        });
      });

      describe('Events section', function () {
        it('should not display the container or events', function () {
          expect(divisionPage.events_container.isPresent()).toBe(false);
          expect(divisionPage.events.count()).toBe(0);
        });
      });

      describe('Blogs section', function () {
        it('should have six blogs on the page', function () {
          expect(divisionPage.blogs_container.isPresent()).toBe(true);
          expect(divisionPage.blogs.count()).toBe(6);
        });

        it('should have a \'See more blogs\' link going to nypl.org',
          function () {
            expect(divisionPage.blogs_more_link.getAttribute('href'))
              .toEqual('http://nypl.org/blog/library/394');
          });
      });

      describe('Footer section', function () {
        describe('Donate Now', function () {
          it('should have a donate section', function () {
            expect(divisionPage.ask_donate.isPresent()).toBe(true);
          });
        });

        describe('Email a librarian link', function () {
          it('should have a link', function () {
            expect(divisionPage.ask_librarian.getAttribute('href'))
              .toEqual('http://www.questionpoint.org/crs/servlet/org.oclc.' +
                'admin.BuildForm?institution=13306&type=1&language=1');
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
        browser.get('/divisions/general-research-division');
        browser.waitForAngular();
      });

      it('should not display any social media icons', function () {
        expect(divisionPage.social_media_container.isPresent()).toBe(false);
        expect(divisionPage.social_media.count()).toBe(0);
      });

      it('should not display the division manager', function () {
        expect(divisionPage.division_manager.isPresent()).toBe(false);
      });

      it('should not have any blogs', function () {
        expect(divisionPage.blogs_container.isPresent()).toBe(false);
        expect(divisionPage.blogs.count()).toBe(0);
      });
    });

  });
