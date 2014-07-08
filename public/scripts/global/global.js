/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals $ */

function headerScripts() {
  'use strict';

  // Toggle Desktop Login Form
  $('.login-button').click(function () {
    $('.sso-login').toggleClass('visible');
  });

  // Toggle Mobile Login Form
  $('.mobile-login').click(function () {
    $('.sso-login').toggleClass('visible');
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

// On Document Load
$(headerScripts());
