/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80 */
/*globals element, by, module, module,
describe, expect, beforeEach, inject, it, angular */

/*
 * Tests for nyplSSO module.
 *   The nyplSSO module only has one directive and it's to show/hide the 
 *   login form.
 */
describe('nyplSSO module', function () {
  'use strict';

  var element, $compile, $rootScope, httpBackend;

  beforeEach(module('nyplSSO'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_) {
    httpBackend = _$httpBackend_;

    httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
  }));

  /*
   * <nypl-sso></nypl-sso>
   *   The nypl-sso directive displays the login and donate buttons and has
   *   DOM manipulation to show and hide the login form.
   */
  describe('nypl-sso', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<nypl-sso></nypl-sso>');
      $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should compile', function () {
      expect(element.attr('class')).toContain('login-donate');
    });

    it('should have a donate button', function () {
      expect(element.find('.donate-button').text()).toEqual('DONATE');
      expect(element.find('.donate-button').attr('href'))
        .toEqual('https://secure3.convio.net/nypl/site/SPageServer?page' +
          'name=donation_form&JServSessionIdr003=dwcz55yj27.' +
          'app304a&s_src=FRQ14ZZ_SWBN');
    });

    it('should have a login button', function () {
      expect(element.find('.login-button').text().trim()).toEqual('LOG IN');
    });

    it('should have the SSO login form', function () {
      var login_form_container = element.find('.sso-login');
      expect(login_form_container.find('form').attr('id'))
        .toEqual('bc-sso-login-form--2');
      expect(login_form_container.find('.form-item-name').text().trim())
        .toEqual('Username or bar code:');
      expect(login_form_container.find('.form-item-user-pin').text().trim())
        .toEqual('PIN:');
      expect(login_form_container.find('.form-item-remember-me').text().trim())
        .toEqual('Remember me');
    });

    it('should have help links', function () {
      var login_form = element.find('form'),
        help_links = login_form.find('#login-form-help');

      expect(help_links.find('a').length).toBe(2);
      expect(help_links.find('.forgotpin-button').text())
        .toEqual('Forgot your PIN?');
      expect(help_links.find('.createacct-button').text())
        .toEqual('Need an account?');
    });

    it('should show the sso-login form', function () {
      expect(element.find('.sso-login').attr('class')).not.toContain('visible');

      element.find('.login-button').click();

      // The login form container should be visible now.
      expect(element.find('.sso-login').attr('class')).toContain('visible');
    });
  });

});
