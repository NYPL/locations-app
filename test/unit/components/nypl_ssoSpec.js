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

  var element, $compile, $scope, httpBackend, ssoStatus;

  beforeEach(module('nyplSSO'));
  beforeEach(module('directiveTemplates'));
  beforeEach(inject(function (_$httpBackend_, _ssoStatus_) {
    httpBackend = _$httpBackend_;
    ssoStatus = _ssoStatus_;

    httpBackend
        .expectGET('/languages/en.json')
        .respond('public/languages/en.json');
  }));

  describe('Service: ssoStatus', function () {
    function loggedIn() {
      return 'edwinguzman';
    }
    function notLoggedIn() {
      return;
    }

    it('should expose some functions', function () {
      expect(ssoStatus.login).toBeDefined();
      expect(ssoStatus.logged_in).toBeDefined();
      expect(ssoStatus.remember).toBeDefined();
      expect(ssoStatus.remembered).toBeDefined();
      expect(ssoStatus.forget).toBeDefined();
    });

    describe('ssoStatus.login()', function () {
      it('should retrieve a username since logged in', function () {
        $.cookie = jasmine.createSpy('cookie').and.callFake(loggedIn);
        expect(ssoStatus.login()).toEqual('edwinguzman');
      });

      it('should not retrieve any username since not logged in', function () {
        $.cookie = jasmine.createSpy('cookie').and.callFake(notLoggedIn);
        expect(ssoStatus.login()).not.toBeDefined();
      });
    });

    describe('ssoStatus.logged_in()', function () {
      it('should return false since not logged in', function () {
        $.cookie = jasmine.createSpy('cookie').and.callFake(notLoggedIn);
        expect(ssoStatus.logged_in()).toBe(false);
      });

      it('should return true since logged in', function () {
        $.cookie = jasmine.createSpy('cookie').and.callFake(loggedIn);
        expect(ssoStatus.logged_in()).toBe(true);
      });
    });

    describe('ssoStatus.remember()', function () {
      it('should store the username in a cookie', function () {
        $.cookie = jasmine.createSpy('cookie');

        ssoStatus.remember('edwinguzman')
        expect($.cookie)
          .toHaveBeenCalledWith('remember_me', 'edwinguzman', {path: '/'});
      });

      it('should return the username', function () {
        var obj = {},
          callback = function (key, val) {
            if (val) {
              obj[key] = val;
            } else {
              return obj[key];
            }
          };

        $.cookie = jasmine.createSpy('cookie').and.callFake(callback);

        // Set the cookie
        ssoStatus.remember('edwinguzman');
        // Retrieve the cookie
        expect(ssoStatus.remember()).toEqual('edwinguzman');
      });

      it('should not return if no cookie was set', function () {
        var obj = {},
          callback = function (key, val) {
            if (val) {
              obj[key] = val;
            } else {
              return obj[key];
            }
          };

        $.cookie = jasmine.createSpy('cookie').and.callFake(callback);

        // Retrieve the cookie
        expect(ssoStatus.remember()).not.toBeDefined();
      });
    });

    describe('ssoStatus.remembered()', function () {
      beforeEach(function () {
        var obj = {},
          callback = function (key, val) {
            if (val) {
              obj[key] = val;
            } else {
              return obj[key];
            }
          };

        $.cookie = jasmine.createSpy('cookie').and.callFake(callback);
      });

      it('should return false since not remembered', function () {
        expect(ssoStatus.remembered()).toBe(false);
      });

      it('should return true since remembered is set', function () {
        ssoStatus.remember('edwinguzman');
        expect(ssoStatus.remembered()).toBe(true);
      });
    });

    describe('ssoStatus.forget()', function () {
      beforeEach(function () {
        var obj = {},
          callback = function (key, val) {
            if (val) {
              obj[key] = val;
            } else {
              return obj[key];
            }
          },
          remove = function (val) {
            if (obj[val]) {
              delete obj.val;
              return true;
            }
            return false;
          };

        $.cookie = jasmine.createSpy('cookie').and.callFake(callback);
        $.removeCookie = jasmine.createSpy('removeCookie').and.callFake(remove);
      });

      it('should return false when deleting a cookie which is not set', function () {
        expect(ssoStatus.forget()).toBe(false);
      });

      it('should return true when deleting a cookie which is set', function () {
        ssoStatus.remember('edwinguzman');
        expect(ssoStatus.forget()).toBe(true);
      });
    });
  });

  /*
   * <nypl-sso></nypl-sso>
   *   The nypl-sso directive displays the login and donate buttons and has
   *   DOM manipulation to show and hide the login form.
   */
  describe('Directive: nypl-sso', function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $scope = _$rootScope_.$new();

      element = angular.element('<nypl-sso></nypl-sso>');
      $compile(element)($scope);
      $scope.$digest();
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
