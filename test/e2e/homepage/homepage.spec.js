/*jslint indent: 4, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
describe('Locations: homepage', function () {
    "use strict";
    // Check ../support/landingPage.js for code
    var landingPage = require('./homepage.po.js');

    beforeEach(function () {
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

        describe('Geolocation Successful', function () {
            beforeEach(function () {
                browser.executeScript(mockGeo(40.7529, -73.9821));
            });

            it('should locate you and show the blue marker on the map legend',
               function () {
                   // Only the 'NYPL Library' key should be in the map legend
                   expect(landingPage.mapMarkers.count()).toEqual(1);

                   // It seems you need to give it some time for the text
                   // to render
                   landingPage.currLoc.click();
                   browser.sleep(1500);

                   // "Showing search results near ...."
                   expect(landingPage.resultsNear.isPresent()).toBe(true);
                   // The "Your Current Location" key should show up in
                   // the map legend
                   expect(landingPage.mapMarkers.count()).toEqual(2);
               });

            it('should not sort by distance without your location', 
               function () {
                   // The list is initially sorted by name - there is
                   // no distance set for any location
                   expect(
                       landingPage.locations
                           .first().findElement(by.css('.p-org')).getText()
                   ).toEqual('115th Street Library');

                   // Do NOT click "current location";
                
                   // Click the header to reverse the distance sorter
                   element(by.id('distanceSorter')).click();
                   
                   // Nothing should change
                   expect(
                       landingPage.locations
                           .first().findElement(by.css('.p-org')).getText()
                   ).toEqual('115th Street Library');
               });


            it('should locate you and sort the list of locations by distance', function () {
                // The list is initially sorted by name - there is no distance
                // set for any location
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.p-org')).getText()
                ).toEqual('115th Street Library');

                // It seems you need to give it some time for the text
                // to render
                landingPage.currLoc.click();
                browser.sleep(1500);

                // The closest location to you
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.distance')).getText()
                ).toEqual('0.03 miles');
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.p-org')).getText()
                ).toEqual('Stephen A. Schwarzman Building');

                // Click the header to reverse the distance sorter
                element(by.id('distanceSorter')).click();

                // The closest farthest away from you
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.distance')).getText()
                ).toEqual('21.7 miles');
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.p-org')).getText()
                ).toEqual('Tottenville Library');
            });
        });

        describe('Geolocation Failure', function () {
            it('should not geolocate if you are too far away', function () {
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
                expect(landingPage.distanceError.getText())
                    .toContain('Unknown error.');
            });
        });
    });

    describe('Search box', function () {
        describe('A library name was searched that is not an NYC area', function () {
            beforeEach(function () {
                landingPage.search('aguilar');
                browser.sleep(1000); // must be a better way
            });

            it('should show what the search was', function () {
                expect(landingPage.resultsNear.getText())
                    .toEqual('Showing search results near aguilar');
            });

            it('should search by location name', function () {
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.p-org')).getText()
                ).toEqual('Aguilar Library');
            });

            it('should have one highlighted location', function () {
                expect(element.all(by.css('.callout')).count()).toBe(1);
                expect(
                    landingPage.locations
                        .first().getAttribute('class')
                ).toContain('callout');
            });

            // Since Aguilar matches a library name and not an area,
            // the rest of the list should be sorted by name.
            it('should sort the rest of the libraries by name', function () {
                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.p-org')).getText()
                ).toEqual('115th Street Library');
                expect(
                    landingPage.locations
                        .get(2).findElement(by.css('.p-org')).getText()
                ).toEqual('125th Street Library');
            });

            it('should clear the input when you click the \'x\'', function () {
                expect(landingPage.searchInput.getAttribute('value'))
                    .toEqual('aguilar');
                landingPage.clearSearch.click();
                expect(landingPage.searchInput.getAttribute('value')).toEqual('');
            });

            it('should reset the list of locations by name after clicking the \'x\'', function () {
                expect(
                    landingPage.locations.first().findElement(by.css('.p-org')).getText()
                ).toEqual('Aguilar Library');
                landingPage.clearSearch.click();
                expect(
                    landingPage.locations.first().findElement(by.css('.p-org')).getText()
                ).toEqual('115th Street Library');
            });
        });

        describe('A library name was searched that is also an NYC area', function () {
            beforeEach(function () {
                landingPage.search('battery park');
                browser.sleep(1000);
            });

            it('should show what the search was', function () {
                expect(landingPage.resultsNear.getText())
                    .toEqual('Showing search results near battery park');
            });

            it('should search by location name and be the first result', function () {
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.p-org')).getText()
                ).toEqual('Battery Park City Library');
                expect(
                    landingPage.locations
                        .first().getAttribute('class')
                ).toContain('callout');
            });

            it('should also search by area and give distance values to the rest of the locations', function () {
                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.p-org')).getText()
                ).toEqual('New Amsterdam Library');
                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.distance')).getText()
                ).toEqual('0.86 miles');


                expect(
                    landingPage.locations
                        .get(2).findElement(by.css('.p-org')).getText()
                ).toEqual('Chatham Square Library');
                expect(
                    landingPage.locations
                        .get(2).findElement(by.css('.distance')).getText()
                ).toEqual('1.29 miles');
            });
        });

        describe('A location in NYC was searched', function () {
            beforeEach(function () {
                landingPage.search('bronx zoo');
                browser.sleep(1000);
            });

            it('should show what the search was', function () {
                expect(landingPage.resultsNear.getText())
                    .toEqual('Showing search results near bronx zoo');
            });

            it('should not have any highlighted locations', function () {
                expect(element.all(by.css('.callout')).count()).toBe(0);
            });

            it('should organize the locations by distance', function () {
                // There is a probably a better way to test this
                // The first location that should appear
                expect(
                    landingPage.locations.first().findElement(by.css('.p-org')).getText()
                ).toEqual('West Farms Library');

                expect(
                    landingPage.locations
                        .first().findElement(by.css('.distance')).getText()
                ).toEqual('0.51 miles');

                // The last location that should appear on the page
                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.p-org')).getText()
                ).toEqual('Belmont Library and Enrico Fermi Cultural Center');

                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.distance')).getText()
                ).toEqual('0.62 miles');
            });
        });

        describe('A zipcode in NYC was searched', function () {
            beforeEach(function () {
                landingPage.search('10016');
                browser.sleep(1000);
            });

            it('should show what the search was', function () {
                expect(landingPage.resultsNear.getText())
                    .toEqual('Showing search results near 10016');
            });

            it('should show libraries in the searched zip code first', function () {
                expect(element.all(by.css('.callout')).count()).toBe(3);
                expect(
                    landingPage.locations
                        .get(0).findElement(by.css('.p-postal-code')).getText()
                ).toEqual('10016');
                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.p-postal-code')).getText()
                ).toEqual('10016');
                expect(
                    landingPage.locations
                        .get(2).findElement(by.css('.p-postal-code')).getText()
                ).toEqual('10016');
            });

            it('should then search for libraries near the searched zip code', function () {
                expect(
                    landingPage.locations
                        .get(3).findElement(by.css('.p-postal-code')).getText()
                ).toEqual('10018');
                expect(
                    landingPage.locations
                        .get(3).findElement(by.css('.p-org')).getText()
                ).toEqual('Stephen A. Schwarzman Building');
                expect(
                    landingPage.locations
                        .get(3).findElement(by.css('.distance')).getText()
                ).toEqual('0.43 miles');
            });
        });

        describe('A location outside of NYC was searched', function () {
            it('should tell you that your query was too far from any NYPL location', function () {
                landingPage.search('boston');
                browser.sleep(1000);

                expect(landingPage.searchError.getText())
                    .toEqual('No results for boston within 25 miles of' +
                        ' an NYPL location. Showing all locations.');
            });

            it('should clear the search field', function () {
                landingPage.search('boston');
                browser.sleep(1000);

               expect(landingPage.searchInput.getAttribute('value')).toEqual('');
            });

            it('should refresh the list of locations after a previous search', function () {
                // User searches for a location:
                landingPage.search('city island');
                browser.sleep(1000);

                // The location list is organized
                expect(
                    landingPage.locations
                        .first().findElement(by.css('.p-org')).getText()
                ).toEqual('City Island Library');

                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.p-org')).getText()
                ).toEqual('Pelham Bay Library');

                landingPage.clear();
                landingPage.search('boston');
                browser.sleep(1000);

                expect(
                    landingPage.locations
                        .first().findElement(by.css('.p-org')).getText()
                ).toEqual('115th Street Library');
                expect(
                    landingPage.locations
                        .get(1).findElement(by.css('.p-org')).getText()
                ).toEqual('125th Street Library');
            });
        });
    });

    describe('Research and Circulating libraries', function () {
        it('should filter by research libraries when clicked', function () {
            var only_r = landingPage.onlyResearch;
            expect(landingPage.locations.count()).toBe(10);
            expect(only_r.getText()).toEqual('only research libraries');

            only_r.click();

            expect(landingPage.locations.count()).toBe(4);
            expect(only_r.getText()).toEqual('all branches');
            expect(landingPage.showing.getText())
                .toEqual('Showing 4 of 4 Locations');
        });

        it('should revert back to all libraries when the search input \'x\' is clicked', function () {
            var only_r = landingPage.onlyResearch;
            only_r.click();

            expect(landingPage.locations.count()).toBe(4);
            expect(landingPage.showing.getText())
                .toEqual('Showing 4 of 4 Locations');

            landingPage.clearSearch.click();

            expect(landingPage.locations.count()).toBe(10);
            expect(landingPage.showing.getText())
                .toEqual('Showing 10 of 92 Locations');
        });

        it('should show all locations when the button is clicked again', function () {
            var only_r = landingPage.onlyResearch;
            only_r.click();
            expect(landingPage.locations.count()).toBe(4);
            expect(only_r.getText()).toEqual('all branches');

            only_r.click();
            expect(landingPage.locations.count()).toBe(10);
            expect(only_r.getText()).toEqual('only research libraries');
            expect(landingPage.showing.getText())
                .toEqual('Showing 10 of 92 Locations');
        });

        it('should list the four research libraries', function () {
            var only_r = landingPage.onlyResearch,
                research_libraries;

            only_r.click();

            research_libraries = landingPage.locations.map(function (elm, index) {
                return {
                    index: index,
                    text: elm.findElement(by.css('.p-org')).getText()
                };
            });

            expect(research_libraries).toEqual([
                {
                    index: 0,
                    text: 'New York Public Library for the Performing ' +
                            'Arts, Dorothy and Lewis B. Cullman Center'
                },
                {
                    index: 1,
                    text: 'Schomburg Center for Research in Black Culture'
                },
                {
                    index: 2,
                    text: 'Science, Industry and Business Library (SIBL)'
                },
                {
                    index: 3,
                    text: 'Stephen A. Schwarzman Building'
                }
            ]);
        });

        it('should revert back to all branches when performing a search', function () {
            var only_r = landingPage.onlyResearch;

            only_r.click();
            expect(landingPage.locations.count()).toBe(4);
            expect(only_r.getText()).toEqual('all branches');

            landingPage.search('parkchester');
            browser.sleep(1000);

            expect(landingPage.locations.count()).toBe(10);
            expect(only_r.getText()).toEqual('only research libraries');
            expect(
                landingPage.locations
                    .first().findElement(by.css('.p-org')).getText()
            ).toEqual('Parkchester Library');
        });

        it('should sort by distance after a search', function () {
            var only_r = landingPage.onlyResearch,
                research_libraries;

            landingPage.search('parkchester');
            browser.sleep(1000);

            only_r.click();

            research_libraries = landingPage.locations.map(function (elm) {
                return {
                    text: elm.findElement(by.css('.p-org')).getText(),
                    distance: elm.findElement(by.css('.distance')).getText()
                };
            });

            expect(landingPage.locations.count()).toBe(4);
            expect(research_libraries).toEqual([
                {
                    text: 'Schomburg Center for Research in Black Culture',
                    distance: '4.71 miles'
                },
                {
                    text: 'New York Public Library for the Performing Arts, Dorothy and Lewis B. Cullman Center',
                    distance: '8.06 miles'
                },
                {
                    text: 'Stephen A. Schwarzman Building',
                    distance: '8.82 miles'
                },
                {
                    text: 'Science, Industry and Business Library (SIBL)',
                    distance: '9.09 miles'
                }
            ]);
        });

    });

    describe('Location list tracker', function () {
        it('should show 10 items by default', function () {
            expect(landingPage.locations.count()).toBe(10);
            expect(landingPage.showing.getText())
                .toEqual('Showing 10 of 92 Locations');
            expect(landingPage.showMore.getText()).toEqual('Show 10 more');
        });

        it('should show the next 10 items', function () {
            landingPage.showMore.click();
            expect(landingPage.locations.count()).toBe(20);
            expect(landingPage.showing.getText())
                .toEqual('Showing 20 of 92 Locations');
        });

        it('should say "Show All" after showing 80 locations', function () {
            var i = 0;
            for (i = 0; i < 7; i++) {
                landingPage.showMore.click();
            }

            expect(landingPage.showing.getText())
                .toEqual('Showing 80 of 92 Locations');
            expect(landingPage.showMore.getText()).toEqual('Show All');
        });

        it('should say show all 92 locations and remove the button', function () {
            var i = 0;
            for (i = 0; i < 8; i++) {
                landingPage.showMore.click();
            }

            expect(landingPage.showing.getText())
                .toEqual('Showing 92 of 92 Locations');
            expect(landingPage.showMore.isPresent()).toBe(false);
        });

        it('should list only four for research libraries', function () {
            var only_r = landingPage.onlyResearch;
            only_r.click();

            expect(landingPage.locations.count()).toBe(4);
            expect(landingPage.showing.getText())
                .toEqual('Showing 4 of 4 Locations');
        });

        it('should revert back to showing 10 locations after toggling research button', function () {
            var only_r = landingPage.onlyResearch;

            landingPage.showMore.click();
            expect(landingPage.locations.count()).toBe(20);
            expect(landingPage.showing.getText())
                .toEqual('Showing 20 of 92 Locations');

            only_r.click();

            expect(landingPage.locations.count()).toBe(4);

            only_r.click();

            expect(landingPage.locations.count()).toBe(10);
            expect(landingPage.showing.getText())
                .toEqual('Showing 10 of 92 Locations');
        });
    });

});
