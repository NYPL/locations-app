/*jslint indent: 4, maxlen: 80 */
/*global describe, require, beforeEach, browser, it, expect, element, by */
describe('Locations: homepage', function () {
    "use strict";
    // Check ../support/landingPage.js for code
    var landingPage = require('../support/landingPage.js');

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

        it('should not geolocate if you are too far away', function () {
            browser.executeScript(mockGeo(36.149674, -86.813347));
            landingPage.currLoc.click();
            expect(landingPage.distanceError.getText())
                .toContain('You are not within 25 miles of any NYPL library');
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
    });
});


