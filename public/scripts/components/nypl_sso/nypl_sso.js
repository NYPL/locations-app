/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $, window, console, jQuery, angular */

function nyplSSO(ssoStatus) {
  'use strict';
  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: 'scripts/components/nypl_sso/nypl_sso.html',
    link: function (scope, element, attrs) {
      // ssoStatus.remember('Edwin');

      var ssoLoginElement = $('.sso-login'),
        ssoUserButton = $('.login-button');

      // Toggle Desktop Login Form
      ssoUserButton.click(function () {
        element.find('.sso-login').toggleClass('visible');
      });

      initForm();
      userButton();

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
        button.click(function (e) {
          e.preventDefault();
          if (checkbox.is(':checked')) {
            ssoStatus.remember(username.val());
          }
        });
      }

      function userButton(options) {
        var defaults = {
            logged_in_menu: '.logged-in-menu',
            login_form: '.login-form',
            mobile: false,
            navBtn: $('.nav-open-button'),
            formClass: ''
          },
          settings = $.extend({}, defaults, options),
          login = ssoStatus.login(),
          logged_in = (login !== null && login !== undefined);

        // Set the button label
        scope.header_button_label = "LOG IN";

        if (logged_in) {
          scope.header_button_label = ssoStatus.login();
          ssoUserButton.addClass('logged-in');
        }
      }


      // Toggle Mobile Navigation
      $('.nav-open-button').click(function () {
        $(this).toggleClass('open');
        $('.search-open-button').removeClass('open');
        $('#search-block-form-input').removeClass('open-search');
        $('.search-options-resp').removeClass('open');
        $('#search-top').removeClass('open');
        $('#main-nav').toggleClass('open-navigation');
        $('.sso-login').removeClass('visible');
        return false;
      });

      // Toggle Mobile Search
      $('.search-open-button').click(function () {
        $(this).toggleClass('open');
        $('.nav-open-button').removeClass('open');
        $('#main-nav').removeClass('open-navigation');
        $('#search-block-form-input').toggleClass('open-search');
        $('#search-top').toggleClass('open');
        $('.sso-login').removeClass('visible');
        return false;
      });


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
