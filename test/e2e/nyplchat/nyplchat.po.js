/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var chatSection = function () {
  'use strict';

  this.chat_link = element(
    by.css('.askchat')
  );

};

module.exports = new chatSection();