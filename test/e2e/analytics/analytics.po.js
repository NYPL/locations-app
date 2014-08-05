/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module */

var LandingPage = function () {
  'use strict';

  this.branch_link = element(
    by.css('.locations-list-view .locations-row:first-child a:first-child')
  );
};

module.exports = new LandingPage();

