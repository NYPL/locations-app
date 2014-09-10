/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

describe('DivisionCtrl', function () {
  'use strict';

  var scope, DivisionCtrl, interceptedPath;


  beforeEach(function () {
    module('nypl_locations');

    module(function ($provider) {
      $provider.provide('$location', {
        path: function (p) {
          interceptedPath = p;
        }
      });

    });

  });

  it('should go to a location', function () {

  });
});
