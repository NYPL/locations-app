/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nyplNavigation.directive:nyplNavigation
   * @restrict E
   * @requires ssoStatus
   * @requires $window
   * @requires $rootScope
   * @scope
   * @description
   * Displays the NYPL navigation menu.
   * @example
   * <pre>
   *  <nypl-navigation></nypl-navigation>
   * </pre>
   */
  function nyplNavigation(ssoStatus, $window, $rootScope) {
    return {
      restrict: 'E',
      scope: {
        activenav: '@'
      },
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

        $rootScope.$watch('current_url', function () {
          scope.logout_url = "https://nypl.bibliocommons.com/user/logout" +
            "?destination=" + $rootScope.current_url;
        })

        // Toggle Mobile Login Form
        $('.mobile-login').click(function (e) {
          e.preventDefault();
          if (ssoStatus.logged_in()) {
            $window.location.href = scope.logout_url;
          } else {
            $('.sso-login').toggleClass('visible');
          }
        });

        scope.menuLabel = 'Log In';
        if (ssoStatus.logged_in()) {
          scope.menuLabel = 'Log Out';
        }

      }
    };
  }

  /**
   * @ngdoc directive
   * @name nyplNavigation.directive:nyplCollapsedButtons
   * @restrict E
   * @scope
   * @description
   * Displays the mobile collapsed buttons and add click event handlers.
   * @example
   * <pre>
   *  <nypl-collapsed-buttons></nypl-collapsed-buttons>
   * </pre>
   */
  function nyplCollapsedButtons() {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      templateUrl: 'scripts/components/nypl_navigation/nypl_collapsed_buttons.html',
      link: function (scope, element, attrs) {
        // Toggle Mobile Navigation
        var navBtn = element.find('.nav-open-button'),
          searchBtn = element.find('.search-open-button');

        navBtn.click(function () {
          $(this).toggleClass('open');
          searchBtn.removeClass('open');
          $('#search-block-form-input').removeClass('open-search');
          $('.search-options-resp').removeClass('open');
          $('#search-top').removeClass('open');
          $('#main-nav').toggleClass('open-navigation');
          $('.sso-login').removeClass('visible');
          return false;
        });

        // Toggle Mobile Search
        searchBtn.click(function () {
          $(this).toggleClass('open');
          navBtn.removeClass('open');
          $('#search-block-form-input').toggleClass('open-search');
          $('#search-top').toggleClass('open');
          $('#main-nav').removeClass('open-navigation');
          $('.sso-login').removeClass('visible');
          return false;
        });

      }
    };
  }

  /**
   * @ngdoc overview
   * @module nyplNavigation
   * @name nyplNavigation
   * @description
   * AngularJS module for adding the NYPL navigation menu as a directive.
   * This module also has a directive for adding mobile collapsed buttons.
   */
  angular
    .module('nyplNavigation', [])
    .directive('nyplNavigation', nyplNavigation)
    .directive('nyplCollapsedButtons', nyplCollapsedButtons);

})();

