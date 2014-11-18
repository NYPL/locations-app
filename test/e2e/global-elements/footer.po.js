/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var Footer = function () {
  'use strict';

  this.footerLinks = element.all(by.css('.footerlinks a'));

};

module.exports = new Footer();
