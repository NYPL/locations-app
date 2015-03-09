/*jslint indent: 2, maxlen: 80, regexp: true*/
/*global describe, require, beforeEach, browser,
angular, it, expect, element, by */

describe('NYPL Alerts Module', function () {
  'use strict';

  var homepage = require('./homepage.po.js'),
    APIresponse = require('../APImocks/alerts.js'),
    // Function that creates a module that is injected at run time,
    // overrides and mocks httpbackend to mock API call. 
    httpBackendMock = function (response) {
      var API_URL = 'http://dev.locations.api.nypl.org';

      angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
          // $httpBackend.whenGET('languages/en.json').passThrough();

          // Let it handle the actual API response
          $httpBackend
            .whenJSONP(API_URL + '/locations?callback=JSON_CALLBACK')
            .passThrough();

          // Mock the alert response
          $httpBackend
            .whenJSONP(API_URL + '/alerts?callback=JSON_CALLBACK')
            .respond(response);

          // For everything else, don't mock
          $httpBackend.whenGET(/^\w+.*/).passThrough();
          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/^\w+.*/).passThrough();
        });
    };

  describe('Global Alerts', function () {
    beforeEach(function () {
      // browser.addMockModule('httpBackendMock', httpBackendMock,
      //     APIresponse.global);
      browser.get('/');
      browser.waitForAngular();
    });

    it('should test time', function () {

    });

  }); /* End Global Alerts */

});