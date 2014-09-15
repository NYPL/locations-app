/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

(function () {
  'use strict';

  function nyplSSO(ssoStatus, $window, $location, $rootScope) {
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
          var current_url = $window.location.hash;

          // Set the button label
          scope.header_button_label = "LOG IN";

          if (ssoStatus.logged_in()) {
            scope.header_button_label = ssoStatus.login();
            scope.logout_url = "https://nypl.bibliocommons.com/user/logout" +
              "?destination=" + $location.absUrl();
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
      return !!(this.login() && this.login() !== null);
    };

    ssoStatus.remember = function (name) {
      if (name) {
        return $.cookie('remember_me', name, {path: '/'});
      }
      return $.cookie('remember_me');
    };

    ssoStatus.remembered = function () {
      var remember_me = this.remember();
      return !!(remember_me && remember_me !== null);
    };

    ssoStatus.forget = function () {
      return $.removeCookie('remember_me', {path: '/'});
    };

    return ssoStatus;
  }

  angular
    .module('nyplSSO', [])
    .service('ssoStatus', ssoStatus)
    .directive('nyplSso', nyplSSO);

})();

