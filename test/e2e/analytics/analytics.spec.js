/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it,
console, protractor, expect, element, by */

describe('Google analytics configuration', function () {
  'use strict';

  // var landingPage = require('./analytics.po.js');
  var landingPage = require('../homepage/homepage.po.js'),
    locationPage = require('../location/location.po.js'),
    widgetPage = require('../widget/widget.po.js'),
    footer = require('../global-elements/footer.po.js'),
    header = require('../global-elements/header.po.js');

  function mockGA() {
    return "window.ga_msg = [];" +
           "ga = function () {" +
           "  var msg = [];" +
           "  for (var i = 0; i < arguments.length; i++) {" +
           "    msg.push(arguments[i]); " +
           "  }" +
           "  window.ga_msg.push(msg);" +
           "}";
  }

  // Structure of pageview array for angularitics plugin
  // ['send', 'pageview', 'URL']
  describe('Page view tracking', function () {
    beforeEach(function () {
      browser.get('/');
      browser.waitForAngular();
      browser.executeScript(mockGA());
    });

    it('should log a branch path as a page view', function () {
      // This triggers a click event and a pageview event
      landingPage.nthLocLink(0).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/locations/115th-street');
      });
    });

    it('should log a division path as a page view', function () {
      // This triggers the first GA click event
      landingPage.onlyResearch.click();

      // This triggers the second GA click event
      // and the first pageview event
      element(by.linkText('Stephen A. Schwarzman Building')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[2][1]).toEqual('pageview');
        expect(ga[2][2]).toEqual('/locations/schwarzman');
      });

      // This triggers the second pageview event
      element(by.linkText('General Research Division')).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[4][1]).toEqual('pageview');
        expect(ga[4][2])
          .toEqual('/locations/divisions/general-research-division');
      });
    });

    it('should log amenities path as a page view', function () {
      landingPage.nthLocLink(0).click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/locations/115th-street');
      });

      locationPage.allAmenities.click();
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[2][1]).toEqual('pageview');
        expect(ga[2][2]).toEqual('/locations/amenities/loc/115th-street');
      });
    });
  });

  // Structure of event array for angularitics plugin
  // ['send', 'event', {eventLabel: '', eventAction: '', eventCategory: ''}]
  describe('Homepage event tracking', function () {
    beforeEach(function () {
      browser.get('/');
      browser.waitForAngular();
      browser.executeScript(mockGA());
    });

    describe('Geolocation search button', function () {
      beforeEach(function () {
        landingPage.currLoc.click();
        browser.sleep(1500);
        browser.waitForAngular();
      });

      it('should track a click event', function () {
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Locations');
          expect(ga[0][2].eventAction).toEqual('Filter by');
          expect(ga[0][2].eventLabel).toEqual('Near me');
        });
      });

      it('should also track a pageview after the click event', function () {
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[1][1]).toEqual('pageview');
          expect(ga[1][2]).toEqual('/locations/map');
        });
      });
    });

    describe('Research Libraries', function () {
      it('should track a click event on the research button', function () {
        landingPage.onlyResearch.click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Locations');
          expect(ga[0][2].eventAction).toEqual('Filter by');
          expect(ga[0][2].eventLabel).toEqual('Research');
        });
      });
    });

    describe('List and Map View', function () {
      it('should track a click and pageview event on the Map View button',
        function () {
          landingPage.mapViewBtn.click();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Locations');
            expect(ga[0][2].eventAction).toEqual('View');
            expect(ga[0][2].eventLabel).toEqual('Map view');

            expect(ga[1][1]).toEqual('pageview');
            expect(ga[1][2]).toEqual('/locations/map');
          });
        });

      it('should track a click and pageview event on the List View button',
        function () {
          // Start by going to the map page
          // It will already track two events (click and pageview)
          landingPage.mapViewBtn.click();

          // Go back to the list view page
          landingPage.listViewBtn.click();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[2][2].eventCategory).toEqual('Locations');
            expect(ga[2][2].eventAction).toEqual('View');
            expect(ga[2][2].eventLabel).toEqual('List view');

            expect(ga[3][1]).toEqual('pageview');
            expect(ga[3][2]).toEqual('/locations/list');
          });
        });
    });

    describe('Library click events', function () {
      it('should track a click on a library\'s name on the list view',
        function () {
          landingPage.nthLocLink(0).click();
          browser.waitForAngular();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            // ga[0] is the click event on the library name from the list
            // ga[1] is the pageview event
            expect(ga[0][2].eventCategory).toEqual('Locations');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('115th Street Library (list)');

            expect(ga[1][1]).toEqual('pageview');
            expect(ga[1][2]).toEqual('/locations/115th-street');
          });
        });

      it('should track a click on a library\'s name on the map view',
        function () {
          landingPage.search('mid manhattan');
          browser.sleep(1000);

          landingPage.nthLocLink(0).click();
          browser.waitForAngular();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            // ga[0] is the pageview to the map page (from the search)
            // ga[1] is the click event on the library name from the list
            // ga[2] is the pageview event
            expect(ga[2][2].eventCategory).toEqual('Locations');
            expect(ga[2][2].eventAction).toEqual('Click');
            expect(ga[2][2].eventLabel).toEqual('Mid-Manhattan Library (map)');

            expect(ga[3][1]).toEqual('pageview');
            expect(ga[3][2]).toEqual('/locations/mid-manhattan-library');
          });
        });

      it('should track a click on a library\'s View on Map button on the ' +
        'list view',
        function () {
          landingPage.nthLocViewMapBtn(0).click();
          browser.waitForAngular();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Locations');
            expect(ga[0][2].eventAction).toEqual('View map');
            expect(ga[0][2].eventLabel).toEqual('115th Street Library (list)');

            expect(ga[1][1]).toEqual('pageview');
            expect(ga[1][2]).toEqual('/locations/map');
          });
        });

      it('should track a click on a library\'s View on Map button on the ' +
        'map view',
        function () {
          landingPage.mapViewBtn.click();
          browser.waitForAngular();

          landingPage.nthLocViewMapBtn(0).click();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[2][2].eventCategory).toEqual('Locations');
            expect(ga[2][2].eventAction).toEqual('View map');
            expect(ga[2][2].eventLabel).toEqual('115th Street Library (map)');
          });
        });

      // NOTE: The following two tests no longer work since the Google Maps
      // link opens in the same window. Must find a workaround to test.
      // it('should track a click on a library\'s direction button on the ' +
      //   'list view',
      //   function () {
      //     landingPage.nthLoc(0).element(by.css('.icon-compass')).click();

      //     browser.executeScript('return window.ga_msg;').then(function (ga) {
      //       expect(ga[0][2]).toEqual('Locations');
      //       expect(ga[0][3]).toEqual('Directions');
      //       expect(ga[0][4]).toEqual('115th Street Library (list)');
      //     });
      //   });

      // it('should track a click on a library\'s direction button on the ' +
      //   'map view',
      //   function () {
      //     landingPage.search('mid manhattan');
      //     browser.sleep(500);
      //     landingPage.nthLoc(0).element(by.css('.icon-compass')).click();

      //     browser.executeScript('return window.ga_msg;').then(function (ga) {
      //       expect(ga[2][2]).toEqual('Locations');
      //       expect(ga[2][3]).toEqual('Directions');
      //       expect(ga[2][4]).toEqual('Mid-Manhattan Library (map)');
      //     });
      //   });
    });
  });

  describe('Branch/Research tracking', function () {
    it('should track a click on the "On Our Shelves Now" button', function () {
      browser.get('/67th-street');
      browser.waitForAngular();
      browser.executeScript(mockGA());

      locationPage.catalog_link.click(function () {
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Locations');
          expect(ga[0][2].eventAction).toEqual('Click');
          expect(ga[0][2].eventLabel).toEqual('On Our Shelves');
        });
      });
    });

    describe('Get Directions on a location page', function () {
      beforeEach(function () {
        browser.get('/115th-street');
        browser.waitForAngular();
        browser.executeScript(mockGA());
      });

      it('should track on a branch', function () {
        locationPage.directions_link.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Locations');
            expect(ga[0][2].eventAction).toEqual('Directions');
            expect(ga[0][2].eventLabel)
              .toEqual('115th Street Library (location)');
          });
        });
      });
    });

      // it('should track social media click events', function () {
      //   browser.get('/115th-street');
      //   browser.waitForAngular();
      //   browser.executeScript(mockGA());

      //   locationPage.social_media.each(function (sm) {
      //     sm.click().then(function () {
      //       browser.navigate().back();
      //       browser.getAllWindowHandles().then(function (handles) {
      //         var newWindowHandle = handles[1];

      //         browser.switchTo().window(newWindowHandle).then(function () {
      //           browser.driver.close().then(function () {
      //             browser.switchTo().window(appWindow);
      //           });
      //         });

      //         browser.executeScript('return window.ga_msg;')
      //             .then(function (ga) {
      //           console.log(ga);
      //         });
      //       });
      //     });
      //   });
      // });

    it('should track the NYPL ASK click event', function () {
      browser.get('/115th-street');
      browser.waitForAngular();
      browser.executeScript(mockGA());

      locationPage.askNYPL.click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('Locations');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('Chat');
      });
    });

    it('should track the NYPL ASK click event', function () {
      browser.get('/schomburg');
      browser.waitForAngular();
      browser.executeScript(mockGA());

      locationPage.askNYPL.click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('Locations');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('Chat');
      });
    });

    it('should track the NYPL ASK click event', function () {
      browser.get('/divisions/map-division');
      browser.waitForAngular();
      browser.executeScript(mockGA());

      locationPage.askNYPL.click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('Locations');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('Chat');
      });
    });

    describe('division click/page', function () {
      it('should track division title click', function () {
        browser.get('/schwarzman');
        browser.waitForAngular();
        browser.executeScript(mockGA());

        element(by.linkText('Dorot Jewish Division')).click();
        browser.waitForAngular();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Locations');
          expect(ga[0][2].eventAction).toEqual('Division Title');
          expect(ga[0][2].eventLabel).toEqual('Dorot Jewish Division');
        });
      });

      it('should track subdivision title click', function () {
        browser.get('/schwarzman');
        browser.waitForAngular();
        browser.executeScript(mockGA());

        element(by.linkText('Rare Book Division')).click();
        browser.waitForAngular();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Locations');
          expect(ga[0][2].eventAction).toEqual('Division Title');
          expect(ga[0][2].eventLabel).toEqual('Rare Book Division');
        });

        element(by.linkText('George Arents Collection')).click();
        browser.waitForAngular();
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[2][2].eventCategory).toEqual('Locations');
          expect(ga[2][2].eventAction).toEqual('Division Title');
          expect(ga[2][2].eventLabel).toEqual('George Arents Collection');
        });

      });
    });
  });

  describe('Autofill events', function () {
    beforeEach(function () {
      browser.get('/');
      browser.waitForAngular();
      browser.executeScript(mockGA());
    });

    it('should track when ENTER was pressed for an accepted search suggestion',
      function () {
        landingPage.searchInput.sendKeys('grand');
        landingPage.searchInput.sendKeys(protractor.Key.ENTER);
        browser.waitForAngular();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Locations');
          expect(ga[0][2].eventAction).toEqual('Accept');
          expect(ga[0][2].eventLabel).toEqual('Grand Central Library');

          expect(ga[1][1]).toEqual('pageview');
          expect(ga[1][2]).toEqual('/locations/grand-central');
        });
      });

    it('should track when searching for a string', function () {
      landingPage.search('grand');
      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('Locations');
        expect(ga[0][2].eventAction).toEqual('Search');
        expect(ga[0][2].eventLabel).toEqual('grand');

        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/locations/map');
      });
    });

    it('should track selecting on suggested library', function () {
      landingPage.searchInput.sendKeys('bay');
      element(by.css('.location-item a')).click();

      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('Locations');
        expect(ga[0][2].eventAction).toEqual('Select');
        expect(ga[0][2].eventLabel).toEqual('Baychester Library');

        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/locations/baychester');
      });
    });

    it('should track selecting on suggested library', function () {
      landingPage.searchInput.sendKeys('tottenville');
      element(by.css('.geocoding-search')).click();

      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('Locations');
        expect(ga[0][2].eventAction).toEqual('Select search');
        expect(ga[0][2].eventLabel).toEqual('tottenville');

        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/locations/map');
      });
    });

    it('should track selecting on suggested library', function () {
      landingPage.searchInput.sendKeys('harlem');
      element(by.css('.location-item .icon-map')).click();

      browser.waitForAngular();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('Locations');
        expect(ga[0][2].eventAction).toEqual('Select view map');
        expect(ga[0][2].eventLabel).toEqual('Harlem Library');

        expect(ga[1][1]).toEqual('pageview');
        expect(ga[1][2]).toEqual('/locations/map');
      });
    });

  });

  describe('Locinator Widget', function () {
    describe('Branch page: New Dorp Library', function () {
      beforeEach(function () {
        browser.get('/widget/new-dorp');
        browser.waitForAngular();
        browser.executeScript(mockGA());
      });

      it('should track a click event on the Get Directions link', function () {
        widgetPage.directions_link.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Directions');
            expect(ga[0][2].eventLabel).toEqual('New Dorp Library');
          });
        });
      });

      it('should track a click even on the social media icons', function () {
        widgetPage.social_media.get(0).click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Social Media');
            expect(ga[0][2].eventLabel).toEqual('Facebook');
          });
        });
      });

      it('should track a click event on the \'Learn More\' link', function () {
        widgetPage.locinator_url.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Learn More');
          });
        });
      });

      it('should track a click event on the Donate button', function () {
        widgetPage.donate_btn.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Fundraising');
          });
        });
      });

      it('should track a click event on the NYPL Chat link', function () {
        widgetPage.askNYPL.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Chat');
          });
        });
      });

      it('should track a click event on Email a Question link', function () {
        widgetPage.email_us.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Email Question');
          });
        });
      });
    });

    describe('Division page', function () {
      beforeEach(function () {
        browser.get('/widget/divisions/map-division');
        browser.waitForAngular();
        browser.executeScript(mockGA());
      });

      it('should track a click even on the social media icons', function () {
        widgetPage.social_media.get(0).click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Social Media');
            expect(ga[0][2].eventLabel).toEqual('Facebook');
          });
        });
      });

      it('should track a click event on the \'Learn More\' link', function () {
        widgetPage.locinator_url.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Learn More');
          });
        });
      });

      it('should track a click event on the Donate button', function () {
        widgetPage.donate_btn.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Fundraising');
          });
        });
      });

      it('should track a click event on the NYPL Chat link', function () {
        widgetPage.askNYPL.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Chat');
          });
        });
      });

      it('should track a click event on Email a Question link', function () {
        widgetPage.email_us.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Email Question');
          });
        });
      });
    });

    describe('Subdivision page', function () {
      beforeEach(function () {
        browser.get('/widget/divisions/wallach-division/print-collection');
        browser.waitForAngular();
        browser.executeScript(mockGA());
      });

      it('should track a click event on the \'Learn More\' link', function () {
        widgetPage.locinator_url.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Learn More');
          });
        });
      });

      it('should track a click event on the Donate button', function () {
        widgetPage.donate_btn.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Fundraising');
          });
        });
      });

      it('should track a click event on the NYPL Chat link', function () {
        widgetPage.askNYPL.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Chat');
          });
        });
      });

      it('should track a click event on Email a Question link', function () {
        widgetPage.email_us.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Location Widget');
            expect(ga[0][2].eventAction).toEqual('Click');
            expect(ga[0][2].eventLabel).toEqual('Email Question');
          });
        });
      });
    });

  });

  describe('Footer events', function () {
    var footerLinks = footer.footerLinks;

    beforeEach(function () {
      browser.get('/chatham-square');
      browser.waitForAngular();
      browser.executeScript(mockGA());
    });

    it('should track clicking on About NYPL link', function () {
      footerLinks.first().click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('footer');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('/help/about-nypl');
      });
    });

    it('should track clicking on Careers at NYPL link', function () {
      footerLinks.get(3).click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('footer');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('/help/about-nypl/careers-nypl');
      });
    });

    it('should track clicking on Connect with NYPL link', function () {
      footerLinks.get(7).click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('footer');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('/voices/connect-nypl');
      });
    });

    it('should track clicking on the Privacy Policy link', function () {
      footerLinks.get(11).click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('footer');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('/help/about-nypl/legal-notices/' +
          'privacy-policy');
      });
    });

    it('should track a click on Gifts of Materials to NYPL link', function () {
      footerLinks.get(15).click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('footer');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('/help/about-nypl/legal-notices/' +
          'policy-gifts-materials');
      });
    });

    it('should track clicking on the Chinese translation link', function () {
      footerLinks.get(17).click();

      browser.executeScript('return window.ga_msg;').then(function (ga) {
        expect(ga[0][2].eventCategory).toEqual('footer');
        expect(ga[0][2].eventAction).toEqual('Click');
        expect(ga[0][2].eventLabel).toEqual('/node/107747');
      });
    });
  });

  describe('Header events', function () {
    describe('Category: Header', function () {
      beforeEach(function () {
        browser.get('/baychester');
        browser.waitForAngular();
        browser.executeScript(mockGA());
      });

      it('should track a click on the Classic Catalog link', function () {
        header.classic_catalog.click();
      });

      it('should track a click on the NYPL logo', function () {
        header.nypl_logo.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Header');
          });
        });
      });

      it('should track a click on the donate button', function () {
        header.donate_button.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('Header');
          });
        });
      });
    });

    describe('Category: SSO', function () {
      describe('Logged out', function () {
        beforeEach(function () {
          browser.get('/parkchester');
          browser.waitForAngular();
          browser.executeScript(mockGA());
        });

        it('should track a click on the desktop open login form', function () {
          header.loginBtn.click();

          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[0][2].eventCategory).toEqual('SSO');
            expect(ga[0][2].eventAction).toEqual('Open Login Form');
            expect(ga[0][2].eventLabel).toEqual('click');
          });
        });
      });

      describe('Logged in', function () {
        // Must mock being logged in for the log out button to show
        it('should track a click to the log out button', function () {
          browser.get('/parkchester');
          browser.manage().addCookie('bc_username', 'edwinguzman');
          browser.waitForAngular();
          browser.executeScript(mockGA());

          header.loginBtn.click();
          header.logOutBtn.click(function () {
            browser.executeScript('return window.ga_msg;').then(function (ga) {
              console.log(ga);
              expect(ga[0][2].eventCategory).toEqual('Header');
            });
          });
        });
      });
    });

    describe('Category: Header Search', function () {
      beforeEach(function () {
        browser.get('/eastchester');
        browser.waitForAngular();
        browser.executeScript(mockGA());
      });

      it('should track when the input field is focused', function () {
        header.searchInputField.click();

        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Header Search');
          expect(ga[0][2].eventAction).toEqual('Focused');
          expect(ga[0][2].eventLabel).toEqual('Search Box');
        });
      });

      it('should track when an empty search was attempted', function () {
        header.searchBtn.click();
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[0][2].eventCategory).toEqual('Header Search');
          expect(ga[0][2].eventAction).toEqual('Empty Search');
          expect(ga[0][2].eventLabel).toBe(null);
        });
      });

      it('should track when a radio button option was selected', function () {
        header.searchInputField.click();
        header.radioBtn_catalog.click();
        browser.executeScript('return window.ga_msg;').then(function (ga) {
          expect(ga[1][2].eventCategory).toEqual('Header Search');
          expect(ga[1][2].eventAction).toEqual('Select');
          expect(ga[1][2].eventLabel).toEqual('catalog');
        });
      });

      it('should track when a search was submitted for nypl.org', function () {
        header.searchInputField.click();
        header.radioBtn_website.click(function () {
          browser.executeScript('return window.ga_msg;').then(function (ga) {
            expect(ga[1][2].eventCategory).toEqual('Header Search');
            expect(ga[1][2].eventAction).toEqual('Select');
            expect(ga[1][2].eventLabel).toEqual('nypl.org');
          });
        });
      });
    });
  });

});
