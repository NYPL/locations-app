/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var Header = function () {
  'use strict';

  this.loginBtn = element(by.css('.login-button'));
  this.mobileLoginBtn = element(by.css('.mobile-login'));

  this.username = element(by.id('username'));
  this.pin = element(by.id('pin'));
  this.remember_me = element(by.id('remember_me'));

  this.sso_login_container = element(by.css('.sso-login'));
  this.login_form = element(by.css('.login-form'));
  this.logged_in_menu = element(by.css('.logged-in-menu'));

};

module.exports = new Header();
