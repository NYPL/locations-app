/*jslint indent: 2, maxlen: 80 */
/*global describe, require, beforeEach, browser, it,
expect, element, by, afterEach */

describe('Locations: Header SSO Login', function () {
  "use strict";

  var landingPage = require('../homepage/homepage.po.js'),
    locationPage = require('../location/location.po.js'),
    divisionPage = require('../division/division.po.js'),
    amenitiesPage = require('../amenities/amenities.po.js'),
    header = require('../global-elements/header.po.js'),
    cookieObj;

  afterEach(function () {
    browser.manage().deleteCookie('remember_me');
    browser.manage().deleteCookie('bc_username');
  });

  describe('Login header form', function () {
    describe('Remember me checkbox', function () {
      it('should be empty without a cookie set', function () {
        browser.get('/');
        browser.waitForAngular();

        header.loginBtn.click();

        // The retrieved cookie should be null since it's not set.
        cookieObj = browser.manage().getCookie('remember_me');
        cookieObj.then(function (data) {
          expect(data).toBe(null);
        });

        expect(header.username.getAttribute('value')).toEqual('');
        expect(header.pin.getAttribute('value')).toEqual('');
        expect(header.rememberMe.isSelected()).toBe(false);
      });

      describe('Remember me cookie is set', function () {
        beforeEach(function () {
          browser.get('/');
          browser.manage().addCookie('remember_me', 'edwinguzman');
          browser.waitForAngular();
        });

        it('should fill out the form since the cookie is set', function () {
          header.loginBtn.click();

          cookieObj = browser.manage().getCookie('remember_me');
          cookieObj.then(function (data) {
            expect(data.name).toEqual('remember_me');
            expect(data.value).toEqual('edwinguzman');
          });

          expect(header.username.getAttribute('value')).toEqual('edwinguzman');
          expect(header.pin.getAttribute('value')).toEqual('');
          expect(header.rememberMe.isSelected()).toBe(true);
        });

        it('should delete the cookie when there is initially a cookie and ' +
          'the checkbox has been unselected',
          function () {

            header.loginBtn.click();

            cookieObj = browser.manage().getCookie('remember_me');
            cookieObj.then(function (data) {
              expect(data.name).toEqual('remember_me');
            });
            expect(header.rememberMe.isSelected()).toBe(true);

            header.rememberMe.click();

            // The checkbox was unselected and the cookie should now be deleted.
            cookieObj = browser.manage().getCookie('remember_me');
            cookieObj.then(function (data) {
              expect(data).toBe(null);
            });
          });
      });
    });

    /* A note on how visibility works:
     * There are two displays
     *    login form - not logged in
     *    logged in menu - logged in
     * The one that will be displayed is based on the CONTAINER having the 
     * 'logged-in' class. If it does not contain that class, then the login
     * form will be visible. If the container does have the 'logged-in' class,
     * then the logged in menu will be visible. The class is added if the
     * correct cookie is set.
     */
    describe('Header menu', function () {
      describe('Not logged in', function () {
        beforeEach(function () {
          browser.get('/');
          browser.waitForAngular();
        });

        it('should display "LOG IN" for the button text', function () {
          expect(header.loginBtn.getText()).toEqual('LOG IN');
        });

        it('should not have the "logged-in" class for the form', function () {
          expect(header.ssoLoginContainer.getAttribute('class'))
            .not.toContain('logged-in');
        });

        it('should open the login form when not logged in', function () {
          expect(header.ssoLoginContainer.getCssValue('display'))
            .toEqual('none');
          expect(header.loginForm.getCssValue('display')).toEqual('block');
          expect(header.loggedInMenu.getCssValue('display')).toEqual('none');

          header.loginBtn.click();

          expect(header.ssoLoginContainer.getCssValue('display'))
            .toEqual('block');
          expect(header.loginForm.getCssValue('display')).toEqual('block');
          expect(header.loggedInMenu.getCssValue('display')).toEqual('none');
        });
      });

      describe('Logged in', function () {
        beforeEach(function () {
          browser.get('/');
          // Mock the logged in cookie from Bibliocommons.
          browser.manage().addCookie('bc_username', 'edwinguzman');
          browser.sleep(1000);
          browser.waitForAngular();
        });

        it('should display the user\'s name in the header button', function () {
          expect(header.loginBtn.getText()).toEqual('edwinguzman');
        });

        it('should have the "logged-in" class for the form', function () {
          expect(header.ssoLoginContainer.getAttribute('class'))
            .toContain('logged-in');
        });

        it('should display the Bibliocommons menu when logged in', function () {
          expect(header.ssoLoginContainer.getCssValue('display'))
            .toEqual('none');
          expect(header.loginForm.getCssValue('display')).toEqual('none');
          expect(header.loggedInMenu.getCssValue('display')).toEqual('block');

          header.loginBtn.click();

          expect(header.ssoLoginContainer.getCssValue('display'))
            .toEqual('block');
          expect(header.loginForm.getCssValue('display')).toEqual('none');
          expect(header.loggedInMenu.getCssValue('display')).toEqual('block');

        });
      });
    }); /* End Header menu */

    // No actual signing in occurs. A cookie is created that mocks signing in
    // since we don't want to click on the 'Submit' button and go through
    // the redirects from Bibliocommons.
    describe('Mock log in and log out', function () {
      it('should log you in', function () {
        browser.get('/');
        browser.waitForAngular();

        expect(header.loginBtn.getText()).toEqual('LOG IN');
        header.loginBtn.click();

        header.username.sendKeys('edwinguzman');
        header.pin.sendKeys('1234');

        // Not actually hitting submit, creating logged in cookie:
        browser.manage().addCookie('bc_username', 'edwinguzman');

        browser.refresh();
        browser.waitForAngular();

        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data.name).toEqual('bc_username');
          expect(data.value).toEqual('edwinguzman');
        });

        expect(header.loginBtn.getText()).toEqual('edwinguzman');
        header.loginBtn.click();

        expect(header.loggedInMenu.getCssValue('display')).toEqual('block');
      });
    });

  }); /* End Login Header */

  describe('Navigating the site', function () {
    describe('Not logged in', function () {
      it('should keep you logged out', function () {
        browser.get('/');
        browser.waitForAngular();

        expect(header.loginBtn.getText()).toEqual('LOG IN');
        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data).toBe(null);
        });
        expect(header.loginForm.getCssValue('display')).toEqual('block');

        landingPage.onlyResearch.click();
        browser.sleep(1000);
        landingPage.nthLocLink(0).click();
        browser.waitForAngular();
        expect(browser.getCurrentUrl())
          .toEqual('http://localhost:9292/schwarzman');

        expect(header.loginBtn.getText()).toEqual('LOG IN');
        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data).toBe(null);
        });
        expect(header.loginForm.getCssValue('display')).toEqual('block');

        element(by.linkText('General Research Division')).click();
        browser.waitForAngular();
        expect(browser.getLocationAbsUrl()).toEqual('http://localhost:9292/' +
          'divisions/general-research-division');

        expect(header.loginBtn.getText()).toEqual('LOG IN');
        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data).toBe(null);
        });
        expect(header.loginForm.getCssValue('display')).toEqual('block');
      });
    });

    describe('Logged in', function () {
      it('should keep you logged in', function () {
        browser.get('/');
        browser.manage().addCookie('bc_username', 'edwinguzman');
        browser.waitForAngular();

        expect(header.loginBtn.getText()).toEqual('edwinguzman');
        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data.name).toEqual('bc_username');
          expect(data.value).toEqual('edwinguzman');
        });
        expect(header.loggedInMenu.getCssValue('display')).toEqual('block');

        landingPage.onlyResearch.click();
        browser.sleep(1000);
        landingPage.nthLocLink(0).click();
        browser.waitForAngular();
        expect(browser.getCurrentUrl())
          .toEqual('http://localhost:9292/schwarzman');

        expect(header.loginBtn.getText()).toEqual('edwinguzman');
        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data.name).toEqual('bc_username');
          expect(data.value).toEqual('edwinguzman');
        });
        expect(header.loggedInMenu.getCssValue('display')).toEqual('block');

        element(by.linkText('General Research Division')).click();
        browser.waitForAngular();
        expect(browser.getLocationAbsUrl()).toEqual('http://localhost:9292/' +
          'divisions/general-research-division');

        expect(header.loginBtn.getText()).toEqual('edwinguzman');
        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data.name).toEqual('bc_username');
          expect(data.value).toEqual('edwinguzman');
        });
        expect(header.loggedInMenu.getCssValue('display')).toEqual('block');

        element(by.css('.nypl-logo a')).click();
        browser.waitForAngular();
        expect(browser.getLocationAbsUrl())
          .toEqual('http://localhost:9292/');

        expect(header.loginBtn.getText()).toEqual('edwinguzman');
        cookieObj = browser.manage().getCookie('bc_username');
        cookieObj.then(function (data) {
          expect(data.name).toEqual('bc_username');
          expect(data.value).toEqual('edwinguzman');
        });
        expect(header.loggedInMenu.getCssValue('display')).toEqual('block');
      });
    });
  }); /* End Navigating the site */

});
