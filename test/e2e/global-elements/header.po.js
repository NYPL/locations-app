/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var Header = function () {
  'use strict';

  this.username = element(by.id('username'));
  this.pin = element(by.id('pin'));
  this.rememberMe = element(by.id('remember_me'));

  this.ssoLoginContainer = element(by.css('.sso-login'));
  this.loginForm = element(by.css('.login-form'));
  this.loggedInMenu = element(by.css('.logged-in-menu'));

  // For Header GA events
  this.classic_catalog = element(by.css('.search-classic-catalog a'));
  this.nypl_logo = element(by.css('.nypl-logo a'));
  this.donate_button = element(by.css('.donate-button'));

  // For SSO GA events
  this.loginBtn = element(by.css('.login-button'));
  this.mobileLoginBtn = element(by.css('.mobile-login a'));
  this.loginSubmit = element(by.id('login-form-submit'));
  this.logOutBtn = element(by.id('sso-logout'));

  // For Header GA Search events
  this.searchInputField = element(by.id('search-block-form-input'));
  this.radioBtn_catalog = element(by.css('.search-the-catalog'));
  this.radioBtn_website = element(by.css('.search-the-website'));
  this.searchBtn = element(by.css('.search-button'));

};

module.exports = new Header();
