/*jslint indent: 2, maxlen: 80, nomen: true */
/*globals nypl_locations, _, angular, jQuery, $location, $ */

(function () {
  'use strict';

  function CollectionsCtrl(
    $scope,
    $rootScope,
    config,
    divisions,
    terms,
    nyplLocationsService,
    nyplUtility
  ) {
    'use strict';
    $rootScope.title = "Research Collections";
    $scope.terms = terms;
    $scope.divisions = divisions;
    var getHoursToday = function(obj) {
      _.each(obj, function (elem) {
        if (elem.hours) {
          elem.hoursToday = nyplUtility.hoursToday(elem.hours);
        }
      });
    };

    $scope.setSubterms = function (index, term) {
      var subterms;
      if (term.id == 42) {
        subterms = _.chain(terms[index].terms)
          .pluck('terms')
          .flatten(true)
          .unique()
          .value();
      } else {
        subterms = terms[index].terms;
      }

      $scope.termIndex = index;
      $scope.subterms = subterms;
    };

    $scope.filterDivisions = function (name) {
      var updatedDivisions = [],
          i;

      for (i = 0; i < divisions.length; i++) {
        if (divisions[i].terms) {
            console.log(divisions[i].name);
            _.each(divisions[i].terms, function (term) {
              console.log(term.terms);

              // if (_.contains(term.terms, {name: name})) {
              //     console.log('test');
              // }
              var test = _.find(term.terms, function (term) {
                // console.log(term);
                return term.name = name;
              });

              console.log(test);
            });
            // console.log(divisions[i].terms[$scope.termIndex].terms)
            // if (_.has(divisions[i].terms[$scope.termIndex].terms, name)) {
            //     console.log('test');
            // }
        }
      }

      $scope.divisions = updatedDivisions;
    };

    // Assign Today's hours
    getHoursToday($scope.divisions);
  }

  angular
    .module('nypl_locations')
    .controller('CollectionsCtrl', CollectionsCtrl);
})();
