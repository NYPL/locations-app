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

        it('should location you and show the blue marker on the map legend', function () {
            browser.executeScript(mockGeo(40.7529, -73.9821));

            // Only the 'NYPL Library' key should be in the map legend
            expect(landingPage.mapMarkers.count()).toEqual(1);

            landingPage.currLoc.click();
            // It seems you need to give it some time for the text to render
            browser.sleep(1500);

            // "Showing search results near ...."
            expect(landingPage.resultsNear.isPresent()).toBe(true);
            // The "Your Current Location" key should show up in the map legend
            expect(landingPage.mapMarkers.count()).toEqual(2);
        });

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

    describe('Search box', function () {
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
                element.all(by.repeater('location in locations'))
                    .first().findElement(by.css('.p-org')).getText()
            ).toEqual('Aguilar Library');
        });

        it('should have one highlighted location', function () {
            expect(element.all(by.css('.callout')).count()).toBe(1);
            expect(
                element.all(by.repeater('location in locations'))
                    .first().getAttribute('class')
            ).toContain('callout');
        });

        it('should clear the input when you click the \'x\'', function () {
            expect(landingPage.searchInput.getAttribute('value'))
                .toEqual('aguilar');
            landingPage.clearSearch.click();
            expect(landingPage.searchInput.getAttribute('value')).toEqual('');
        });

        it('should list the locations by name after clicking the \'x\'', function () {
            expect(
                element.all(by.repeater('location in locations'))
                    .first().findElement(by.css('.p-org')).getText()
            ).toEqual('Aguilar Library');
            landingPage.clearSearch.click();
            expect(
                element.all(by.repeater('location in locations'))
                    .first().findElement(by.css('.p-org')).getText()
            ).toEqual('115th Street Library');
        });
    });

    it('should show 10 items by default', function () {
        var locations = landingPage.locations;
        expect(locations.count()).toBe(10);
        expect(landingPage.showing.getText())
            .toEqual('Showing 10 of 92 Locations');
    });

    it('should show the next 10 items', function () {
        landingPage.showMore.click();
        expect(landingPage.locations.count()).toBe(20);
        expect(landingPage.showing.getText())
            .toEqual('Showing 20 of 92 Locations');
    });

    it('should filter by research libraries', function () {
        var only_r = landingPage.onlyResearch;
        expect(only_r.getText()).toEqual('only research libraries');
        only_r.click();
        expect(landingPage.locations.count()).toBe(4);
        expect(only_r.getText()).toEqual('all branches');
        only_r.click();
        expect(landingPage.locations.count()).toBe(10);
        expect(only_r.getText()).toEqual('only research libraries');
    });

});


