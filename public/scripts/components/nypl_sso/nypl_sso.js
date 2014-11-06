/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name nyplSSO.directive:nyplSso
   * @restrict E
   * @requires ssoStatus
   * @requires $window
   * @requires $rootScope
   * @scope
   * @description
   * Displays the NYPL SSO/donate button and login forms, to sign in and the
   * Bibliocommons signed in menu.
   * @example
   * <pre>
   *  <nypl-sso></nypl-sso>
   * </pre>
   */
  function nyplSSO(ssoStatus, $window, $rootScope) {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      templateUrl: 'scripts/components/nypl_sso/nypl_sso.html',
      link: function (scope, element, attrs) {
        var ssoLoginElement = $('.sso-login'),
          ssoUserButton = $('.login-button');

        function makeForm(username, pin, checkbox, button) {
          var current_url = '';

          if (ssoStatus.remembered()) {
            username.val(ssoStatus.remember()); // Fill in username
            checkbox.attr("checked", true); // Mark the checkbox
          }
          
          // If the checkbox is unchecked, remove the cookie
          checkbox.click(function () {
            if (!$(this).is(':checked')) {
              ssoStatus.forget();
            }
          });

          $rootScope.$watch('current_url', function () {
            current_url = $rootScope.current_url;
          });

          // Submit the login form
          button.click(function (e) {
            var url = 'https://nypl.bibliocommons.com/user/login?destination=';
            e.preventDefault();

            if (checkbox.is(':checked')) {
              ssoStatus.remember(username.val());
            }

            url += current_url.replace('#', '%23') + '&';
            url += 'name=' + username.val();
            url += '&user_pin=' + pin.val();

            $window.location.href = url;
          });
        }

        function initForm(options) {
          var defaults = {
              username: '#username',
              pin: '#pin',
              remember_checkbox: '#remember_me',
              login_button: '#login-form-submit'
            },
            settings = $.extend({}, defaults, options);

          if (ssoStatus.logged_in()) {
            ssoLoginElement.addClass('logged-in');
          }

          makeForm(
            $(settings.username),
            $(settings.pin),
            $(settings.remember_checkbox),
            $(settings.login_button)
          );
        }

        function userButton(options) {
          $rootScope.$watch('current_url', function () {
            scope.logout_url = "https://nypl.bibliocommons.com/user/logout" +
              "?destination=" + $rootScope.current_url;
          })

          // Set the button label
          scope.header_button_label = "LOG IN";

          if (ssoStatus.logged_in()) {
            scope.header_button_label = ssoStatus.login();
            ssoUserButton.addClass('logged-in');
          }

          // Toggle Desktop Login Form
          ssoUserButton.click(function () {
            ssoLoginElement.toggleClass('visible');
          });
        }

        initForm();
        userButton();

      }
    };
  }

  /**
   * @ngdoc service
   * @name nyplSSO.service:ssoStatus
   * @description
   * AngularJS service used to check browser cookies to verify if a user
   * is logged in or not. Sets cookie when signing in and can remove cookies.
   */
  function ssoStatus() {
    var ssoStatus = {};

    /**
     * @ngdoc function
     * @name login
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {string} User's usename from the bc_username cookie. If the
     * user is not logged in, undefined will be returned.
     */
    ssoStatus.login = function () {
      return $.cookie('bc_username');
    };

    /**
     * @ngdoc function
     * @name logged_in
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {boolean} True if the user is logged in and false otherwise.
     */
    ssoStatus.logged_in = function () {
      return !!(this.login() && this.login() !== null);
    };

    /**
     * @ngdoc function
     * @name remember
     * @methodOf nyplSSO.service:ssoStatus
     * @param {string} [name] A setter and getter. Sets the user's username
     *  if the parameter was passed. If no parameter was passed, it will return
     *  the username from the remember_me cookie.
     * @returns {string} User's usename from the bc_username cookie. If the
     *  user is not logged in, undefined will be returned.
     */
    ssoStatus.remember = function (name) {
      if (name) {
        return $.cookie('remember_me', name, {path: '/'});
      }
      return $.cookie('remember_me');
    };

    /**
     * @ngdoc function
     * @name remembered
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {boolean} Returns true if the user clicked on the 'Remember me'
     *  checkbox and the cookie is set, false otherwise.
     */
    ssoStatus.remembered = function () {
      var remember_me = this.remember();
      return !!(remember_me && remember_me !== null);
    };

    /**
     * @ngdoc function
     * @name forget
     * @methodOf nyplSSO.service:ssoStatus
     * @returns {boolean} Delete the 'remember_me' cookie if the 'Remember me'
     *  checkbox was unselected when submitting the form. Returns true if
     *  deleting was successful, false if deleting the cookie failed.
     */
    ssoStatus.forget = function () {
      return $.removeCookie('remember_me', {path: '/'});
    };

    return ssoStatus;
  }

  /**
   * @ngdoc overview
   * @module nyplSSO
   * @name nyplSSO
   * @description
   * AngularJS module for adding the SSO header button and functionality
   * including browser cookies for verifying against Bibliocommons.
   */
  angular
    .module('nyplSSO', [])
    .service('ssoStatus', ssoStatus)
    .directive('nyplSso', nyplSSO);

})();

