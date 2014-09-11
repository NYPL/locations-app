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
      // console.log(ssoStatus.remember());

      var ssoLoginElement = $('.sso-login');
      var ssoUserButton = $('.login-button');

      scope.bc_logged_in = false;
      if (ssoStatus.logged_in()) {
        scope.bc_logged_in = true;
      }

      function initForm(options) {
        var defaults = {
            username: '#username',
            remember_checkbox: '#remember_me',
            login_button: '#login-form-submit'
          }, 
          settings = $.extend({}, defaults, options);

        ssoLoginElement.data('sso_details', settings);

        if (ssoStatus.logged_in()) {
          ssoLoginElement.addClass('logged-in');
        }

        makeForm(
          $(settings.username),
          $(settings.remember_checkbox),
          $(settings.login_button)
        );


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
            // Save Cookie
            if (checkbox.is(':checked')) {
              ssoStatus.remember(username.val());
            }
          });
        }
      }

      function userButton(options) {
        var defaults = {
          logged_in_menu: '.logged-in-menu',
          login_form: '.login-form',
          mobile: false,
          navBtn: $('.nav-open-button'),
          formClass: ''
        };
        var settings = $.extend({}, defaults, options);
        ssoUserButton.data('sso_user_button', settings);

        // login is the username if the user is logged in, or null
        var login = ssoStatus.login();
        var logged_in = (login !== null && login !== undefined);

          // Set the button label
        if (logged_in) {
          ssoUserButton.find('.label').text(ssoStatus.login());
          ssoUserButton.addClass('logged-in');
        } else {
          ssoUserButton.find('.label').text("LOG IN");
        }
          
          // the mobile nav button should close the login form on mobile
          // settings.navBtn.on('click', function () {
          //   settings.details.sso_details('hide');
          // });
          // methods.logout('#sso-logout');

      }

      initForm();
      userButton();


      // Toggle Desktop Login Form
      $('.login-button').click(function () {
        element.find('.sso-login').toggleClass('visible');
      });

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

function ssoStatus($cookies) {
  var ssoStatus = {};

  ssoStatus.login = function () {
    // next line for testing if logged in
    // $cookies.bc_username = 'Edwin';
    return $cookies.bc_username;
  };

  ssoStatus.logged_in = function () {
    return this.login() !== undefined && this.login() !== null;
  };

  ssoStatus.remember = function (name) {
    if (name) {
      return $cookies.remember_me = name;
    }
    return $cookies.remember_me;
  };

  ssoStatus.remembered = function () {
    return $cookies.remember_me !== null && $cookies.remember_me !== undefined;
  };

  ssoStatus.forget = function () {
    return delete $cookies.remember_me;
  };

  return ssoStatus;
}

angular
  .module('nyplSSO', [])
  .service('ssoStatus', ssoStatus)
  .directive('nyplSso', nyplSSO);
