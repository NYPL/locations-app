/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, angular */

var utils = {};

utils.httpBackendMock = function (page, response) {
  var API_URL = 'http://dev.locations.api.nypl.org/api/v0.7.1';

  angular.module('httpBackendMock', ['ngMockE2E'])
    .run(['$httpBackend', function ($httpBackend, $window) {
      console.log(API_URL);
      $httpBackend
        .whenJSONP(API_URL + page + '?callback=JSON_CALLBACK')
        .respond(response);

      $httpBackend
        .whenJSONP(API_URL + '/alerts?callback=JSON_CALLBACK')
        .respond({});

      // For everything else, don't mock
      $httpBackend.whenGET(/^\w+.*/).passThrough();
      $httpBackend.whenGET(/.*/).passThrough();
      $httpBackend.whenPOST(/^\w+.*/).passThrough();
    }]);
};

module.exports = utils;
