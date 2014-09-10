/*jslint indent: 2, maxlen: 80 */
/*globals element, by, module, module, window, jasmine,
describe, expect, beforeEach, inject, it, angular, spyOn */

describe('DivisionCtrl', function () {
  'use strict';

  var $rootScope, $injector, $state, DivisionCtrl, interceptedPath, state = 'home.map';


  beforeEach(function () {
    module('nypl_locations');

    // module(function ($provider) {
    //   $provider.provide('$location', {
    //     path: function (p) {
    //       interceptedPath = p;
    //     }
    //   });

    // });
    inject(function (_$rootScope_, _$state_, _$injector_) {
      $state = _$state_;
      $rootScope = _$rootScope_;
      $injector = _$injector_;
    })
  });

  it('should go to a location', function () {
    expect($state.href(state)).toEqual('#/map');
  });
});
