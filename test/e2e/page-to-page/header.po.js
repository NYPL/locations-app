/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var Header = function () {
  'use strict';

  this.loginBtn = element(by.css('.login-button'));
  this.mobileLoginBtn = element(by.css('.mobile-login'));

  this.username = element(by.id('username'));
  this.pin = element(by.id('pin'));
  this.rememberMe = element(by.id('remember_me'));

  this.ssoLoginContainer = element(by.css('.sso-login'));
  this.loginForm = element(by.css('.login-form'));
  this.loggedInMenu = element(by.css('.logged-in-menu'));

};

module.exports = new Header();
