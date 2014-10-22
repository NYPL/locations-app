/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('NYPL Chat Window', function () {
  'use strict';

  var chatElem = require('./nyplchat.po.js'),
    appWindow = browser.getWindowHandle(),
    chatRegex = /http:\/\/www.nypl.org\/ask-librarian/;

  function verifyChatURL() {
    browser.getAllWindowHandles().then(function (handles) {
      var newWindowHandle = handles[1];

      browser.switchTo().window(newWindowHandle).then(function () {
        browser.sleep(1000);
        expect(browser.driver.getCurrentUrl()).toMatch(chatRegex);
        browser.driver.close().then(function () {
          browser.switchTo().window(appWindow);
        });
      });
    });
  }

  describe('Circulating page: Battery Park City', function () {
    beforeEach(function () {
      browser.get('/battery-park-city');
      browser.waitForAngular();
    });

    it('should not initialize with an active class', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the element when clicked', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');

      chatElem.chat_link.click().then(verifyChatURL);

      expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
      chatElem.chat_link.click().then(verifyChatURL);
    });
  });

  describe('Research page: Schomburg', function () {
    beforeEach(function () {
      browser.get('/schomburg');
      browser.waitForAngular();
    });

    it('should not initialize with an active class', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the element when clicked', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
      chatElem.chat_link.click().then(verifyChatURL);
      expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
      chatElem.chat_link.click().then(verifyChatURL);
    });
  });

  describe('Division: Lionel Pincus and Princess Firyal Map Division',
    function () {
      beforeEach(function () {
        browser.get('/divisions/map-division');
        browser.waitForAngular();
      });

      it('should not initialize with an active class', function () {
        expect(chatElem.chat_link.getAttribute('class'))
          .not.toContain('active');
      });

      it('should add an active class to the element when clicked', function () {
        expect(chatElem.chat_link.getAttribute('class'))
          .not.toContain('active');
        chatElem.chat_link.click().then(verifyChatURL);
        expect(chatElem.chat_link.getAttribute('class')).toContain('active');
      });

      it('should open a new window with proper url params', function () {
        chatElem.chat_link.click().then(verifyChatURL);
      });
    });

  describe('Amenities page', function () {
    beforeEach(function () {
      browser.get('/amenities');
      browser.waitForAngular();
    });

    it('should not initialize with an active class', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the element when clicked', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
      chatElem.chat_link.click().then(verifyChatURL);
      expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
      chatElem.chat_link.click().then(verifyChatURL);
    });
  });

  describe('Single Amenity page: "Computers for Public Use"', function () {
    beforeEach(function () {
      browser.get('/amenities/id/7964');
      browser.waitForAngular();
    });

    it('should not initialize with an active class', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the element when clicked', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
      chatElem.chat_link.click().then(verifyChatURL);
      expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
      chatElem.chat_link.click().then(verifyChatURL);
    });
  });

  describe('Amenities at Schomburg page', function () {
    beforeEach(function () {
      browser.get('/amenities/loc/schomburg');
      browser.waitForAngular();
    });

    it('should not initialize with an active class', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the element when clicked', function () {
      expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
      chatElem.chat_link.click().then(verifyChatURL);
      expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
      chatElem.chat_link.click().then(verifyChatURL);
    });
  });

});