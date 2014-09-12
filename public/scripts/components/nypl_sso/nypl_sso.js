/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  function nyplSSO(ssoStatus) {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      templateUrl: 'scripts/components/nypl_sso/nypl_sso.html',
      link: function (scope, element, attrs) {
        // ssoStatus.remember('Edwin');

        var ssoLoginElement = $('.sso-login'),
          ssoUserButton = $('.login-button');

        function makeForm(username, checkbox, button) {
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

          // Submit the login form
          button.click(function () {
            if (checkbox.is(':checked')) {
              ssoStatus.remember(username.val());
            }
          });
        }

        function initForm(options) {
          var defaults = {
              username: '#username',
              remember_checkbox: '#remember_me',
              login_button: '#login-form-submit'
            },
            settings = $.extend({}, defaults, options);

          if (ssoStatus.logged_in()) {
            ssoLoginElement.addClass('logged-in');
          }

          makeForm(
            $(settings.username),
            $(settings.remember_checkbox),
            $(settings.login_button)
          );
        }

        function userButton(options) {
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

  function ssoStatus() {
    var ssoStatus = {};

    ssoStatus.login = function () {
      // next line for testing if logged in
      // $.cookie('bc_username', 'edwinguzman');
      return $.cookie('bc_username');
    };

    ssoStatus.logged_in = function () {
      return (this.login() && this.login() !== null);
    };

    ssoStatus.remember = function (name) {
      if (name) {
        return $.cookie('remember_me', name);
      }
      return $.cookie('remember_me');
    };

    ssoStatus.remembered = function () {
      var remember_me = this.remember();
      return (remember_me && remember_me !== null);
    };

    ssoStatus.forget = function () {
      return $.removeCookie('remember_me');
    };

    return ssoStatus;
  }

  angular
    .module('nyplSSO', [])
    .service('ssoStatus', ssoStatus)
    .directive('nyplSso', nyplSSO);

})();

