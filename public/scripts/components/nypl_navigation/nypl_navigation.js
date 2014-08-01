/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

function nyplNavigation() {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: 'scripts/components/nypl_navigation/nypl_navigation.html',
    link: function (scope, element, attrs) {
      // Open/Close Main Navigation
      $('.dropDown').hover(
        function () {
          $(this).addClass('openDropDown');
        },
        function () {
          $(this).removeClass('openDropDown');
        }
      );
    }
  };
}

angular
  .module('nyplNavigation', [])
  .directive('nyplNavigation', nyplNavigation);
