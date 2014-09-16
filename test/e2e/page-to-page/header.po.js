/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var Header = function () {
  'use strict';

  this.loginBtn = element(by.css('.login-button'));

};

module.exports = new Header();
