/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */

describe('Locations: homepage', function () {
  "use strict";

  // Check ../support/landingPage.js for code
  var landingPage = require('./homepage.po.js'),
    APIresponse = require('../APImocks/homepage.js'),
    httpBackendMock = function (response) {
      var API_URL = 'http://locations-api-alpha.herokuapp.com';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          $httpBackend.whenGET('/languages/en.json').passThrough();
          $httpBackend
            .whenGET('/config')
            .respond({ config: { api_root: API_URL } });

          $httpBackend
            .whenJSONP(API_URL + '/locations?callback=JSON_CALLBACK')
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

  beforeEach(function () {
    // Pass the good JSON from the API call.
    browser.addMockModule('httpBackendMock', httpBackendMock, APIresponse.good);
    browser.get('/');
    browser.waitForAngular();
  });

  describe('Geolocation', function () {
    function mockGeo(lat, lon) {
      return 'window.navigator.geolocation.getCurrentPosition = ' +
        '       function (success, error) {' +
        '           var position = {' +
        '               "coords" : {' +
        '                   "latitude": "' + lat + '",' +
        '                   "longitude": "' + lon + '"' +
        '               }' +
        '           };' +
        '           success(position);' +
        '       }';
    }

    function mockGeoError(code) {
      return 'window.navigator.geolocation.getCurrentPosition = ' +
        '       function (success, error) {' +
        '           var err = {' +
        '               code: ' + code + ',' +
        '               PERMISSION_DENIED: 1,' +
        '               POSITION_UNAVAILABLE: 2,' +
        '               TIMEOUT: 3' +
        '           };' +
        '           error(err);' +
        '       }';
    }

    describe('Successful - mocked coordinates based on SASB', function () {
      beforeEach(function () {
        // Coordinates based on SASB
        browser.executeScript(mockGeo(40.7529, -73.9821));
      });

      describe('List View', function () {
        it('should locate you and show your estimated address', function () {
          landingPage.currLoc.click();
          browser.sleep(1500);
          // "Showing search results near ...."
          expect(landingPage.resultsNear.isPresent()).toBe(true);
          expect(landingPage.resultsNear.getText())
            .toMatch(/Showing search results near/);
        });

        it('should locate you and sort the list of locations by distance',
          function () {
            // The list is initially sorted by name - there is
            // no distance set for any location
            expect(landingPage.firstLocName()).toEqual('115th Street Library');

            // It seems you need to give it some time for the text
            // to render
            landingPage.currLoc.click();
            browser.sleep(1500);

            expect(landingPage.resultsNear.isPresent()).toBe(true);
            // The closest location to you
            expect(landingPage.firstLocDist()).toEqual('Distance: 0.03 miles');
            expect(landingPage.firstLocName())
              .toEqual('Stephen A. Schwarzman Building');

            expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.08 miles');
            expect(landingPage.nthLocName(1)).toEqual('Mid-Manhattan Library');
          });

        it('should reset the location list when the searchbox \'x\' is clicked',
          function () {
            landingPage.currLoc.click();
            browser.sleep(1500);

            expect(landingPage.resultsNear.isPresent()).toBe(true);
            expect(landingPage.firstLocName())
              .toEqual('Stephen A. Schwarzman Building');

            // Click the 'X'
            landingPage.clearSearch.click();

            expect(landingPage.resultsNear.isPresent()).toBe(false);
            expect(landingPage.firstLocName()).toEqual('115th Street Library');
          });
      });

      describe('Map View', function () {
        beforeEach(function () {
          // Go to map view
          // NOTE: Now that we're using ui-router, we must wait for angular
          // to finish loading the state before testing for page elements.
          landingPage.mapViewBtn.click();
          browser.waitForAngular();
          browser.sleep(1500);
        });

        it('should locate you and show the blue marker on the map and legend',
          function () {
            // Only the 'NYPL Library' key should be in the map legend
            expect(landingPage.mapMarkers.count()).toEqual(1);
            landingPage.currLoc.click();
            browser.sleep(1500);

            // "Showing search results near ...."
            expect(landingPage.resultsNear.isPresent()).toBe(true);
            // The "Your Current Location" key should show up in the map legend
            expect(landingPage.mapMarkers.count()).toEqual(2);
            expect(landingPage.gmapInfoWindow.getText())
              .toEqual('Your Current Location');
          });

        it('should locate you and sort the list of locations by distance',
          function () {
            // The list is initially sorted by name
            expect(landingPage.firstLocName()).toEqual('115th Street Library');

            landingPage.currLoc.click();
            browser.sleep(1500);

            // The closest location to you
            expect(landingPage.firstLocDist()).toEqual('Distance: 0.03 miles');
            expect(landingPage.firstLocName())
              .toEqual('Stephen A. Schwarzman Building');

            expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.08 miles');
            expect(landingPage.nthLocName(1)).toEqual('Mid-Manhattan Library');
          });

        it('should reset the location list when the searchbox \'x\' is clicked',
          function () {
            landingPage.currLoc.click();
            browser.sleep(1500);

            expect(landingPage.resultsNear.isPresent()).toBe(true);
            expect(landingPage.firstLocName())
              .toEqual('Stephen A. Schwarzman Building');

            // Click the 'X'
            landingPage.clearSearch.click();

            expect(landingPage.resultsNear.isPresent()).toBe(false);
            expect(landingPage.firstLocName()).toEqual('115th Street Library');
          });
      });
    });

    // Error messages show up regardless of List or Map view
    describe('Failure', function () {
      it('should not geolocate if you are too far away and report it',
        function () {
          browser.executeScript(mockGeo(36.149674, -86.813347));
          landingPage.currLoc.click();
          expect(landingPage.distanceError.getText())
            .toContain('You are not within 25 miles of any NYPL library');
        });

      it('should report when permission is denied', function () {
        browser.executeScript(mockGeoError(1));
        landingPage.currLoc.click();
        expect(landingPage.distanceError.getText())
          .toContain('Permission denied.');
      });

      it('should report when location is unavailable', function () {
        browser.executeScript(mockGeoError(2));
        landingPage.currLoc.click();
        expect(landingPage.distanceError.getText())
          .toContain('The position is currently unavailable.');
      });

      it('should report when geolocation times out', function () {
        browser.executeScript(mockGeoError(3));
        landingPage.currLoc.click();
        expect(landingPage.distanceError.getText())
          .toContain('The request timed out.');
      });

      it('should report unknown errors', function () {
        browser.executeScript(mockGeoError(100));
        landingPage.currLoc.click();
        expect(landingPage.distanceError.getText()).toContain('Unknown error.');
      });
    });
  });

  describe('Search box', function () {
    describe('A library name was searched that is not an NYC area' +
      ', using "aguilar" for the test',
      function () {
        beforeEach(function () {
          landingPage.search('aguilar');
          browser.sleep(1500); // must be a better way
        });

        it('should go to the /map page', function () {

        });

        it('should perform a geolocation search and sort by distance',
          function () {
            expect(landingPage.firstLocName()).toEqual('Throg\'s Neck Library');
            expect(landingPage.nthLocDist(0)).toEqual('Distance: 6.5 miles');
            expect(landingPage.nthLocName(1)).toEqual('Soundview Library');
            expect(landingPage.nthLocDist(1)).toEqual('Distance: 6.76 miles');
            expect(landingPage.nthLocName(2)).toEqual('Castle Hill Library');
            expect(landingPage.nthLocDist(2)).toEqual('Distance: 7.08 miles');
          });

        it('should perform a geolocation search and give you back an address',
          function () {
            expect(landingPage.resultsNear.getText())
              .toEqual('Showing search results near Aguilar Avenue, Queens, ' +
                'NY, USA');
             expect(landingPage.gmapInfoWindow.getText())
                .toEqual('Aguilar Avenue\nQueens\nNY, USA');

          });

        describe('Clicking searchbox \'x\'', function () {
          it('should clear the input', function () {
            expect(landingPage.searchInput.getAttribute('value'))
              .toEqual('aguilar');
            landingPage.clearSearch.click();
            expect(landingPage.searchInput.getAttribute('value')).toEqual('');
          });

          it('should reset the list of locations by name', function () {
            expect(landingPage.firstLocName()).toEqual('Throg\'s Neck Library');
            landingPage.clearSearch.click();
            expect(landingPage.firstLocName()).toEqual('115th Street Library');
          });
        });
      });

    describe('A library name was searched that is also an NYC area, ' +
      'using "battery park" for the test',
      function () {
        beforeEach(function () {
          landingPage.search('battery park');
          browser.sleep(1000);
        });

        it('should show what the search was', function () {
          expect(landingPage.resultsNear.getText())
            .toEqual('Showing search results near Battery Park, ' +
              'New York, NY, USA');
        });

        it('should search by location name and be the first result',
          function () {
            expect(landingPage.firstLocName())
              .toEqual('Battery Park City Library');
            expect(landingPage.firstLocDist()).toEqual('Distance: 0.85 miles');
          });

        it('should show other results with distances in order', function () {
          expect(landingPage.nthLocName(1)).toEqual('New Amsterdam Library');
          expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.86 miles');

          expect(landingPage.nthLocName(2)).toEqual('Chatham Square Library');
          expect(landingPage.nthLocDist(2)).toEqual('Distance: 1.29 miles');
        });

        it('should have the returned address in the infowindow', function () {
          expect(landingPage.gmapInfoWindow.getText())
            .toEqual('Battery Park\nNew York\nNY, USA');
        });

        describe('Clicking searchbox \'x\'', function () {
          it('should clear the input', function () {
            expect(landingPage.searchInput.getAttribute('value'))
              .toEqual('battery park');
            landingPage.clearSearch.click();
            browser.sleep(1500);
            expect(landingPage.searchInput.getAttribute('value')).toEqual('');
          });

          it('should reset the list of locations by name', function () {
            expect(landingPage.firstLocName())
              .toEqual('Battery Park City Library');
            landingPage.clearSearch.click();
            browser.sleep(2500);
            expect(landingPage.firstLocName()).toEqual('115th Street Library');
          });
        });
      });

    describe('A location in NYC was searched, testing "bronx zoo"',
      function () {
        beforeEach(function () {
          landingPage.search('bronx zoo');
          browser.sleep(1000);
        });

        it('should show what the search was', function () {
          expect(landingPage.resultsNear.getText())
            .toEqual('Showing search results near Bronx Zoo, ' +
              '2300 Southern Boulevard, Bronx, NY 10460, USA');
        });

        it('should organize the locations by distance - West Farms ' +
          'Library should be first in the list',
          function () {
            // There is a probably a better way to test this
            // The first location that should appear
            expect(landingPage.firstLocName()).toEqual('West Farms Library');
            expect(landingPage.firstLocDist()).toEqual('Distance: 0.51 miles');

            // The next location that should appear on the page
            expect(landingPage.nthLocName(1))
              .toEqual('Belmont Library and Enrico Fermi Cultural Center');
            expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.62 miles');

            expect(
              landingPage.locations.last().element(by.css('.p-org')).getText()
            ).toEqual('Tottenville Library');

            expect(
              landingPage.locations.last()
                .element(by.css('.distance')).getText()
            ).toEqual('Distance: 30.4 miles');
          });

        it('should display the search query on the map with ' +
          'a marker',
          function () {
            expect(landingPage.gmapInfoWindow.getText())
              .toEqual('Bronx Zoo\n2300 Southern Boulevard\n' +
                'Bronx, NY 10460, USA');
          });

        describe('Clicking searchbox \'x\'', function () {
          it('should clear the input', function () {
            expect(landingPage.searchInput.getAttribute('value'))
              .toEqual('bronx zoo');
            landingPage.clearSearch.click();
            browser.sleep(2000);
            expect(landingPage.searchInput.getAttribute('value'))
              .toEqual('');
          });

          it('should reset the list of locations by name', function () {
            expect(landingPage.firstLocName()).toEqual('West Farms Library');
            landingPage.clearSearch.click();
            expect(landingPage.firstLocName()).toEqual('115th Street Library');
          });
        });
      });

    describe('A zipcode in NYC was searched - using "10016" for the test',
      function () {
        beforeEach(function () {
          landingPage.search('10016');
          browser.sleep(1500);
        });

        it('should show what the search was', function () {
          expect(landingPage.resultsNear.getText())
            .toEqual('Showing search results near New York, NY 10016, USA');
        });

        it('should show libraries in the searched zip code first', function () {
          expect(landingPage.firstLocName()).toEqual('Science, Industry and ' +
            'Business Library (SIBL)');
          expect(
            landingPage.nthLoc(0).element(by.css('.p-postal-code')).getText()
          ).toEqual('10016');

          expect(landingPage.nthLocName(1)).toEqual('Kips Bay Library');
          expect(
            landingPage.nthLoc(1).element(by.css('.p-postal-code')).getText()
          ).toEqual('10016');

          expect(landingPage.nthLocName(2)).toEqual('Mid-Manhattan Library');
          expect(
            landingPage.nthLoc(2).element(by.css('.p-postal-code')).getText()
          ).toEqual('10016');
        });

        it('should sort by distance', function () {
          expect(landingPage.nthLocDist(0)).toEqual('Distance: 0.17 miles');
          expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.25 miles');
          expect(landingPage.nthLocDist(2)).toEqual('Distance: 0.33 miles');
          expect(landingPage.nthLocDist(3)).toEqual('Distance: 0.43 miles');
        });

        it('should then search for libraries near the searched ' +
          'zip code sorted by distance',
          function () {
            expect(
              landingPage.nthLoc(3).element(by.css('.p-postal-code')).getText()
            ).toEqual('10018');
            expect(landingPage.nthLocName(3))
              .toEqual('Stephen A. Schwarzman Building');
            expect(landingPage.nthLocDist(3)).toEqual('Distance: 0.43 miles');

            expect(
              landingPage.nthLoc(4).element(by.css('.p-postal-code')).getText()
            ).toEqual('10017');
            expect(landingPage.nthLocName(4)).toEqual('Grand Central Library');
            expect(landingPage.nthLocDist(4)).toEqual('Distance: 0.56 miles');
          });

        it('should have a marker for the searched zip code', function () {
          expect(landingPage.gmapInfoWindow.getText())
            .toEqual('New York\nNY 10016\nUSA');
        });

        describe('Clicking searchbox \'x\'', function () {
          it('should clear the input', function () {
            expect(landingPage.searchInput.getAttribute('value'))
              .toEqual('10016');
            landingPage.clearSearch.click();
            expect(landingPage.searchInput.getAttribute('value')).toEqual('');
          });

          it('should reset the list of locations by name', function () {
            expect(landingPage.firstLocName())
              .not.toEqual('115th Street Library');
            landingPage.clearSearch.click();
            expect(landingPage.firstLocName()).toEqual('115th Street Library');
          });
        });
      });

    describe('A location outside of NYC was searched', function () {
      it('should tell you that your query was too far from any branch',
        function () {
          landingPage.search('boston');
          browser.sleep(1000);

          expect(landingPage.searchError.getText())
            .toEqual('No results for Boston, MA, USA within 25 ' +
              'miles of an NYPL location. Showing all locations.');
        });

      it('should clear the search field', function () {
        landingPage.search('boston');
        browser.sleep(1000);

        expect(landingPage.searchInput.getAttribute('value')).toEqual('');
      });

      it('should refresh the list of locations after a previous search - ' +
        '"city island" was searched first, searching for ' +
        '"boston" results the list',
        function () {
          // User searches for a location:
          landingPage.search('city island');
          browser.sleep(1000);

          // The location list is organized
          expect(landingPage.firstLocName()).toEqual('City Island Library');

          expect(landingPage.nthLocName(1)).toEqual('Pelham Bay Library');

          landingPage.clear();
          landingPage.search('boston');
          browser.sleep(1000);

          expect(landingPage.searchError.getText())
            .toEqual('No results for Boston, MA, USA within 25 ' +
              'miles of an NYPL location. Showing all locations.');

          expect(landingPage.firstLocName()).toEqual('115th Street Library');
          expect(landingPage.nthLocName(1)).toEqual('125th Street Library');
        });

      describe('Map View', function () {
        it('should not place a marker for a location not in NYC', function () {
          landingPage.search('boston');
          browser.sleep(1000);

          landingPage.mapViewBtn.click();
          browser.waitForAngular();
          browser.sleep(2000);

          expect(landingPage.gmapInfoWindow.isPresent()).toBe(false);
        });
      });
    });
  });

  describe('Research and Circulating libraries', function () {
    describe('List View', function () {
      it('should filter by research libraries when clicked', function () {
        var only_research = landingPage.onlyResearch;
        expect(landingPage.locations.count()).toBe(92);
        expect(only_research.getText()).toEqual('research libraries');

        only_research.click();
        browser.sleep(1000);

        expect(landingPage.locations.count()).toBe(4);
        expect(only_research.getText()).toEqual('all branches');
      });

      it('should revert when the search input \'x\' is clicked', function () {
        var only_research = landingPage.onlyResearch;
        only_research.click();
        browser.sleep(4000);

        expect(landingPage.locations.count()).toBe(4);

        landingPage.clearSearch.click();

        expect(landingPage.locations.count()).toBe(92);
      });

      it('should show all locations when the button is clicked again',
        function () {
          var only_research = landingPage.onlyResearch;
          only_research.click();
          expect(landingPage.locations.count()).toBe(4);
          expect(only_research.getText()).toEqual('all branches');

          only_research.click();
          expect(landingPage.locations.count()).toBe(92);
          expect(only_research.getText()).toEqual('research libraries');
        });

      it('should list the four research libraries', function () {
        var only_research = landingPage.onlyResearch,
          research_libraries;

        only_research.click();
        browser.sleep(4000);

        research_libraries = landingPage.locations.map(
          function (elm, index) {
            return {
              index: index,
              text: elm.element(by.css('.p-org')).getText()
            };
          }
        );

        expect(research_libraries).toEqual([
          {
            index: 0,
            text: 'Stephen A. Schwarzman Building'
          },
          {
            index: 1,
            text: 'New York Public Library for the Performing ' +
              'Arts, Dorothy and Lewis B. Cullman Center'
          },
          {
            index: 2,
            text: 'Schomburg Center for Research in Black Culture'
          },
          {
            index: 3,
            text: 'Science, Industry and Business Library (SIBL)'
          }
        ]);
      });

      it('should revert back to all branches when performing a search ' +
        'and display the result first in the list - searching for ' +
        '"parkchester" when viewing the research branches should ' +
        'take you back to view all the branches',
        function () {
          var only_research = landingPage.onlyResearch;

          only_research.click();
          expect(landingPage.locations.count()).toBe(4);
          expect(only_research.getText()).toEqual('all branches');

          landingPage.search('parkchester');
          browser.waitForAngular();

          expect(landingPage.locations.count()).toBe(92);
          expect(only_research.getText()).toEqual('research libraries');
          expect(landingPage.firstLocName()).toEqual('Parkchester Library');
        });

      it('should sort the research branches by distance after ' +
        'performing a search, "parkchester" used in the test',
        function () {
          var only_research = landingPage.onlyResearch,
            research_libraries;

          landingPage.search('parkchester');
          browser.sleep(1000);

          only_research.click();
          browser.sleep(3000);

          research_libraries = landingPage.locations.map(function (elm) {
            return {
              text: elm.element(by.css('.p-org')).getText(),
              distance: elm.element(by.css('.distance')).getText()
            };
          });

          expect(landingPage.locations.count()).toBe(4);
          expect(research_libraries).toEqual([
            {
              text: 'Stephen A. Schwarzman Building',
              distance: 'Distance: 8.82 miles'
            },
            {
              text: 'New York Public Library for the ' +
                  'Performing Arts, Dorothy and Lewis B. Cullman Center',
              distance: 'Distance: 8.06 miles'
            },
            {
              text: 'Schomburg Center for Research in Black Culture',
              distance: 'Distance: 4.71 miles'
            },
            {
              text: 'Science, Industry and Business Library (SIBL)',
              distance: 'Distance: 9.09 miles'
            }
          ]);
        });
    });

    describe('Map View', function () {
      beforeEach(function () {
        landingPage.mapViewBtn.click();
        browser.waitForAngular();
        browser.sleep(2500);
      });

      it('should filter by research libraries when clicked', function () {
        var only_research = landingPage.onlyResearch;

        only_research.click();
        browser.sleep(4000);

        expect(landingPage.locations.count()).toBe(4);
        expect(only_research.getText()).toEqual('all branches');
      });

      it('should revert when the search input \'x\' is clicked', function () {
        var only_research = landingPage.onlyResearch;
        only_research.click();

        browser.sleep(4000);
        expect(landingPage.locations.count()).toBe(4);

        landingPage.clearSearch.click();

        expect(landingPage.locations.count()).toBe(92);
      });

      it('should switch between the research and circulating branches',
        function () {
          var only_research = landingPage.onlyResearch;

          only_research.click();
          browser.sleep(4000);
          expect(landingPage.locations.count()).toBe(4);

          only_research.click();
          expect(landingPage.locations.count()).toBe(92);

          only_research.click();
          browser.sleep(4000);
          expect(landingPage.locations.count()).toBe(4);
        });

      it('should list the four research libraries', function () {
        var only_research = landingPage.onlyResearch,
          research_libraries;

        only_research.click();

        research_libraries = landingPage.locations.map(function (elm, index) {
          return {
            index: index,
            text: elm.element(by.css('.p-org')).getText()
          };
        });

        expect(research_libraries).toEqual([
          {
            index: 0,
            text: 'Stephen A. Schwarzman Building'
          },
          {
            index: 1,
            text: 'New York Public Library for the Performing ' +
                    'Arts, Dorothy and Lewis B. Cullman Center'
          },
          {
            index: 2,
            text: 'Schomburg Center for Research in Black Culture'
          },
          {
            index: 3,
            text: 'Science, Industry and Business Library (SIBL)'
          }
        ]);
      });

      it('should revert back to all branches when performing a search ' +
        'and display result first in the list',
        function () {
          var only_research = landingPage.onlyResearch;
          only_research.click();
          browser.sleep(4000);

          expect(landingPage.locations.count()).toBe(4);
          expect(only_research.getText()).toEqual('all branches');

          landingPage.search('lower east side');
          browser.sleep(3000);

          expect(landingPage.locations.count()).toBe(92);
          expect(only_research.getText()).toEqual('research libraries');
          expect(landingPage.firstLocName()).toEqual('Seward Park Library');
          expect(landingPage.gmapInfoWindow.getText())
            .toEqual('Lower East Side\nNew York\nNY, USA');
        });

      it('should sort by distance after a search', function () {
        var only_research = landingPage.onlyResearch,
          research_libraries;

        landingPage.search('lower east side');
        browser.sleep(1000);

        only_research.click();
        browser.sleep(5000);

        research_libraries = landingPage.locations.map(function (elm) {
          return {
            text: elm.element(by.css('.p-org')).getText(),
            distance: elm.element(by.css('.distance')).getText()
          };
        });

        expect(landingPage.gmapInfoWindow.getText())
          .toEqual('Lower East Side\nNew York\nNY, USA');
        expect(landingPage.locations.count()).toBe(4);
        expect(research_libraries).toEqual([
          {
            text: 'Stephen A. Schwarzman Building',
            distance: 'Distance: 2.64 miles'
          },
          {
            text: 'New York Public Library for the Performing ' +
              'Arts, Dorothy and Lewis B. Cullman Center',
            distance: 'Distance: 4.04 miles'
          },
          {
            text: 'Schomburg Center for Research in Black Culture',
            distance: 'Distance: 7.23 miles'
          },
          {
            text: 'Science, Industry and Business Library (SIBL)',
            distance: 'Distance: 2.28 miles'
          }
        ]);
      });
    });
  });

  describe('Map related functions', function () {
    describe('Coming from the List View', function () {
      it('should go to the map when clicking on the "Map View" button',
        function () {
          expect(landingPage.listViewTable.isPresent()).toBe(true);
          expect(landingPage.mapViewMap.isPresent()).toBe(false);

          landingPage.mapViewBtn.click();
          browser.waitForAngular();
          browser.sleep(2000);

          expect(landingPage.listViewTable.isPresent()).toBe(false);
          expect(landingPage.mapViewMap.isPresent()).toBe(true);
        });

      it('should show the library you clicked on top of the list' +
        ' when clicking on "View on Map" and be highlighted when' +
        ' viewing in "List View". Using 67th street in the test',
        function () {
          expect(landingPage.listViewTable.isPresent()).toBe(true);
          expect(landingPage.mapViewMap.isPresent()).toBe(false);

          landingPage.nthLocViewMapBtn(3).click();

          expect(landingPage.mapViewMap.isPresent()).toBe(true);
          expect(landingPage.listViewTable.isPresent()).toBe(false);
          expect(landingPage.firstLocName()).toEqual('67th Street Library');

          landingPage.listViewBtn.click();

          expect(landingPage.listViewTable.isPresent()).toBe(true);
          expect(landingPage.firstLocName()).toEqual('67th Street Library');
          expect(landingPage.locations.first().getAttribute('class'))
            .toContain('active');

          landingPage.nthLocViewMapBtn(9).click();

          expect(landingPage.mapViewMap.isPresent()).toBe(true);
          expect(landingPage.firstLocName()).toEqual('Baychester Library');
        });
    });

    describe('On the Map View', function () {
      it('should pan to different libraries when clicking on "View on Map"',
        function () {
          landingPage.mapViewBtn.click();
          browser.waitForAngular();
          browser.sleep(2000);

          landingPage.nthLocViewMapBtn(2).click();
          expect(landingPage.nthLocName(2)).toEqual('58th Street Library');
          expect(landingPage.gmapInfoWindow.getText())
            .toEqual('58th Street Library\n127 East 58th Street\n' +
              'New York, NY, 10022');

          landingPage.nthLocViewMapBtn(10).click();
          expect(landingPage.nthLocName(10))
            .toEqual('Belmont Library and Enrico Fermi Cultural Center');
          expect(landingPage.gmapInfoWindow.getText())
            .toEqual('Belmont Library and Enrico Fermi Cultural ' +
              'Center\n610 E. 186th Street\nBronx, NY, 10458');

          landingPage.nthLocViewMapBtn(25).click();
          expect(landingPage.nthLocName(25)).toEqual('Francis Martin Library');
          expect(landingPage.gmapInfoWindow.getText())
            .toEqual('Francis Martin Library\n2150 University ' +
              'Avenue\nBronx, NY, 10453');
        });
    });
  });
});
