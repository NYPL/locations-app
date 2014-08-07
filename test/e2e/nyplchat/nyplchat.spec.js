/*jslint indent: 2, maxlen: 80, regexp: true */
/*global describe, require, beforeEach,
browser, it, expect, element, by, angular */

describe('NYPL Chat Window', function () {
  'use strict';

  var chatElem = require('./nyplchat.po.js');

  describe('Circulating page nypl chat link: Battery Park City', function () {

	  beforeEach(function () {
      browser.get('/#/battery-park-city');
      browser.waitForAngular();
    });

    it('should not initialize with an active class unless clicked on', function () {
    	expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the link element, if none exist', function () {
      chatElem.chat_link.click();
      browser.sleep(2000);
    	expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
    	var appWindow = browser.getWindowHandle();

			chatElem.chat_link.click().then(function () {
        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo().window(newWindowHandle).then(function () {
            browser.sleep(1000);
            expect(browser.driver.getCurrentUrl())
              .toMatch(/http:\/\/www.nypl.org\/ask-librarian/);
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
	    });
	  });
  });

  describe('Research page nypl chat link: Schomburg', function () {

	  beforeEach(function () {
      browser.get('/#/schomburg');
      browser.waitForAngular();
    });

    it('should not initialize with an active class unless clicked on', function () {
    	expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the link element, if none exist', function () {
      chatElem.chat_link.click();
      browser.sleep(2000);
    	expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
    	var appWindow = browser.getWindowHandle();

			chatElem.chat_link.click().then(function () {
        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo().window(newWindowHandle).then(function () {
            browser.sleep(1000);
            expect(browser.driver.getCurrentUrl())
              .toMatch(/http:\/\/www.nypl.org\/ask-librarian/);
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
	    });
	  });
  });

  describe('Division page nypl chat link: Sound and Video Recordings Division', function () {

	  beforeEach(function () {
      browser.get('/#/division/sound-and-video-recordings');
      browser.waitForAngular();
    });

    it('should not initialize with an active class unless clicked on', function () {
    	expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the link element, if none exist', function () {
      chatElem.chat_link.click();
      browser.sleep(2000);
    	expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
    	var appWindow = browser.getWindowHandle();

			chatElem.chat_link.click().then(function () {
        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo().window(newWindowHandle).then(function () {
            browser.sleep(1000);
            expect(browser.driver.getCurrentUrl())
              .toMatch(/http:\/\/www.nypl.org\/ask-librarian/);
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
	    });
	  });
  });

  describe('Global Amenities page nypl chat link', function () {

	  beforeEach(function () {
      browser.get('/#/amenities');
      browser.waitForAngular();
    });

    it('should not initialize with an active class unless clicked on', function () {
    	expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the link element, if none exist', function () {
      chatElem.chat_link.click();
      browser.sleep(2000);
    	expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
    	var appWindow = browser.getWindowHandle();

			chatElem.chat_link.click().then(function () {
        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo().window(newWindowHandle).then(function () {
            browser.sleep(1000);
            expect(browser.driver.getCurrentUrl())
              .toMatch(/http:\/\/www.nypl.org\/ask-librarian/);
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
	    });
	  });
  });

  describe('Amenities ID:4 "Computers for Public Use" page nypl chat link', function () {

	  beforeEach(function () {
      browser.get('/#/amenities/4');
      browser.waitForAngular();
    });

    it('should not initialize with an active class unless clicked on', function () {
    	expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the link element, if none exist', function () {
      chatElem.chat_link.click();
      browser.sleep(2000);
    	expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
    	var appWindow = browser.getWindowHandle();

			chatElem.chat_link.click().then(function () {
        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo().window(newWindowHandle).then(function () {
            browser.sleep(1000);
            expect(browser.driver.getCurrentUrl())
              .toMatch(/http:\/\/www.nypl.org\/ask-librarian/);
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
	    });
	  });
  });

  describe('Amenities page for Schomburg nypl chat link', function () {

	  beforeEach(function () {
      browser.get('/#/amenities/location/SC');
      browser.waitForAngular();
    });

    it('should not initialize with an active class unless clicked on', function () {
    	expect(chatElem.chat_link.getAttribute('class')).not.toContain('active');
    });

    it('should add an active class to the link element, if none exist', function () {
      chatElem.chat_link.click();
      browser.sleep(2000);
    	expect(chatElem.chat_link.getAttribute('class')).toContain('active');
    });

    it('should open a new window with proper url params', function () {
    	var appWindow = browser.getWindowHandle();

			chatElem.chat_link.click().then(function () {
        browser.getAllWindowHandles().then(function (handles) {
          var newWindowHandle = handles[1];

          browser.switchTo().window(newWindowHandle).then(function () {
            browser.sleep(1000);
            expect(browser.driver.getCurrentUrl())
              .toMatch(/http:\/\/www.nypl.org\/ask-librarian/);
            browser.driver.close().then(function () {
              browser.switchTo().window(appWindow);
            });
          });
        });
	    });
	  });
  });

});