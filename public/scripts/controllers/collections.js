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
    researchCollectionService,
    nyplUtility
  ) {
    'use strict';
    $rootScope.title = "Research Collections";
    $scope.terms = terms;
    $scope.divisions = divisions;

    var rcValues = researchCollectionService.getResearchValues();
    var getHoursToday = function(obj) {
      _.each(obj, function (elem) {
        if (elem.hours) {
          elem.hoursToday = nyplUtility.hoursToday(elem.hours);
        }
      });
    };

    $scope.subterms = rcValues.subterms;
    $scope.filteredDivisions = rcValues.filteredDivisions || divisions;

    $scope.setSubterms = function (index, term) {
      var subterms;

      // The Subjects term has nested terms so we must pluck the 
      // terms property from every term. Check the API.
      if (term.id == 42) {
        subterms = _.chain(terms[index].terms)
          .pluck('terms')
          .flatten(true)
          .unique()
          .value();
      } else {
      // The Media term has all the terms listed as a flat array.
        subterms = terms[index].terms;
      }

      researchCollectionService.setResearchValue('subterms', subterms);
      $scope.subterms = subterms;
    };

    $scope.filterDivisionsBy = function (selectedTerm) {
      var termID = selectedTerm.id;

      $scope.filteredDivisions = $scope.divisions.filter(function (division) {
        var found;

        // Only search through divisions with terms property
        if (division.terms) {
          // Search through each parent term
          _.each(division.terms, function (parentTerm) {
            // If already found, no need to keep searching;
            if (!found) {
              // Find the term where the ID matches what was selected
              found = _.find(parentTerm.terms, function (term) {
                return term.id === termID;
              });
            }
          });
        }

        // Return the boolean value of found. True if there's an object,
        // false if no object was found.
        return !!found;
      });

      researchCollectionService
        .setResearchValue('filteredDivisions', $scope.filteredDivisions);
    };

    // Assign Today's hours
    getHoursToday($scope.divisions);
  }

  angular
    .module('nypl_locations')
    .controller('CollectionsCtrl', CollectionsCtrl);
})();
