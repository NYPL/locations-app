/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

function nyplNavigation(ssoStatus, $window) {
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

      // Toggle Mobile Login Form
      $('.mobile-login').click(function () {
        if (ssoStatus.logged_in()) {
          $window.location.href = "http://www.nypl.org/bc_sso/logout";
        } else {
          $('.sso-login').toggleClass('visible');
        }
      });

      scope.menuLabel = 'Log In';
      if (ssoStatus.logged_in()) {
        scope.menuLabel = 'Log Out';
        // Might not need this.
        // $('.mobile-login').find('a').text('Log Out')
        //  .attr('href', 'http://www.nypl.org/bc_sso/logout');
      }
    }
  };
}

angular
  .module('nyplNavigation', [])
  .directive('nyplNavigation', nyplNavigation);
