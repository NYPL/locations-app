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

        describe('Successful - mocked coordinates based on SASB', function () {
            beforeEach(function () {
                // Coordinates based on SASB
                browser.executeScript(mockGeo(40.7529, -73.9821));
            });

            describe('List View', function () {
                it('should locate you and show your estimated address',
                    function () {
                        landingPage.currLoc.click();
                        browser.sleep(1000);
                        // "Showing search results near ...."
                        expect(landingPage.resultsNear.isPresent()).toBe(true);
                    });

                it('should locate you and sort the list of locations by distance',
                    function () {
                        // The list is initially sorted by name - there is
                        // no distance set for any location
                        expect(landingPage.firstLocName())
                            .toEqual('115th Street Library');

                        // It seems you need to give it some time for the text
                        // to render
                        landingPage.currLoc.click();
                        browser.sleep(1500);

                        // The closest location to you
                        expect(landingPage.firstLocDist())
                            .toEqual('Distance: 0.03 miles');
                        expect(landingPage.firstLocName())
                            .toEqual('Stephen A. Schwarzman Building');

                        expect(landingPage.nthLocDist(1))
                            .toEqual('Distance: 0.08 miles');
                        expect(landingPage.nthLocName(1))
                            .toEqual('Mid-Manhattan Library');
                    });
    
                it('should reset the location list' + 
                    ' when the searchbox \'x\' is clicked',
                    function () {
                        landingPage.currLoc.click();
                        browser.sleep(1000);

                        expect(landingPage.resultsNear.isPresent()).toBe(true);
                        expect(landingPage.firstLocName())
                            .toEqual('Stephen A. Schwarzman Building');

                        // Click the 'X'
                        landingPage.clearSearch.click();

                        expect(landingPage.resultsNear.isPresent()).toBe(false);
                        expect(landingPage.firstLocName())
                            .toEqual('115th Street Library');
                    });
            });

            describe('Map View', function () {
                beforeEach(function () {
                    // Go to map view
                    landingPage.mapViewBtn.click();
                    // browser.sleep(1500);
                });

                it('should locate you and show the blue marker on the map and legend',
                    function () {
                        // Only the 'NYPL Library' key should be in the map legend
                        expect(landingPage.mapMarkers.count()).toEqual(1);
                        landingPage.currLoc.click();
                        browser.sleep(2000);

                        // "Showing search results near ...."
                        expect(landingPage.resultsNear.isPresent()).toBe(true);
                        // The "Your Current Location" key should show up in
                        // the map legend
                        expect(landingPage.mapMarkers.count()).toEqual(2);
                        expect(landingPage.gmapInfoWindow.getText()).toEqual('Your Current Location');
                    });

                it('should locate you and sort the list of locations by distance',
                    function () {
                        // The list is initially sorted by name
                        expect(landingPage.firstLocName())
                            .toEqual('115th Street Library');

                        landingPage.currLoc.click();
                        browser.sleep(1500);

                        // The closest location to you
                        expect(landingPage.firstLocDist())
                            .toEqual('Distance: 0.03 miles');
                        expect(landingPage.firstLocName())
                            .toEqual('Stephen A. Schwarzman Building');

                        expect(landingPage.nthLocDist(1))
                            .toEqual('Distance: 0.08 miles');
                        expect(landingPage.nthLocName(1))
                            .toEqual('Mid-Manhattan Library');
                    });

                it('should reset the location list' + 
                    ' when the searchbox \'x\' is clicked',
                    function () {
                        landingPage.currLoc.click();
                        browser.sleep(1000);

                        expect(landingPage.resultsNear.isPresent()).toBe(true);
                        expect(landingPage.firstLocName())
                            .toEqual('Stephen A. Schwarzman Building');

                        // Click the 'X'
                        landingPage.clearSearch.click();

                        expect(landingPage.resultsNear.isPresent()).toBe(false);
                        expect(landingPage.firstLocName())
                            .toEqual('115th Street Library');
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
                        .toContain(
                            'You are not within 25 miles of any NYPL library'
                        );
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
        describe('A library name was searched that is not an NYC area' +
            ', using "aguilar" for the test',
            function () {
                beforeEach(function () {
                    landingPage.search('aguilar');
                    browser.sleep(1000); // must be a better way
                });
                
                it('should search by location name and return that result first',
                    function () {
                        expect(landingPage.firstLocName())
                            .toEqual('Aguilar Library');
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
                it('should sort the rest of the libraries by name',
                    function () {
                        expect(landingPage.nthLocName(1))
                            .toEqual('115th Street Library');
                        expect(landingPage.nthLocName(2))
                            .toEqual('125th Street Library');
                    });

                describe('Map View', function () {
                    it('should have the same location list from the List View',
                        function () {
                            landingPage.mapViewBtn.click();
                            expect(landingPage.firstLocName())
                                .toEqual('Aguilar Library');
                            expect(landingPage.nthLocName(1))
                                .toEqual('115th Street Library');
                            expect(landingPage.gmapInfoWindow.getText())
                                .toEqual('Aguilar Library' +
                                    '\n174 East 110th Street\n' +
                                    'New York, NY, 10029');
                        });
                });

                describe('Clicking searchbox \'x\'', function () {
                    it('should clear the input',
                        function () {
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('aguilar');
                            landingPage.clearSearch.click();
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('');
                        });

                    it('should reset the list of locations by name',
                        function () {
                            expect(landingPage.firstLocName())
                                .toEqual('Aguilar Library');
                            landingPage.clearSearch.click();
                            expect(landingPage.firstLocName())
                                .toEqual('115th Street Library');
                        });
                });
            });

        describe(
            'A library name was searched that is also an NYC area, ' +
            'using "battery park" for the test',
            function () {
                beforeEach(function () {
                    landingPage.search('battery park');
                    browser.sleep(1000);
                });

                it('should show what the search was', function () {
                    expect(landingPage.resultsNear.getText())
                        .toEqual('Showing search results near battery park');
                });

                it('should search by location name and be the first result',
                    function () {
                        expect(landingPage.firstLocName())
                            .toEqual('Battery Park City Library');

                        // It should be the only match for that search
                        expect(element.all(by.css('.callout')).count()).toBe(1);
                        expect(
                            landingPage.locations
                                .first().getAttribute('class')
                        ).toContain('callout');
                    });

                it('should show other results with distances in order', function () {
                    expect(landingPage.nthLocName(1))
                        .toEqual('New Amsterdam Library');
                    expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.86 miles');


                    expect(landingPage.nthLocName(2))
                        .toEqual('Chatham Square Library');
                    expect(landingPage.nthLocDist(2)).toEqual('Distance: 1.29 miles');
                });

                describe('Map View', function () {
                    it('should have the same location list from the List View',
                        function () {
                            expect(landingPage.firstLocName())
                                .toEqual('Battery Park City Library');
                            expect(landingPage.nthLocName(1))
                                .toEqual('New Amsterdam Library');
                            expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.86 miles');

                            landingPage.mapViewBtn.click();

                            expect(landingPage.firstLocName())
                                .toEqual('Battery Park City Library');
                            expect(landingPage.nthLocName(1))
                                .toEqual('New Amsterdam Library');
                            expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.86 miles');

                            expect(landingPage.gmapInfoWindow.getText())
                                .toEqual('Battery Park City Library\n' +
                                    '175 North End Avenue\nNew York, NY, 10282');
                        });
                });

                describe('Clicking searchbox \'x\'', function () {
                    it('should clear the input',
                        function () {
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('battery park');
                            landingPage.clearSearch.click();
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('');
                        });

                    it('should reset the list of locations by name',
                        function () {
                            expect(landingPage.firstLocName())
                                .toEqual('Battery Park City Library');
                            landingPage.clearSearch.click();
                            expect(landingPage.firstLocName())
                                .toEqual('115th Street Library');
                        });
                });
            }
        );

        describe('A location in NYC was searched, using "bronx zoo" for the test',
            function () {
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

                it('should organize the locations by distance - West Farms Library ' +
                    'should be first in the list',
                    function () {
                        // There is a probably a better way to test this
                        // The first location that should appear
                        expect(landingPage.firstLocName())
                            .toEqual('West Farms Library');

                        expect(landingPage.firstLocDist()).toEqual('Distance: 0.51 miles');

                        // The next location that should appear on the page
                        expect(landingPage.nthLocName(1))
                            .toEqual(
                                'Belmont Library and Enrico Fermi Cultural Center'
                            );

                        expect(landingPage.nthLocDist(1)).toEqual('Distance: 0.62 miles');

                        // The last of 10 locations that should appear on the page
                        expect(
                            landingPage.locations
                                .last().findElement(by.css('.p-org')).getText()
                        ).toEqual('Mosholu Library');

                        expect(
                            landingPage.locations
                                .last().findElement(by.css('.distance')).getText()
                        ).toEqual('Distance: 1.65 miles');
                    });

                describe('Map View', function () {
                    it('should display the search query on the map with a marker ' +
                        'and organize list by distance',
                        function () {
                            landingPage.mapViewBtn.click();

                            expect(landingPage.firstLocName())
                                .toEqual('West Farms Library');
                            expect(landingPage.firstLocDist()).toEqual('Distance: 0.51 miles');

                            expect(landingPage.gmapInfoWindow.getText())
                                .toEqual('bronx zoo');
                        });
                });

                describe('Clicking searchbox \'x\'', function () {
                    it('should clear the input',
                        function () {
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('bronx zoo');
                            landingPage.clearSearch.click();
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('');
                        });

                    it('should reset the list of locations by name',
                        function () {
                            expect(landingPage.firstLocName())
                                .toEqual('West Farms Library');
                            landingPage.clearSearch.click();
                            expect(landingPage.firstLocName())
                                .toEqual('115th Street Library');
                        });
                });
            });

        describe('A zipcode in NYC was searched - using "10016" for the test',
            function () {
                beforeEach(function () {
                    landingPage.search('10016');
                    browser.sleep(1000);
                });

                it('should show what the search was', function () {
                    expect(landingPage.resultsNear.getText())
                        .toEqual('Showing search results near 10016');
                });

                it('should show libraries in the searched zip code first',
                    function () {
                        expect(element.all(by.css('.callout')).count()).toBe(3);

                        expect(
                            landingPage.nthLoc(0)
                                .findElement(by.css('.p-postal-code')).getText()
                        ).toEqual('10016');

                        expect(
                            landingPage.nthLoc(1)
                                .findElement(by.css('.p-postal-code')).getText()
                        ).toEqual('10016');

                        expect(
                            landingPage.nthLoc(2)
                                .findElement(by.css('.p-postal-code')).getText()
                        ).toEqual('10016');

                        expect(landingPage.firstLocName())
                            .toEqual('Kips Bay Library');
                    });

                it('should then search for libraries near the searched zip code' +
                    'sorted by distance', function () {
                        expect(
                            landingPage.nthLoc(3)
                                .findElement(by.css('.p-postal-code')).getText()
                        ).toEqual('10018');

                        expect(landingPage.nthLocName(3))
                            .toEqual('Stephen A. Schwarzman Building');
                        expect(landingPage.nthLocDist(3)).toEqual('Distance: 0.43 miles');

                         expect(landingPage.nthLocName(4))
                            .toEqual('Grand Central Library');
                        expect(landingPage.nthLocDist(4)).toEqual('Distance: 0.56 miles');
                    });

                describe('Map View', function () {
                    it('should display one of the matches for the searched' + 
                        'zip code',
                        function () {
                            landingPage.mapViewBtn.click();

                            expect(landingPage.firstLocName())
                                .toEqual('Kips Bay Library');
                            expect(landingPage.gmapInfoWindow.getText())
                                .toEqual('Kips Bay Library\n446 Third Avenue\n' +
                                    'New York, NY, 10016');
                        });
                });

                describe('Clicking searchbox \'x\'', function () {
                    it('should clear the input',
                        function () {
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('10016');
                            landingPage.clearSearch.click();
                            expect(
                                landingPage.searchInput.getAttribute('value')
                            ).toEqual('');
                        });

                    it('should reset the list of locations by name',
                        function () {
                            expect(landingPage.firstLocName())
                                .not.toEqual('115th Street Library');
                            landingPage.clearSearch.click();
                            expect(landingPage.firstLocName())
                                .toEqual('115th Street Library');
                        });
                });
            });

        describe('A location outside of NYC was searched', function () {
            it('should tell you that your query was too far from any branch',
                function () {
                    landingPage.search('boston');
                    browser.sleep(1000);

                    expect(landingPage.searchError.getText())
                        .toEqual('No results for boston within 25 miles of' +
                                 ' an NYPL location. Showing all locations.');
                });

            it('should clear the search field', function () {
                landingPage.search('boston');
                browser.sleep(1000);

                expect(landingPage.searchInput.getAttribute('value'))
                    .toEqual('');
            });

            it('should refresh the list of locations after a previous search - ' +
                '"city island" was searched first, searching for "boston" results ' +
                'the list',
                function () {
                    // User searches for a location:
                    landingPage.search('city island');
                    browser.sleep(1000);

                    // The location list is organized
                    expect(landingPage.firstLocName())
                        .toEqual('City Island Library');

                    expect(landingPage.nthLocName(1))
                        .toEqual('Pelham Bay Library');

                    landingPage.clear();
                    landingPage.search('boston');
                    browser.sleep(1000);

                    expect(landingPage.searchError.getText())
                        .toEqual('No results for boston within 25 miles of' +
                                 ' an NYPL location. Showing all locations.');

                    expect(landingPage.firstLocName())
                        .toEqual('115th Street Library');
                    expect(landingPage.nthLocName(1))
                        .toEqual('125th Street Library');
                });

            describe('Map View', function () {
                it('should not place a marker for a location not in NYC',
                    function () {
                        landingPage.search('boston');
                        browser.sleep(1000);

                        landingPage.mapViewBtn.click();

                        expect(landingPage.gmapInfoWindow.isPresent())
                            .toBe(false);
                    });
            });
        });
    });

    describe('Research and Circulating libraries', function () {
        describe('List View', function () {
            it('should filter by research libraries when clicked', function () {
                var only_research = landingPage.onlyResearch;
                expect(landingPage.locations.count()).toBe(10);
                expect(only_research.getText()).toEqual('research libraries');

                only_research.click();

                expect(landingPage.locations.count()).toBe(4);
                expect(only_research.getText()).toEqual('all branches');
                expect(landingPage.showing.getText())
                    .toEqual('Showing 4 of 4 Locations');
            });

            it('should revert when the search input \'x\' is clicked',
                function () {
                    var only_research = landingPage.onlyResearch;
                    only_research.click();

                    expect(landingPage.locations.count()).toBe(4);
                    expect(landingPage.showing.getText())
                        .toEqual('Showing 4 of 4 Locations');

                    landingPage.clearSearch.click();

                    expect(landingPage.locations.count()).toBe(10);
                    expect(landingPage.showing.getText())
                        .toEqual('Showing 10 of 92 Locations');
                    expect(landingPage.showMore.isPresent()).toBe(true);
                });

            it('should show all locations when the button is clicked again',
                function () {
                    var only_research = landingPage.onlyResearch;
                    only_research.click();
                    expect(landingPage.locations.count()).toBe(4);
                    expect(only_research.getText()).toEqual('all branches');

                    only_research.click();
                    expect(landingPage.locations.count()).toBe(10);
                    expect(only_research.getText()).toEqual('research libraries');
                    expect(landingPage.showing.getText())
                        .toEqual('Showing 10 of 92 Locations');
                });

            it('should list the four research libraries', function () {
                var only_research = landingPage.onlyResearch,
                    research_libraries;

                only_research.click();

                research_libraries = landingPage.locations.map(
                    function (elm, index) {
                        return {
                            index: index,
                            text: elm.findElement(by.css('.p-org')).getText()
                        };
                    }
                );

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

            it('should revert back to all branches when performing a search ' +
                'and display the result first in the list - searching for ' +
                '"parkchester" when viewing the research branches should take ' +
                'you back to view all the branches',
                function () {
                    var only_research = landingPage.onlyResearch;

                    only_research.click();
                    expect(landingPage.locations.count()).toBe(4);
                    expect(only_research.getText()).toEqual('all branches');

                    landingPage.search('parkchester');
                    browser.sleep(1000);

                    expect(landingPage.locations.count()).toBe(10);
                    expect(only_research.getText()).toEqual('research libraries');
                    expect(landingPage.firstLocName())
                        .toEqual('Parkchester Library');
                });

            it('should sort the research branches by distance after performing' +
                ' a search, "parkchester" used in the test', function () {
                var only_research = landingPage.onlyResearch,
                    research_libraries;

                landingPage.search('parkchester');
                browser.sleep(1000);

                only_research.click();

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
                        distance: 'Distance: 4.71 miles'
                    },
                    {
                        text: 'New York Public Library for the Performing Arts' +
                            ', Dorothy and Lewis B. Cullman Center',
                        distance: 'Distance: 8.06 miles'
                    },
                    {
                        text: 'Stephen A. Schwarzman Building',
                        distance: 'Distance: 8.82 miles'
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
                browser.sleep(1000);
            });

            it('should filter by research libraries when clicked', function () {
                var only_research = landingPage.onlyResearch;

                expect(landingPage.locations.count()).toBe(92);
                expect(only_research.getText()).toEqual('research libraries');

                only_research.click();

                expect(landingPage.locations.count()).toBe(4);
                expect(only_research.getText()).toEqual('all branches');
            });

            it('should revert when the search input \'x\' is clicked',
                function () {
                    var only_research = landingPage.onlyResearch;
                    only_research.click();

                    expect(landingPage.locations.count()).toBe(4);

                    landingPage.clearSearch.click();

                    expect(landingPage.locations.count()).toBe(92);
                });

            it('should switch between the research and circulating branches',
                function () {
                    var only_research = landingPage.onlyResearch;

                    only_research.click();
                    expect(landingPage.locations.count()).toBe(4);

                    only_research.click();
                    expect(landingPage.locations.count()).toBe(92);

                    only_research.click();
                    expect(landingPage.locations.count()).toBe(4);
                });

            it('should list the four research libraries', function () {
                var only_research = landingPage.onlyResearch,
                    research_libraries;

                only_research.click();

                research_libraries = landingPage.locations.map(
                    function (elm, index) {
                        return {
                            index: index,
                            text: elm.findElement(by.css('.p-org')).getText()
                        };
                    }
                );

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

            it('should revert back to all branches when performing a search ' +
                'and display result first in the list',
                function () {
                    var only_research = landingPage.onlyResearch;
                    only_research.click();

                    expect(landingPage.locations.count()).toBe(4);
                    expect(only_research.getText()).toEqual('all branches');

                    landingPage.search('lower east side');
                    browser.sleep(1000);

                    expect(landingPage.locations.count()).toBe(92);
                    expect(only_research.getText()).toEqual('research libraries');
                    expect(landingPage.firstLocName())
                        .toEqual('Seward Park Library');
                    expect(landingPage.gmapInfoWindow.getText())
                        .toEqual('lower east side');
                });

            it('should sort by distance after a search', function () {
                var only_research = landingPage.onlyResearch,
                    research_libraries;

                landingPage.search('lower east side');
                browser.sleep(1000);

                only_research.click();

                research_libraries = landingPage.locations.map(function (elm) {
                    return {
                        text: elm.findElement(by.css('.p-org')).getText(),
                        distance: elm.findElement(by.css('.distance')).getText()
                    };
                });

                expect(landingPage.gmapInfoWindow.getText())
                    .toEqual('lower east side');
                expect(landingPage.locations.count()).toBe(4);
                expect(research_libraries).toEqual([
                    {
                        text: 'Science, Industry and Business Library (SIBL)',
                        distance: 'Distance: 2.28 miles'
                    },
                    {
                        text: 'Stephen A. Schwarzman Building',
                        distance: 'Distance: 2.64 miles'
                    },
                    {
                        text: 'New York Public Library for the Performing Arts' +
                            ', Dorothy and Lewis B. Cullman Center',
                        distance: 'Distance: 4.04 miles'
                    },
                    {
                        text: 'Schomburg Center for Research in Black Culture',
                        distance: 'Distance: 7.23 miles'
                    },
                ]);
            });
        });
    });

    describe('Location list tracker', function () {

        describe('List View - has show more button', function () {
            it('should show 10 locations by default', function () {
                expect(landingPage.locations.count()).toBe(10);
                expect(landingPage.showing.getText())
                    .toEqual('Showing 10 of 92 Locations');
                expect(landingPage.showMore.getText()).toEqual('Show 10 more');
            });

            it('should show the next 10 locations when the "show more" ' +
                'button is clicked',
                function () {
                    landingPage.showMore.click();
                    expect(landingPage.locations.count()).toBe(20);
                    expect(landingPage.showing.getText())
                        .toEqual('Showing 20 of 92 Locations');
                });

            it('should say "Show All" after showing 80 locations', function () {
                // Click the 'Show more' button 7 times.
                landingPage.clickShowMore(7);

                expect(landingPage.showing.getText())
                    .toEqual('Showing 80 of 92 Locations');
                expect(landingPage.showMore.getText()).toEqual('Show All');
            });

            it('should revert back to default after clicking on the ' +
                '\'x\' button in the searchbox and show only 10 locations',
                function () {
                    // Random
                    landingPage.clickShowMore(3);

                    expect(landingPage.locations.count()).toBe(40);
                    expect(landingPage.showing.getText())
                        .toEqual('Showing 40 of 92 Locations');

                    landingPage.clearSearch.click();

                    expect(landingPage.locations.count()).toBe(10);
                    expect(landingPage.showing.getText())
                        .toEqual('Showing 10 of 92 Locations');
                });

            it('should say show all 92 locations and remove the button ' +
                'after the button is clicked 8 times',
                function () {
                    // Click the 'Show more' button 8 times.
                    landingPage.clickShowMore(8);

                    expect(landingPage.showing.getText())
                        .toEqual('Showing 92 of 92 Locations');
                    expect(landingPage.showMore.isPresent()).toBe(false);
                });

            it('should list only four for research libraries after ' +
                'clicking the research branches button',
                function () {
                    var only_r = landingPage.onlyResearch;
                    only_r.click();

                    expect(landingPage.locations.count()).toBe(4);
                    expect(landingPage.showing.getText())
                        .toEqual('Showing 4 of 4 Locations');
                });

            it('should revert to 10 locations after toggling research button',
                function () {
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

        describe('Map View - shows all locations and no button', function () {
            beforeEach(function () {
                landingPage.mapViewBtn.click();
            });

            it('should show all locations by default', function () {
                expect(landingPage.locations.count()).toBe(92);
                expect(landingPage.showing.isPresent()).toBe(false);
            });

            it('should show the four research branches', function () {
                landingPage.onlyResearch.click();
                expect(landingPage.locations.count()).toBe(4);
                expect(landingPage.showing.isPresent()).toBe(false);
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
                        expect(landingPage.locations
                            .first().getAttribute('class')
                        ).toContain('callout');


                        landingPage.nthLocViewMapBtn(9).click();

                        expect(landingPage.mapViewMap.isPresent()).toBe(true);
                        expect(landingPage.firstLocName()).toEqual('Baychester Library');
                    });
        });

        describe('On the Map View', function () {
            it('should pan to different libraries when clicking on ' +
                '"View on Map"', function () {
                    landingPage.mapViewBtn.click();

                    landingPage.nthLocViewMapBtn(2).click();
                    expect(landingPage.nthLocName(2)).toEqual('58th Street Library');
                    expect(landingPage.gmapInfoWindow.getText())
                        .toEqual('58th Street Library\n127 East 58th Street\n' +
                            'New York, NY, 10022');

                    landingPage.nthLocViewMapBtn(10).click();
                    expect(landingPage.nthLocName(10))
                        .toEqual('Belmont Library and Enrico Fermi Cultural Center');
                    expect(landingPage.gmapInfoWindow.getText())
                        .toEqual('Belmont Library and Enrico Fermi Cultural Center\n' +
                            '610 E. 186th Street\nBronx, NY, 10458');

                    landingPage.nthLocViewMapBtn(25).click();
                    expect(landingPage.nthLocName(25)).toEqual('Francis Martin Library');
                    expect(landingPage.gmapInfoWindow.getText())
                        .toEqual('Francis Martin Library\n2150 University Avenue\n' +
                            'Bronx, NY, 10453');
                });
        });
    });
});
