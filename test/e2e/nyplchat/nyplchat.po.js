/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var ChatSection = function () {
  'use strict';

  this.chat_link = element(by.css('.askchat'));

};

module.exports = new ChatSection();